import React from "react";
import {
  Pencil,
  FileText,
} from "lucide-react";

const formatCurrency = (value) => {
  const numeric = Number(value);

  if (!numeric) {
    return "—";
  }

  return `₦${numeric.toLocaleString(
    "en-NG"
  )}`;
};

const ReviewStep = ({
  application,
  onEdit,
  onConsentChange,
}) => {
  const {
    personal,
    employment,
    property,
    consent,
  } = application;

  return (
    <div className="mortgage-review">
      <section className="mortgage-review-card">
        <div className="mortgage-review-card__heading">
          <h2>Personal Information</h2>

          <button
            type="button"
            onClick={() => onEdit(1)}
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>

        <div className="mortgage-review-card__divider" />

        <div className="mortgage-review-grid">
          <div>
            <span>Full Name</span>
            <strong>
              {personal.fullName || "—"}
            </strong>
          </div>

          <div>
            <span>Date of Birth</span>
            <strong>
              {personal.dateOfBirth || "—"}
            </strong>
          </div>

          <div>
            <span>National ID / SSN</span>
            <strong>
              {personal.nationalId
                ? `****${personal.nationalId.slice(
                    -4
                  )}`
                : "—"}
            </strong>
          </div>

          <div>
            <span>Contact Info</span>
            <strong>
              {personal.email || "—"}
              <br />
              {personal.phone || ""}
            </strong>
          </div>

          <div className="mortgage-review-grid__wide">
            <span>
              Current Residential Address
            </span>

            <strong>
              {personal.address || "—"}
            </strong>
          </div>
        </div>

        <div className="mortgage-review-document">
          <span>Supporting Documents</span>

          <div>
            <FileText size={17} />

            <span>
              {personal.document?.name ||
                "No document uploaded"}
            </span>

            {personal.document && (
              <button
                type="button"
                onClick={() => {
                  const url =
                    URL.createObjectURL(
                      personal.document
                    );

                  window.open(
                    url,
                    "_blank"
                  );
                }}
              >
                View
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mortgage-review-card">
        <div className="mortgage-review-card__heading">
          <h2>Employment &amp; Income</h2>

          <button
            type="button"
            onClick={() => onEdit(2)}
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>

        <div className="mortgage-review-card__divider" />

        <div className="mortgage-review-grid">
          <div>
            <span>Employer</span>

            <strong>
              {employment.employer || "—"}
            </strong>
          </div>

          <div>
            <span>Role</span>

            <strong>
              {employment.jobTitle || "—"}
            </strong>
          </div>

          <div>
            <span>Annual Base Income</span>

            <strong>
              {formatCurrency(
                employment.annualIncome
              )}
            </strong>
          </div>

          <div>
            <span>
              Employment Duration
            </span>

            <strong>
              {employment.yearsEmployment ||
                "—"}
            </strong>
          </div>
        </div>
      </section>

      <section className="mortgage-review-card">
        <div className="mortgage-review-card__heading">
          <h2>Property Details</h2>

          <button
            type="button"
            onClick={() => onEdit(3)}
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>

        <div className="mortgage-review-card__divider" />

        <div className="mortgage-review-grid">
          <div className="mortgage-review-grid__wide">
            <span>Property Address</span>

            <strong>
              {property.propertyAddress ||
                "—"}
            </strong>
          </div>

          <div>
            <span>Property Type</span>

            <strong>
              {property.propertyType ||
                "—"}
            </strong>
          </div>

          <div>
            <span>Purchase Price</span>

            <strong>
              {formatCurrency(
                property.purchasePrice
              )}
            </strong>
          </div>

          <div>
            <span>Down Payment</span>

            <strong>
              {formatCurrency(
                property.downPayment
              )}
            </strong>
          </div>

          <div>
            <span>
              Requested Loan Amount
            </span>

            <strong>
              {formatCurrency(
                Number(
                  property.purchasePrice
                ) -
                  Number(
                    property.downPayment
                  )
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="mortgage-consent-card">
        <h2>
          Declarations &amp; Consent
        </h2>

        <label>
          <input
            type="checkbox"
            checked={consent.accuracy}
            onChange={(event) =>
              onConsentChange({
                accuracy:
                  event.target.checked,
              })
            }
          />

          <span>
            I certify that the information
            provided in this application is true
            and correct as of the date set forth
            opposite my signature.
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={consent.terms}
            onChange={(event) =>
              onConsentChange({
                terms:
                  event.target.checked,
              })
            }
          />

          <span>
            I agree to the{" "}
            <a href="/terms">
              Terms of Service
            </a>{" "}
            and acknowledge receipt of the{" "}
            <a href="/privacy">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={consent.creditCheck}
            onChange={(event) =>
              onConsentChange({
                creditCheck:
                  event.target.checked,
              })
            }
          />

          <span>
            I authorize Haggai Homes to obtain a
            consumer credit report to evaluate my
            application.
          </span>
        </label>
      </section>
    </div>
  );
};

export default ReviewStep;