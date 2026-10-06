import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Ruler,
} from "lucide-react";

import { formatPrice } from "../../api/properties";

import "./PropertyCard.css";

export default function PropertyCard({ property }) {
  const [failedImage, setFailedImage] = useState("");

  const image = property.images[0];
  const detailsUrl = `/properties/${property.id}`;

  return (
    <article className="hh-property-card">
      <Link
        to={detailsUrl}
        className="hh-property-card__image"
        aria-label={`View ${property.title}`}
      >
        {image && failedImage !== image ? (
          <img
            src={image}
            alt={property.title}
            loading="lazy"
            onError={() => setFailedImage(image)}
          />
        ) : (
          <div className="hh-property-card__placeholder">
            <Building2 size={44} />
            <span>Haggai Homes</span>
          </div>
        )}

        {property.status && (
          <span className="hh-property-card__status">
            {property.status}
          </span>
        )}
      </Link>

      <div className="hh-property-card__body">
        <span className="hh-property-card__type">
          {property.type || "Property"}
        </span>

        <h3>
          <Link to={detailsUrl}>{property.title}</Link>
        </h3>

        <p className="hh-property-card__location">
          <MapPin size={15} />
          <span>{property.location || "Location not provided"}</span>
        </p>

        <strong className="hh-property-card__price">
          {formatPrice(property.price, property.currency)}
        </strong>

        <div className="hh-property-card__specs">
          {property.bedrooms != null && (
            <span>
              <BedDouble size={16} />
              {property.bedrooms} beds
            </span>
          )}

          {property.bathrooms != null && (
            <span>
              <Bath size={16} />
              {property.bathrooms} baths
            </span>
          )}

          {property.size != null && (
            <span>
              <Ruler size={16} />
              {property.size} sqm
            </span>
          )}
        </div>

        <div className="hh-property-card__actions">
          <Link to={detailsUrl}>View Details</Link>
          <Link to={`${detailsUrl}#contact-dealer`}>Enquire</Link>
        </div>
      </div>
    </article>
  );
}