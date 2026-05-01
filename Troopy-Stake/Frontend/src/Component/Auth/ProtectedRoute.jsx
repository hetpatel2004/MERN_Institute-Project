import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const superAdmin = localStorage.getItem("superAdmin");

  if (!superAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;