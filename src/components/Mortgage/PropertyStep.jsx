import React from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const PropertyStep = ({
  data,
  onChange,
  onBack,
  onNext,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !data.propertyAddress ||
      !data.purchasePrice ||
      !data.downPayment ||
      !data.propertyType ||
      !data.propertyUsage
    ) {
      alert(
        "Please complete all property information fields."
      );

      return;
    }

    if (
      Number(data.downPayment) >
      Number(data.purchasePrice)
    ) {
      alert(
        "Down payment cannot be greater than the purchase price."
      );

      return;
    }

    onNext();
  };

  return (
    <section className="mortgage-property-step">
      <div className="mortgage-section-title mortgage-section-title--outside">
        <h2>Property Information</h2>

        <p>
          Provide details about the property you
          intend to purchase or refinance.
        </p>
      </div>

      <div className="mortgage-form-card mortgage-form-card--property">
        <form onSubmit={handleSubmit}>
          <div className="mortgage-field">
            <label>Property Address</label>

            <input
              type="text"
              value={data.propertyAddress}
              placeholder="e.g. 123 Main St, Springfield"
              onChange={(event) =>
                onChange({
                  propertyAddress:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="mortgage-grid mortgage-grid--two">
            <div className="mortgage-field">
              <label>
                Estimated Purchase Price
              </label>

              <div className="mortgage-currency-input">
                <span>₦</span>

                <input
                  type="number"
                  min="0"
                  value={data.purchasePrice}
                  placeholder="500,000"
                  onChange={(event) =>
                    onChange({
                      purchasePrice:
                        event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mortgage-field">
              <label>Down Payment</label>

              <div className="mortgage-currency-input">
                <span>₦</span>

                <input
                  type="number"
                  min="0"
                  value={data.downPayment}
                  placeholder="100,000"
                  onChange={(event) =>
                    onChange({
                      downPayment:
                        event.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mortgage-form-card__divider mortgage-form-card__divider--small" />

          <div className="mortgage-grid mortgage-grid--two">
            <div className="mortgage-field">
              <label>Property Type</label>

              <select
                value={data.propertyType}
                onChange={(event) =>
                  onChange({
                    propertyType:
                      event.target.value,
                  })
                }
              >
                <option value="">
                  Select property type
                </option>

                <option value="Detached Duplex">
                  Detached Duplex
                </option>

                <option value="Semi Detached Duplex">
                  Semi Detached Duplex
                </option>

                <option value="Terrace">
                  Terrace
                </option>

                <option value="Apartment">
                  Apartment
                </option>

                <option value="Residential Land">
                  Residential Land
                </option>
              </select>
            </div>

            <div className="mortgage-field">
              <label>Property Usage</label>

              <select
                value={data.propertyUsage}
                onChange={(event) =>
                  onChange({
                    propertyUsage:
                      event.target.value,
                  })
                }
              >
                <option value="">
                  Select usage intent
                </option>

                <option value="Primary Residence">
                  Primary Residence
                </option>

                <option value="Investment">
                  Investment
                </option>

                <option value="Secondary Residence">
                  Secondary Residence
                </option>
              </select>
            </div>
          </div>

          <div className="mortgage-form-actions">
            <button
              type="button"
              className="mortgage-back-button"
              onClick={onBack}
            >
              <ArrowLeft size={17} />

              Back
            </button>

            <button
              type="submit"
              className="mortgage-primary-button"
            >
              Save &amp; Continue
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PropertyStep;