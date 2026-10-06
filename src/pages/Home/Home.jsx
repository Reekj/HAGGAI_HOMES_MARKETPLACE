import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  Home as HomeIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

import { listProperties } from "../../api/properties";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    listProperties(
      {
        status: "Available",
        page: 1,
        limit: 3,
      },
      { signal: controller.signal }
    )
      .then((result) => {
        if (!controller.signal.aborted) {
          setProperties(result.properties);
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setError(failure.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retry]);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (city.trim()) params.set("city", city.trim());
    if (propertyType) params.set("propertyType", propertyType);

    navigate(`/properties${params.size ? `?${params}` : ""}`);
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="home-hero__background-shape" />

          <div className="home-container home-hero__inner">
            <div className="home-hero__content">
              <div className="home-hero__eyebrow">
                <span className="home-hero__eyebrow-icon">
                  <HomeIcon size={17} />
                </span>
                Haggai Homes Marketplace
              </div>

              <h1 className="home-hero__title">
                Find a home you can
                <span> truly call yours.</span>
              </h1>

              <p className="home-hero__description">
                Browse properties and discover homes, apartments
                and land opportunities designed to make your
                journey to homeownership simpler.
              </p>

              <form
                className="home-search"
                onSubmit={handleSearch}
              >
                <div className="home-search__field">
                  <label htmlFor="home-location">City / Area</label>

                  <div className="home-search__control">
                    <MapPin size={18} />

                    <input
                      id="home-location"
                      type="text"
                      value={city}
                      placeholder="e.g. Lekki"
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="home-search__field">
                  <label htmlFor="home-type">Property Type</label>

                  <select
                    id="home-type"
                    value={propertyType}
                    onChange={(event) =>
                      setPropertyType(event.target.value)
                    }
                  >
                    <option value="">Any Property Type</option>
                    {["Duplex", "Apartment", "Terrace", "Land"].map(
                      (type) => (
                        <option key={type}>{type}</option>
                      )
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  className="home-search__button"
                >
                  <Search size={18} />
                  Search
                </button>
              </form>

              <div className="home-hero__trust">
                <span>
                  <CheckCircle2 size={16} />
                  Property listings
                </span>
                <span>
                  <CheckCircle2 size={16} />
                  Mortgage support
                </span>
                <span>
                  <CheckCircle2 size={16} />
                  Property enquiries
                </span>
              </div>
            </div>

            <div className="home-hero__visual">
              <div className="home-hero__visual-main">
                <HomeIcon size={70} strokeWidth={1.35} />
                <span>HAGGAI HOMES</span>
              </div>

              <div className="home-hero__visual-card">
                <span className="home-hero__visual-card-label">
                  Find your next home
                </span>

                <strong>Properties across Nigeria</strong>

                <button
                  type="button"
                  onClick={() => navigate("/properties")}
                >
                  Browse Properties
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="home-properties">
          <div className="home-container">
            <div className="home-section-heading">
              <div>
                <span className="home-section-heading__eyebrow">
                  AVAILABLE PROPERTIES
                </span>
                <h2>Explore available homes</h2>
                <p>
                  Discover properties available through Haggai Homes.
                </p>
              </div>

              <button
                type="button"
                className="home-section-heading__action"
                onClick={() => navigate("/properties")}
              >
                View All Properties
                <ArrowRight size={18} />
              </button>
            </div>

            {loading ? (
              <p role="status">Loading properties…</p>
            ) : error ? (
              <div role="alert">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Retry
                </button>
              </div>
            ) : properties.length ? (
              <div className="home-properties__grid">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "50px 20px",
                  textAlign: "center",
                  border: "1px solid #e1e6eb",
                  background: "#fff",
                }}
              >
                <p>No properties are available right now.</p>
              </div>
            )}
          </div>
        </section>

        <section className="home-mortgage">
          <div className="home-container">
            <div className="home-mortgage__inner">
              <div className="home-mortgage__content">
                <span className="home-mortgage__eyebrow">
                  HAGGAI MORTGAGE BANK
                </span>

                <h2>
                  Found the right home?
                  <br />
                  Let us help you finance it.
                </h2>

                <p>
                  Take the next step toward owning your home with
                  mortgage solutions from Haggai Mortgage Bank.
                </p>

                <button
                  type="button"
                  className="home-mortgage__button"
                  onClick={() => navigate("/mortgage")}
                >
                  Apply for Mortgage
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="home-mortgage__graphic">
                <div className="home-mortgage__graphic-house">
                  <HomeIcon size={64} strokeWidth={1.4} />
                </div>

                <div className="home-mortgage__graphic-badge">
                  <CheckCircle2 size={18} />
                  Mortgage support available
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}