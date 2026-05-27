import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_SECTIONS = [
  "Main",
  "CRM & Leads",
  "Communication",
  "Students",
  "Academics",
  "Finance",
  "Analytics",
  "Operations",
  "Settings",
];

const DEFAULT_MENUS = [
  { id: "default-1", section: "Main", name: "Dashboard", path: "/superadmin/dashboard", type: "Default", visible: true },
  { id: "default-2", section: "Main", name: "Institute", path: "/superadmin/institute", type: "Default", visible: true },
  { id: "default-3", section: "Main", name: "Course", path: "/superadmin/course", type: "Default", visible: true },
  { id: "default-4", section: "Main", name: "Company", path: "/superadmin/company", type: "Default", visible: true },

  { id: "default-5", section: "CRM & Leads", name: "Leads", path: "/superadmin/leads", type: "Default", visible: true },
  { id: "default-6", section: "CRM & Leads", name: "Follow-ups", path: "/superadmin/follow-ups", type: "Default", visible: true },
  { id: "default-7", section: "CRM & Leads", name: "Admissions", path: "/superadmin/admissions", type: "Default", visible: true },
  { id: "default-8", section: "CRM & Leads", name: "Counsellors", path: "/superadmin/counsellors", type: "Default", visible: true },
  { id: "default-9", section: "CRM & Leads", name: "Campaigns", path: "/superadmin/campaigns", type: "Default", visible: true },
  { id: "default-10", section: "CRM & Leads", name: "Tasks", path: "/superadmin/tasks", type: "Default", visible: true },
  { id: "default-11", section: "CRM & Leads", name: "Daily Reports", path: "/superadmin/daily-reports", type: "Default", visible: true },

  { id: "default-12", section: "Communication", name: "WhatsApp Inbox", path: "/superadmin/whatsapp-inbox", type: "Default", visible: true },
  { id: "default-13", section: "Communication", name: "QR Codes", path: "/superadmin/qr-codes", type: "Default", visible: true },
  { id: "default-14", section: "Communication", name: "Templates", path: "/superadmin/templates", type: "Default", visible: true },
  { id: "default-15", section: "Communication", name: "Broadcasts", path: "/superadmin/broadcasts", type: "Default", visible: true },

  { id: "default-16", section: "Students", name: "Students", path: "/superadmin/students", type: "Default", visible: true },
  { id: "default-17", section: "Students", name: "Batches", path: "/superadmin/batches", type: "Default", visible: true },
  { id: "default-18", section: "Students", name: "Courses", path: "/superadmin/course", type: "Default", visible: true },
  { id: "default-19", section: "Students", name: "Placements", path: "/superadmin/placements", type: "Default", visible: true },

  { id: "default-20", section: "Academics", name: "Programs", path: "/superadmin/programs", type: "Default", visible: true },
  { id: "default-21", section: "Academics", name: "Course Categories", path: "/superadmin/course-categories", type: "Default", visible: true },
  { id: "default-22", section: "Academics", name: "Faculties", path: "/superadmin/faculties", type: "Default", visible: true },
  { id: "default-23", section: "Academics", name: "Exams", path: "/superadmin/exams", type: "Default", visible: true },

  { id: "default-24", section: "Finance", name: "Fees", path: "/superadmin/fees", type: "Default", visible: true },
  { id: "default-25", section: "Finance", name: "Expenses", path: "/superadmin/expenses", type: "Default", visible: true },
  { id: "default-26", section: "Finance", name: "Invoices", path: "/superadmin/invoices", type: "Default", visible: true },

  { id: "default-27", section: "Analytics", name: "Lead Analytics", path: "/superadmin/lead-analytics", type: "Default", visible: true },
  { id: "default-28", section: "Analytics", name: "Revenue", path: "/superadmin/revenue", type: "Default", visible: true },
  { id: "default-29", section: "Analytics", name: "Performance", path: "/superadmin/performance", type: "Default", visible: true },
  { id: "default-30", section: "Analytics", name: "Reports", path: "/superadmin/reports", type: "Default", visible: true },

  { id: "default-31", section: "Operations", name: "Staff", path: "/superadmin/staff", type: "Default", visible: true },
  { id: "default-32", section: "Operations", name: "Attendance", path: "/superadmin/attendance", type: "Default", visible: true },
  { id: "default-33", section: "Operations", name: "Holidays", path: "/superadmin/holidays", type: "Default", visible: true },
  { id: "default-34", section: "Operations", name: "Login Approvals", path: "/superadmin/login-approvals", type: "Default", visible: true },

  { id: "default-35", section: "Settings", name: "Branches", path: "/superadmin/branches", type: "Default", visible: true },
  { id: "default-36", section: "Settings", name: "Users", path: "/superadmin/users", type: "Default", visible: true },
  { id: "default-37", section: "Settings", name: "Roles", path: "/superadmin/roles", type: "Default", visible: true },
  { id: "default-38", section: "Settings", name: "Menus", path: "/superadmin/menus", type: "Default", visible: true },
  { id: "default-39", section: "Settings", name: "Integrations", path: "/superadmin/integrations", type: "Default", visible: true },
];

