import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <strong>Copyright © {year} Admin MA </strong>
      All rights reserved.
      <div className="float-right d-none d-sm-inline-block">
        <b>
          Dibuat dengan <i className="fas fa-coffee fa-xs"></i>
        </b>
        &nbsp; Di Rumah & Bahagia
      </div>
    </footer>
  );
};

export default Footer;
