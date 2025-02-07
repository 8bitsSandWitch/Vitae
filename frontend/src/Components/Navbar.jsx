import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/upload-cv">Upload CV</Link></li>
        <li><Link to="/set-keywords">Set Keywords</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
