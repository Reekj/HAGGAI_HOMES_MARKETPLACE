import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  apiRequest,
  getToken,
  saveToken,
} from "../../api/client";

import { useAdminAuth } from "../../auth/AdminAuth";

import "./AdminProperties.css";

const STATUSES = ["Available", "Under Offer", "Sold"];
const TYPES = ["Duplex", "Apartment", "Terrace", "Land"];

const EMPTY_FILTERS = {
  city: "",
  state: "",
  propertyType: "",
  status: "",
  minPrice: "",
  maxPrice: "",
};

const NUMBER_FIELDS = [
  ["bedrooms", "Bedrooms"],
  ["bathrooms", "Bathrooms"],
  ["toilets", "Toilets"],
  ["parkingSpaces", "Parking spaces"],
  ["landSizeSqM", "Land size (sqm)"],
];

const imageUrl = (image) =>
  typeof image === "string" ? image : image?.url;

const lines = (value) =>
  value.split("\n").map((item) => item.trim()).filter(Boolean);

function money(property) {
  const value = Number(property.price);

  if (!Number.isFinite(value)) return "Price unavailable";

  const currency = property.currency || "NGN";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-NG")}`;
  }
}

function statusClass(status) {
  if (status === "Available") return "hap-status--available";
  if (status === "Under Offer") return "hap-status--offer";
  if (status === "Sold") return "hap-status--sold";
  return "";
}

function makeForm(property) {
  const overview = property?.overview || {};
  const location = property?.location || {};

  return {
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price == null ? "" : String(property.price),
    currency: property?.currency || "NGN",
    status: property?.status || "Available",
    address: location.address || "",
    city: location.city || "",
    state: location.state || "",
    propertyType: overview.propertyType || "Duplex",
    furnishing: overview.furnishing || "",
    bedrooms: String(overview.bedrooms ?? ""),
    bathrooms: String(overview.bathrooms ?? ""),
    toilets: String(overview.toilets ?? ""),
    parkingSpaces: String(overview.parkingSpaces ?? ""),
    landSizeSqM: String(overview.landSizeSqM ?? ""),
    amenities: (property?.amenities || []).join("\n"),
    functions: (property?.functions || []).join("\n"),
  };
}

function Modal({ title, busy = false, onClose, children }) {
  const ref = useRef(null);
  const headingId = title.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const node = ref.current;
    node.showModal();
    return () => node.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className="hap-dialog"
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="hap-dialog-heading">
        <h2 id={headingId}>{title}</h2>
        <button type="button" disabled={busy} onClick={onClose}>
          Close
        </button>
      </div>
      {children}
    </dialog>
  );
}

function Field({
  name,
  label,
  form,
  onChange,
  type = "text",
  required = false,
  step,
  autoComplete,
}) {
  return (
    <label className="hap-field">
      <span>{label}{required ? " *" : ""}</span>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={onChange}
        required={required}
        min={type === "number" ? "0" : undefined}
        step={step}
        autoComplete={autoComplete}
      />
    </label>
  );
}

