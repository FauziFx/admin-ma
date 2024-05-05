import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("user-ma-token");
    if (!userToken) {
      return navigate("/login");
    } else {
      const decode = jwtDecode(userToken);
      setUser({
        id: decode.user.id,
        name: decode.user.nama,
        email: decode.user.username,
        role: decode.user.role,
      });
    }
  }, []);

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        {/* Messages Dropdown Menu */}
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-user" />
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <Link to="/pengaturan-akun" className="dropdown-item">
              {/* Message Start */}
              <div className="media">
                <img
                  src="/img/user1-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 mr-3 img-circle"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">{user.name}</h3>
                  <p className="text-sm">{user.email}</p>
                  <p className="text-sm text-muted">
                    <i className="fas fa-home fa-sm" /> {user.role}
                  </p>
                </div>
              </div>
              {/* Message End */}
            </Link>
            <div className="dropdown-divider" />
            <div className="dropdown-divider" />
            <a
              href="#"
              onClick={() => {
                localStorage.clear();
                window.location.replace("/");
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
