import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import "../CSS/login.css";
import { Link } from "react-router-dom";

import logPicture from '../IMG/LoginPic.png'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = Cookies.get('csrftoken');
    fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setSnackbar({ open: true, message: data.error, severity: 'error' });
        } else {
          localStorage.setItem('user', JSON.stringify(data));
          setSnackbar({ open: true, message: 'Login successful', severity: 'success' });
          if (onSubmit) {
            onSubmit();
          }
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbar({ open: true, message: 'An error occurred during login.', severity: 'error' });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="login-container">
      <div className="welcome_img">
        <img src={logPicture} alt="Welcome" />
      </div>

      <form className="login_form" onSubmit={handleSubmit}>
        <h3>Welcome To Vitaee</h3>
        <p>Please login to continue</p>

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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <div className="mt-4">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>


      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
