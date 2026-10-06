import { apiRequest } from "./client";

export function formatPrice(value, currency = "NGN") {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

export function normalizeProperty(property) {
  const overview = property.overview || {};
  const location = property.location || {};

  const images = Array.isArray(property.images)
    ? property.images
        .map((image) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean)
    : [];

  return {
    id: property._id,
    title: property.title || "Untitled property",
    description: property.description || "",
    price: property.price,
    currency: property.currency || "NGN",
    status: property.status || "",
    type: overview.propertyType || "",
    bedrooms: overview.bedrooms,
    bathrooms: overview.bathrooms,
    toilets: overview.toilets,
    parkingSpaces: overview.parkingSpaces,
    size: overview.landSizeSqM,
    furnishing: overview.furnishing || "",
    address: location.address || "",
    city: location.city || "",
    state: location.state || "",
    location: [
      location.address,
      location.city,
      location.state,
    ]
      .filter(Boolean)
      .join(", "),
    amenities: Array.isArray(property.amenities)
      ? property.amenities
      : [],
    functions: Array.isArray(property.functions)
      ? property.functions
      : [],
    images,
  };
}

export async function listProperties(filters = {}, options = {}) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      query.set(key, String(value).trim());
    }
  });

  const result = await apiRequest(
    `/properties?${query.toString()}`,
    options
  );

  if (!Array.isArray(result.data)) {
    throw new Error("The server returned an invalid property list.");
  }

  return {
    properties: result.data.map(normalizeProperty),
    total: Number(result.total ?? result.data.length),
    totalPages: Math.max(
      1,
      Number(result.pagination?.totalPages) || 1
    ),
  };
}

export async function getProperty(id, options = {}) {
  const result = await apiRequest(
    `/properties/${encodeURIComponent(id)}`,
    options
  );

  if (!result.data?._id) {
    throw new Error("The server returned an invalid property.");
  }

  return normalizeProperty(result.data);
}