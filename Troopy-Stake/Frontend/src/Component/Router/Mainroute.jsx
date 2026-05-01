import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Index from "../Index";
import Login from "../Auth/Login";
import Registration from "../Auth/Registration";
import ProtectedRoute from "../Auth/ProtectedRoute";

import SuperAdmin from "../Supper_admin/Supper_admin";
import Institutes from "../Supper_admin/Institutes";
import Courses from "../Supper_admin/AdminCourses";
import Companies from "../Supper_admin/Companies";

import "bootstrap/dist/css/bootstrap.min.css";

function Mainroute() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />

      <Route
        path="/superadmin"
        element={
          <ProtectedRoute>
            <Navigate to="/superadmin/dashboard" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute>
            <SuperAdmin page="dashboard" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institute"
        element={
          <ProtectedRoute>
            <SuperAdmin page="institute">
              <Institutes />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course"
        element={
          <ProtectedRoute>
            <SuperAdmin page="course">
              <Courses />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/company"
        element={
          <ProtectedRoute>
            <SuperAdmin page="company">
              <Companies />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Mainroute;