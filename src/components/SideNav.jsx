import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SideNav = () => {
  const [active, setActive] = useState(null);

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
      title: "Dropdown",
      url: "",
      icon: "fa-table",
      dropdown: [
        { title: "Page 1", url: "page1" },
        { title: "Page 2", url: "page2" },
      ],
      clicked: false,
    },
    {
      id: 3,
      title: "Page",
      url: "page",
      icon: "fa-file-code",
      clicked: false,
    },
  ]);

  const NavLink = ({ id, title, url, icon, isActive, onClick }) => {
    return (
      <Link
        to={url}
        className={isActive ? "nav-link active" : "nav-link"}
        onClick={() => navigate(id)}
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
          href={"#" + title}
          data-toggle="collapse"
          aria-expanded="false"
          className={isActive ? "nav-link active" : "nav-link"}
          onClick={() => navigate(id)}
        >
          <i className={"nav-icon fas " + icon}></i>
          <p>
            {title}
            <i className="right fa fa-chevron-down"></i>
          </p>
        </a>
        <div id={title} className="collapse">
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

  const navigate = (id) => {
    setActive(id);
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="index3.html" className="brand-link">
        <img
          src="/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <a href="#" className="d-block">
              Alexander Pierce
            </a>
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
                    onClick={navigate}
                  />
                ) : (
                  <NavLink
                    {...item}
                    isActive={active === item.id}
                    onClick={navigate}
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
