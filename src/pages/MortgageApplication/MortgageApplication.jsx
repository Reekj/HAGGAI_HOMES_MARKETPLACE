import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MortgageHeader from "../../components/Mortgage/MortgageHeader";
import MortgageProgress from "../../components/Mortgage/MortgageProgress";
import MortgageEstimator from "../../components/Mortgage/MortgageEstimator";
import PersonalInfoStep from "../../components/Mortgage/PersonalInfoStep";
import EmploymentStep from "../../components/Mortgage/EmploymentStep";
import PropertyStep from "../../components/Mortgage/PropertyStep";
import ReviewStep from "../../components/Mortgage/ReviewStep";

import "./MortgageApplication.css";

const MortgageApplication = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [application, setApplication] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      nationalId: "",
      address: "",
      dateOfBirth: "",
      document: null,
    },

    employment: {
      employer: "",
      jobTitle: "",
      yearsEmployment: "",
      annualIncome: "",
    },

    property: {
      propertyAddress: "",
      purchasePrice: "",
      downPayment: "",
      propertyType: "",
      propertyUsage: "",
    },

    consent: {
      accuracy: false,
      terms: false,
      creditCheck: false,
    },

    loan: {
      interestRate: 6.5,
      term: 30,
    },
  });

  const updateSection = (section, values) => {
    setApplication((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...values,
      },
    }));
  };

  const numericPurchasePrice =
    Number(application.property.purchasePrice);

  const numericDownPayment =
    Number(application.property.downPayment) ||
    numericPurchasePrice * 0.2;

  const loanAmount = Math.max(
    0,
    numericPurchasePrice - numericDownPayment
  );

  const estimatedMonthlyPayment = useMemo(() => {
    const principal = loanAmount;

    const annualInterest =
      Number(application.loan.interestRate) / 100;

    const monthlyInterest = annualInterest / 12;

    const numberOfPayments =
      Number(application.loan.term) * 12;

    if (!principal) {
      return 0;
    }

    if (!monthlyInterest) {
      return principal / numberOfPayments;
    }

    const payment =
      (principal *
        monthlyInterest *
        Math.pow(
          1 + monthlyInterest,
          numberOfPayments
        )) /
      (Math.pow(
        1 + monthlyInterest,
        numberOfPayments
      ) -
        1);

    return Math.round(payment);
  }, [
    loanAmount,
    application.loan.interestRate,
    application.loan.term,
  ]);

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const allConsentsAccepted =
      application.consent.accuracy &&
      application.consent.terms &&
      application.consent.creditCheck;

    if (!allConsentsAccepted) {
      alert(
        "Please accept all declarations and consent items before submitting."
      );
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mortgage-page">
        <MortgageHeader />

        <main className="mortgage-success">
          <div className="mortgage-success__card">
            <div className="mortgage-success__icon">✓</div>

            <h1>Application Submitted</h1>

            <p>
              Your mortgage application has been received
              successfully.
            </p>

            <p>
              A Haggai Homes representative will contact you after
              reviewing the information provided.
            </p>

            <button
              type="button"
              onClick={() => navigate("/properties")}
            >
              Back to Properties
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mortgage-page">
      <MortgageHeader />

      <main className="mortgage-main">
        <div className="mortgage-container">
          <MortgageProgress
            currentStep={currentStep}
            onStepClick={goToStep}
          />

          {currentStep === 4 && (
            <div className="mortgage-review-heading">
              <h1>Review &amp; Submit</h1>

              <p>
                Please verify your details before submitting your
                application.
              </p>
            </div>
          )}

          <div
            className={`mortgage-workspace ${
              currentStep === 1
                ? "mortgage-workspace--personal"
                : ""
            }`}
          >
            <section className="mortgage-workspace__form">
              {currentStep === 1 && (
                <PersonalInfoStep
                  data={application.personal}
                  onChange={(values) =>
                    updateSection("personal", values)
                  }
                  onNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <EmploymentStep
                  data={application.employment}
                  onChange={(values) =>
                    updateSection("employment", values)
                  }
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}

              {currentStep === 3 && (
                <PropertyStep
                  data={application.property}
                  onChange={(values) =>
                    updateSection("property", values)
                  }
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}

              {currentStep === 4 && (
                <ReviewStep
                  application={application}
                  onEdit={goToStep}
                  onConsentChange={(values) =>
                    updateSection("consent", values)
                  }
                />
              )}
            </section>

            <aside className="mortgage-workspace__estimator">
              <MortgageEstimator
                currentStep={currentStep}
                application={application}
                updateLoan={(values) =>
                  updateSection("loan", values)
                }
                purchasePrice={numericPurchasePrice}
                downPayment={numericDownPayment}
                loanAmount={loanAmount}
                monthlyPayment={estimatedMonthlyPayment}
                onSubmit={handleSubmit}
                onBackToProperty={() => goToStep(3)}
              />
            </aside>
          </div>

          {currentStep === 1 && (
            <div className="mortgage-security-banner">
              <div className="mortgage-security-banner__icon">
                ⛨
              </div>

              <div>
                <strong>Bank-Grade Security</strong>

                <p>
                  Your data is protected with 256-bit encryption.
                  Haggai Homes will never share your personal
                  information without explicit consent.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mortgage-footer">
        <div className="mortgage-footer__inner">
          <div>
            <div className="mortgage-footer__brand">
              <span>⌂</span>
              Haggai Homes
            </div>

            <p>
              © 2026 Haggai Homes Financial Services. All rights
              reserved.
              <br />
              Registered Mortgage Lender ID: 948210. Member FDIC.
              Equal Housing Opportunity.
            </p>
          </div>

          <nav>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Cookie Policy</a>
            <a href="/about">Regulatory Disclosure</a>
            <a href="/contact">Contact Us</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default MortgageApplication;