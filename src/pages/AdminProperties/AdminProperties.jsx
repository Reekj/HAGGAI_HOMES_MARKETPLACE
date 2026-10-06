import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../../api/client";
import {
  formatPrice,
  listProperties,
} from "../../api/properties";
import { useAdminAuth } from "../../auth/AdminAuth";

import "./AdminProperties.css";

const emptyFilters = {
  city: "",
  state: "",
  propertyType: "",
};

const emptyForm = {
  title: "",
  description: "",
  price: "",
  address: "",
  city: "",
  state: "",
  propertyType: "Duplex",
  bedrooms: "",
  bathrooms: "",
  toilets: "",
  parkingSpaces: "",
  landSizeSqM: "",
  furnishing: "",
  amenities: "",
  functions: "",
};

const splitLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

function Field({
  name,
  label,
  form,
  onChange,
  type = "text",
  required = false,
  step,
}) {
  return (
    <label className="hap-field" htmlFor={`property-${name}`}>
      <span>
        {label}
        {required ? " *" : ""}
      </span>

      <input
        id={`property-${name}`}
        name={name}
        type={type}
        value={form[name]}
        onChange={onChange}
        required={required}
        min={type === "number" ? "0" : undefined}
        step={step}
      />
    </label>
  );
}

function PropertyForm({ onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pending = useRef(false);
  const dialog = useRef(null);

  useEffect(() => {
    const node = dialog.current;
    node.showModal();

    return () => node.close();
  }, []);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    if (selected.length > 8) {
      setError("Select no more than eight images.");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (selected.some((file) => !allowed.includes(file.type))) {
      setError("Select JPG, PNG, or WebP images.");
      return;
    }

    setError("");
    setFiles(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (pending.current) return;

    if (!form.title.trim() || !form.description.trim()) {
      setError("Enter a title and description.");
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a price greater than zero.");
      return;
    }

    const overview = {
      propertyType: form.propertyType,
    };

    if (form.furnishing.trim()) {
      overview.furnishing = form.furnishing.trim();
    }

    for (const key of [
      "bedrooms",
      "bathrooms",
      "toilets",
      "parkingSpaces",
      "landSizeSqM",
    ]) {
      if (form[key] === "") continue;

      const value = Number(form[key]);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        (key !== "landSizeSqM" && !Number.isInteger(value))
      ) {
        setError(
          "Room and parking counts must be whole non-negative numbers. Land size must be non-negative."
        );
        return;
      }

      overview[key] = value;
    }

    const body = new FormData();

    body.append("title", form.title.trim());
    body.append("description", form.description.trim());
    body.append("price", String(price));
    body.append("currency", "NGN");
    body.append("status", "Available");
    body.append("overview", JSON.stringify(overview));

    body.append(
      "location",
      JSON.stringify({
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
      })
    );

    body.append(
      "amenities",
      JSON.stringify(splitLines(form.amenities))
    );

    body.append(
      "functions",
      JSON.stringify(splitLines(form.functions))
    );

    files.forEach((file) => body.append("images", file));

    pending.current = true;
    setBusy(true);
    setError("");

    try {
      await apiRequest("/properties", {
        method: "POST",
        authenticated: true,
        body,
      });

      onCreated();
    } catch (failure) {
      setError(failure.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return (
    <dialog
      ref={dialog}
      className="hap-dialog"
      aria-labelledby="add-property-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending.current) onClose();
      }}
    >
      <div className="hap-dialog-heading">
        <div>
          <p className="hap-eyebrow">PROPERTY CATALOGUE</p>
          <h2 id="add-property-title">Add property</h2>
        </div>

        <button type="button" onClick={onClose} disabled={busy}>
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <p className="hap-error" role="alert">
            {error}
          </p>
        )}

        <fieldset disabled={busy} className="hap-fields">
          <legend>Listing details</legend>

          <Field
            name="title"
            label="Property title"
            form={form}
            onChange={handleChange}
            required
          />

          <label className="hap-field">
            <span>Description *</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
            />
          </label>

          <div className="hap-grid">
            <Field
              name="price"
              label="Price (NGN)"
              type="number"
              step="0.01"
              form={form}
              onChange={handleChange}
              required
            />

            <label className="hap-field">
              <span>Property type</span>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
              >
                {["Duplex", "Apartment", "Terrace", "Land"].map(
                  (type) => (
                    <option key={type}>{type}</option>
                  )
                )}
              </select>
            </label>
          </div>

          <p>New listings are marked Available.</p>

          <h3>Location</h3>

          <Field
            name="address"
            label="Street address"
            form={form}
            onChange={handleChange}
          />

          <div className="hap-grid">
            <Field
              name="city"
              label="City"
              form={form}
              onChange={handleChange}
            />

            <Field
              name="state"
              label="State"
              form={form}
              onChange={handleChange}
            />
          </div>

          <h3>Property specifications</h3>

          <div className="hap-grid">
            {[
              ["bedrooms", "Bedrooms"],
              ["bathrooms", "Bathrooms"],
              ["toilets", "Toilets"],
              ["parkingSpaces", "Parking spaces"],
              ["landSizeSqM", "Land size (sqm)"],
            ].map(([name, label]) => (
              <Field
                key={name}
                name={name}
                label={label}
                type="number"
                step={name === "landSizeSqM" ? "any" : "1"}
                form={form}
                onChange={handleChange}
              />
            ))}

            <Field
              name="furnishing"
              label="Furnishing"
              form={form}
              onChange={handleChange}
            />
          </div>

          <label className="hap-field">
            <span>Amenities — one per line</span>
            <textarea
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              rows={4}
              placeholder={"24/7 Security\nSwimming Pool"}
            />
          </label>

          <label className="hap-field">
            <span>Allowed uses — one per line</span>
            <textarea
              name="functions"
              value={form.functions}
              onChange={handleChange}
              rows={3}
              placeholder={"Residential\nShortlet Allowed"}
            />
          </label>

          <label className="hap-field">
            <span>Property images — up to 8</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFiles}
            />
          </label>

          <p>
            {files.length}/8 selected. Selecting files replaces
            the current selection.
          </p>

          <div className="hap-previews">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`}>
                {previews[index] && (
                  <img
                    src={previews[index]}
                    alt={`Upload preview ${index + 1}`}
                  />
                )}

                <span>{file.name}</span>

                <button
                  type="button"
                  onClick={() =>
                    setFiles((current) =>
                      current.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="hap-actions">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="hap-primary"
            disabled={busy}
          >
            {busy ? "Saving property…" : "Add property"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default function AdminProperties() {
  const { user, logout } = useAdminAuth();

  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    listProperties(
      {
        ...applied,
        page,
        limit: 20,
      },
      { signal: controller.signal }
    )
      .then((result) => {
        if (controller.signal.aborted) return;

        setProperties(result.properties);
        setPagination({
          total: result.total,
          totalPages: result.totalPages,
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

  const handleCreated = () => {
    setFormOpen(false);
    setNotice("Property created successfully.");
    setFilters({ ...emptyFilters });
    setApplied({ ...emptyFilters });
    setPage(1);
    setRefresh((value) => value + 1);
  };

  const resetFilters = () => {
    setFilters({ ...emptyFilters });
    setApplied({ ...emptyFilters });
    setPage(1);
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
          <button onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className="hap-main">
        <div className="hap-heading">
          <div>
            <p className="hap-eyebrow">PROPERTY MANAGEMENT</p>
            <h1>Properties Catalogue</h1>
            <p>Create and view property listings.</p>
          </div>

          <button
            className="hap-primary"
            onClick={() => {
              setNotice("");
              setFormOpen(true);
            }}
          >
            + Add Property
          </button>
        </div>

        {notice && (
          <p className="hap-success" role="status">
            {notice}
          </p>
        )}

        <section className="hap-panel">
          <form
            className="hap-toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setApplied({ ...filters });
            }}
          >
            {[
              ["city", "City"],
              ["state", "State"],
            ].map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  value={filters[name]}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}

            <label>
              Property type
              <select
                value={filters.propertyType}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    propertyType: event.target.value,
                  }))
                }
              >
                <option value="">All types</option>
                {["Duplex", "Apartment", "Terrace", "Land"].map(
                  (type) => (
                    <option key={type}>{type}</option>
                  )
                )}
              </select>
            </label>

            <button type="submit" className="hap-primary">
              Apply filters
            </button>

            <button type="button" onClick={resetFilters}>
              Reset
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setRefresh((value) => value + 1)}
            >
              Refresh
            </button>
          </form>

          {loading ? (
            <p role="status" className="hap-empty">
              Loading properties…
            </p>
          ) : error ? (
            <div className="hap-error" role="alert">
              <p>{error}</p>
              <button
                onClick={() => setRefresh((value) => value + 1)}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <p>
                {pagination.total} matching{" "}
                {pagination.total === 1 ? "property" : "properties"}
              </p>

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
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id}>
                          <td>
                            <div className="hap-property">
                              {property.images[0] ? (
                                <img
                                  src={property.images[0]}
                                  alt=""
                                />
                              ) : (
                                <div className="hap-no-image">
                                  No image
                                </div>
                              )}

                              <strong>{property.title}</strong>
                            </div>
                          </td>

                          <td>
                            {[property.city, property.state]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </td>

                          <td>{property.type || "—"}</td>

                          <td>
                            {formatPrice(
                              property.price,
                              property.currency
                            )}
                          </td>

                          <td>
                            <span className="hap-status">
                              {property.status || "—"}
                            </span>
                          </td>

                          <td>
                            <Link
                              to={`/properties/${property.id}`}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <nav
                className="hap-pagination"
                aria-label="Catalogue pagination"
              >
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {page} of {pagination.totalPages}
                </span>

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

      {formOpen && (
        <PropertyForm
          onClose={() => setFormOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}