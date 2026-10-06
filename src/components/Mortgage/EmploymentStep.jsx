import React from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const EmploymentStep = ({
  data,
  onChange,
  onBack,
  onNext,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !data.employer ||
      !data.jobTitle ||
      !data.yearsEmployment ||
      !data.annualIncome
    ) {
      alert(
        "Please complete all employment and income fields."
      );

      return;
    }

    onNext();
  };

  return (
    <section className="mortgage-form-card mortgage-form-card--employment">
      <div className="mortgage-section-title">
        <h2>Employment &amp; Income</h2>

        <p>
          Please provide details about your
          current primary source of income.
        </p>
      </div>

      <div className="mortgage-form-card__divider" />

      <form onSubmit={handleSubmit}>
        <div className="mortgage-grid mortgage-grid--two">
          <div className="mortgage-field">
            <label>Current Employer</label>

            <input
              type="text"
              value={data.employer}
              placeholder="Company Name"
              onChange={(event) =>
                onChange({
                  employer:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="mortgage-field">
            <label>Job Title</label>

            <input
              type="text"
              value={data.jobTitle}
              placeholder="e.g. Software Engineer"
              onChange={(event) =>
                onChange({
                  jobTitle:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="mortgage-field">
            <label>
              Years of Employment
            </label>

            <select
              value={data.yearsEmployment}
              onChange={(event) =>
                onChange({
                  yearsEmployment:
                    event.target.value,
                })
              }
            >
              <option value="">
                Select duration
              </option>

              <option value="Less than 1 year">
                Less than 1 year
              </option>

              <option value="1-2 years">
                1–2 Years
              </option>

              <option value="3-5 years">
                3–5 Years
              </option>

              <option value="6-10 years">
                6–10 Years
              </option>

              <option value="10+ years">
                10+ Years
              </option>
            </select>
          </div>

          <div className="mortgage-field">
            <label>
              Annual Gross Income
            </label>

            <div className="mortgage-currency-input">
              <span>₦</span>

              <input
                type="number"
                min="0"
                value={data.annualIncome}
                placeholder="0.00"
                onChange={(event) =>
                  onChange({
                    annualIncome:
                      event.target.value,
                  })
                }
              />
            </div>
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
    </section>
  );
};

export default EmploymentStep;