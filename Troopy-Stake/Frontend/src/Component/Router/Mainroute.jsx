import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Index from "../Index";
import Login from "../Auth/Login";
import Registration from "../Auth/Registration";
import ProtectedRoute from "../Auth/ProtectedRoute";
import SuperAdmin from "../Supper_admin/Supper_admin";
import Institutes from "../Supper_admin/Institutes";
import Courses from "../Supper_admin/AdminCourses";
import Companies from "../Supper_admin/Companies";
import { ROUTES } from "../../constants/routes";
import Branches from "../Supper_admin/Branches";
import CompanyAdmin from "../Company_admin/Company_Admin";
import InstituteAdmin from "../Institute_admin/Institute_admin";

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
        path="/superadmin/branch"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="branch">
              <Branches />
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
        path={ROUTES.companyAdmin}
        element={
          <ProtectedRoute role="companyadmin">
            <CompanyAdmin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}

export default Mainroute;
