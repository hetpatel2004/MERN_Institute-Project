import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Search,
  Plus,
  Trash2,
  RefreshCcw,
  Edit,
} from "lucide-react";
import "./Supper_admin.css";

function Institutes() {
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    email: "",
    phone: "",
    status: "Active",
    branches: [
      {
        branch_name: "",
        branch_city: "",
        branch_address: "",
        admin_email: "",
        admin_password: "",
      },
    ],
  });

const getInstitutes = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/institutes");
    setInstitutes(res.data);
    setMessage("");
  } catch (error) {
    setMessage("Backend not connected: Failed to fetch institutes");
  }
};
  useEffect(() => {
    getInstitutes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBranchChange = (index, e) => {
    const updatedBranches = [...formData.branches];

    updatedBranches[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      branches: updatedBranches,
    });
  };

  const addBranch = () => {
    setFormData({
      ...formData,
      branches: [
        ...formData.branches,
        {
          branch_name: "",
          branch_city: "",
          branch_address: "",
          admin_email: "",
          admin_password: "",
        },
      ],
    });
  };

  const removeBranch = (index) => {
    const updatedBranches = formData.branches.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      branches: updatedBranches,
    });
  };

 const handleEditInstitute = (item) => {
  setFormData({
    name: item.name || "",
    code: item.code || "",
    city: item.city || "",
    email: item.email || "",
    phone: item.phone || "",
    status: item.status || "Active",
    branches:
      item.branches && item.branches.length > 0
        ? item.branches
        : [
            {
              branch_name: "",
              branch_city: "",
              branch_address: "",
              admin_email: "",
              admin_password: "",
            },
          ],
  });

  setEditId(item._id);
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.code ||
    !formData.city ||
    !formData.email ||
    !formData.phone
  ) {
    alert("Please fill institute details");
    return;
  }

  try {
    if (editId) {
      await axios.put(
        `http://localhost:5000/api/institutes/${editId}`,
        formData
      );

      alert("Institute updated successfully");
    } else {
      await axios.post("http://localhost:5000/api/institutes", formData);

      alert("Institute created successfully");
    }

    handleClear();
    getInstitutes();
  } catch (error) {
    alert(error.response?.data?.message || "Operation failed");
  }
};

  const handleDeleteInstitute = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this institute?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/api/institutes/${id}`);
  } catch (error) {
    console.log("Backend delete failed, deleting from screen only");
  }

  setInstitutes(institutes.filter((item) => item._id !== id));
};

  const handleClear = () => {
    setFormData({
      name: "",
      code: "",
      city: "",
      email: "",
      phone: "",
      status: "Active",
      branches: [
        {
          branch_name: "",
          branch_city: "",
          branch_address: "",
          admin_email: "",
          admin_password: "",
        },
      ],
    });

    setEditId(null);
  };

  const filteredInstitutes = institutes.filter((item) => {
    return (
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.code?.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <div className="sa-header">
        <div>
          <p className="sa-tag">SUPER ADMIN / INSTITUTES</p>
          <h1>Institute Management</h1>
        </div>

        <button className="sa-primary-btn" type="button">
          <Plus size={18} />
          Add Institute
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            borderRadius: "12px",
            background: "#fee2e2",
            color: "#b91c1c",
            fontWeight: "700",
          }}
        >
          {message}
        </div>
      )}

      <div className="institute-page-grid">
        <div className="institute-list-card">
          <div className="institute-list-header">
            <div>
              <h2>Institutes</h2>
              <p>Add institute with multiple branches and branch admins.</p>
            </div>

            <div className="institute-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search institute"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="institute-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Code</th>
                  <th>City</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInstitutes.length > 0 ? (
                  filteredInstitutes.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <Building2 size={17} color="#0f766e" />{" "}
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.code}</td>
                      <td>{item.city}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>
                        <span className="sa-status">{item.status}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="sa-icon-btn edit"
                          onClick={() => handleEditInstitute(item)}
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          type="button"
                          className="sa-icon-btn delete"
                          onClick={() => handleDeleteInstitute(item._id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No institute records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="institute-form-card">
          <div className="institute-form-head">
            <h2>{editId ? "Edit Institute" : "Add Institute"}</h2>
            <p>
              Add institute, branches and branch admin login credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="institute-form-grid">
              <div>
                <label>Institute Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="full-width">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="full-width">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {!editId && (
              <>
                <h3 style={{ marginTop: "25px", marginBottom: "15px" }}>
                  Branches + Branch Admin Login
                </h3>

                {formData.branches.map((branch, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #dbe3ec",
                      borderRadius: "14px",
                      padding: "15px",
                      marginBottom: "15px",
                      background: "#f8fafc",
                    }}
                  >
                    <div className="institute-form-grid">
                      <div>
                        <label>Branch Name</label>
                        <input
                          type="text"
                          name="branch_name"
                          value={branch.branch_name}
                          onChange={(e) => handleBranchChange(index, e)}
                        />
                      </div>

                      <div>
                        <label>Branch City</label>
                        <input
                          type="text"
                          name="branch_city"
                          value={branch.branch_city}
                          onChange={(e) => handleBranchChange(index, e)}
                        />
                      </div>

                      <div className="full-width">
                        <label>Branch Address</label>
                        <input
                          type="text"
                          name="branch_address"
                          value={branch.branch_address}
                          onChange={(e) => handleBranchChange(index, e)}
                        />
                      </div>

                      <div>
                        <label>Branch Admin Email</label>
                        <input
                          type="email"
                          name="admin_email"
                          value={branch.admin_email}
                          onChange={(e) => handleBranchChange(index, e)}
                        />
                      </div>

                      <div>
                        <label>Branch Admin Password</label>
                        <input
                          type="text"
                          name="admin_password"
                          value={branch.admin_password}
                          onChange={(e) => handleBranchChange(index, e)}
                        />
                      </div>
                    </div>

                    {formData.branches.length > 1 && (
                      <button
                        type="button"
                        className="sa-icon-btn delete"
                        style={{ marginTop: "12px" }}
                        onClick={() => removeBranch(index)}
                      >
                        <Trash2 size={15} /> Remove Branch
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="clear-btn"
                  onClick={addBranch}
                  style={{ marginBottom: "15px" }}
                >
                  <Plus size={16} /> Add Another Branch
                </button>
              </>
            )}

            <div className="institute-form-actions">
              <button type="button" className="clear-btn" onClick={handleClear}>
                <RefreshCcw size={16} /> Clear
              </button>

              <button type="submit" className="sa-primary-btn">
                {editId ? "Update Institute" : "Create Institute"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Institutes;