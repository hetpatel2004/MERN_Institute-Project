import React, { useEffect, useState } from "react";
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
  Target,
  MessageCircle,
  School,
  IndianRupee,
  BarChart3,
  Settings,
  UserCheck,
  CalendarCheck,
  Megaphone,
  ClipboardList,
  QrCode,
  Send,
  Layers,
  Award,
  FolderTree,
  UserCog,
  FilePenLine,
  Wallet,
  ReceiptText,
  Activity,
  FileText,
  UserRoundCog,
  Clock,
  CalendarDays,
  Menu,
  Plug,
  Shield,
} from "lucide-react";

import { ROUTES } from "../../constants/routes";
import { clearAuthData } from "../../utils/storage";
import "./Supper_admin.css";

function Dashboard({ institutes, courses, companies, navigate }) {
  const totalStudents = institutes.reduce(
    (total, item) => total + Number(item.students || 0),
    0
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
    </>
  );
}

const superAdminMenuSections = [
  {
    title: "CRM & Leads",
    key: "crm",
    icon: Target,
    items: [
      { name: "Leads", path: "/superadmin/leads", icon: Target },
      { name: "Follow-ups", path: "/superadmin/follow-ups", icon: CalendarCheck },
      { name: "Admissions", path: "/superadmin/admissions", icon: UserCheck },
      { name: "Counsellors", path: "/superadmin/counsellors", icon: UsersIcon },
      { name: "Campaigns", path: "/superadmin/campaigns", icon: Megaphone },
      { name: "Tasks", path: "/superadmin/tasks", icon: ClipboardList },
      { name: "Daily Reports", path: "/superadmin/daily-reports", icon: FileText },
    ],
  },
  {
    title: "Communication",
    key: "communication",
    icon: MessageCircle,
    items: [
      { name: "WhatsApp Inbox", path: "/superadmin/whatsapp-inbox", icon: MessageCircle },
      { name: "QR Codes", path: "/superadmin/qr-codes", icon: QrCode },
      { name: "Templates", path: "/superadmin/templates", icon: FilePenLine },
      { name: "Broadcasts", path: "/superadmin/broadcasts", icon: Send },
    ],
  },
  {
    title: "Students",
    key: "students",
    icon: GraduationCap,
    items: [
      { name: "Students", path: "/superadmin/students", icon: GraduationCap },
      { name: "Batches", path: "/superadmin/batches", icon: Layers },
      { name: "Courses", path: ROUTES.superAdminCourse, icon: BookOpen },
      { name: "Placements", path: "/superadmin/placements", icon: Award },
    ],
  },
  {
    title: "Academics",
    key: "academics",
    icon: School,
    items: [
      { name: "Programs", path: "/superadmin/programs", icon: Layers },
      { name: "Course Categories", path: "/superadmin/course-categories", icon: FolderTree },
      { name: "Faculties", path: "/superadmin/faculties", icon: UserCog },
      { name: "Exams", path: "/superadmin/exams", icon: FilePenLine },
    ],
  },
  {
    title: "Finance",
    key: "finance",
    icon: IndianRupee,
    items: [
      { name: "Fees", path: "/superadmin/fees", icon: IndianRupee },
      { name: "Expenses", path: "/superadmin/expenses", icon: Wallet },
      { name: "Invoices", path: "/superadmin/invoices", icon: ReceiptText },
    ],
  },
  {
    title: "Analytics",
    key: "analytics",
    icon: BarChart3,
    items: [
      { name: "Lead Analytics", path: "/superadmin/lead-analytics", icon: BarChart3 },
      { name: "Revenue", path: "/superadmin/revenue", icon: TrendingUp },
      { name: "Performance", path: "/superadmin/performance", icon: Activity },
      { name: "Reports", path: "/superadmin/reports", icon: FileText },
    ],
  },
  {
    title: "Operations",
    key: "operations",
    icon: UserRoundCog,
    items: [
      { name: "Staff", path: "/superadmin/staff", icon: UserRoundCog },
      { name: "Attendance", path: "/superadmin/attendance", icon: Clock },
      { name: "Holidays", path: "/superadmin/holidays", icon: CalendarDays },
      { name: "Login Approvals", path: "/superadmin/login-approvals", icon: ShieldCheck },
    ],
  },
  {
    title: "Settings",
    key: "settings",
    icon: Settings,
    items: [
      { name: "Branches", path: "/superadmin/branches", icon: Building2 },
      { name: "Users", path: ROUTES.superAdminUsers, icon: UsersIcon },
      { name: "Roles", path: "/superadmin/roles", icon: Shield },
      { name: "Menus", path: "/superadmin/menus", icon: Menu },
      { name: "Integrations", path: "/superadmin/integrations", icon: Plug },
    ],
  },
];

function Supper_admin({ children, page }) {
  const navigate = useNavigate();

  const [courseOpen, setCourseOpen] = useState(page === "course");
  const [customMenus, setCustomMenus] = useState([]);

  const [openMenus, setOpenMenus] = useState({
    crm: true,
    communication: true,
    students: true,
    academics: true,
    finance: true,
    analytics: true,
    operations: true,
    settings: true,
  });

  const [institutes, setInstitutes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadCustomMenus = () => {
      const savedMenus =
        JSON.parse(localStorage.getItem("superAdminExtraMenus")) || [];
      setCustomMenus(savedMenus);
    };

    loadCustomMenus();

    window.addEventListener("superAdminMenuUpdated", loadCustomMenus);

    return () => {
      window.removeEventListener("superAdminMenuUpdated", loadCustomMenus);
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate(ROUTES.login, { replace: true });
  };

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
              className={`sa-course-dropdown-btn ${
                page === "course" ? "active" : ""
              }`}
              onClick={() => setCourseOpen(!courseOpen)}
            >
              <BookOpen size={20} />
              <span>Course</span>

              <span style={{ marginLeft: "auto" }}>
                {courseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {courseOpen && (
              <div className="sa-course-submenu">
                <NavLink to="/superadmin/course">All Courses</NavLink>
                <NavLink to="/superadmin/course/create">Create Course</NavLink>
                <NavLink to="/superadmin/course/all-modules">
                  All Courses & Modules
                </NavLink>
                <NavLink to="/superadmin/course/module-topics">
                  Module Topics
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to={ROUTES.superAdminCompany}>
            <BriefcaseBusiness size={20} />
            Company
          </NavLink>

          {superAdminMenuSections.map((section) => {
            const SectionIcon = section.icon;

            const sectionCustomMenus = customMenus
              .filter((menu) => menu.section === section.title)
              .map((menu) => ({
                name: menu.name,
                path: menu.path,
                icon: Menu,
              }));

            const finalItems = [...section.items, ...sectionCustomMenus];

            return (
              <div className="sa-menu-section" key={section.key}>
                <button
                  type="button"
                  className="sa-menu-title-btn"
                  onClick={() => toggleMenu(section.key)}
                >
                  <SectionIcon size={17} />
                  <span>{section.title}</span>
                  <b>
                    {openMenus[section.key] ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </b>
                </button>

                {openMenus[section.key] && (
                  <div className="sa-dropdown-menu">
                    {finalItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink key={item.path} to={item.path}>
                          <Icon size={19} />
                          {item.name}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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