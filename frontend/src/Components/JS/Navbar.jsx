import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../CSS/nav.css";

const Navbar = () => {
  const [activePage, setActivePage] = useState(window.location.pathname);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setActivePage(window.location.pathname);
    };

    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        const navbarToggler = document.querySelector(".navbar-toggler");
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click();
        }
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar" ref={navbarRef}>
      <div className="container-fluid nav_div">
        <Link className="navbar-brand" to="/">
          Vitae
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav">
            <li className={`nav-item ${activePage === "/" ? "active" : ""}`}>
              <Link
                className="nav-link"
                to="/"
                onClick={() => setActivePage("/")}
              >
                Dashboard
              </Link>
            </li>
            <li
              className={`nav-item ${
                activePage === "/post" ? "active" : ""
              }`}
            >
              <Link
                className="nav-link"
                to="/post"
                onClick={() => setActivePage("/post")}
              >
                Post Offer
              </Link>
            </li>
            <li
              className={`nav-item ${
                activePage === "/upload-cv" ? "active" : ""
              }`}
            >
              <Link
                className="nav-link"
                to="/upload-cv"
                onClick={() => setActivePage("/upload-cv")}
              >
                Upload CV
              </Link>
            </li>
            <li
              className={`nav-item ${
                activePage === "/set-keywords" ? "active" : ""
              }`}
            >
              <Link
                className="nav-link"
                to="/set-keywords"
                onClick={() => setActivePage("/set-keywords")}
              >
                Set Keywords
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="accountDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faUser} />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="accountDropdown"
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/manage-account"
                    onClick={() => setActivePage("/manage-account")}
                  >
                    Manage Account
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/help"
                    onClick={() => setActivePage("/help")}
                  >
                    Help
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
