import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Search, Trash2, RefreshCcw } from "lucide-react";
import "./Supper_admin.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: "",
    HR_name: "",
    contact_email: "",
    contact_phone: "",
    job_roles: "",
    package_range: "",
    branches: [
      {
        branch_name: "",
        admin_email: "",
        admin_password: "",
      },
    ],
  };

  const [formData, setFormData] = useState(emptyForm);

  const getCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Backend not connected: Failed to fetch companies");
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      HR_name: item.HR_name || "",
      contact_email: item.contact_email || "",
      contact_phone: item.contact_phone || "",
      job_roles: item.job_roles || "",
      package_range: item.package_range || "",
      branches:
        item.branches && item.branches.length > 0
          ? item.branches.map((branch) => ({
              branch_name: branch.branch_name || "",
              admin_email: branch.admin_email || "",
              admin_password: "",
            }))
          : [
              {
                branch_name: "",
                admin_email: "",
                admin_password: "",
              },
            ],
    });

    setEditId(item._id);
  };

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

  const handleAddCompany = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/companies/${editId}`,
          formData
        );

        alert("Company updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/companies", formData);

        alert("Company added successfully");
      }

      setFormData(emptyForm);
      setEditId(null);
      getCompanies();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/companies/${id}`);
      alert("Company deleted successfully");
      getCompanies();
    } catch (error) {
      alert("Failed to delete company");
    }
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setEditId(null);
  };

  const filteredCompanies = companies.filter((item) => {
    return (
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.HR_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.contact_email?.toLowerCase().includes(search.toLowerCase()) ||
      item.job_roles?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="company-page-grid">
      <div className="company-list-card">
        <div className="company-list-header">
          <div>
            <h2>Companies</h2>
            <p>Add, update, remove and monitor hiring companies.</p>
          </div>

          <div className="company-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {message && (
          <div
            style={{
              margin: "20px",
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

        <div className="company-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>HR Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Job Roles</th>
                <th>Package</th>
                <th>Branches</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Building2 size={17} color="#0f766e" />{" "}
                      <strong>{item.name}</strong>
                    </td>

                    <td>{item.HR_name}</td>
                    <td>{item.contact_email}</td>
                    <td>{item.contact_phone}</td>
                    <td>{item.job_roles}</td>
                    <td>{item.package_range}</td>

                    <td>
                      {item.branches?.length > 0
                        ? item.branches.map((branch, index) => (
                            <div key={index} style={{ marginBottom: "8px" }}>
                              <strong>{branch.branch_name}</strong>
                              <br />
                              {branch.admin_email}
                            </div>
                          ))
                        : "No Branch"}
                    </td>

                    <td>
                      <button
                        className="sa-icon-btn edit"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="sa-icon-btn delete"
                        onClick={() => handleDeleteCompany(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No company records match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="company-form-card">
        <div className="company-form-head">
          <h2>{editId ? "Edit Company" : "Add Company"}</h2>
          <p>Create a new hiring company record.</p>
        </div>

        <form onSubmit={handleAddCompany}>
          <div className="company-form-grid">
            <div>
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>HR Name</label>
              <input
                type="text"
                name="HR_name"
                value={formData.HR_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Contact Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <label>Job Roles</label>
              <input
                type="text"
                name="job_roles"
                value={formData.job_roles}
                onChange={handleChange}
                placeholder="Frontend, Backend, UI/UX"
              />
            </div>

            <div className="full-width">
              <label>Package Range</label>
              <input
                type="text"
                name="package_range"
                value={formData.package_range}
                onChange={handleChange}
                placeholder="3 LPA - 8 LPA"
              />
            </div>
          </div>

          <div className="full-width">
            <h3 style={{ marginTop: "20px", marginBottom: "15px" }}>
              Branches + Company Admin Login
            </h3>
          </div>

          {formData.branches.map((branch, index) => (
            <div
              key={index}
              className="full-width"
              style={{
                border: "1px solid #dbe3ec",
                borderRadius: "14px",
                padding: "15px",
                marginBottom: "15px",
                background: "#f8fafc",
              }}
            >
              <div className="company-form-grid">
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
                  <label>Company Admin Email</label>
                  <input
                    type="email"
                    name="admin_email"
                    value={branch.admin_email}
                    onChange={(e) => handleBranchChange(index, e)}
                  />
                </div>

                <div className="full-width">
                  <label>Company Admin Password</label>
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
                  Remove Branch
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
            Add Another Branch
          </button>

          <div className="company-form-actions">
            <button type="button" className="clear-btn" onClick={handleClear}>
              <RefreshCcw size={16} /> Clear
            </button>

            <button type="submit" className="sa-primary-btn">
              {editId ? "Update Company" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Companies;