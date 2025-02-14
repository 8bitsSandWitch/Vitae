import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import "../CSS/nav.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {
  const [activePage, setActivePage] = useState(window.location.pathname);
  const [activeBackgroundStyle, setActiveBackgroundStyle] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navbarRef = useRef(null);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

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

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("popstate", handleLocationChange);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navigate, prevScrollPos]);

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark custom-navbar ${visible ? 'visible' : 'hidden'}`} ref={navbarRef}>
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
              {user && user.type_utils !== "job_applicant" && (
                <li className={`nav-item ${activePage === "/post" ? "active" : ""}`}>
                  <Link
                    className="nav-link"
                    to="/post"
                    onClick={() => setActivePage("/post")}
                  >
                    Post Offer
                  </Link>
                </li>
              )}
              <li className={`nav-item ${activePage === "/upload-cv" ? "active" : ""}`}>
                <Link
                  className="nav-link"
                  to="/upload-cv"
                  onClick={() => setActivePage("/upload-cv")}
                >
                  Upload CV
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
                      to="/account"
                      onClick={() => setActivePage("/account")}
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
            {/* <div className="active-background" style={activeBackgroundStyle}></div> */}
          </div>
        </div>
      </nav>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
