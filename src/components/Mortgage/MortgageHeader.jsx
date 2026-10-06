import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, LockKeyhole } from "lucide-react";

const MortgageHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="mortgage-header">
      <button
        type="button"
        className="mortgage-header__brand"
        onClick={() => navigate("/")}
      >
        <Home size={22} strokeWidth={2.5} />

        <span>Haggai Homes</span>
      </button>

      <div className="mortgage-header__security">
        <LockKeyhole size={17} />

        <span>Bank-Grade Security</span>
      </div>
    </header>
  );
};

export default MortgageHeader;