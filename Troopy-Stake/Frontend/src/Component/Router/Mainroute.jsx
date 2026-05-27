import React from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";

import Index from "../Index";
import Login from "../Auth/Login";
import Registration from "../Auth/Registration";

import SuperAdmin from "../Supper_admin/Supper_admin";
import Institutes from "../Supper_admin/Institutes";
import Companies from "../Supper_admin/Companies";
import Users from "../Supper_admin/Users";
import MenuManager from "../Supper_admin/MenuManager";

import CourseAllModules from "../Supper_admin/Course/CourseAllModules";
import CourseAllCourses from "../Supper_admin/Course/CourseAllCourses";
import CourseCreate from "../Supper_admin/Course/CourseCreate";
// import CourseModules from "../Supper_admin/Course/CourseModules";
import ModuleTopics from "../Supper_admin/Course/ModuleTopics";
import TopicMaterials from "../Supper_admin/Course/TopicMaterials";
import ModuleDetail from "../Supper_admin/Course/ModuleDetail";
import Leads from "../Supper_admin/Leads/Leads";
import FollowUps from "../Supper_admin/FollowUps/FollowUps";
import Admissions from "../Supper_admin/CRM/Admissions";
import RoleAccessPage from "../Supper_admin/Roles/RoleAccessPage";

import InstituteDetails from "../Supper_admin/InstituteDetails";
import InstituteBranches from "../Supper_admin/InstituteBranches";
import InstituteStudents from "../Supper_admin/InstituteStudents";
import InstituteAdmissions from "../Supper_admin/InstituteAdmissions";
import InstitutePayments from "../Supper_admin/InstitutePayments";
import InstitutePurchasedCourses from "../Supper_admin/InstitutePurchasedCourses";

import UserDashboard from "../User_dashboard/UserDashboard";
import ProtectedRoute from "../Auth/ProtectedRoute";
import TopicContent from "../Supper_admin/Course/TopicContent";
import { ROUTES } from "../../constants/routes";
import Batches from "../Supper_admin/Batches/Batches";

import "bootstrap/dist/css/bootstrap.min.css";

function DynamicSuperAdminPage() {
  const { menuSlug } = useParams();

  const title = menuSlug
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="sa-page-card">
      <h1>{title}</h1>
      <p>
        This page is protected and ready. You can add dynamic content here
        later.
      </p>
    </div>
  );
}

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
        path="/superadmin/institutes/:instituteId/details"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <InstituteDetails />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institutes/:instituteId/branches"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <InstituteBranches />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institutes/:instituteId/students"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <InstituteStudents />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institutes/:instituteId/admissions"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <InstituteAdmissions />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institutes/:instituteId/payments"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <InstitutePayments />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/institutes/:instituteId/purchased-courses"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="institute">
              <InstitutePurchasedCourses />
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
        path="/superadmin/course/module-topics"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <ModuleTopics />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course/topic/:topicId/materials"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <TopicMaterials />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/course/module/:moduleId"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <ModuleDetail />
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
        path="/superadmin/leads"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="leads">
              <Leads />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/follow-ups"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="followups">
              <FollowUps />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/admissions"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="admissions">
              <Admissions />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/roles"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="roles">
              <RoleAccessPage />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/menus"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="menus">
              <MenuManager />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/batches"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="batches">
              <Batches />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/:menuSlug"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="dynamic">
              <DynamicSuperAdminPage />
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

      <Route
        path="/superadmin/course/topic-content/:topicId"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdmin page="course">
              <TopicContent />
            </SuperAdmin>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default Mainroute;
