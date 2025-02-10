import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/login.css';
import { Link } from 'react-router-dom';
import logPicture from '../IMG/picA.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(formData),
      credentials: 'include' // Include credentials in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect to dashboard
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Invalid credentials');
      });
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <div className="login-container">
      <div className="welcome_img">
        <img src={logPicture} alt="Welcome" />
      </div>

      <div className="login_formContainer">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <h1>Welcome To Vitaee</h1>
        <p>Please login to continue</p>

        <form className='login_form' onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id_username">Username:</label>
            <input type="text" className="form-control" name="username" id="id_username" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="id_password">Password:</label>
            <input type="password" className="form-control" name="password" id="id_password" required onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <div className="mt-3">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
