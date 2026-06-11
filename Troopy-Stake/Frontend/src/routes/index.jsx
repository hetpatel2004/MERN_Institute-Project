import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import ProtectedRoute from "../Component/Auth/ProtectedRoute";
import SuperAdmin from "../Component/Supper_admin/Supper_admin";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = lazy(() => import("../Component/Auth/Login"));
const Registration = lazy(() => import("../Component/Auth/Registration"));
const Index = lazy(() => import("../Component/Index"));
const Institutes = lazy(() => import("../Component/Supper_admin/Institutes"));
const Companies = lazy(() => import("../Component/Supper_admin/Companies"));
const Users = lazy(() => import("../Component/Supper_admin/Users"));
const MenuManager = lazy(() => import("../Component/Supper_admin/MenuManager"));
const CourseAllCourses = lazy(() => import("../Component/Supper_admin/Course/CourseAllCourses"));
const CourseAllModules = lazy(() => import("../Component/Supper_admin/Course/CourseAllModules"));
const CourseCreate = lazy(() => import("../Component/Supper_admin/Course/CourseCreate"));
const ModuleTopics = lazy(() => import("../Component/Supper_admin/Course/ModuleTopics"));
const TopicMaterials = lazy(() => import("../Component/Supper_admin/Course/TopicMaterials"));
const ModuleDetail = lazy(() => import("../Component/Supper_admin/Course/ModuleDetail"));
const TopicContent = lazy(() => import("../Component/Supper_admin/Course/TopicContent"));
const Leads = lazy(() => import("../Component/Supper_admin/Leads/Leads"));
const FollowUps = lazy(() => import("../Component/Supper_admin/FollowUps/FollowUps"));
const Admissions = lazy(() => import("../Component/Supper_admin/CRM/Admissions"));
const Counsellors = lazy(() => import("../Component/Supper_admin/Counsellors"));
const Branches = lazy(() => import("../Component/Supper_admin/Branches"));
const RoleAccessPage = lazy(() => import("../Component/Supper_admin/Roles/RoleAccessPage"));
const InstituteDetails = lazy(() => import("../Component/Supper_admin/InstituteDetails"));
const InstituteBranches = lazy(() => import("../Component/Supper_admin/InstituteBranches"));
const InstituteStudents = lazy(() => import("../Component/Supper_admin/InstituteStudents"));
const InstituteAdmissions = lazy(() => import("../Component/Supper_admin/InstituteAdmissions"));
const InstitutePayments = lazy(() => import("../Component/Supper_admin/InstitutePayments"));
const InstitutePurchasedCourses = lazy(() => import("../Component/Supper_admin/InstitutePurchasedCourses"));
const UserDashboard = lazy(() => import("../Component/User_dashboard/UserDashboard"));
const Batches = lazy(() => import("../Component/Supper_admin/Batches/Batches"));
const Campaigns = lazy(() => import("../Component/Supper_admin/Campaign/Campaigns"));
const HolidayCalendar = lazy(() => import("../Component/Supper_admin/HolidayCalendar/HolidayCalendar"));
const Fees = lazy(() => import("../Component/Supper_admin/Finance/Fees"));
const Expenses = lazy(() => import("../Component/Supper_admin/Finance/Expenses"));
const Invoices = lazy(() => import("../Component/Supper_admin/Finance/Invoices"));
const Tasks = lazy(() => import("../Component/Supper_admin/Tasks/Tasks"));
const DailyReports = lazy(() => import("../Component/Supper_admin/DailyReports/DailyReports"));
const WhatsAppInbox = lazy(() => import("../Component/Supper_admin/Communication/WhatsAppInbox"));
const QrCodeGenerator = lazy(() => import("../Component/Supper_admin/Communication/QrCodeGenerator"));
const Templates = lazy(() => import("../Component/Supper_admin/Communication/Templates"));
const Broadcasts = lazy(() => import("../Component/Supper_admin/Communication/Broadcasts"));
const Students = lazy(() => import("../Component/Supper_admin/Students/Students"));
const Placements = lazy(() => import("../Component/Supper_admin/Placements/Placements"));
const Programs = lazy(() => import("../Component/Supper_admin/Programs/Programs"));
const CourseCategories = lazy(() => import("../Component/Supper_admin/CourseCategories/CourseCategories"));
const Faculties = lazy(() => import("../Component/Supper_admin/Faculties/Faculties"));
const Exams = lazy(() => import("../Component/Supper_admin/Exams/Exams"));
const LeadAnalytics = lazy(() => import("../Component/Supper_admin/Analytics/LeadAnalytics"));
const Revenue = lazy(() => import("../Component/Supper_admin/Analytics/Revenue"));
const Performance = lazy(() => import("../Component/Supper_admin/Analytics/Performance"));
const Reports = lazy(() => import("../Component/Supper_admin/Analytics/Reports"));
const Staff = lazy(() => import("../Component/Supper_admin/Staff/Staff"));
const Attendance = lazy(() => import("../Component/Supper_admin/Attendance/Attendance"));
const LoginApprovals = lazy(() => import("../Component/Supper_admin/LoginApprovals/LoginApprovals"));
const Integrations = lazy(() => import("../Component/Supper_admin/Integrations/Integrations"));

