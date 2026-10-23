import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Building2,
  BedDouble,
  Bath,
  Ruler,
  Shield,
  Landmark,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { apiRequest } from "../../api/client";
import { formatPrice, getProperty } from "../../api/properties";

import "./PropertyDetails.css";

const emptyInquiry = {
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  message: "",
};

function InquiryForm({ property }) {
  const [form, setForm] = useState({
    ...emptyInquiry,
    message: `I am interested in ${property.title}. Please contact me with more details.`,
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const pending = useRef(false);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (pending.current) return;

    const body = {
      propertyId: property.id,
      buyerName: form.buyerName.trim(),
      buyerEmail: form.buyerEmail.trim(),
      buyerPhone: form.buyerPhone.trim(),
      message: form.message.trim(),
    };

    if (Object.values(body).some((value) => !value)) {
      setError("Please complete every field.");
      return;
    }

    pending.current = true;
    setBusy(true);
    setError("");
    setReceipt(null);

    try {
      const result = await apiRequest("/inquiries", {
        method: "POST",
        body,
      });

      setReceipt({
        message:
          result.message || "Your inquiry has been submitted successfully.",
        reference:
          result.referenceNumber || result.data?.referenceNumber || "",
      });

      setForm({ ...emptyInquiry });
    } catch (failure) {
      setError(failure.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return (
    <section
      id="contact-dealer"
      className="property-detail-card property-contact"
      style={{ scrollMarginTop: 100 }}
    >
      <h2>Enquire about this property</h2>
      <p>Send your details to the property representative.</p>

      {receipt && (
        <div
          role="status"
          style={{
            margin: "16px 0",
            padding: 16,
            background: "#f0fdf4",
            color: "#166534",
            borderRadius: 8,
            overflowWrap: "anywhere",
          }}
        >
          <p>{receipt.message}</p>
          {receipt.reference && (
            <>
              <p>
                Reference number: <strong>{receipt.reference}</strong>
              </p>
              <p>Keep this reference for follow-up enquiries.</p>
            </>
          )}
        </div>
      )}

      <form className="property-contact__form" onSubmit={submit}>
        <input
          name="buyerName"
          type="text"
          aria-label="Full name"
          autoComplete="name"
          value={form.buyerName}
          onChange={change}
          placeholder="Full Name"
          disabled={busy}
          required
        />

        <input
          name="buyerEmail"
          type="email"
          aria-label="Email address"
          autoComplete="email"
          value={form.buyerEmail}
          onChange={change}
          placeholder="Email Address"
          disabled={busy}
          required
        />

        <input
          name="buyerPhone"
          type="tel"
          aria-label="Phone number"
          autoComplete="tel"
          value={form.buyerPhone}
          onChange={change}
          placeholder="Phone Number"
          disabled={busy}
          required
        />

        <textarea
          name="message"
          aria-label="Message"
          value={form.message}
          onChange={change}
          placeholder="Your message"
          rows={4}
          disabled={busy}
          required
        />

        {error && (
          <p role="alert" style={{ color: "#b6191a" }}>{error}</p>
        )}

        <button
          type="submit"
          className="property-contact__request"
          disabled={busy}
        >
          {busy ? "Sending…" : "Request Details"}
        </button>
      </form>
    </section>
  );
}

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const location = useLocation();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [failedImage, setFailedImage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setNotFound(false);
    setProperty(null);
    setActiveImage(0);
    setFailedImage("");

    getProperty(propertyId, { signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) setProperty(result);
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        setNotFound(failure.status === 404);
        setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [propertyId, retry]);

  useEffect(() => {
    if (property && location.hash === "#contact-dealer") {
      document.getElementById("contact-dealer")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [property, location.hash]);

  const currentImage = property?.images[activeImage];

  const overviewItems = property ? [
    ["Bedrooms", property.bedrooms ?? "—", BedDouble],
    ["Bathrooms", property.bathrooms ?? "—", Bath],
    [
      "Land Size",
      property.size != null ? `${property.size} sqm` : "—",
      Ruler,
    ],
    ["Furnishing", property.furnishing || "—", Building2],
    ["Toilets", property.toilets ?? "—", Bath],
    ["Parking Spaces", property.parkingSpaces ?? "—", Building2],
  ] : [];

  return (
    <div className="property-details-page">
      <Navbar />

      <main className="property-details-main">
        <div className="property-details-container">
          <div className="property-details-breadcrumb">
            <Link to="/properties">
              <ArrowLeft size={15} />
              Back to Properties
            </Link>

            {property && (
              <>
                <span>/</span>
                <span>{property.state}</span>
                <span>/</span>
                <strong>{property.city}</strong>
              </>
            )}
          </div>

          {loading ? (
            <p role="status">Loading property…</p>
          ) : error ? (
            <div role="alert">
              <h1>
                {notFound ? "Property not found" : "Unable to load property"}
              </h1>
              <p>{error}</p>
              {!notFound && (
                <button onClick={() => setRetry((value) => value + 1)}>
                  Retry
                </button>
              )}
            </div>
          ) : property ? (
            <>
              <div className="property-details-heading">
                <div className="property-details-heading__left">
                  <div className="property-details-badges">
                    {property.status && (
                      <span
                        className="property-details-badge"
                        style={{
                          background:
                            property.status === "Sold"
                              ? "#fee2e2"
                              : property.status === "Under Offer"
                                ? "#fef3c7"
                                : "#dcfce7",
                          color:
                            property.status === "Sold"
                              ? "#991b1b"
                              : property.status === "Under Offer"
                                ? "#92400e"
                                : "#166534",
                        }}
                      >
                        {property.status}
                      </span>
                    )}

                    {property.type && (
                      <span className="property-details-badge">
                        {property.type}
                      </span>
                    )}
                  </div>

                  <h1>{property.title}</h1>

                  <div className="property-details-location">
                    <MapPin size={17} />
                    <span>{property.location || "Location not provided"}</span>
                  </div>
                </div>

                <div className="property-details-heading__price">
                  <strong>
                    {formatPrice(property.price, property.currency)}
                  </strong>
                </div>
              </div>

              <section
                className="property-gallery"
                aria-label="Property images"
              >
                <div
                  className="property-gallery__main"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 280,
                  }}
                >
                  {currentImage && failedImage !== currentImage ? (
                    <img
                      src={currentImage}
                      alt={`${property.title}, image ${activeImage + 1}`}
                      onError={() => setFailedImage(currentImage)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <Building2 size={48} strokeWidth={2} />
                      <span>No image available</span>
                    </>
                  )}
                </div>

                {property.images.length > 1 && (
                  <div className="property-gallery__thumbnails">
                    {property.images.map((image, index) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        aria-label={`View image ${index + 1}`}
                        aria-pressed={activeImage === index}
                        onClick={() => {
                          setActiveImage(index);
                          setFailedImage("");
                        }}
                        style={{
                          padding: 0,
                          overflow: "hidden",
                          border: activeImage === index
                            ? "2px solid #b6191a"
                            : "1px solid #ddd",
                        }}
                      >
                        <img
                          src={image}
                          alt={`Property thumbnail ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <div className="property-details-content">
                <div className="property-details-content__main">
                  <section className="property-detail-card property-overview">
                    <h2>Property Overview</h2>
                    <div className="property-detail-divider" />

                    <div className="property-overview__grid">
                      {overviewItems.map(([label, value, Icon]) => (
                        <div className="property-overview__item" key={label}>
                          <div>
                            <Icon size={17} />
                            <span>{label}</span>
                          </div>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="property-detail-card property-about">
                    <h2>About this Property</h2>
                    <div className="property-detail-divider" />
                    <div className="property-about__copy">
                      <p style={{ whiteSpace: "pre-wrap" }}>
                        {property.description || "No description provided."}
                      </p>
                    </div>
                  </section>

                  <section className="property-detail-card property-amenities">
                    <h2>Amenities & Features</h2>
                    <div className="property-detail-divider" />

                    {property.amenities.length ? (
                      <div className="property-amenities__grid">
                        {property.amenities.map((amenity, index) => (
                          <div
                            key={`${amenity}-${index}`}
                            className="property-amenities__item"
                          >
                            <Shield size={19} />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No amenities listed.</p>
                    )}
                  </section>

                  {property.functions.length > 0 && (
                    <section className="property-detail-card">
                      <h2>Allowed Uses</h2>
                      <div className="property-detail-divider" />
                      <ul>
                        {property.functions.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <aside className="property-details-sidebar">
                  <InquiryForm key={property.id} property={property} />

                  <section className="property-mortgage-card">
                    <div className="property-mortgage-card__heading">
                      <Landmark size={20} />
                      <strong>Mortgage Support</strong>
                    </div>

                    <p>
                      Explore financing options with Haggai Mortgage Bank.
                    </p>

                    <Link
                      to="/mortgage"
                      style={{
                        display: "inline-block",
                        padding: "12px 18px",
                        background: "#b6191a",
                        color: "#fff",
                        borderRadius: 6,
                        textDecoration: "none",
                      }}
                    >
                      Apply for Mortgage
                    </Link>
                  </section>
                </aside>
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}