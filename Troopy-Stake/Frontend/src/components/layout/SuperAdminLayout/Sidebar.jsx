import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, BookOpen, BriefcaseBusiness, ShieldCheck,
  Users as UsersIcon, GraduationCap, Plus, TrendingUp, LogOut,
  ChevronDown, ChevronUp, Target, MessageCircle, School, IndianRupee,
  BarChart3, Settings, UserCheck, CalendarCheck, Megaphone, ClipboardList,
  QrCode, Send, Layers, Award, FolderTree, UserCog, FilePenLine, Wallet,
  ReceiptText, Activity, FileText, UserRoundCog, Clock, CalendarDays, Menu,
  Plug, Shield, Sun, Moon,
} from "lucide-react";
import { ROUTES } from "../../../../constants/routes";
import { clearAuthData } from "../../../../utils/storage";
import { useTheme } from "../../../../context/ThemeContext";

const superAdminMenuSections = [
  { title: "CRM & Leads", key: "crm", icon: Target, items: [
    { name: "Leads", path: "/superadmin/leads", icon: Target },
    { name: "Follow-ups", path: "/superadmin/follow-ups", icon: CalendarCheck },
    { name: "Admissions", path: "/superadmin/admissions", icon: UserCheck },
    { name: "Counsellors", path: "/superadmin/counsellors", icon: UsersIcon },
    { name: "Campaigns", path: "/superadmin/campaigns", icon: Megaphone },
    { name: "Tasks", path: "/superadmin/tasks", icon: ClipboardList },
    { name: "Daily Reports", path: "/superadmin/daily-reports", icon: FileText },
  ]},
  { title: "Communication", key: "communication", icon: MessageCircle, items: [
    { name: "WhatsApp Inbox", path: "/superadmin/whatsapp-inbox", icon: MessageCircle },
    { name: "QR Codes", path: "/superadmin/qr-codes", icon: QrCode },
    { name: "Templates", path: "/superadmin/templates", icon: FilePenLine },
    { name: "Broadcasts", path: "/superadmin/broadcasts", icon: Send },
  ]},
  { title: "Students", key: "students", icon: GraduationCap, items: [
    { name: "Students", path: "/superadmin/students", icon: GraduationCap },
    { name: "Batches", path: "/superadmin/batches", icon: Layers },
    { name: "Courses", path: ROUTES.superAdminCourse, icon: BookOpen },
    { name: "Placements", path: "/superadmin/placements", icon: Award },
  ]},
  { title: "Academics", key: "academics", icon: School, items: [
    { name: "Programs", path: "/superadmin/programs", icon: Layers },
    { name: "Course Categories", path: "/superadmin/course-categories", icon: FolderTree },
    { name: "Faculties", path: "/superadmin/faculties", icon: UserCog },
    { name: "Exams", path: "/superadmin/exams", icon: FilePenLine },
  ]},
  { title: "Finance", key: "finance", icon: IndianRupee, items: [
    { name: "Fees", path: "/superadmin/fees", icon: IndianRupee },
    { name: "Expenses", path: "/superadmin/expenses", icon: Wallet },
    { name: "Invoices", path: "/superadmin/invoices", icon: ReceiptText },
  ]},
  { title: "Analytics", key: "analytics", icon: BarChart3, items: [
    { name: "Lead Analytics", path: "/superadmin/lead-analytics", icon: BarChart3 },
    { name: "Revenue", path: "/superadmin/revenue", icon: TrendingUp },
    { name: "Performance", path: "/superadmin/performance", icon: Activity },
    { name: "Reports", path: "/superadmin/reports", icon: FileText },
  ]},
  { title: "Operations", key: "operations", icon: UserRoundCog, items: [
    { name: "Staff", path: "/superadmin/staff", icon: UserRoundCog },
    { name: "Attendance", path: "/superadmin/attendance", icon: Clock },
    { name: "Holidays", path: "/superadmin/holidays", icon: CalendarDays },
    { name: "Login Approvals", path: "/superadmin/login-approvals", icon: ShieldCheck },
  ]},
  { title: "Settings", key: "settings", icon: Settings, items: [
    { name: "Users", path: ROUTES.superAdminUsers, icon: UsersIcon },
    { name: "Roles", path: "/superadmin/roles", icon: Shield },
    { name: "Menus", path: "/superadmin/menus", icon: Menu },
    { name: "Integrations", path: "/superadmin/integrations", icon: Plug },
  ]},
  { title: "OTHER", key: "other", icon: Menu, items: [
    { name: "Branches", path: "/superadmin/branches", icon: Building2 },
  ]},
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { dark, toggle: toggleTheme } = useTheme();
  const [customMenus, setCustomMenus] = useState([]);
  const [defaultMenus, setDefaultMenus] = useState([]);
  const [openMenus, setOpenMenus] = useState({
    crm: true, communication: true, students: true, academics: true,
    finance: true, analytics: true, operations: true, settings: true, other: true,
  });

  useEffect(() => {
    const loadMenus = () => {
      setCustomMenus(JSON.parse(localStorage.getItem("superAdminExtraMenus")) || []);
      setDefaultMenus(JSON.parse(localStorage.getItem("superAdminDefaultMenus")) || []);
    };
    loadMenus();
    window.addEventListener("superAdminMenuUpdated", loadMenus);
    return () => window.removeEventListener("superAdminMenuUpdated", loadMenus);
  }, []);

  const toggleMenu = (key) => setOpenMenus((p) => ({ ...p, [key]: !p[key] }));

  const handleLogout = () => {
    clearAuthData();
    navigate(ROUTES.login, { replace: true });
  };

  const vis = {};
  [...defaultMenus, ...customMenus].forEach((m) => { vis[m.path] = m.visible !== false; });

  return (
    <aside className="sa-sidebar">
      <div className="sa-brand">
        <div className="sa-logo"><ShieldCheck size={30} /></div>
        <div>
          <h3>InstituteOS</h3>
          <p>Super Admin</p>
        </div>
      </div>

      <div className="sa-menu">
        {vis[ROUTES.superAdminDashboard] !== false && (
          <NavLink to={ROUTES.superAdminDashboard}><LayoutDashboard size={20} /> Dashboard</NavLink>
        )}
        {vis[ROUTES.superAdminInstitute] !== false && (
          <NavLink to={ROUTES.superAdminInstitute}><Building2 size={20} /> Institute</NavLink>
        )}
        {vis["/superadmin/course"] !== false && (
          <NavLink to="/superadmin/course"><BookOpen size={20} /> Course</NavLink>
        )}
        {vis[ROUTES.superAdminCompany] !== false && (
          <NavLink to={ROUTES.superAdminCompany}><BriefcaseBusiness size={20} /> Company</NavLink>
        )}

        {superAdminMenuSections.map((section) => {
          const SectionIcon = section.icon;
          const sectionCustom = customMenus.filter((m) => m.section === section.title).map((m) => ({ ...m, icon: Menu }));
          const finalItems = [...section.items, ...sectionCustom].filter((item) => vis[item.path] !== false);

          return (
            <div className="sa-menu-section" key={section.key}>
              <button type="button" className="sa-menu-title-btn" onClick={() => toggleMenu(section.key)}>
                <SectionIcon size={17} />
                <span>{section.title}</span>
                <b>{openMenus[section.key] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</b>
              </button>
              {openMenus[section.key] && (
                <div className="sa-dropdown-menu">
                  {finalItems.map((item) => {
                    const Icon = item.icon;
                    return <NavLink key={item.path} to={item.path}><Icon size={19} />{item.name}</NavLink>;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="sa-theme-toggle" onClick={toggleTheme}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
        <span>{dark ? "Light Mode" : "Dark Mode"}</span>
      </button>

      <button className="sa-logout" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
