import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Import files to render
import Login from "../JS/Login";
import Register from "../JS/Register";
import Navbar from "../JS/Navbar";
import Dashboard from "../JS/Dashboard";
import PostJob from "../JS/PostOffer";
import UploadCV from "../JS/UploadCV";
import JobList from "../JS/JobList";
import FilterCV from "../JS/FilterCV";
import Profile from "../JS/Profile";
import ProtectedRoute from "./ProtectedRoute";

const Urls = () => {
  const location = useLocation(); // Récupère l'URL actuelle

  return (
    <>
      {/* Affiche la Navbar sauf si l'utilisateur est sur la route "/login" */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> }/>
        <Route path="/upload-cv" element={ <ProtectedRoute><UploadCV /></ProtectedRoute> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/post" element={ <ProtectedRoute><PostJob /></ProtectedRoute> } />
        <Route path="/job-list" element={ <ProtectedRoute><JobList /></ProtectedRoute> } />
        <Route path="/filter-cv" element={ <ProtectedRoute><FilterCV /></ProtectedRoute> } />
        <Route path="/account" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <Urls />
  </Router>
);

export default App;
