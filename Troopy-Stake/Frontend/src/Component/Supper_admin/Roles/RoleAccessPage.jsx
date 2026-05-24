import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RoleAccessPage.css";

const API = "http://localhost:5000/api/role-access";

const menuGroups = [
  { name: "Dashboard", children: ["Dashboard"] },
  {
    name: "CRM & Leads",
    children: ["Leads", "Follow-ups", "Admissions", "Counsellors", "Campaigns"],
  },
  { name: "Students", children: ["Students", "Batches", "Courses", "Placements"] },
  { name: "Academics", children: ["Programs", "Course Categories", "Faculties", "Exams"] },
  { name: "Finance", children: ["Fees", "Expenses", "Invoices"] },
  { name: "Analytics", children: ["Lead Analytics", "Revenue", "Performance", "Reports"] },
  { name: "Operations", children: ["Staff", "Attendance", "Holidays", "Login Approvals"] },
  {
    name: "Settings",
    children: ["Branches", "Users", "Roles", "Menus", "Permissions", "System Settings"],
  },
];

const actions = ["view", "add", "edit", "delete", "export"];

function RoleAccessPage() {
  const [roles, setRoles] = useState([]);
  const [branchAdminCount, setBranchAdminCount] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

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
    fetchBranchAdminCount();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API}/roles`);
      let backendRoles = res.data || [];

      for (const role of defaultRoles) {
        const alreadyExists = backendRoles.some((r) => r.roleCode === role.roleCode);
        if (!alreadyExists) {
          await axios.post(`${API}/roles`, role);
        }
      }

      const finalRes = await axios.get(`${API}/roles`);
      setRoles(finalRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch roles");
    }
  };

  const fetchBranchAdminCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/institutes");

      const count = (res.data || []).reduce((total, institute) => {
        return total + (institute.branches?.length || 0);
      }, 0);

      setBranchAdminCount(count);
    } catch (err) {
      console.error("Failed to count branch admins", err);
      setBranchAdminCount(0);
    }
  };

  const getRoleUserCount = (role) => {
    if (role.roleCode === "BRANCH_ADMIN") return branchAdminCount;
    return role.totalUsers || 0;
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
      const isAllChecked = groupMenus.every((menu) => prev.permissions?.[menu]?.[action]);
      const updatedPermissions = { ...prev.permissions };

      groupMenus.forEach((menu) => {
        updatedPermissions[menu] = {
          ...updatedPermissions[menu],
          [action]: !isAllChecked,
        };
      });

      return { ...prev, permissions: updatedPermissions };
    });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      roleName: "",
      roleCode: "",
      description: "",
      status: true,
      permissions: {},
    });
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

      resetForm();
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const editRole = (role) => {
    setEditId(role._id);
    setForm({
      roleName: role.roleName || "",
      roleCode: role.roleCode || "",
      description: role.description || "",
      status: role.status ?? true,
      permissions: role.permissions || {},
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await axios.delete(`${API}/roles/${id}`);
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

  const openRoleDetails = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  return (
    <div className="rap-page">
      <div className="rap-page-header">
        <div>
          <h2>Role Management</h2>
          <p>Settings &gt; Roles</p>
        </div>

        <button className="rap-primary" onClick={resetForm}>
          + Add New Role
        </button>
      </div>

      <div className="rap-grid">
        <div className="rap-card">
          <h3>Role Information</h3>

          <div className="rap-form">
            <label>
              Role Name <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter role name"
              value={form.roleName}
              onChange={(e) => setForm({ ...form, roleName: e.target.value })}
            />

            <label>
              Role Code <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter role code e.g. BRANCH_ADMIN"
              value={form.roleCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  roleCode: e.target.value.toUpperCase().replace(/\s/g, "_"),
                })
              }
            />

            <label>Description</label>
            <textarea
              placeholder="Enter role description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <label>Status</label>
            <div className="rap-status-row">
              <label className="rap-switch">
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={() => setForm({ ...form, status: !form.status })}
                />
                <span></span>
              </label>
              <b>{form.status ? "Active" : "Inactive"}</b>
            </div>
          </div>

          <div className="rap-btn-row">
            <button className="rap-cancel" onClick={resetForm}>
              Cancel
            </button>

            <button className="rap-primary" onClick={saveRole}>
              {editId ? "Update Role" : "Create Role"}
            </button>
          </div>
        </div>

        <div className="rap-card">
          <div className="rap-card-head">
            <h3>Menu Access & Permissions</h3>
            <button className="rap-refresh" onClick={resetForm}>
              Refresh
            </button>
          </div>

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
                        <input
                          type="checkbox"
                          checked={form.permissions?.[group.name]?.[action] || false}
                          onChange={() => handleGroupPermission(group, action)}
                        />
                      </td>
                    ))}
                  </tr>

                  {group.children.map((child) => (
                    <tr key={child}>
                      <td className="rap-child-menu">☑ {child}</td>

                      {actions.map((action) => (
                        <td key={action}>
                          <input
                            type="checkbox"
                            checked={form.permissions?.[child]?.[action] || false}
                            onChange={() => handlePermission(child, action)}
                          />
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
        </div>
      </div>

      <div className="rap-card rap-role-card">
        <div className="rap-role-top">
          <h3>Roles List</h3>

          <div className="rap-filter">
            <input placeholder="Search roles..." />
            <select>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="rap-primary" onClick={resetForm}>
              + Add New Role
            </button>
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
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role, index) => (
              <tr key={role._id}>
                <td>{index + 1}</td>
                <td>{role.roleName}</td>
                <td>{role.roleCode}</td>
                <td>{role.description}</td>
                <td>{getRoleUserCount(role)}</td>
                <td>
                  <span className={role.status ? "rap-active" : "rap-inactive"}>
                    {role.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  {role.createdAt
                    ? new Date(role.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="rap-action-btns">
                  <button onClick={() => openRoleDetails(role)}>👁</button>
                  <button onClick={() => editRole(role)}>✏️</button>
                  <button onClick={() => toggleRoleStatus(role._id)}>
                    {role.status ? "🔵" : "⚪"}
                  </button>
                  <button onClick={() => deleteRole(role._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {roles.length === 0 && (
          <p className="rap-empty">No roles found. Create your first role.</p>
        )}
      </div>

      {showModal && selectedRole && (
        <div className="rap-modal-overlay">
          <div className="rap-modal">
            <button className="rap-close" onClick={() => setShowModal(false)}>
              ×
            </button>

            <h2>Role Details - {selectedRole.roleName}</h2>

            <div className="rap-tabs">
              <span className="active-tab">Role Information</span>
              <span>Permissions</span>
            </div>

            <div className="rap-detail-grid">
              <p>
                <b>Role Name:</b> {selectedRole.roleName}
              </p>
              <p>
                <b>Role Code:</b> {selectedRole.roleCode}
              </p>
              <p>
                <b>Total Users:</b> {getRoleUserCount(selectedRole)}
              </p>
              <p>
                <b>Status:</b> {selectedRole.status ? "Active" : "Inactive"}
              </p>
              <p>
                <b>Description:</b> {selectedRole.description}
              </p>
            </div>

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
                {Object.keys(selectedRole.permissions || {}).map((menu) => (
                  <tr key={menu}>
                    <td>{menu}</td>
                    {actions.map((action) => (
                      <td key={action}>
                        {selectedRole.permissions?.[menu]?.[action] ? "✅" : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleAccessPage;