import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home as HomeIcon } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMortgageApplication = () => {
    navigate("/mortgage");
    closeMobileMenu();
  };

  return (
    <header className="marketplace-navbar">
      <div className="marketplace-navbar__inner">
        <Link
          to="/"
          className="marketplace-navbar__brand"
          onClick={closeMobileMenu}
        >
          <span className="marketplace-navbar__brand-icon">
            <HomeIcon size={19} strokeWidth={2.8} />
          </span>

          <span className="marketplace-navbar__brand-text">
            Haggai Marketplace
          </span>
        </Link>

        <nav
          className={`marketplace-navbar__navigation ${
            mobileMenuOpen
              ? "marketplace-navbar__navigation--open"
              : ""
          }`}
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `marketplace-navbar__link ${
                isActive ? "marketplace-navbar__link--active" : ""
              }`
            }
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `marketplace-navbar__link ${
                isActive ? "marketplace-navbar__link--active" : ""
              }`
            }
            onClick={closeMobileMenu}
          >
            Properties
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `marketplace-navbar__link ${
                isActive ? "marketplace-navbar__link--active" : ""
              }`
            }
            onClick={closeMobileMenu}
          >
            Contact
          </NavLink>

          <button
            type="button"
            className="marketplace-navbar__mortgage marketplace-navbar__mortgage--mobile"
            onClick={handleMortgageApplication}
          >
            Apply for Mortgage
          </button>
        </nav>

        <button
          type="button"
          className="marketplace-navbar__mortgage marketplace-navbar__mortgage--desktop"
          onClick={handleMortgageApplication}
        >
          Apply for Mortgage
        </button>

        <button
          type="button"
          className="marketplace-navbar__menu-button"
          aria-label={
            mobileMenuOpen ? "Close navigation" : "Open navigation"
          }
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;