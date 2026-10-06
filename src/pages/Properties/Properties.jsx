import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid2X2, List } from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

import { listProperties } from "../../api/properties";

import "./Properties.css";

function readFilters(params) {
  return {
    state: params.get("state") || "",
    city: params.get("city") || params.get("location") || "",
    propertyType:
      params.get("propertyType") || params.get("type") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
  };
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const [filters, setFilters] = useState(() =>
    readFilters(searchParams)
  );

  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [retry, setRetry] = useState(0);

  const rawPage = Number(searchParams.get("page") || 1);
  const page =
    Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  useEffect(() => {
    setFilters(readFilters(new URLSearchParams(queryString)));
    setFilterError("");
  }, [queryString]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(queryString);

    setLoading(true);
    setError("");

    listProperties(
      {
        ...readFilters(params),
        status: "Available",
        page,
        limit: 9,
      },
      { signal: controller.signal }
    )
      .then((result) => {
        if (controller.signal.aborted) return;

        setProperties(result.properties);
        setTotal(result.total);
        setTotalPages(result.totalPages);
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
  }, [queryString, page, retry]);

  const changeFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setFilterError("");

    for (const name of ["minPrice", "maxPrice"]) {
      if (
        filters[name] !== "" &&
        (!Number.isFinite(Number(filters[name])) ||
          Number(filters[name]) < 0)
      ) {
        setFilterError("Enter valid non-negative prices.");
        return;
      }
    }

    if (
      filters.minPrice !== "" &&
      filters.maxPrice !== "" &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setFilterError(
        "Minimum price cannot be greater than maximum price."
      );
      return;
    }

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params.set(key, value.trim());
    });

    setSearchParams(params);
  };

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <div className="properties-page">
      <Navbar />

      <main className="properties-main">
        <div className="properties-layout">
          <aside className="property-filters">
            <div className="property-filters__heading">
              <h2>Filters</h2>
              <p>Narrow your search</p>
            </div>

            <form onSubmit={applyFilters}>
              <div className="property-filter">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  value={filters.state}
                  onChange={changeFilter}
                  placeholder="e.g. Lagos"
                />
              </div>

              <div className="property-filter">
                <label htmlFor="city">City / Area</label>
                <input
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={changeFilter}
                  placeholder="e.g. Lekki"
                />
              </div>

              <div className="property-filter">
                <label htmlFor="property-type">Property Type</label>
                <select
                  id="property-type"
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={changeFilter}
                >
                  <option value="">Any</option>
                  {["Duplex", "Apartment", "Terrace", "Land"].map(
                    (type) => (
                      <option key={type}>{type}</option>
                    )
                  )}
                </select>
              </div>

              <div className="property-filter property-filter--prices">
                <div>
                  <label htmlFor="min-price">Min (₦)</label>
                  <input
                    id="min-price"
                    name="minPrice"
                    type="number"
                    min="0"
                    step="any"
                    value={filters.minPrice}
                    onChange={changeFilter}
                    placeholder="Min"
                  />
                </div>

                <div>
                  <label htmlFor="max-price">Max (₦)</label>
                  <input
                    id="max-price"
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="any"
                    value={filters.maxPrice}
                    onChange={changeFilter}
                    placeholder="Max"
                  />
                </div>
              </div>

              {filterError && (
                <p role="alert" style={{ color: "#b6191a" }}>
                  {filterError}
                </p>
              )}

              <div className="property-filter-divider" />

              <button
                type="submit"
                className="property-filters__apply"
              >
                Apply Filters
              </button>

              <button
                type="button"
                style={{ marginTop: 12 }}
                onClick={() => {
                  setFilters(readFilters(new URLSearchParams()));
                  setFilterError("");
                  setSearchParams({});
                }}
              >
                Reset filters
              </button>
            </form>
          </aside>

          <section className="property-results">
            <div className="property-results__header">
              <div>
                <h1>Available Properties</h1>
                {!loading && !error && (
                  <p>
                    <span>{total} properties</span> matching your
                    criteria
                  </p>
                )}
              </div>

              <div className="property-results__view">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  className={
                    viewMode === "grid"
                      ? "property-results__view-button property-results__view-button--active"
                      : "property-results__view-button"
                  }
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 size={19} />
                </button>

                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  className={
                    viewMode === "list"
                      ? "property-results__view-button property-results__view-button--active"
                      : "property-results__view-button"
                  }
                  onClick={() => setViewMode("list")}
                >
                  <List size={19} />
                </button>
              </div>
            </div>

            {loading ? (
              <p role="status">Loading properties…</p>
            ) : error ? (
              <div role="alert">
                <p>{error}</p>
                <button
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {properties.length ? (
                  <div
                    className={`property-results__grid ${
                      viewMode === "list"
                        ? "property-results__grid--list"
                        : ""
                    }`}
                  >
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="property-results__empty">
                    <h2>No properties found</h2>
                    <p>
                      Try changing your filters to view more
                      properties.
                    </p>
                  </div>
                )}

                {(totalPages > 1 || page > 1) && (
                  <nav
                    className="property-pagination"
                    aria-label="Property pages"
                  >
                    <button
                      type="button"
                      className="property-pagination__button"
                      disabled={page <= 1}
                      onClick={() => goToPage(page - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      className="property-pagination__button"
                      disabled={page >= totalPages}
                      onClick={() => goToPage(page + 1)}
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}