function MenuManager() {
  const [defaultMenus, setDefaultMenus] = useState([]);
  const [customMenus, setCustomMenus] = useState([]);

  const [form, setForm] = useState({
    section: "CRM & Leads",
    name: "",
    path: "",
  });

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const savedDefaultMenus = JSON.parse(localStorage.getItem("superAdminDefaultMenus"));
    const savedCustomMenus = JSON.parse(localStorage.getItem("superAdminExtraMenus")) || [];

    setDefaultMenus(savedDefaultMenus || DEFAULT_MENUS);
    setCustomMenus(savedCustomMenus);
  }, []);

  const allMenus = useMemo(() => [...defaultMenus, ...customMenus], [defaultMenus, customMenus]);

  const updateSidebar = () => {
    window.dispatchEvent(new Event("superAdminMenuUpdated"));
  };

  const saveDefaultMenus = (updatedMenus) => {
    setDefaultMenus(updatedMenus);
    localStorage.setItem("superAdminDefaultMenus", JSON.stringify(updatedMenus));
    updateSidebar();
  };

  const saveCustomMenus = (updatedMenus) => {
    setCustomMenus(updatedMenus);
    localStorage.setItem("superAdminExtraMenus", JSON.stringify(updatedMenus));
    updateSidebar();
  };

  const createPath = (path) => {
    const cleanPath = path.trim().toLowerCase().replaceAll(" ", "-").replaceAll("_", "-");
    return cleanPath.startsWith("/superadmin") ? cleanPath : `/superadmin/${cleanPath}`;
  };

  const resetForm = () => {
    setForm({
      section: "CRM & Leads",
      name: "",
      path: "",
    });
    setEditData(null);
  };

  const handleAddOrUpdateMenu = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.path.trim()) {
      alert("Please enter menu name and path");
      return;
    }

    const finalPath = createPath(form.path);

    const duplicate = allMenus.some(
      (menu) =>
        menu.id !== editData?.id &&
        (menu.path === finalPath ||
          menu.name.toLowerCase() === form.name.trim().toLowerCase())
    );

    if (duplicate) {
      alert("This menu name or path already exists");
      return;
    }

    if (editData) {
      const updatedMenu = {
        ...editData,
        section: form.section,
        name: form.name.trim(),
        path: finalPath,
      };

      if (editData.type === "Default") {
        saveDefaultMenus(defaultMenus.map((menu) => (menu.id === editData.id ? updatedMenu : menu)));
      } else {
        saveCustomMenus(customMenus.map((menu) => (menu.id === editData.id ? updatedMenu : menu)));
      }

      resetForm();
      return;
    }

    const newMenu = {
      id: `custom-${Date.now()}`,
      section: form.section,
      name: form.name.trim(),
      path: finalPath,
      type: "Custom",
      visible: true,
    };

    saveCustomMenus([...customMenus, newMenu]);
    resetForm();
  };

  const handleToggleVisible = (menu) => {
    if (menu.path === "/superadmin/menus") {
      alert("Menus page cannot be hidden because it controls menu visibility.");
      return;
    }

    if (menu.type === "Default") {
      saveDefaultMenus(
        defaultMenus.map((item) =>
          item.id === menu.id ? { ...item, visible: item.visible === false ? true : false } : item
        )
      );
    } else {
      saveCustomMenus(
        customMenus.map((item) =>
          item.id === menu.id ? { ...item, visible: item.visible === false ? true : false } : item
        )
      );
    }
  };

  const handleEdit = (menu) => {
    setEditData(menu);
    setForm({
      section: menu.section,
      name: menu.name,
      path: menu.path,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (menu) => {
    if (menu.path === "/superadmin/menus") {
      alert("Menus page cannot be deleted because it controls menu management.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${menu.name}?`);
    if (!confirmDelete) return;

    if (menu.type === "Default") {
      saveDefaultMenus(defaultMenus.filter((item) => item.id !== menu.id));
    } else {
      saveCustomMenus(customMenus.filter((item) => item.id !== menu.id));
    }
  };

  const handleResetDefaultMenus = () => {
    const confirmReset = window.confirm("This will restore all default menus. Continue?");
    if (!confirmReset) return;
    saveDefaultMenus(DEFAULT_MENUS);
  };

  return (
    <div className="sa-page-card">
      <h1>Menu Management</h1>
      <p>View, add, edit, delete, hide and show Super Admin sidebar menus dynamically.</p>

      <form className="menu-manager-form" onSubmit={handleAddOrUpdateMenu}>
        <div>
          <label>Menu Section <span className="required-star">*</span></label>
          <select
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            required
          >
            {DEFAULT_SECTIONS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Menu Name <span className="required-star">*</span></label>
          <input
            type="text"
            placeholder="Example: Student ID Card"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Route Path <span className="required-star">*</span></label>
          <input
            type="text"
            placeholder="Example: student-id-card"
            value={form.path}
            onChange={(e) => setForm({ ...form, path: e.target.value })}
            required
          />
        </div>

        <button type="submit">{editData ? "Update Menu" : "Add Menu"}</button>

        {editData && (
          <button type="button" className="cancel-menu-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="menu-manager-table">
        <div className="menu-manager-head">
          <h2>All Super Admin Menus</h2>
          <button type="button" className="reset-menu-btn" onClick={handleResetDefaultMenus}>
            Reset Default Menus
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Section</th>
              <th>Menu Name</th>
              <th>Path</th>
              <th>Type</th>
              <th>Visible</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {allMenus.map((menu) => (
              <tr key={menu.id}>
                <td>{menu.section}</td>
                <td>{menu.name}</td>
                <td>{menu.path}</td>
                <td>{menu.type}</td>

                <td>
                  <label className="menu-toggle-switch">
                    <input
                      type="checkbox"
                      checked={menu.visible !== false}
                      onChange={() => handleToggleVisible(menu)}
                    />
                    <span className="menu-toggle-slider"></span>
                  </label>

                  <span style={{ marginLeft: "10px", fontWeight: "700" }}>
                    {menu.visible !== false ? "Visible" : "Hidden"}
                  </span>
                </td>

                <td>
                  <div className="menu-action-group">
                    <button type="button" className="edit-menu-btn" onClick={() => handleEdit(menu)}>
                      Edit
                    </button>

                    <button type="button" className="delete-menu-btn" onClick={() => handleDelete(menu)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuManager;