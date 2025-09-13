import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="nav-root">
      <div className="nav-inner">
        <button className="nav-back">←</button>
        <div className="nav-title-wrapper">
          <div className="nav-title">आपली लाखोरी</div>
          <div className="nav-subtitle">माझा गाव-माझी ओळख</div>
        </div>
        <div className="nav-actions">
          <button className="icon-btn">☰</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