function PropertyEditor({ property = null, onClose, onSaved }) {
  const editing = Boolean(property?._id);
  const [form, setForm] = useState(() => makeForm(property));
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageMode, setImageMode] = useState("keep");
  const [confirmReplacement, setConfirmReplacement] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);

  const existingImages = property?.images || [];
  const initial = makeForm(property);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const selectFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    if (selected.length > 8) {
      setError("Select no more than eight new images per upload.");
      return;
    }

    if (
      selected.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type)
      )
    ) {
      setError("Choose JPG, PNG, or WebP images.");
      return;
    }

    setFiles(selected);
    setConfirmReplacement(false);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (pending.current) return;

    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Enter a title and description.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      setError("Enter a price greater than zero.");
      return;
    }

    const currency = form.currency.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(currency)) {
      setError("Enter a three-letter currency code, such as NGN.");
      return;
    }

    if (!STATUSES.includes(form.status)) {
      setError("Choose a valid property status.");
      return;
    }

    const overview = { ...(property?.overview || {}) };

    overview.propertyType = form.propertyType.trim();
    overview.furnishing = form.furnishing.trim();

    for (const [key, label] of NUMBER_FIELDS) {
      if (form[key] === "") {
        if (editing && property.overview?.[key] != null) {
          setError(
            `${label} already has a saved value. Enter a number; use 0 where appropriate.`
          );
          return;
        }

        delete overview[key];
        continue;
      }

      const value = Number(form[key]);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        (key !== "landSizeSqM" && !Number.isInteger(value))
      ) {
        setError(`${label} must be a valid non-negative ${
          key === "landSizeSqM" ? "number" : "whole number"
        }.`);
        return;
      }

      overview[key] = value;
    }

    if (editing && imageMode !== "keep" && files.length === 0) {
      setError("Select the new images, or choose Keep existing images.");
      return;
    }

    if (
      editing &&
      imageMode === "replace" &&
      existingImages.length > 0 &&
      !confirmReplacement
    ) {
      setError("Confirm that you want to replace all existing images.");
      return;
    }

    const body = new FormData();

    // Send changed fields on edit; send all required fields on creation.
    for (const key of ["title", "description", "price", "currency", "status"]) {
      if (!editing || form[key] !== initial[key]) {
        const value =
          key === "price"
            ? String(Number(form.price))
            : key === "currency"
              ? currency
              : form[key].trim();

        body.append(key, value);
      }
    }

    const overviewKeys = [
      "propertyType",
      "furnishing",
      ...NUMBER_FIELDS.map(([key]) => key),
    ];

    if (
      !editing ||
      overviewKeys.some((key) => form[key] !== initial[key])
    ) {
      body.append("overview", JSON.stringify(overview));
    }

    if (
      !editing ||
      ["address", "city", "state"].some(
        (key) => form[key] !== initial[key]
      )
    ) {
      body.append(
        "location",
        JSON.stringify({
          ...(property?.location || {}),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
        })
      );
    }

    for (const key of ["amenities", "functions"]) {
      if (!editing || form[key] !== initial[key]) {
        body.append(key, JSON.stringify(lines(form[key])));
      }
    }

    if (!editing || imageMode !== "keep") {
      files.forEach((file) => body.append("images", file));

      if (editing) {
        body.append(
          "replaceImages",
          imageMode === "replace" ? "true" : "false"
        );
      }
    }

    if (editing && Array.from(body.keys()).length === 0) {
      setError("Make a change before saving.");
      return;
    }

    pending.current = true;
    setBusy(true);

    try {
      await apiRequest(
        editing
          ? `/properties/${encodeURIComponent(property._id)}`
          : "/properties",
        {
          method: editing ? "PUT" : "POST",
          authenticated: true,
          body,
        }
      );

      onSaved(
        editing
          ? "Property updated successfully."
          : "Property created successfully.",
        !editing
      );
    } catch (failure) {
      setError(failure.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return (
    <Modal
      title={editing ? "Edit property" : "Add property"}
      busy={busy}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        {error && <p className="hap-error" role="alert">{error}</p>}

        <fieldset className="hap-fields" disabled={busy}>
          <legend>Listing details</legend>

          <Field
            name="title"
            label="Property title"
            form={form}
            onChange={change}
            required
          />

          <label className="hap-field">
            <span>Description *</span>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              required
              rows={5}
            />
          </label>

          <div className="hap-grid">
            <Field
              name="price"
              label="Price"
              type="number"
              step="0.01"
              form={form}
              onChange={change}
              required
            />

            <Field
              name="currency"
              label="Currency code"
              form={form}
              onChange={change}
              required
            />

            <label className="hap-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={change}>
                {!STATUSES.includes(form.status) && (
                  <option value={form.status}>{form.status}</option>
                )}
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="hap-field">
              <span>Property type</span>
              <input
                name="propertyType"
                list="hap-property-types"
                value={form.propertyType}
                onChange={change}
                required
              />
              <datalist id="hap-property-types">
                {TYPES.map((type) => <option key={type} value={type} />)}
              </datalist>
            </label>
          </div>

          <h3>Location</h3>

          <Field
            name="address"
            label="Street address"
            form={form}
            onChange={change}
          />

          <div className="hap-grid">
            <Field name="city" label="City" form={form} onChange={change} />
            <Field name="state" label="State" form={form} onChange={change} />
          </div>

          <h3>Property specifications</h3>

          <div className="hap-grid">
            {NUMBER_FIELDS.map(([name, label]) => (
              <Field
                key={name}
                name={name}
                label={label}
                type="number"
                step={name === "landSizeSqM" ? "any" : "1"}
                form={form}
                onChange={change}
              />
            ))}

            <Field
              name="furnishing"
              label="Furnishing"
              form={form}
              onChange={change}
            />
          </div>

          {[
            ["amenities", "Amenities — one per line"],
            ["functions", "Allowed uses — one per line"],
          ].map(([name, label]) => (
            <label className="hap-field" key={name}>
              <span>{label}</span>
              <textarea
                name={name}
                value={form[name]}
                onChange={change}
                rows={4}
              />
            </label>
          ))}

          <h3>Images</h3>

          {editing && (
            <>
              <p>{existingImages.length} saved images.</p>

              <div className="hap-previews">
                {existingImages.map((image, index) => (
                  <img
                    key={image.key || index}
                    src={imageUrl(image)}
                    alt={`Saved property image ${index + 1}`}
                  />
                ))}
              </div>

              <label className="hap-field">
                <span>Image update</span>
                <select
                  value={imageMode}
                  onChange={(event) => {
                    setImageMode(event.target.value);
                    setFiles([]);
                    setConfirmReplacement(false);
                    setError("");
                  }}
                >
                  <option value="keep">Keep existing images</option>
                  <option value="append">Add images to existing images</option>
                  <option value="replace">Replace all existing images</option>
                </select>
              </label>
            </>
          )}

          {(!editing || imageMode !== "keep") && (
            <>
              <label className="hap-field">
                <span>Upload up to 8 new images</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={selectFiles}
                />
              </label>

              <p>
                {files.length}/8 new images selected.
                Selecting files replaces your current upload selection.
              </p>

              <div className="hap-previews">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`}>
                    {previews[index] && (
                      <img
                        src={previews[index]}
                        alt={`New upload ${index + 1}`}
                      />
                    )}
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFiles((current) =>
                          current.filter((_, i) => i !== index)
                        );
                        setConfirmReplacement(false);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {editing && imageMode === "replace" && existingImages.length > 0 && (
            <label className="hap-checkbox">
              <input
                type="checkbox"
                checked={confirmReplacement}
                onChange={(event) =>
                  setConfirmReplacement(event.target.checked)
                }
              />
              <span>
                Replace all {existingImages.length} saved images with the
                new selection.
              </span>
            </label>
          )}
        </fieldset>

        <div className="hap-actions">
          <button type="button" disabled={busy} onClick={onClose}>
            Cancel
          </button>
          <button className="hap-primary" disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Add property"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PropertyPreview({ property, onClose }) {
  return (
    <Modal title="Property details" onClose={onClose}>
      <h3>{property.title}</h3>
      <p><strong>{money(property)}</strong> · {property.status}</p>
      <p>
        {[
          property.location?.address,
          property.location?.city,
          property.location?.state,
        ].filter(Boolean).join(", ") || "Location not provided"}
      </p>

      <p style={{ whiteSpace: "pre-wrap" }}>{property.description}</p>

      <dl className="hap-details">
        {Object.entries(property.overview || {}).map(([key, value]) => (
          <div key={key}>
            <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
            <dd>{String(value ?? "—")}</dd>
          </div>
        ))}
      </dl>

      <h3>Amenities</h3>
      <p>{property.amenities?.join(" · ") || "None listed"}</p>

      <h3>Allowed uses</h3>
      <p>{property.functions?.join(" · ") || "None listed"}</p>

      <div className="hap-preview-gallery">
        {(property.images || []).map((image, index) => (
          <img
            key={image.key || index}
            src={imageUrl(image)}
            alt={`${property.title}, image ${index + 1}`}
          />
        ))}
      </div>
    </Modal>
  );
}

function PropertyLoader({ id, mode, onClose, onSaved }) {
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setProperty(null);
    setError("");

    apiRequest(`/properties/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then((result) => {
        if (controller.signal.aborted) return;
        if (!result.data?._id) throw new Error("Invalid property response.");
        setProperty(result.data);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      });

    return () => controller.abort();
  }, [id, retry]);

  if (!property) {
    return (
      <Modal title="Load property" onClose={onClose}>
        {error ? (
          <div role="alert">
            <p className="hap-error">{error}</p>
            <button onClick={() => setRetry((value) => value + 1)}>
              Retry
            </button>
          </div>
        ) : (
          <p role="status">Loading latest property details…</p>
        )}
      </Modal>
    );
  }

  return mode === "edit" ? (
    <PropertyEditor property={property} onClose={onClose} onSaved={onSaved} />
  ) : (
    <PropertyPreview property={property} onClose={onClose} />
  );
}

function DeleteProperty({ property, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);

  const remove = async () => {
    if (pending.current) return;

    pending.current = true;
    setBusy(true);
    setError("");

    try {
      await apiRequest(
        `/properties/${encodeURIComponent(property._id)}`,
        { method: "DELETE", authenticated: true }
      );

      onDeleted("Property deleted successfully.");
    } catch (failure) {
      if (failure.status === 404) {
        onDeleted("This property no longer exists. The catalogue has been refreshed.");
      } else {
        setError(failure.message);
      }
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete property" busy={busy} onClose={onClose}>
      <p>Delete <strong>{property.title}</strong>?</p>
      <p>
        This permanently deletes the listing and its stored images.
        This action cannot be undone.
      </p>

      {error && <p className="hap-error" role="alert">{error}</p>}

      <div className="hap-actions">
        <button type="button" disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="hap-danger"
          disabled={busy}
          onClick={remove}
        >
          {busy ? "Deleting…" : "Delete permanently"}
        </button>
      </div>
    </Modal>
  );
}

function AccountSettings({ mode, onClose, onSaved }) {
  const { user, verifySession, logout } = useAdminAuth();
  const passwordMode = mode === "password";

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (pending.current) return;

    setError("");

    if (passwordMode) {
      if (!form.currentPassword || !form.newPassword) {
        setError("Enter your current and new passwords.");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setError("The new passwords do not match.");
        return;
      }

      if (form.newPassword === form.currentPassword) {
        setError("Choose a password different from your current password.");
        return;
      }
    } else if (!form.name.trim() || !form.email.trim()) {
      setError("Enter your name and email address.");
      return;
    }

    pending.current = true;
    setBusy(true);

    const originalToken = getToken();

    try {
      const result = await apiRequest(
        passwordMode ? "/auth/updatepassword" : "/auth/profile",
        {
          method: "PUT",
          authenticated: true,

          // The password endpoint also returns 401 for a wrong current password.
          expireOnUnauthorized: !passwordMode,

          body: passwordMode
            ? {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
              }
            : {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
              },
        }
      );

      if (getToken() !== originalToken) {
        throw new Error("Your session changed. Please sign in again.");
      }

      if (passwordMode) {
        if (typeof result.token !== "string" || !result.token) {
          logout();
          return;
        }

        // This endpoint returns the token at the top level.
        saveToken(result.token);
      }

      onSaved(
        passwordMode
          ? "Password updated successfully."
          : "Profile updated successfully."
      );

      await verifySession();
    } catch (failure) {
      setError(failure.message);

      if (passwordMode && failure.status === 401) {
        // Verify whether the token is still valid before expiring the session.
        try {
          await apiRequest("/auth/me", { authenticated: true });
        } catch {
          // The shared client handles an expired token.
        }
      }
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return (
    <Modal
      title={passwordMode ? "Change password" : "Edit profile"}
      busy={busy}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        {error && <p className="hap-error" role="alert">{error}</p>}

        <fieldset className="hap-fields" disabled={busy}>
          <legend>{passwordMode ? "Password details" : "Your details"}</legend>

          {passwordMode ? (
            <>
              <Field
                name="currentPassword"
                label="Current password"
                type="password"
                autoComplete="current-password"
                form={form}
                onChange={change}
                required
              />
              <Field
                name="newPassword"
                label="New password"
                type="password"
                autoComplete="new-password"
                form={form}
                onChange={change}
                required
              />
              <Field
                name="confirmPassword"
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                form={form}
                onChange={change}
                required
              />
            </>
          ) : (
            <>
              <Field
                name="name"
                label="Full name"
                autoComplete="name"
                form={form}
                onChange={change}
                required
              />
              <Field
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                form={form}
                onChange={change}
                required
              />
              <Field
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                form={form}
                onChange={change}
              />
            </>
          )}
        </fieldset>

        <div className="hap-actions">
          <button type="button" disabled={busy} onClick={onClose}>
            Cancel
          </button>
          <button className="hap-primary" disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminProperties() {
  const { user, logout } = useAdminAuth();

  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [applied, setApplied] = useState({ ...EMPTY_FILTERS });
  const [filterError, setFilterError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
    });

    Object.entries(applied).forEach(([key, value]) => {
      if (String(value).trim()) params.set(key, String(value).trim());
    });

    apiRequest(`/properties?${params}`, { signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(result.data)) {
          throw new Error("The server returned an invalid property list.");
        }

        const totalPages = Math.max(
          1,
          Number(result.pagination?.totalPages) || 1
        );

        if (page > totalPages) {
          setPage(totalPages);
          return;
        }

        setProperties(result.data);
        setPagination({
          total: Number(result.total ?? result.data.length),
          totalPages,
        });
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        setProperties([]);
        setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, applied, refresh]);

  const changeFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setFilterError("");

    for (const key of ["minPrice", "maxPrice"]) {
      if (
        filters[key] !== "" &&
        (!Number.isFinite(Number(filters[key])) || Number(filters[key]) < 0)
      ) {
        setFilterError("Enter valid non-negative price limits.");
        return;
      }
    }

    if (
      filters.minPrice !== "" &&
      filters.maxPrice !== "" &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setFilterError("Minimum price cannot exceed maximum price.");
      return;
    }

    setPage(1);
    setApplied({ ...filters });
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS });
    setApplied({ ...EMPTY_FILTERS });
    setFilterError("");
    setPage(1);
  };

  const saved = (message, created = false) => {
    setModal(null);
    setNotice(message);
    if (created) resetFilters();
    setRefresh((value) => value + 1);
  };

  const openModal = (value) => {
    setNotice("");
    setModal(value);
  };

  return (
    <div className="hap-page">
      <header className="hap-header">
        <Link to="/" className="hap-brand">
          Haggai Homes
          <span>System Administration</span>
        </Link>

        <div className="hap-actions">
          <Link to="/properties">View Catalogue</Link>
          <span>{user?.name}</span>
          <button onClick={() => openModal({ type: "profile" })}>
            Edit profile
          </button>
          <button onClick={() => openModal({ type: "password" })}>
            Change password
          </button>
          <button onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className="hap-main">
        <div className="hap-heading">
          <div>
            <p className="hap-eyebrow">PROPERTY MANAGEMENT</p>
            <h1>Properties Catalogue</h1>
            <p>Create, update, and manage your property listings.</p>
          </div>

          <button
            className="hap-primary"
            onClick={() => openModal({ type: "create" })}
          >
            + Add Property
          </button>
        </div>

        {notice && <p className="hap-success" role="status">{notice}</p>}

        <section className="hap-panel" aria-label="Property catalogue">
          <form className="hap-toolbar" onSubmit={applyFilters}>
            {[
              ["city", "City", "text"],
              ["state", "State", "text"],
              ["propertyType", "Property type", "text"],
              ["minPrice", "Minimum price", "number"],
              ["maxPrice", "Maximum price", "number"],
            ].map(([name, label, type]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  type={type}
                  min={type === "number" ? "0" : undefined}
                  step={type === "number" ? "any" : undefined}
                  value={filters[name]}
                  onChange={changeFilter}
                />
              </label>
            ))}

            <label>
              Status
              <select name="status" value={filters.status} onChange={changeFilter}>
                <option value="">All statuses</option>
                {STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>

            <button className="hap-primary">Apply filters</button>
            <button type="button" onClick={resetFilters}>Reset</button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setRefresh((value) => value + 1)}
            >
              Refresh
            </button>
          </form>

          {filterError && <p className="hap-error" role="alert">{filterError}</p>}

          {loading ? (
            <p className="hap-empty" role="status">Loading properties…</p>
          ) : error ? (
            <div className="hap-error" role="alert">
              <p>{error}</p>
              <button onClick={() => setRefresh((value) => value + 1)}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <p>{pagination.total} matching properties</p>

              {properties.length === 0 ? (
                <p className="hap-empty">No properties found.</p>
              ) : (
                <div className="hap-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {properties.map((property) => (
                        <tr key={property._id}>
                          <td>
                            <div className="hap-property">
                              {imageUrl(property.images?.[0]) ? (
                                <img
                                  src={imageUrl(property.images[0])}
                                  alt=""
                                  loading="lazy"
                                />
                              ) : (
                                <div className="hap-no-image">No image</div>
                              )}
                              <strong>{property.title}</strong>
                            </div>
                          </td>
                          <td>
                            {[property.location?.city, property.location?.state]
                              .filter(Boolean).join(", ") || "—"}
                          </td>
                          <td>{property.overview?.propertyType || "—"}</td>
                          <td>{money(property)}</td>
                          <td>
                            <span className={`hap-status ${statusClass(property.status)}`}>
                              {property.status || "—"}
                            </span>
                          </td>
                          <td>
                            <div className="hap-row-actions">
                              <button onClick={() => openModal({
                                type: "view",
                                id: property._id,
                              })}>
                                View
                              </button>
                              <button onClick={() => openModal({
                                type: "edit",
                                id: property._id,
                              })}>
                                Edit
                              </button>
                              <button
                                className="hap-danger-outline"
                                onClick={() => openModal({
                                  type: "delete",
                                  property,
                                })}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <nav className="hap-pagination" aria-label="Catalogue pagination">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </button>
                <span>Page {page} of {pagination.totalPages}</span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </button>
              </nav>
            </>
          )}
        </section>
      </main>

      {modal?.type === "create" && (
        <PropertyEditor onClose={() => setModal(null)} onSaved={saved} />
      )}

      {["view", "edit"].includes(modal?.type) && (
        <PropertyLoader
          key={`${modal.type}-${modal.id}`}
          id={modal.id}
          mode={modal.type}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}

      {modal?.type === "delete" && (
        <DeleteProperty
          property={modal.property}
          onClose={() => setModal(null)}
          onDeleted={saved}
        />
      )}

      {["profile", "password"].includes(modal?.type) && (
        <AccountSettings
          key={modal.type}
          mode={modal.type}
          onClose={() => setModal(null)}
          onSaved={(message) => {
            setModal(null);
            setNotice(message);
          }}
        />
      )}
    </div>
  );
}