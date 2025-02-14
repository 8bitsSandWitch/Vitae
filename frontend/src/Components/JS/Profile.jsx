import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import "../CSS/profile.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faLock, faUserAltSlash } from "@fortawesome/free-solid-svg-icons";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
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
    setFirstName(parsedUser.first_name || "");
    setLastName(parsedUser.last_name || "");
    setUsername(parsedUser.username || "");
    setEmail(parsedUser.email || "");
    if (parsedUser.profile_picture) {
      setProfilePicturePreview(parsedUser.profile_picture);
    }
  }, [navigate]);

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicturePreview(null);
    }
  };

  const handleCancelProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(user.profile_picture);
  };

  const handleValidaterofilePicture = () => {
    if (!profilePicture) {
      setSnackbar({
        open: true,
        message: "No profile picture selected.",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    const csrfToken = getCSRFToken();
    const token = localStorage.getItem("token");

    axios.put(`http://localhost:8000/api/update-profile-picture/`, formData, {
      headers: {
        "X-CSRFToken": csrfToken,
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        setSnackbar({
          open: true,
          message: "Profile picture updated successfully.",
          severity: "success",
        });
        // Update local storage with new user data
        const updatedUser = { ...user, profile_picture: response.data.profile_picture };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      })
      .catch((error) => {
        console.error("Error updating profile picture:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during profile picture update.",
          severity: "error",
        });
      });
  };

  const passwordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      const formData = new FormData();
      formData.append("password", newPassword);

      const csrfToken = getCSRFToken();
      const token = localStorage.getItem("token");

      axios.put(`http://localhost:8000/api/Utilisateur/${user.id}/`, formData, {
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${token}`,
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email, // Append email from localStorage
      type_utils: user.type_utils,
      profile_picture: profilePicture ? profilePicture.name : user.profile_picture.split('/').pop(),
    };

    const csrfToken = getCSRFToken();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(`http://localhost:8000/api/Utilisateur/${user.id}/`, formData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.id) {
        setSnackbar({
          open: true,
          message: "Profile updated successfully.",
          severity: "success",
        });
        // Update local storage with new user data
        const updatedUser = { ...response.data, profile_picture: "src/Components/IMG/" + response.data.profile_picture };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setSnackbar({
          open: true,
          message: "An error occurred while storing profile update.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "An error occurred during profile update.",
        severity: "error",
      });
    }
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
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/entreprise/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "Authorization": `Bearer ${token}`,
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
    // main-content
    <div className="profile-container">
      <div className="profile-sb">
        <div className="profile-sb-header">
          <div className="profile-edit-img">
            <img src={profilePicturePreview || null} alt="Profile" />
            <form className="profile-image-form">
              {!profilePicture && (
                <FontAwesomeIcon icon={faEdit} className="profile-edit-icon" />
              )}
              <input type="file" className="edit-img-input" id="profilePicture" onChange={handleProfilePictureChange} accept="image/*" />
              {profilePicture && (
                <FontAwesomeIcon icon={faCheck} className="validate-btn" onClick={handleValidaterofilePicture} />
              )}
            </form>
          </div>
          <p>@{username}</p>
          {
            profilePicture && (
              <button type="button" className="cancel-btn" onClick={handleCancelProfilePicture}>Cancel</button>
            )
          }
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
              <FontAwesomeIcon icon={faEdit} className="profile-user-icon" />
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
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
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

export default Profile;
