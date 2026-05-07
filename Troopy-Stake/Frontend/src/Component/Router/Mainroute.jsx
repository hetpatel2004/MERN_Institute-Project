import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Index from "../Index";
import Login from "../Auth/Login";
import Registration from "../Auth/Registration";

import SuperAdmin from "../Supper_admin/Supper_admin";
import Institutes from "../Supper_admin/Institutes";
import Courses from "../Supper_admin/AdminCourses";
import Companies from "../Supper_admin/Companies";
import Users from "../Supper_admin/Users";

import UserDashboard from "../User_dashboard/UserDashboard";

import ProtectedRoute from "../Auth/ProtectedRoute";
import { ROUTES } from "../../constants/routes";

import "bootstrap/dist/css/bootstrap.min.css";

function Mainroute() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registration" element={<Registration />} />

      <Route
        path="/superadmin"
        element={<Navigate to="/superadmin/dashboard" replace />}
      />

      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="dashboard" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institute"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <Institutes />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <Courses />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/company"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="company">
              <Companies />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/users"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="users">
              <Users />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.instituteAdmin}
        element={
          <ProtectedRoute role="instituteadmin">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.branchAdmin}
        element={
          <ProtectedRoute role="branchadmin">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.companyAdmin}
        element={
          <ProtectedRoute role="companyadmin">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default Mainroute;