import React, { useEffect, useState } from "react";

const DEFAULT_SECTIONS = [
  "CRM & Leads",
  "Communication",
  "Students",
  "Academics",
  "Finance",
  "Analytics",
  "Operations",
  "Settings",
];

function MenuManager() {
  const [menus, setMenus] = useState([]);

  const [form, setForm] = useState({
    section: "CRM & Leads",
    name: "",
    path: "",
  });

  useEffect(() => {
    const savedMenus =
      JSON.parse(localStorage.getItem("superAdminExtraMenus")) || [];
    setMenus(savedMenus);
  }, []);

  const saveMenus = (updatedMenus) => {
    setMenus(updatedMenus);
    localStorage.setItem("superAdminExtraMenus", JSON.stringify(updatedMenus));

    window.dispatchEvent(new Event("superAdminMenuUpdated"));
  };

  const handleAddMenu = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.path.trim()) {
      alert("Please enter menu name and path");
      return;
    }

    const cleanPath = form.path
      .trim()
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll("_", "-");

    const newMenu = {
      id: Date.now(),
      section: form.section,
      name: form.name.trim(),
      path: cleanPath.startsWith("/superadmin")
        ? cleanPath
        : `/superadmin/${cleanPath}`,
    };

    saveMenus([...menus, newMenu]);

    setForm({
      section: "CRM & Leads",
      name: "",
      path: "",
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu?"
    );

    if (!confirmDelete) return;

    const updatedMenus = menus.filter((menu) => menu.id !== id);
    saveMenus(updatedMenus);
  };

  return (
    <div className="sa-page-card">
      <h1>Menu Management</h1>
      <p>Add or delete Super Admin sidebar menus dynamically.</p>

      <form className="menu-manager-form" onSubmit={handleAddMenu}>
        <div>
          <label>Menu Section</label>
          <select
            value={form.section}
            onChange={(e) =>
              setForm({
                ...form,
                section: e.target.value,
              })
            }
          >
            {DEFAULT_SECTIONS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Menu Name</label>
          <input
            type="text"
            placeholder="Example: Student ID Card"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Route Path</label>
          <input
            type="text"
            placeholder="Example: student-id-card"
            value={form.path}
            onChange={(e) =>
              setForm({
                ...form,
                path: e.target.value,
              })
            }
          />
        </div>

        <button type="submit">Add Menu</button>
      </form>

      <div className="menu-manager-table">
        <h2>Added Menus</h2>

        {menus.length === 0 ? (
          <p>No custom menu added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Menu Name</th>
                <th>Path</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.section}</td>
                  <td>{menu.name}</td>
                  <td>{menu.path}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-menu-btn"
                      onClick={() => handleDelete(menu.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MenuManager;