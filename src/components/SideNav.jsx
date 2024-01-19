import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SideNav = () => {
  const [active, setActive] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("user-token");
    if (!userToken) {
      return navigate("/login");
    } else {
      const decode = jwtDecode(userToken);
      setUser({
        id: decode.user.id,
        name: decode.user.name,
        email: decode.user.email,
        role: decode.user.role,
      });
    }
  }, []);

  const [dataMenu, setDataMenu] = useState([
    {
      id: 1,
      title: "Dashboard",
      url: "",
      icon: "fa-tachometer-alt",
      clicked: false,
    },
    {
      id: 2,
      title: "Data Lensa",
      url: "data-lensa",
      icon: "fa-database",
      clicked: false,
    },
    {
      id: 3,
      title: "Rekam Medis",
      url: "",
      icon: "fa-user-md",
      dropdown: [
        { title: "Data Pasien", url: "pasien" },
        { title: "Data Rekam Medis", url: "rekam-medis" },
      ],
      clicked: false,
    },
    {
      id: 4,
      title: "Garansi",
      url: "",
      icon: "fa-certificate",
      dropdown: [
        { title: "Data Garansi", url: "garansi" },
        { title: "Data Klaim Garansi", url: "klaim-garansi" },
      ],
      clicked: false,
    },
    {
      id: 5,
      title: "Data Optik/Armada",
      url: "data-optik",
      icon: "fa-building",
      clicked: false,
    },
    {
      id: 6,
      title: "Daftar Akun",
      url: "daftar-akun",
      icon: "fa-list-alt",
      clicked: false,
    },
    {
      id: 7,
      title: "Pengaturan Akun",
      url: "pengaturan-akun",
      icon: "fa-cog",
      clicked: false,
    },
  ]);

  const NavLink = ({ id, title, url, icon, isActive, onClick }) => {
    return (
      <Link
        to={url}
        className={isActive ? "nav-link active" : "nav-link"}
        onClick={() => navigates(id)}
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
              <li className="nav-item text-light" key={index}>
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
            {dataMenu.map((item) => (
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
  );
};

export default SideNav;
