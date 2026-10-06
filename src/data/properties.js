const STORAGE_KEY = "haggai_homes_properties";
export const PROPERTY_UPDATE_EVENT =
  "haggai-homes-properties-updated";

/*
|--------------------------------------------------------------------------
| INITIAL SEED DATA
|--------------------------------------------------------------------------
|
| These records are ONLY used the first time the app starts.
| After that, the application reads from localStorage.
|
*/

export const initialProperties = [
  {
    id: 1,
    slug: "sterling-heights-duplex",

    status: "for-sale",
    statusLabel: "FOR SALE",
    badge: "DETACHED DUPLEX",

    price: 250000000,
    estimatedMortgage: "₦1.8M/mo",

    location: "Lekki Phase 1, Lagos",
    state: "Lagos",
    area: "Lekki Phase 1",

    title: "Sterling Heights Duplex",
    description: "4 Bedroom Fully Detached Duplex",

    propertyCategory: "Residential",
    type: "Duplex",

    bedrooms: 4,
    bathrooms: 5,

    size: "450",
    sizeUnit: "sqm",

    tenure: "Freehold",

    featured: true,

    landStatus: "",
    amenity: "",

    coverImage: "",
    images: [],

    dealer: {
      name: "Adebayo Johnson",
      role: "Senior Broker, Haggai Homes",
      phone: "+2349000000000",
      whatsapp: "2349000000000",
    },

    about: [
      "Experience unparalleled luxury in this exquisite 4-bedroom fully detached duplex located in the prestigious Lekki Phase 1, Lagos. Designed with meticulous attention to detail, this property offers a seamless blend of contemporary architecture and functional living spaces.",

      "The ground floor features an expansive living area with floor-to-ceiling windows, ensuring abundant natural light. A state-of-the-art fitted kitchen with premium appliances connects effortlessly to the dining area, perfect for entertaining guests.",

      "Upstairs, the master suite is a private sanctuary, complete with a walk-in closet and a spa-inspired en-suite bathroom. Three additional generously sized bedrooms, all en-suite, provide comfort and privacy for the entire family. The property also includes a dedicated home office, a private terrace, and a well-manicured garden.",
    ],

    amenities: [
      "24/7 Security",
      "Constant Power Supply",
      "Ample Parking",
      "Water Treatment Plant",
      "Swimming Pool",
      "Fully Fitted Kitchen",
      "Smart Home Features",
      "Private Balcony",
    ],

    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T00:00:00.000Z",
  },

  {
    id: 2,
    slug: "grace-gardens-estate",

    status: "for-sale",
    statusLabel: "FOR SALE",
    badge: "RESIDENTIAL LAND",

    price: 15000000,
    estimatedMortgage: "₦115K/mo",

    location: "Epe, Lagos State",
    state: "Lagos",
    area: "Epe",

    title: "Grace Gardens Estate",
    description: "Dry Land (C of O)",

    propertyCategory: "Residential",
    type: "Land",

    bedrooms: null,
    bathrooms: null,

    size: "600",
    sizeUnit: "sqm",

    tenure: "C of O",

    landStatus: "Surveyed",
    amenity: "",

    featured: true,

    coverImage: "",
    images: [],

    dealer: {
      name: "Adebayo Johnson",
      role: "Senior Broker, Haggai Homes",
      phone: "+2349000000000",
      whatsapp: "2349000000000",
    },

    about: [
      "Grace Gardens Estate offers premium residential plots in one of Epe's emerging residential corridors. The estate provides dry, surveyed land suitable for residential development.",

      "The property is strategically positioned with access to major road networks and planned infrastructure, making it suitable for both residential development and long-term investment.",
    ],

    amenities: [
      "Surveyed Land",
      "Secure Estate",
      "Good Road Access",
      "Residential Development",
    ],

    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T00:00:00.000Z",
  },

  {
    id: 3,
    slug: "the-zenith-apartments",

    status: "sold-out",
    statusLabel: "SOLD OUT",
    badge: "LUXURY APARTMENT",

    price: 450000000,
    estimatedMortgage: "₦3.4M/mo",

    location: "Maitama, Abuja",
    state: "Abuja",
    area: "Maitama",

    title: "The Zenith Apartments",
    description: "3 Bedroom Luxury Apartments",

    propertyCategory: "Residential",
    type: "Apartment",

    bedrooms: 3,
    bathrooms: 4,

    size: "320",
    sizeUnit: "sqm",

    tenure: "Freehold",

    landStatus: "",
    amenity: "Pool",

    featured: true,

    coverImage: "",
    images: [],

    dealer: {
      name: "Adebayo Johnson",
      role: "Senior Broker, Haggai Homes",
      phone: "+2349000000000",
      whatsapp: "2349000000000",
    },

    about: [
      "The Zenith Apartments provide refined contemporary living within Maitama, Abuja, combining luxury finishes with spacious interiors and modern amenities.",

      "Each residence includes carefully designed living spaces, en-suite bedrooms and access to shared recreational facilities within the development.",
    ],

    amenities: [
      "24/7 Security",
      "Swimming Pool",
      "Ample Parking",
      "Constant Power Supply",
      "Fully Fitted Kitchen",
      "Private Balcony",
    ],

    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T00:00:00.000Z",
  },

  {
    id: 4,
    slug: "rivercrest-terrace",

    status: "for-sale",
    statusLabel: "FOR SALE",
    badge: "TERRACE HOUSE",

    price: 85000000,
    estimatedMortgage: "₦630K/mo",

    location: "GRA, Port Harcourt",
    state: "Rivers",
    area: "GRA",

    title: "Rivercrest Terrace",
    description: "4 Bedroom Terrace House",

    propertyCategory: "Residential",
    type: "Terrace",

    bedrooms: 4,
    bathrooms: 4,

    size: "380",
    sizeUnit: "sqm",

    tenure: "Freehold",

    landStatus: "",
    amenity: "Secure",

    featured: true,

    coverImage: "",
    images: [],

    dealer: {
      name: "Adebayo Johnson",
      role: "Senior Broker, Haggai Homes",
      phone: "+2349000000000",
      whatsapp: "2349000000000",
    },

    about: [
      "Rivercrest Terrace is a modern four-bedroom terrace property situated within GRA, Port Harcourt. Its layout prioritizes comfortable family living while maintaining a contemporary architectural character.",

      "The development provides secure surroundings, generous interior spaces and convenient access to key destinations within Port Harcourt.",
    ],

    amenities: [
      "24/7 Security",
      "Ample Parking",
      "Constant Power Supply",
      "Water Treatment Plant",
      "Fully Fitted Kitchen",
    ],

    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T00:00:00.000Z",
  },
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

export const createSlug = (value = "") => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const dispatchPropertyUpdate = () => {
  window.dispatchEvent(
    new CustomEvent(PROPERTY_UPDATE_EVENT)
  );
};

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export const getProperties = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialProperties)
      );

      return initialProperties;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Property storage is invalid.");
    }

    return parsed;
  } catch (error) {
    console.error(
      "Could not load Haggai Homes properties:",
      error
    );

    return initialProperties;
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE
|--------------------------------------------------------------------------
*/

export const getPropertyById = (id) => {
  return getProperties().find(
    (property) =>
      String(property.id) === String(id)
  );
};

export const getPropertyBySlug = (slug) => {
  return getProperties().find(
    (property) => property.slug === slug
  );
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const addProperty = (propertyData) => {
  const existingProperties = getProperties();

  const highestId = existingProperties.reduce(
    (highest, property) =>
      Math.max(
        highest,
        Number(property.id) || 0
      ),
    0
  );

  const now = new Date().toISOString();

  const property = {
    ...propertyData,

    id: highestId + 1,

    slug:
      propertyData.slug ||
      createSlug(propertyData.title),

    createdAt: now,
    updatedAt: now,
  };

  const updatedProperties = [
    property,
    ...existingProperties,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedProperties)
  );

  dispatchPropertyUpdate();

  return property;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateProperty = (
  propertyId,
  changes
) => {
  const existingProperties = getProperties();

  const updatedProperties =
    existingProperties.map((property) => {
      if (
        String(property.id) !==
        String(propertyId)
      ) {
        return property;
      }

      return {
        ...property,
        ...changes,

        slug:
          changes.slug ||
          createSlug(
            changes.title || property.title
          ),

        updatedAt:
          new Date().toISOString(),
      };
    });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedProperties)
  );

  dispatchPropertyUpdate();

  return updatedProperties.find(
    (property) =>
      String(property.id) ===
      String(propertyId)
  );
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteProperty = (propertyId) => {
  const updatedProperties =
    getProperties().filter(
      (property) =>
        String(property.id) !==
        String(propertyId)
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedProperties)
  );

  dispatchPropertyUpdate();

  return updatedProperties;
};

/*
|--------------------------------------------------------------------------
| FORMATTERS
|--------------------------------------------------------------------------
*/

export const formatPrice = (price) => {
  return `₦${Number(
    price || 0
  ).toLocaleString("en-NG")}`;
};