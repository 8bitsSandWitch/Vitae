import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Login from './Login';
import Register from './Register';

import "../CSS/nav.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {
  const [activePage, setActivePage] = useState(window.location.pathname);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeBackgroundStyle, setActiveBackgroundStyle] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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

  useEffect(() => {
    const activeNavItem = document.querySelector(`.nav-item.active`);
    if (activeNavItem) {
      const { offsetLeft, offsetWidth } = activeNavItem;
      setActiveBackgroundStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activePage]);

  const handleLogin = () => {
    setSnackbar({ open: true, message: 'Login successful', severity: 'success' });
    setShowLogin(false);
  };

  const handleRegister = () => {
    setSnackbar({ open: true, message: 'Registration successful', severity: 'success' });
    setShowRegister(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
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
                className={`nav-item ${activePage === "/post" ? "active" : ""
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
                className={`nav-item ${activePage === "/upload-cv" ? "active" : ""
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
                className={`nav-item ${activePage === "/set-keywords" ? "active" : ""
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
              <li className="nav-item">
                <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => setShowRegister(true)}>Register</button>
              </li>
            </ul>
            <div className="active-background" style={activeBackgroundStyle}></div>
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className="popup" onClick={() => setShowLogin(false)}>
          <Login onSubmit={handleLogin} />
        </div>
      )}

      {showRegister && (
        <div className="popup" onClick={() => setShowRegister(false)}>
          <div className="popup-content">
            <Register onSubmit={handleRegister} />
          </div>
        </div>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
