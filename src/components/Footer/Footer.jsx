import React from "react";
import { Link } from "react-router-dom";
import {
  Globe2,
  AtSign,
  QrCode,
} from "lucide-react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="homes-footer">
      <div className="homes-footer__inner">
        <div className="homes-footer__about">
          <h3>Haggai Homes</h3>

          <p>
            A subsidiary of Haggai Bank, dedicated to making
            homeownership a reality through simplified real estate
            solutions.
          </p>

          <span className="homes-footer__copyright">
            © 2026 Haggai Homes. All rights reserved.
            <br />
            Licensed by the Central Bank of Nigeria.
          </span>
        </div>

        <div className="homes-footer__links">
          <div className="homes-footer__column">
            <h4>Company</h4>

            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className="homes-footer__column">
            <h4>Tools</h4>

            <Link to="/mortgage-calculator">
              Mortgage Calculator
            </Link>

            <Link to="/branch-locator">
              Branch Locator
            </Link>

            <Link to="/dealer">
              Dealer Portal
            </Link>
          </div>

          <div className="homes-footer__column">
            <h4>Connect</h4>

            <div className="homes-footer__socials">
              <button
                type="button"
                aria-label="Show Haggai Homes QR code"
              >
                <QrCode size={19} />
              </button>

              <button
                type="button"
                aria-label="Visit Haggai Homes website"
              >
                <Globe2 size={19} />
              </button>

              <Link
                to="/contact"
                aria-label="Contact Haggai Homes"
              >
                <AtSign size={19} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;