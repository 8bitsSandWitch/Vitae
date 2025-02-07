import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("username"); // Vérifie si un utilisateur est connecté

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
