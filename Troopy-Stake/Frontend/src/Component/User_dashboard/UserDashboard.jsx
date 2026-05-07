import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  BriefcaseBusiness,
  Users,
  FileText,
  Settings,
  Search,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthData, getUser } from "../../utils/storage";
import "./UserDashboard.css";

function UserDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const allMenus = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Institute", icon: <Building2 size={20} /> },
    { name: "Course", icon: <BookOpen size={20} /> },
    { name: "Company", icon: <BriefcaseBusiness size={20} /> },
    { name: "Students", icon: <Users size={20} /> },
    { name: "Reports", icon: <FileText size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  const allowedMenus =
    user?.menuAccess?.length > 0
      ? allMenus.filter((menu) => user.menuAccess.includes(menu.name))
      : allMenus.filter((menu) => menu.name === "Dashboard");

  const handleLogout = () => {
    clearAuthData();
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-layout">
      <aside className="user-sidebar">
        <div className="user-brand">
          <h2>InstituteOS</h2>
          <p>{user?.role}</p>
        </div>

        <div className="user-menu">
          {allowedMenus.map((menu) => (
            <button
              key={menu.name}
              className={activeMenu === menu.name ? "active" : ""}
              onClick={() => setActiveMenu(menu.name)}
            >
              {menu.icon}
              {menu.name}
            </button>
          ))}
        </div>

        <div className="user-profile-box">
          <h4>{user?.name}</h4>
          <p>{user?.email}</p>
          <small>{user?.role}</small>
        </div>

        <button className="user-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="user-main">
        <div className="user-topbar">
          <div>
            <h1>{activeMenu}</h1>
            <p>Welcome back, {user?.name}</p>
          </div>

          <div className="user-search">
            <Search size={18} />
            <input placeholder="Search menu, course, details..." />
          </div>
        </div>

        <div className="user-content-card">
          <h2>{activeMenu}</h2>

          {activeMenu === "Dashboard" && (
            <p>This is your default user dashboard.</p>
          )}

          {activeMenu === "Course" && (
            <p>Here selected course details will be shown.</p>
          )}

          {activeMenu === "Institute" && (
            <p>Here institute details will be shown.</p>
          )}

          {activeMenu === "Company" && (
            <p>Here company details will be shown.</p>
          )}

          {activeMenu === "Students" && (
            <p>Here allowed student details will be shown.</p>
          )}

          {activeMenu === "Reports" && (
            <p>Here reports will be shown.</p>
          )}

          {activeMenu === "Settings" && (
            <p>User settings page.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;