import React from "react";

const steps = [
  {
    number: 1,
    label: "Personal Info",
  },
  {
    number: 2,
    label: "Employment",
  },
  {
    number: 3,
    label: "Property",
  },
  {
    number: 4,
    label: "Review",
  },
];

const MortgageProgress = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <section className="mortgage-progress-card">
      <h1>Mortgage Application</h1>

      <p>
        {currentStep === 4
          ? "Please confirm all the information inputted is accurate."
          : "Please complete all fields carefully. This information is required for initial pre-approval."}
      </p>

      <div className="mortgage-progress">
        <div className="mortgage-progress__line" />

        <div
          className="mortgage-progress__completed-line"
          style={{
            width: `${
              ((currentStep - 1) / 3) * 100
            }%`,
          }}
        />

        {steps.map((step) => {
          const completed = step.number < currentStep;
          const active = step.number === currentStep;

          return (
            <button
              key={step.number}
              type="button"
              className={`mortgage-progress__step ${
                active
                  ? "mortgage-progress__step--active"
                  : ""
              } ${
                completed
                  ? "mortgage-progress__step--completed"
                  : ""
              }`}
              onClick={() => {
                if (
                  step.number <= currentStep
                ) {
                  onStepClick(step.number);
                }
              }}
            >
              <span className="mortgage-progress__circle">
                {completed ? "✓" : step.number}
              </span>

              <strong>{step.label}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MortgageProgress;