import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserRoleAccess.css";

const API = "http://localhost:5000/api/role-access";

const menus = [
  "Dashboard",
  "User Management",
  "Users",
  "Roles",
  "Role Management",
  "Menu Management",
  "Permission Management",
  "Organization Management",
  "System Settings",
  "Audit Logs",
];

function UserRoleAccess() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: true,
    permissions: {},
  });

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    const res = await axios.get(`${API}/roles`);
    setRoles(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
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

  const createUser = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Password and confirm password not match");
      return;
    }

    await axios.post(`${API}/users`, form);
    fetchUsers();
    alert("User created successfully");

    setForm({
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      status: true,
      permissions: {},
    });
  };

  const openRoleDetails = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const usersByRole = users.filter((u) => u.role === selectedRole?.roleName);

  const toggleUserStatus = async (id) => {
    await axios.patch(`${API}/users/${id}/status`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`${API}/users/${id}`);
      fetchUsers();
    }
  };

  const deleteRole = async (id) => {
    if (window.confirm("Delete this role?")) {
      await axios.delete(`${API}/roles/${id}`);
      fetchRoles();
    }
  };

  return (
    <div className="ura-page">
      <div className="ura-top">
        <div>
          <h2>User Management</h2>
          <p>User Management &gt; Create User</p>
        </div>
        <button className="ura-back">← Back to Users</button>
      </div>

      <div className="ura-grid">
        <div className="ura-card">
          <h3>User Information</h3>

          <div className="ura-form-grid">
            <input placeholder="Enter full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input placeholder="Enter username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input placeholder="Enter email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Enter password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input placeholder="Enter phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

            <label className="ura-switch-line">
              <input type="checkbox" checked={form.status} onChange={() => setForm({ ...form, status: !form.status })} />
              Active
            </label>

            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r._id} value={r.roleName}>{r.roleName}</option>
              ))}
            </select>
          </div>

          <div className="ura-actions">
            <button className="ura-cancel">Cancel</button>
            <button className="ura-primary" onClick={createUser}>Create User</button>
          </div>
        </div>

        <div className="ura-card">
          <div className="ura-card-head">
            <h3>Menu Access & Permissions</h3>
            <input placeholder="Search menu..." />
          </div>

          <table className="ura-table">
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
              {menus.map((menu) => (
                <tr key={menu}>
                  <td>{menu}</td>
                  {["view", "add", "edit", "delete", "export"].map((action) => (
                    <td key={action}>
                      <input
                        type="checkbox"
                        checked={form.permissions?.[menu]?.[action] || false}
                        onChange={() => handlePermission(menu, action)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ura-card ura-role-section">
        <h3>Roles</h3>

        <table className="ura-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role, index) => (
              <tr key={role._id}>
                <td>{index + 1}</td>
                <td>{role.roleName}</td>
                <td>{role.description}</td>
                <td>{users.filter((u) => u.role === role.roleName).length}</td>
                <td>
                  <span className={role.status ? "active-badge" : "inactive-badge"}>
                    {role.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button onClick={() => openRoleDetails(role)}>👁</button>
                  <button>✏️</button>
                  <button onClick={() => deleteRole(role._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedRole && (
        <div className="ura-modal-overlay">
          <div className="ura-modal">
            <button className="ura-close" onClick={() => setShowModal(false)}>×</button>

            <h3>Role Details - {selectedRole.roleName}</h3>

            <div className="ura-tabs">
              <span className="active-tab">Users ({usersByRole.length})</span>
              <span>Permissions</span>
              <span>Role Information</span>
            </div>

            <table className="ura-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {usersByRole.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={user.status ? "active-badge" : "inactive-badge"}>
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleUserStatus(user._id)}>
                        {user.status ? "Disable" : "Enable"}
                      </button>
                      <button>✏️</button>
                      <button onClick={() => deleteUser(user._id)}>🗑</button>
                    </td>
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

export default UserRoleAccess;