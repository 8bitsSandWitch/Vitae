import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Import files to render
import UploadCV from "../JS/UploadCV";
import KeywordFilter from "../JS/KeywordFilter";
import Dashboard from "../JS/Dashboard";
import Navbar from "../JS/Navbar";
import Login from "../JS/Login";
import Register from "../JS/Register";

const Urls = () => {
  const location = useLocation(); // Get the current URL

  return (
    <>
      {/* Display the Navbar except on the login and register routes */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload-cv" element={<UploadCV />} />
        <Route path="/set-keywords" element={<KeywordFilter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manage-account" element={<ManageAccount />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </>
  )
}

const App = () => (
  <Router>
    <Urls />
  </Router>
);

export default App;
