import React, { useRef } from "react";
import {
  UserRound,
  Mail,
  Phone,
  IdCard,
  LockKeyhole,
  Upload,
  ArrowRight,
} from "lucide-react";

const PersonalInfoStep = ({
  data,
  onChange,
  onNext,
}) => {
  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !data.fullName ||
      !data.email ||
      !data.phone ||
      !data.nationalId ||
      !data.address
    ) {
      alert(
        "Please complete all required personal information fields."
      );

      return;
    }

    onNext();
  };

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Maximum file size is 10MB.");
      return;
    }

    onChange({
      document: file,
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file =
      event.dataTransfer.files?.[0];

    handleFile(file);
  };

  return (
    <section className="mortgage-form-card">
      <div className="mortgage-form-card__heading">
        <UserRound size={21} />

        <h2>Personal Information</h2>
      </div>

      <div className="mortgage-form-card__divider" />

      <form onSubmit={handleSubmit}>
        <div className="mortgage-field">
          <label>
            Full Legal Name
          </label>

          <input
            type="text"
            value={data.fullName}
            placeholder="e.g. Jane Doe"
            onChange={(event) =>
              onChange({
                fullName:
                  event.target.value,
              })
            }
          />

          <small>
            As it appears on your government ID.
          </small>
        </div>

        <div className="mortgage-grid mortgage-grid--two">
          <div className="mortgage-field">
            <label>Email Address</label>

            <div className="mortgage-input-icon">
              <Mail size={19} />

              <input
                type="email"
                value={data.email}
                placeholder="jane@example.com"
                onChange={(event) =>
                  onChange({
                    email:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mortgage-field">
            <label>Phone Number</label>

            <div className="mortgage-input-icon">
              <Phone size={19} />

              <input
                type="tel"
                value={data.phone}
                placeholder="(555) 000–0000"
                onChange={(event) =>
                  onChange({
                    phone:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="mortgage-field">
          <label>
            National ID / SSN
          </label>

          <div className="mortgage-input-icon">
            <IdCard size={19} />

            <input
              type="text"
              value={data.nationalId}
              placeholder="•••–••–••••"
              onChange={(event) =>
                onChange({
                  nationalId:
                    event.target.value,
                })
              }
            />
          </div>

          <small className="mortgage-field__secure">
            <LockKeyhole size={12} />

            Encrypted and securely stored.
          </small>
        </div>

        <div className="mortgage-field">
          <label>
            Current Residential Address
          </label>

          <input
            type="text"
            value={data.address}
            placeholder="123 Main St, Apt 4B, City, State, ZIP"
            onChange={(event) =>
              onChange({
                address:
                  event.target.value,
              })
            }
          />
        </div>

        <div className="mortgage-field">
          <label>
            Supporting Documents (Optional)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            hidden
            onChange={(event) =>
              handleFile(
                event.target.files?.[0]
              )
            }
          />

          <button
            type="button"
            className="mortgage-upload"
            onClick={() =>
              fileInputRef.current?.click()
            }
            onDragOver={(event) =>
              event.preventDefault()
            }
            onDrop={handleDrop}
          >
            <Upload size={25} />

            {data.document ? (
              <>
                <strong>
                  {data.document.name}
                </strong>

                <span>
                  Click to replace document
                </span>
              </>
            ) : (
              <>
                <strong>
                  Click to upload or drag and
                  drop
                </strong>

                <span>
                  PDF, JPG, PNG (Max 10MB)
                </span>
              </>
            )}
          </button>

          <small>
            Upload government ID, proof of
            income, or other relevant
            documents.
          </small>
        </div>

        <div className="mortgage-form-actions mortgage-form-actions--right">
          <button
            type="submit"
            className="mortgage-primary-button mortgage-primary-button--black"
          >
            Save &amp; Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoStep;