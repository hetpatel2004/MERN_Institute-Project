import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // NOT LOGIN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ROLE CHECK
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;