function DynamicSuperAdminPage() {
  const { menuSlug } = useParams();
  const title = menuSlug?.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return (
    <div className="sa-page-card">
      <h1>{title}</h1>
      <p>This page is protected and ready. You can add dynamic content here later.</p>
    </div>
  );
}

const PageLoader = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const withSA = (Component, page) => (
  <SuperAdmin page={page}>
    <Suspense fallback={<PageLoader />}><Component /></Suspense>
  </SuperAdmin>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<PageLoader />}><Index /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
      <Route path="/registration" element={<Suspense fallback={<PageLoader />}><Registration /></Suspense>} />

      <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />

      <Route path={ROUTES.superAdminDashboard} element={<ProtectedRoute role="superadmin"><SuperAdmin page="dashboard" /></ProtectedRoute>} />

      <Route path={ROUTES.superAdminInstitute} element={<ProtectedRoute role="superadmin">{withSA(Institutes, "institute")}</ProtectedRoute>} />

      <Route path="/superadmin/institutes/:instituteId/details" element={<ProtectedRoute role="superadmin">{withSA(InstituteDetails, "institute")}</ProtectedRoute>} />
      <Route path="/superadmin/institutes/:instituteId/branches" element={<ProtectedRoute role="superadmin">{withSA(InstituteBranches, "institute")}</ProtectedRoute>} />
      <Route path="/superadmin/institutes/:instituteId/students" element={<ProtectedRoute role="superadmin">{withSA(InstituteStudents, "institute")}</ProtectedRoute>} />
      <Route path="/superadmin/institutes/:instituteId/admissions" element={<ProtectedRoute role="superadmin">{withSA(InstituteAdmissions, "institute")}</ProtectedRoute>} />
      <Route path="/superadmin/institutes/:instituteId/payments" element={<ProtectedRoute role="superadmin">{withSA(InstitutePayments, "institute")}</ProtectedRoute>} />
      <Route path="/superadmin/institutes/:instituteId/purchased-courses" element={<ProtectedRoute role="superadmin">{withSA(InstitutePurchasedCourses, "institute")}</ProtectedRoute>} />

      <Route path="/superadmin/course" element={<ProtectedRoute role="superadmin">{withSA(CourseAllCourses, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/create" element={<ProtectedRoute role="superadmin">{withSA(CourseCreate, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/edit/:id" element={<ProtectedRoute role="superadmin">{withSA(CourseCreate, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/all-modules" element={<ProtectedRoute role="superadmin">{withSA(CourseAllModules, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/module-topics" element={<ProtectedRoute role="superadmin">{withSA(ModuleTopics, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/topic/:topicId/materials" element={<ProtectedRoute role="superadmin">{withSA(TopicMaterials, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/module/:moduleId" element={<ProtectedRoute role="superadmin">{withSA(ModuleDetail, "course")}</ProtectedRoute>} />
      <Route path="/superadmin/course/topic-content/:topicId" element={<ProtectedRoute role="superadmin">{withSA(TopicContent, "course")}</ProtectedRoute>} />

      <Route path={ROUTES.superAdminCompany} element={<ProtectedRoute role="superadmin">{withSA(Companies, "company")}</ProtectedRoute>} />
      <Route path={ROUTES.superAdminUsers} element={<ProtectedRoute role="superadmin">{withSA(Users, "users")}</ProtectedRoute>} />
      <Route path="/superadmin/leads" element={<ProtectedRoute role="superadmin">{withSA(Leads, "leads")}</ProtectedRoute>} />
      <Route path="/superadmin/follow-ups" element={<ProtectedRoute role="superadmin">{withSA(FollowUps, "followups")}</ProtectedRoute>} />
      <Route path="/superadmin/admissions" element={<ProtectedRoute role="superadmin">{withSA(Admissions, "admissions")}</ProtectedRoute>} />
      <Route path="/superadmin/counsellors" element={<ProtectedRoute role="superadmin">{withSA(Counsellors, "counsellors")}</ProtectedRoute>} />
      <Route path="/superadmin/campaigns" element={<ProtectedRoute role="superadmin">{withSA(Campaigns, "campaigns")}</ProtectedRoute>} />
      <Route path="/superadmin/roles" element={<ProtectedRoute role="superadmin">{withSA(RoleAccessPage, "roles")}</ProtectedRoute>} />
      <Route path="/superadmin/menus" element={<ProtectedRoute role="superadmin">{withSA(MenuManager, "menus")}</ProtectedRoute>} />
      <Route path="/superadmin/batches" element={<ProtectedRoute role="superadmin">{withSA(Batches, "batches")}</ProtectedRoute>} />
      <Route path="/superadmin/branches" element={<ProtectedRoute role="superadmin">{withSA(Branches, "branches")}</ProtectedRoute>} />
      <Route path="/superadmin/holidays" element={<ProtectedRoute role="superadmin">{withSA(HolidayCalendar, "holidays")}</ProtectedRoute>} />
      <Route path="/superadmin/fees" element={<ProtectedRoute role="superadmin">{withSA(Fees, "fees")}</ProtectedRoute>} />
      <Route path="/superadmin/expenses" element={<ProtectedRoute role="superadmin">{withSA(Expenses, "expenses")}</ProtectedRoute>} />
      <Route path="/superadmin/invoices" element={<ProtectedRoute role="superadmin">{withSA(Invoices, "invoices")}</ProtectedRoute>} />
      <Route path="/superadmin/tasks" element={<ProtectedRoute role="superadmin">{withSA(Tasks, "tasks")}</ProtectedRoute>} />
      <Route path="/superadmin/daily-reports" element={<ProtectedRoute role="superadmin">{withSA(DailyReports, "daily-reports")}</ProtectedRoute>} />
      <Route path="/superadmin/whatsapp-inbox" element={<ProtectedRoute role="superadmin">{withSA(WhatsAppInbox, "whatsapp-inbox")}</ProtectedRoute>} />
      <Route path="/superadmin/qr-codes" element={<ProtectedRoute role="superadmin">{withSA(QrCodeGenerator, "qr-codes")}</ProtectedRoute>} />
      <Route path="/superadmin/templates" element={<ProtectedRoute role="superadmin">{withSA(Templates, "templates")}</ProtectedRoute>} />
      <Route path="/superadmin/broadcasts" element={<ProtectedRoute role="superadmin">{withSA(Broadcasts, "broadcasts")}</ProtectedRoute>} />
      <Route path="/superadmin/students" element={<ProtectedRoute role="superadmin">{withSA(Students, "students")}</ProtectedRoute>} />
      <Route path="/superadmin/placements" element={<ProtectedRoute role="superadmin">{withSA(Placements, "placements")}</ProtectedRoute>} />
      <Route path="/superadmin/programs" element={<ProtectedRoute role="superadmin">{withSA(Programs, "programs")}</ProtectedRoute>} />
      <Route path="/superadmin/course-categories" element={<ProtectedRoute role="superadmin">{withSA(CourseCategories, "course-categories")}</ProtectedRoute>} />
      <Route path="/superadmin/faculties" element={<ProtectedRoute role="superadmin">{withSA(Faculties, "faculties")}</ProtectedRoute>} />
      <Route path="/superadmin/exams" element={<ProtectedRoute role="superadmin">{withSA(Exams, "exams")}</ProtectedRoute>} />
      <Route path="/superadmin/lead-analytics" element={<ProtectedRoute role="superadmin">{withSA(LeadAnalytics, "lead-analytics")}</ProtectedRoute>} />
      <Route path="/superadmin/revenue" element={<ProtectedRoute role="superadmin">{withSA(Revenue, "revenue")}</ProtectedRoute>} />
      <Route path="/superadmin/performance" element={<ProtectedRoute role="superadmin">{withSA(Performance, "performance")}</ProtectedRoute>} />
      <Route path="/superadmin/reports" element={<ProtectedRoute role="superadmin">{withSA(Reports, "reports")}</ProtectedRoute>} />
      <Route path="/superadmin/staff" element={<ProtectedRoute role="superadmin">{withSA(Staff, "staff")}</ProtectedRoute>} />
      <Route path="/superadmin/attendance" element={<ProtectedRoute role="superadmin">{withSA(Attendance, "attendance")}</ProtectedRoute>} />
      <Route path="/superadmin/login-approvals" element={<ProtectedRoute role="superadmin">{withSA(LoginApprovals, "login-approvals")}</ProtectedRoute>} />
      <Route path="/superadmin/integrations" element={<ProtectedRoute role="superadmin">{withSA(Integrations, "integrations")}</ProtectedRoute>} />

      <Route path="/superadmin/:menuSlug" element={<ProtectedRoute role="superadmin">{withSA(DynamicSuperAdminPage, "dynamic")}</ProtectedRoute>} />

      <Route path={ROUTES.branchAdmin} element={<ProtectedRoute role="branchadmin"><Suspense fallback={<PageLoader />}><UserDashboard /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.companyAdmin} element={<ProtectedRoute role="companyadmin"><Suspense fallback={<PageLoader />}><UserDashboard /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.student} element={<ProtectedRoute role="student"><Suspense fallback={<PageLoader />}><UserDashboard /></Suspense></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
