import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext"; // Adjust path to where your AuthProvider is defined

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
