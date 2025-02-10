import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userData = localStorage.getItem("user"); // Vérifie si un utilisateur est connecté
  const isAuthenticated = userData ? true : false;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
