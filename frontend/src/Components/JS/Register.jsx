import React, { useState } from 'react';
import '../CSS/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(formData),
      credentials: 'include' // Include credentials in the request
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.location.href = '/login'; // Redirect to login page
      })
      .catch(error => {
        console.error('Error:', error);
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
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_username">Username:</label>
          <input type="text" name="username" id="id_username" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="id_email">Email:</label>
          <input type="email" name="email" id="id_email" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="id_password1">Password:</label>
          <input type="password" name="password1" id="id_password1" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="id_password2">Confirm Password:</label>
          <input type="password" name="password2" id="id_password2" required onChange={handleChange} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
