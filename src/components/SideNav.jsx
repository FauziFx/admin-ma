import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SideNav = ({ isAdmin }) => {
  const [active, setActive] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [dataMenuFilter, setDataMenuFilter] = useState([]);
  const pushMenu = useRef(null);

  useEffect(() => {
    if (!isAdmin) {
      setDataMenuFilter(
        dataMenu.filter((dataMenu) => dataMenu.role === "user")
      );
    } else {
      setDataMenuFilter(dataMenu);
    }
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
  }, [isAdmin]);

  const [dataMenu, setDataMenu] = useState([
    {
      id: 1,
      title: "Dashboard",
      url: "",
      icon: "fa-tachometer-alt",
      clicked: false,
      role: "user",
    },
    {
      id: 2,
      title: "Cek Stok Lensa 1",
      url: "cek-stok-lensa-1",
      icon: "fa-database",
      clicked: false,
      role: "user",
    },
    {
      id: 3,
      title: "Cek Stok Lensa 2",
      url: "cek-stok-lensa-2",
      icon: "fa-database",
      clicked: false,
      role: "user",
    },
    {
      id: 4,
      title: "Rekam Medis",
      url: "",
      icon: "fa-user-md",
      dropdown: [
        { title: "Pendaftaran Pasien", url: "pasien" },
        { title: "Kunjungan Pasien", url: "kunjungan-pasien" },
      ],
      clicked: false,
      role: "user",
    },
    {
      id: 5,
      title: "Garansi",
      url: "",
      icon: "fa-certificate",
      dropdown: [
        { title: "Data Garansi", url: "garansi" },
        { title: "Data Klaim Garansi", url: "klaim-garansi" },
      ],
      clicked: false,
      role: "user",
    },
    {
      id: 6,
      title: "Data Optik/Armada",
      url: "data-optik",
      icon: "fa-building",
      clicked: false,
      role: "admin",
    },
    // {
    //   id: 6,
    //   title: "Daftar Akun",
    //   url: "daftar-akun",
    //   icon: "fa-list-alt",
    //   clicked: false,
    //   role: "admin",
    // },
    {
      id: 7,
      title: "Pengaturan Akun",
      url: "pengaturan-akun",
      icon: "fa-cog",
      clicked: false,
      role: "user",
    },
  ]);

  const NavLink = ({ id, title, url, icon, isActive, onClick }) => {
    return (
      <Link
        to={url}
        className={isActive ? "nav-link active" : "nav-link"}
        onClick={() => {
          navigates(id);
          let is_mobile = /android|mobile/gi.test(navigator.userAgent);
          if (is_mobile) {
            pushMenu.current.click();
          }
        }}
      >
        <i className={"nav-icon fas " + icon}></i>
        <p>{title}</p>
      </Link>
    );
  };

  const NavLinkDropdown = ({
    id,
    title,
    url,
    icon,
    dropdown,
    isActive,
    onClick,
  }) => {
    return (
      <>
        <a
          href={"#" + title.replace(/ /g, "")}
          data-toggle="collapse"
          aria-expanded="false"
          className={isActive ? "nav-link active" : "nav-link"}
          onClick={() => navigates(id)}
        >
          <i className={"nav-icon fas " + icon}></i>
          <p>
            {title}
            <i className="right fa fa-chevron-down"></i>
          </p>
        </a>
        <div id={title.replace(/ /g, "")} className="collapse">
          <ul className="">
            {dropdown.map((item, index) => (
              <li
                className="nav-item text-light"
                key={index}
                onClick={() => {
                  let is_mobile = /android|mobile/gi.test(navigator.userAgent);
                  if (is_mobile) {
                    pushMenu.current.click();
                  }
                }}
              >
                <Link to={item.url} className="nav-link">
                  <p>{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const navigates = (id) => {
    setActive(id);
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
              ref={pushMenu}
            >
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
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="#" className="brand-link">
          <img
            src="/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">Admin MA</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="/img/user1-128x128.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <Link to="/pengaturan-akun" className="d-block">
                {user.name}
              </Link>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {dataMenuFilter.map((item) => (
                <li className="nav-item" key={item.id}>
                  {item.dropdown ? (
                    <NavLinkDropdown
                      {...item}
                      isActive={active === item.id}
                      onClick={navigates}
                    />
                  ) : (
                    <NavLink
                      {...item}
                      isActive={active === item.id}
                      onClick={navigates}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
};

export default SideNav;
