import React from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Import files to render
import UploadCV from "../JS/UploadCV";
import KeywordFilter from "../JS/KeywordFilter";
import Dashboard from "../JS/Dashboard";
import Navbar from "../JS/Navbar";
import Login from "../JS/Login";
import Register from "../JS/Register";

const Urls = () => {
  const location = useLocation(); // Récupère l'URL actuelle

  return (
    <>
      {/* Affiche la Navbar sauf si l'utilisateur est sur la route "/login" */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload-cv" element={<UploadCV />} />
        <Route path="/set-keywords" element={<KeywordFilter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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