import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RoleAccessPage.css";

const API = "http://localhost:5000/api/role-access";

const menuGroups = [
  { name: "Dashboard", children: ["Dashboard"] },
  { name: "CRM & Leads", children: ["Leads", "Follow-ups", "Admissions", "Counsellors", "Campaigns"] },
  { name: "Students", children: ["Students", "Batches", "Courses", "Placements"] },
  { name: "Academics", children: ["Programs", "Course Categories", "Faculties", "Exams"] },
  { name: "Finance", children: ["Fees", "Expenses", "Invoices"] },
  { name: "Analytics", children: ["Lead Analytics", "Revenue", "Performance", "Reports"] },
  { name: "Operations", children: ["Staff", "Attendance", "Holidays", "Login Approvals"] },
  { name: "Settings", children: ["Branches", "Users", "Roles", "Menus", "Integrations"] },
];

const actions = ["view", "add", "edit", "delete", "export"];

function RoleAccessPage() {
  const [roles, setRoles] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [roleUsers, setRoleUsers] = useState([]);
  const [activeRoleId, setActiveRoleId] = useState(null);

  const [form, setForm] = useState({
    roleName: "",
    roleCode: "",
    description: "",
    status: true,
    permissions: {},
  });

  const defaultRoles = [
    { roleName: "Super Admin", roleCode: "SUPER_ADMIN", description: "Full system access", totalUsers: 1, status: true },
    { roleName: "Institute Admin", roleCode: "INSTITUTE_ADMIN", description: "Institute management access", totalUsers: 0, status: true },
    { roleName: "Branch Admin", roleCode: "BRANCH_ADMIN", description: "Branch management access", totalUsers: 0, status: true },
    { roleName: "Company Admin", roleCode: "COMPANY_ADMIN", description: "Company management access", totalUsers: 0, status: true },
    { roleName: "Faculty", roleCode: "FACULTY", description: "Faculty access", totalUsers: 0, status: true },
    { roleName: "Counsellor", roleCode: "COUNSELLOR", description: "Lead & student counselling access", totalUsers: 0, status: true },
    { roleName: "Sales Person", roleCode: "SALES_PERSON", description: "Sales management access", totalUsers: 0, status: true },
    { roleName: "Call Person", roleCode: "CALL_PERSON", description: "Call handling access", totalUsers: 0, status: true },
    { roleName: "Student", roleCode: "STUDENT", description: "Student dashboard access", totalUsers: 0, status: true },
  ];

  useEffect(() => {
    fetchRoles();
    fetchRoleCounts();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API}/roles`);
      const backendRoles = res.data || [];
      for (const role of defaultRoles) {
        const exists = backendRoles.some((r) => r.roleCode === role.roleCode);
        if (!exists) await axios.post(`${API}/roles`, role);
      }
      const finalRes = await axios.get(`${API}/roles`);
      setRoles(finalRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch roles");
    }
  };

  const fetchRoleCounts = async () => {
    try {
      const res = await axios.get(`${API}/role-counts`);
      setRoleCounts(res.data || {});
    } catch (err) {
      console.error("Failed to fetch role counts", err);
      setRoleCounts({});
    }
  };

  const getRoleUserCount = (role) => roleCounts[role.roleCode] || 0;

  const selectRole = (role) => {
    setActiveRoleId(role._id);
    setEditId(role._id);
    setForm({
      roleName: role.roleName || "",
      roleCode: role.roleCode || "",
      description: role.description || "",
      status: role.status ?? true,
      permissions: role.permissions || {},
    });
  };

  const clearSelection = () => {
    setActiveRoleId(null);
    setEditId(null);
    setForm({
      roleName: "",
      roleCode: "",
      description: "",
      status: true,
      permissions: {},
    });
  };

  const handlePermission = (menu, action) => {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [menu]: {
          ...prev.permissions[menu],
          [action]: !prev.permissions?.[menu]?.[action],
        },
      },
    }));
  };

  const handleGroupPermission = (group, action) => {
    const groupMenus = [group.name, ...group.children];
    setForm((prev) => {
      const allChecked = groupMenus.every((menu) => prev.permissions?.[menu]?.[action]);
      const updatedPermissions = { ...prev.permissions };
      groupMenus.forEach((menu) => {
        updatedPermissions[menu] = {
          ...updatedPermissions[menu],
          [action]: !allChecked,
        };
      });
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleSelectAll = () => {
    const updatedPermissions = {};
    menuGroups.forEach((group) => {
      [group.name, ...group.children].forEach((menu) => {
        updatedPermissions[menu] = {};
        actions.forEach((action) => {
          updatedPermissions[menu][action] = true;
        });
      });
    });
    setForm((prev) => ({
      ...prev,
      permissions: updatedPermissions,
    }));
  };

  const saveRole = async () => {
    if (!form.roleName || !form.roleCode) {
      alert("Role name and role code are required");
      return;
    }
    try {
      if (editId) {
        await axios.put(`${API}/roles/${editId}`, form);
        alert("Role updated successfully");
      } else {
        await axios.post(`${API}/roles`, form);
        alert("Role created successfully");
      }
      clearSelection();
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const savePermissions = async () => {
    if (!editId) {
      alert("Select a role first by clicking on it in the list below");
      return;
    }
    try {
      await axios.put(`${API}/roles/${editId}`, { permissions: form.permissions });
      alert("Permissions saved successfully");
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save permissions");
    }
  };

  const editRole = (role) => {
    selectRole(role);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await axios.delete(`${API}/roles/${id}`);
      if (activeRoleId === id) clearSelection();
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete role");
    }
  };

  const toggleRoleStatus = async (id) => {
    try {
      await axios.patch(`${API}/roles/${id}/status`);
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Failed to change role status");
    }
  };

  const openRoleDetails = async (role) => {
    try {
      setSelectedRole(role);
      setShowModal(true);
      const res = await axios.get(`${API}/role-users/${role.roleCode}`);
      setRoleUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setRoleUsers([]);
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      const url = user.status === "Blocked"
        ? `http://localhost:5000/api/users/${user._id}/unblock`
        : `http://localhost:5000/api/users/${user._id}/block`;
      const res = await axios.patch(url);
      setRoleUsers((prev) => prev.map((u) => (u._id === user._id ? res.data.user : u)));
      fetchRoleCounts();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const accessibleMenus = Object.entries(form.permissions)
    .filter(([, perms]) => perms?.view)
    .map(([menu]) => menu);

  return (
    <div className="rap-page">
      <div className="rap-page-header">
        <div>
          <h2>Role Management</h2>
          <p>Settings &gt; Roles — Click any role in the list to view & edit its menu permissions</p>
        </div>
        <button className="rap-primary" onClick={clearSelection}>
          + Add New Role
        </button>
      </div>

      <div className="rap-grid">
        <div className="rap-card">
          <h3>Role Information {activeRoleId ? <span className="rap-badge-editing">(Editing)</span> : ""}</h3>
          <div className="rap-form">
            <label>Role Name <span>*</span></label>
            <input type="text" placeholder="Enter role name" value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })} />
            <label>Role Code <span>*</span></label>
            <input type="text" placeholder="Enter role code e.g. BRANCH_ADMIN" value={form.roleCode} onChange={(e) => setForm({ ...form, roleCode: e.target.value.toUpperCase().replace(/\s/g, "_") })} />
            <label>Description</label>
            <textarea placeholder="Enter role description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label>Status</label>
            <div className="rap-status-row">
              <label className="rap-switch">
                <input type="checkbox" checked={form.status} onChange={() => setForm({ ...form, status: !form.status })} />
                <span></span>
              </label>
              <b>{form.status ? "Active" : "Inactive"}</b>
            </div>
          </div>
          <div className="rap-btn-row">
            <button className="rap-cancel" onClick={clearSelection}>Cancel</button>
            <button className="rap-primary" onClick={saveRole}>{editId ? "Update Role" : "Create Role"}</button>
          </div>
        </div>

        <div className="rap-card">
          <div className="rap-card-head">
            <h3>Menu Access & Permissions {activeRoleId ? <span className="rap-role-name-label">{roles.find(r => r._id === activeRoleId)?.roleName}</span> : ""}</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="rap-primary" type="button" onClick={handleSelectAll}>Select All</button>
              {editId && <button className="rap-save-perms-btn" onClick={savePermissions}>Save Permissions</button>}
              <button className="rap-refresh" onClick={clearSelection}>Clear</button>
            </div>
          </div>

          {activeRoleId ? (
            <>
              <table className="rap-table">
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th>View</th>
                    <th>Add</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Export</th>
                  </tr>
                </thead>
                <tbody>
                  {menuGroups.map((group) => (
                    <React.Fragment key={group.name}>
                      <tr className="rap-parent-row">
                        <td>▸ {group.name}</td>
                        {actions.map((action) => (
                          <td key={action}>
                            <input type="checkbox" checked={[group.name, ...group.children].every((menu) => form.permissions?.[menu]?.[action])} onChange={() => handleGroupPermission(group, action)} />
                          </td>
                        ))}
                      </tr>
                      {group.children.map((child) => (
                        <tr key={child}>
                          <td className="rap-child-menu">☑ {child}</td>
                          {actions.map((action) => (
                            <td key={action}>
                              <input type="checkbox" checked={form.permissions?.[child]?.[action] || false} onChange={() => handlePermission(child, action)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="rap-permission-note">
                <span>☑ Allowed</span>
                <span>☐ Not Allowed</span>
              </div>
            </>
          ) : (
            <div className="rap-empty-state">
              <p>Select a role from the list below to view and edit its menu access permissions.</p>
            </div>
          )}
        </div>
      </div>

      <div className="rap-card rap-role-card">
        <div className="rap-role-top">
          <h3>Roles List — Select a role to view its menu access</h3>
          <div className="rap-filter">
            <input placeholder="Search roles..." />
            <select>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="rap-primary" onClick={clearSelection}>+ Add New Role</button>
          </div>
        </div>

        <table className="rap-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Role Code</th>
              <th>Description</th>
              <th>Total Users</th>
              <th>Status</th>
              <th>Menu Access</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role._id} className={activeRoleId === role._id ? "rap-row-active" : "rap-row-clickable"}>
                <td>{index + 1}</td>
                <td className="rap-role-name-cell" onClick={() => selectRole(role)}>{role.roleName}</td>
                <td>{role.roleCode}</td>
                <td>{role.description}</td>
                <td>{getRoleUserCount(role)}</td>
                <td>
                  <span className={role.status ? "rap-active" : "rap-inactive"}>{role.status ? "Active" : "Inactive"}</span>
                </td>
                <td className="rap-menu-summary">
                  <div className="rap-menu-dots">
                    {menuGroups.map((group) => {
                      const hasView = group.children.some((child) => role.permissions?.[child]?.view);
                      return <span key={group.name} className={hasView ? "rap-dot-on" : "rap-dot-off"} title={group.name}>{group.name[0]}</span>;
                    })}
                  </div>
                </td>
                <td>{role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "-"}</td>
                <td className="rap-action-btns">
                  <button className="rap-view-btn" onClick={() => openRoleDetails(role)} title="View users">👁</button>
                  <button className="rap-edit-btn" onClick={() => editRole(role)} title="Edit">✏️</button>
                  <button className="rap-status-btn" onClick={() => toggleRoleStatus(role._id)}>{role.status ? "Disable" : "Enable"}</button>
                  <button className="rap-delete-btn" onClick={() => deleteRole(role._id)} title="Delete">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {roles.length === 0 && <p className="rap-empty">No roles found. Create your first role.</p>}
      </div>

      {activeRoleId && (
        <div className="rap-card rap-menu-visual-card">
          <h3>Visual Menu Access — <span className="rap-role-name-label">{roles.find(r => r._id === activeRoleId)?.roleName}</span></h3>
          <p className="rap-visual-hint">Menus this role can <strong>view</strong> (from permissions):</p>
          <div className="rap-visual-grid">
            {menuGroups.map((group) => {
              const visibleChildren = group.children.filter((c) => form.permissions?.[c]?.view);
              return (
                <div key={group.name} className={`rap-visual-section ${visibleChildren.length > 0 ? "" : "rap-visual-empty"}`}>
                  <div className="rap-visual-section-title">{group.name}</div>
                  {visibleChildren.length > 0 ? (
                    visibleChildren.map((c) => <div key={c} className="rap-visual-item">▸ {c}</div>)
                  ) : (
                    <div className="rap-visual-item rap-visual-na">No access</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && selectedRole && (
        <div className="rap-modal-overlay">
          <div className="rap-modal">
            <button className="rap-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Role Details - {selectedRole.roleName}</h2>
            <div className="rap-tabs">
              <span className="active-tab">Users ({roleUsers.length})</span>
            </div>
            <div className="rap-detail-grid">
              <p><b>Role Name:</b> {selectedRole.roleName}</p>
              <p><b>Role Code:</b> {selectedRole.roleCode}</p>
              <p><b>Total Users:</b> {getRoleUserCount(selectedRole)}</p>
              <p><b>Status:</b> {selectedRole.status ? "Active" : "Inactive"}</p>
              <p><b>Description:</b> {selectedRole.description}</p>
            </div>
            <table className="rap-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Block / Unblock</th>
                </tr>
              </thead>
              <tbody>
                {roleUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName || user.name || "-"}</td>
                    <td>{user.username || user.name || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td><span className={user.status === "Blocked" ? "rap-inactive" : "rap-active"}>{user.status === "Blocked" ? "Blocked" : "Active"}</span></td>
                    <td className="rap-action-btns">
                      <label className="block-toggle">
                        <input type="checkbox" checked={user.status !== "Blocked"} onChange={() => handleToggleBlock(user)} />
                        <span className="block-slider"></span>
                      </label>
                      <span style={{ marginLeft: "10px", fontWeight: "600", color: user.status === "Blocked" ? "#ef4444" : "#22c55e" }}>
                        {user.status === "Blocked" ? "Blocked" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {roleUsers.length === 0 && <p className="rap-empty">No users found in this role.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleAccessPage;
