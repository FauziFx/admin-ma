import React from "react";

const Navbar = () => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Messages Dropdown Menu */}
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-user" />
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" className="dropdown-item">
              {/* Message Start */}
              <div className="media">
                <img
                  src="/img/user1-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 mr-3 img-circle"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">Brad Diesel</h3>
                  <p className="text-sm">email@mail.com</p>
                  <p className="text-sm text-muted">
                    <i className="fas fa-home fa-sm" /> Unit
                  </p>
                </div>
              </div>
              {/* Message End */}
            </a>
            <div className="dropdown-divider" />
            <div className="dropdown-divider" />
            <a
              href="#"
              onClick={() => {
                localStorage.clear();
                window.location.replace("/login");
              }}
              className="dropdown-item dropdown-footer"
            >
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
