import React from 'react';
import '../CSS/login.css';

const Login = () => {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form method="post" action="/login/">
        <div className="form-group">
          <label htmlFor="id_username">Username:</label>
          <input type="text" name="username" id="id_username" required />
        </div>
        <div className="form-group">
          <label htmlFor="id_password">Password:</label>
          <input type="password" name="password" id="id_password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
