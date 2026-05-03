import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Index from "../Index";
import Login from "../Auth/Login";
import Registration from "../Auth/Registration";
import ProtectedRoute from "../Auth/ProtectedRoute";
import InstituteAdmin from "../Institute_admin/Institute_admin";
import Student from "../Student/Student";
import SuperAdmin from "../Supper_admin/Supper_admin";
import Institutes from "../Supper_admin/Institutes";
import Courses from "../Supper_admin/AdminCourses";
import Companies from "../Supper_admin/Companies";
import { ROUTES } from "../../constants/routes";

function Mainroute() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Index />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.registration} element={<Registration />} />

      <Route
        path={ROUTES.superAdmin}
        element={
          <ProtectedRoute role="superadmin">
            <Navigate to={ROUTES.superAdminDashboard} replace />
          </ProtectedRoute>
        }
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
        path={ROUTES.superAdminCourse}
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <Courses />
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
        path={ROUTES.instituteAdmin}
        element={
          <ProtectedRoute role="instituteadmin">
            <InstituteAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.student}
        element={
          <ProtectedRoute role="student">
            <Student />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}

export default Mainroute;
