import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password1: '',
    password2: '',
    type_utils: 'job_applicant' // Default to job applicant
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
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    axios.post('http://localhost:8000/register/', {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password1,
      type_utils: formData.type_utils
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      withCredentials: true
    })
      .then(response => {
        console.log('Success:', response.data);
        window.location.href = '/login'; // Redirect to login page
      })
      .catch(error => {
        console.error('Error:', error);
        setError('An error occurred during registration');
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
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group flex-container">
          <div className="flex-item">
            <label htmlFor="id_first_name">First Name:</label>
            <input type="text" className="form-control" name="first_name" id="id_first_name" required onChange={handleChange} />
          </div>
          <div className="flex-item">
            <label htmlFor="id_last_name">Last Name:</label>
            <input type="text" className="form-control" name="last_name" id="id_last_name" required onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="id_username">Username:</label>
          <input type="text" className="form-control" name="username" id="id_username" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="id_email">Email:</label>
          <input type="email" className="form-control" name="email" id="id_email" required onChange={handleChange} />
        </div>
        <div className="form-group flex-container">
          <div className="flex-item">
            <label htmlFor="id_password1">Password:</label>
            <input type="password" className="form-control" name="password1" id="id_password1" required onChange={handleChange} />
          </div>
          <div className="flex-item">
            <label htmlFor="id_password2">Confirm Password:</label>
            <input type="password" className="form-control" name="password2" id="id_password2" required onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="id_type_utils">Type of User:</label>
          <select className="form-control" name="type_utils" id="id_type_utils" value={formData.type_utils} onChange={handleChange}>
            <option value="job_applicant">Job Applicant</option>
            <option value="job_poster">Job Poster</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <div className="mt-3">
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
