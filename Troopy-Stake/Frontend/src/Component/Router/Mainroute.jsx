import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Index from "../Index";
import Login from "../Auth/Login";
import Registration from "../Auth/Registration";

import SuperAdmin from "../Supper_admin/Supper_admin";
import Institutes from "../Supper_admin/Institutes";
import Companies from "../Supper_admin/Companies";
import Users from "../Supper_admin/Users";

import CourseAllCourses from "../Supper_admin/Course/CourseAllCourses";
import CourseCreate from "../Supper_admin/Course/CourseCreate";
import CourseModules from "../Supper_admin/Course/CourseModules";
import UserDashboard from "../User_dashboard/UserDashboard";
import ProtectedRoute from "../Auth/ProtectedRoute";
import CourseAllModules from "../Supper_admin/Course/CourseAllModules";
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
        path={ROUTES.superAdminDashboard}
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="dashboard" />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.superAdminInstitute}
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
              <CourseAllCourses />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course/create"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <CourseCreate />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course/:courseId/modules"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <CourseModules />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course/edit/:id"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <CourseCreate />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course/all-modules"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <CourseAllModules />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.superAdminCompany}
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="company">
              <Companies />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.superAdminUsers}
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="users">
              <Users />
            </SuperAdmin>
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

      <Route
        path={ROUTES.student}
        element={
          <ProtectedRoute role="student">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default Mainroute;
