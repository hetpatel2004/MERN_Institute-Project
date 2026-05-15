import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  BriefcaseBusiness,
  ShieldCheck,
  Users as UsersIcon,
  GraduationCap,
  Plus,
  TrendingUp,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import CourseAllCourses from "../Supper_admin/Course/CourseAllCourses";
import CourseCreate from "../Supper_admin/Course/CourseCreate";
import { ROUTES } from "../../constants/routes";
import { clearAuthData } from "../../utils/storage";
import "./Supper_admin.css";

function Dashboard({ institutes, courses, companies, navigate }) {
  const totalStudents = institutes.reduce(
    (total, item) => total + Number(item.students || 0),
    0,
  );

  return (
    <>
      <div className="sa-header">
        <div>
          <p className="sa-tag">MULTI INSTITUTE MANAGEMENT</p>
          <h1>Super Admin Dashboard</h1>
          <span>Manage your whole platform from one place</span>
        </div>

        <button
          className="sa-primary-btn"
          onClick={() => navigate(ROUTES.superAdminInstitute)}
        >
          <Plus size={20} />
          Add Institute
        </button>
      </div>

      <div className="sa-stats">
        <div className="sa-stat-card">
          <Building2 size={32} />
          <p>Total Institutes</p>
          <h2>{institutes.length}</h2>
          <span>Active partners</span>
        </div>

        <div className="sa-stat-card">
          <UsersIcon size={32} />
          <p>Total Students</p>
          <h2>{totalStudents}</h2>
          <span>All students</span>
        </div>

        <div className="sa-stat-card">
          <GraduationCap size={32} />
          <p>Total Courses</p>
          <h2>{courses.length}</h2>
          <span>Course modules</span>
        </div>

        <div className="sa-stat-card">
          <BriefcaseBusiness size={32} />
          <p>Companies</p>
          <h2>{companies.length}</h2>
          <span>Placement partners</span>
        </div>
      </div>

      <div className="sa-dashboard-grid">
        <div className="sa-hero">
          <p>COMMAND CENTER</p>
          <h2>Control your education platform easily.</h2>
          <span>
            Manage institutes, courses, companies, students and placement
            activity from this super admin dashboard.
          </span>
        </div>

        <div className="sa-module-card">
          <h3>Website Overview</h3>

          <div className="sa-module-row">
            <span>Institute Management</span>
            <b>{institutes.length}</b>
          </div>

          <div className="sa-module-row">
            <span>Course Management</span>
            <b>{courses.length}</b>
          </div>

          <div className="sa-module-row">
            <span>Placement Companies</span>
            <b>{companies.length}</b>
          </div>

          <div className="sa-module-row">
            <span>Growth Rate</span>
            <b>
              <TrendingUp size={18} /> 86%
            </b>
          </div>
        </div>
      </div>
    </>
  );
}

function Supper_admin({ children, page }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    navigate(ROUTES.login, { replace: true });
  };
  const [courseOpen, setCourseOpen] = useState(page === "course");
  const [institutes, setInstitutes] = useState([
    {
      id: 1,
      name: "Frameboxx Institute",
      city: "Ahmedabad",
      admin: "Raj Patel",
      students: 320,
      status: "Active",
    },
    {
      id: 2,
      name: "Tech Skill Academy",
      city: "Surat",
      admin: "Mehul Shah",
      students: 210,
      status: "Active",
    },
  ]);

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Full Stack Development",
      type: "IT Course",
      duration: "6 Months",
      fees: "45000",
    },
    {
      id: 2,
      name: "Cyber Security",
      type: "Security Course",
      duration: "8 Months",
      fees: "60000",
    },
  ]);

  const [companies, setCompanies] = useState([
    { id: 1, name: "TCS", role: "React Developer", students: 12 },
    { id: 2, name: "Infosys", role: "Node Developer", students: 8 },
    { id: 3, name: "Wipro", role: "Frontend Developer", students: 15 },
  ]);

  const childWithProps =
    children &&
    React.cloneElement(children, {
      institutes,
      setInstitutes,
      courses,
      setCourses,
      companies,
      setCompanies,
    });

  return (
    <div className="sa-layout">
      <aside className="sa-sidebar">
        <div className="sa-brand">
          <div className="sa-logo">
            <ShieldCheck size={30} />
          </div>
          <div>
            <h3>InstituteOS</h3>
            <p>Super Admin</p>
          </div>
        </div>

        <div className="sa-menu">
          <NavLink to={ROUTES.superAdminDashboard}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to={ROUTES.superAdminInstitute}>
            <Building2 size={20} />
            Institute
          </NavLink>

          <div>
            <button
              type="button"
              className={`sa-course-dropdown-btn ${page === "course" ? "active" : ""}`}
              onClick={() => setCourseOpen(!courseOpen)}
            >
              <BookOpen size={20} />
              <span>Course</span>

              <span style={{ marginLeft: "auto" }}>
                {courseOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </span>
            </button>

            {courseOpen && (
              <div className="sa-course-submenu">
                <NavLink to="/superadmin/course">All Courses</NavLink>
                <NavLink to="/superadmin/course/create">Create Course</NavLink>
                <NavLink to="/superadmin/course/all-modules">All Courses & Modules</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/superadmin/users">
            <UsersIcon size={20} />
            Users
          </NavLink>

          <NavLink to={ROUTES.superAdminCompany}>
            <BriefcaseBusiness size={20} />
            Company
          </NavLink>
        </div>

        <button className="sa-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="sa-main">
        {page === "dashboard" ? (
          <Dashboard
            institutes={institutes}
            courses={courses}
            companies={companies}
            navigate={navigate}
          />
        ) : (
          childWithProps
        )}
      </main>
    </div>
  );
}

export default Supper_admin;
