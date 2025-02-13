import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "../CSS/profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserAltSlash } from "@fortawesome/free-solid-svg-icons";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Default from '../IMG/default.png'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const profile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [enterpriseName, setEnterpriseName] = useState("");
  const [enterpriseAddress, setEnterpriseAddress] = useState("");
  const [enterpriseEmail, setEnterpriseEmail] = useState("");
  const [enterpriseWebsite, setEnterpriseWebsite] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
    setFirstName(parsedUser.first_name);
    setLastName(parsedUser.last_name);
    setUsername(parsedUser.username);
    setEmail(parsedUser.email);
  }, [navigate]);

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const passwordSubmit = async (e) => {
    e.preventDefault();
    if (newpassword === confirmpassword) {
      const formData = new FormData();
      formData.append("password", newpassword);

      const csrfToken = getCSRFToken();

      axios.put(`http://localhost:8000/api/users/${user.id}/`, formData, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => {
          setSnackbar({
            open: true,
            message: "Password updated successfully.",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          setSnackbar({
            open: true,
            message: "An error occurred during password update.",
            severity: "error",
          });
        });
    } else {
      setSnackbar({
        open: true,
        message: "New password and confirmation password do not match.",
        severity: "error",
      });
    }


    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("username", username);

    const csrfToken = getCSRFToken();

    fetch(`http://localhost:8000/api/users/${user.id}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setSnackbar({
            open: true,
            message: "Profile updated successfully.",
            severity: "success",
          });
          // Update local storage with new user data
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during profile update.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during profile update.",
          severity: "error",
        });
      });
  };

  const handleEnterpriseSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: enterpriseName,
      address: enterpriseAddress,
      email: enterpriseEmail,
      website: enterpriseWebsite,
    };

    const csrfToken = getCSRFToken();

    fetch("http://localhost:8000/api/entreprise/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setSnackbar({
            open: true,
            message: "Enterprise details updated successfully.",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during enterprise update.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating enterprise:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during enterprise update.",
          severity: "error",
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="profile-container main-content">
      <div className="profile-sb">
        <div className="profile-sb-header">
          <div className="profile-edit-img">
            <img src={Default} alt="" />
            <FontAwesomeIcon icon={faEdit} className="profile-edit-icon" />
            <input type="file" className="edit-img-input" id="profilePicture" onChange={handleProfilePictureChange} accept="image/*" />
          </div>
          <p>@{username}</p>
        </div>

        <hr className="divide-line" />

        <div className="profile-sb-footer">
          <button className="sb-footer-delAccount">
            <FontAwesomeIcon icon={faUserAltSlash} className="button-icon" />
            Delete Account
          </button>
        </div>
      </div>

      <div className="grouped-form">
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-header">
            <div className="title-icon-group">
              <FontAwesomeIcon icon={faUserEdit} className="profile-user-icon" />
              <h2>Account Settings</h2>
            </div>
            <button type="submit">Save</button>
          </div>
          <div className="group-input">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="group-input">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="email"
                id="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </form>

        <form className="profile-form psdForm" onSubmit={passwordSubmit}>
          <div className="profile-form-header">
            <div className="title-icon-group">
              <FontAwesomeIcon icon={faLock} className="profile-user-icon" />
              <h2>Password Settings</h2>
            </div>
            <button type="submit">Save</button>
          </div>

          <div className="form-group">
            <label htmlFor="password">Current Password</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input type="password" id="newpassword" onChange={(e) => setNewpassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input type="password" id="confirmpassword" onChange={(e) => setConfirmpassword(e.target.value)} />
          </div>
        </form>

        {user && user.type_utils === "job_poster" && (
          <form className="profile-form" onSubmit={handleEnterpriseSubmit}>
            <h3>Enterprise Details</h3>
            <div className="form-group">
              <label htmlFor="enterpriseName">Enterprise Name</label>
              <input
                type="text"
                id="enterpriseName"
                value={enterpriseName}
                onChange={(e) => setEnterpriseName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="enterpriseAddress">Enterprise Address</label>
              <input
                type="text"
                id="enterpriseAddress"
                value={enterpriseAddress}
                onChange={(e) => setEnterpriseAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="enterpriseEmail">Enterprise Email</label>
              <input
                type="email"
                id="enterpriseEmail"
                value={enterpriseEmail}
                onChange={(e) => setEnterpriseEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="enterpriseWebsite">Enterprise Website</label>
              <input
                type="url"
                id="enterpriseWebsite"
                value={enterpriseWebsite}
                onChange={(e) => setEnterpriseWebsite(e.target.value)}
                required
              />
            </div>
            <button type="submit">Update Enterprise</button>
          </form>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default profile;
