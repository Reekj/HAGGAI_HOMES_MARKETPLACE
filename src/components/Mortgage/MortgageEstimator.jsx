import React from "react";
import {
  Calculator,
  Info,
} from "lucide-react";

const formatCurrency = (value) =>
  `₦${Math.round(
    Number(value) || 0
  ).toLocaleString("en-NG")}`;

const MortgageEstimator = ({
  currentStep,
  application,
  updateLoan,
  purchasePrice,
  downPayment,
  loanAmount,
  monthlyPayment,
  onSubmit,
  onBackToProperty,
}) => {
  const loan = application.loan;

  if (currentStep === 1) {
    return (
      <section className="mortgage-estimator mortgage-estimator--dark-top">
        <div className="mortgage-estimator__dark-heading">
          <div>
            <Calculator size={19} />

            <h2>Estimator</h2>
          </div>

          <p>Draft your numbers</p>
        </div>

        <div className="mortgage-estimator__body">
          <div className="mortgage-estimator__range-row">
            <div>
              <span>Home Value</span>

              <strong>
                {formatCurrency(
                  purchasePrice
                )}
              </strong>
            </div>

            <input
              type="range"
              min="10000000"
              max="1000000000"
              step="5000000"
              value={purchasePrice}
              onChange={() => {}}
              disabled
            />
          </div>

          <div className="mortgage-estimator__range-row">
            <div>
              <span>
                Down Payment (20%)
              </span>

              <strong>
                {formatCurrency(
                  downPayment
                )}
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max={purchasePrice}
              value={downPayment}
              disabled
            />
          </div>

          <div className="mortgage-estimator__term">
            <span>Loan Term</span>

            <div>
              {[15, 20, 30].map((term) => (
                <button
                  key={term}
                  type="button"
                  className={
                    loan.term === term
                      ? "mortgage-estimator__term-button mortgage-estimator__term-button--active"
                      : "mortgage-estimator__term-button"
                  }
                  onClick={() =>
                    updateLoan({
                      term,
                    })
                  }
                >
                  {term} Yr
                </button>
              ))}
            </div>
          </div>

          <div className="mortgage-estimator__big-payment">
            <span>
              ESTIMATED MONTHLY
            </span>

            <strong>
              {formatCurrency(
                monthlyPayment
              )}
            </strong>

            <p>
              Principal &amp; Interest only @{" "}
              {loan.interestRate}% APR
            </p>
          </div>

          <button
            type="button"
            className="mortgage-estimator__recalculate"
          >
            Recalculate
          </button>
        </div>

        <p className="mortgage-estimator__footer-note">
          This is an estimate. Final terms subject
          to approval.
        </p>
      </section>
    );
  }

  if (currentStep === 4) {
    return (
      <section className="mortgage-estimator mortgage-estimator--review">
        <div className="mortgage-estimator__simple-heading">
          <Calculator size={20} />

          <h2>Estimator</h2>
        </div>

        <div className="mortgage-estimator__summary-row">
          <span>Loan Amount</span>

          <strong>
            {formatCurrency(
              loanAmount
            )}
          </strong>
        </div>

        <div className="mortgage-estimator__summary-row">
          <span>Term</span>

          <strong>
            {loan.term} Year Fixed
          </strong>
        </div>

        <div className="mortgage-estimator__summary-row">
          <span>
            Est. Interest Rate
          </span>

          <strong>
            {loan.interestRate}%
          </strong>
        </div>

        <div className="mortgage-estimator__review-payment">
          <span>
            Est. Monthly Payment
          </span>

          <strong>
            {formatCurrency(
              monthlyPayment
            )}
          </strong>
        </div>

        <p className="mortgage-estimator__review-note">
          *Includes estimated taxes and insurance.
          Final rate subject to underwriting.
        </p>

        <button
          type="button"
          className="mortgage-estimator__submit"
          onClick={onSubmit}
        >
          Submit Application
        </button>

        <button
          type="button"
          className="mortgage-estimator__back-property"
          onClick={onBackToProperty}
        >
          Back to Property
        </button>
      </section>
    );
  }

  return (
    <section className="mortgage-estimator mortgage-estimator--simple">
      <div className="mortgage-estimator__simple-heading">
        <Calculator size={20} />

        <h2>Estimator</h2>
      </div>

      <div className="mortgage-estimator__summary-row">
        <span>
          {currentStep === 2
            ? "Target Loan Amount"
            : "Loan Amount"}
        </span>

        <strong>
          {formatCurrency(
            loanAmount || purchasePrice
          )}
        </strong>
      </div>

      <div className="mortgage-estimator__summary-row">
        <span>
          {currentStep === 2
            ? "Interest Rate (Est.)"
            : "Est. Interest Rate"}
        </span>

        <strong>
          {loan.interestRate}%
        </strong>
      </div>

      <div className="mortgage-estimator__summary-row">
        <span>Term</span>

        <strong>
          {loan.term} Years
          {currentStep === 3
            ? " Fixed"
            : ""}
        </strong>
      </div>

      <div className="mortgage-estimator__small-payment">
        <span>
          {currentStep === 3
            ? "Est. Monthly Payment"
            : "Estimated Monthly Payment"}
        </span>

        <strong>
          {formatCurrency(
            monthlyPayment
          )}
        </strong>

        <p>
          Includes principal and interest. Taxes
          and insurance not included.
        </p>
      </div>

      {currentStep === 3 && (
        <div className="mortgage-estimator__notice">
          <Info size={18} />

          <span>
            This is a preliminary estimate based
            on typical rates for the entered
            parameters. Your actual rate and
            payment may vary.
          </span>
        </div>
      )}
    </section>
  );
};

export default MortgageEstimator;