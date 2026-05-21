import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Clock,
  CalendarCheck,
  Video,
  PhoneCall,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  UserRoundCheck,
  History,
  FileText,
  Settings,
  BookOpen,
  LogOut,
} from "lucide-react";

import "./BranchSidebar.css";

const menuItems = [
  { title: "Dashboard", path: "/branchadmin/dashboard", icon: LayoutDashboard },
  { title: "User Management", path: "/branchadmin/users", icon: Users },
  { title: "Add Faculty / Counsellor / Sales / Call Person", path: "/branchadmin/add-user", icon: UserPlus },
  { title: "Faculty Check-in / Check-out", path: "/branchadmin/faculty-attendance", icon: Clock },
  { title: "Counsellor Scheduled Meetings", path: "/branchadmin/counsellor-meetings", icon: CalendarCheck },
  { title: "Live Classes / Recordings", path: "/branchadmin/live-classes", icon: Video },
  { title: "Call Person Target Tracking", path: "/branchadmin/call-tracking", icon: PhoneCall },
  { title: "Admissions / Fees / Students", path: "/branchadmin/admissions", icon: IndianRupee },
  { title: "Profit & Loss", path: "/branchadmin/profit-loss", icon: TrendingUp },
  { title: "Total Students", path: "/branchadmin/total-students", icon: GraduationCap },
  { title: "Old Students History", path: "/branchadmin/old-students", icon: History },
  { title: "All Reports", path: "/branchadmin/reports", icon: FileText },
  { title: "Branch Purchased Courses only", path: "/branchadmin/purchased-courses", icon: BookOpen },
  { title: "Settings", path: "/branchadmin/settings", icon: Settings },
];

function BranchSidebar() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="branch-sidebar">
      <div className="branch-logo-box">
        <h2>InstituteOS</h2>
        <p>branchadmin</p>
      </div>

      <nav className="branch-menu">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "branch-menu-link active" : "branch-menu-link"
              }
            >
              <Icon size={19} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="branch-admin-card">
        <h3>{user?.name || "drive-in Admin"}</h3>
        <p>{user?.email || "drivein@gmail.com"}</p>
        <span>{user?.role || "branchadmin"}</span>
      </div>

      <button className="branch-logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default BranchSidebar;