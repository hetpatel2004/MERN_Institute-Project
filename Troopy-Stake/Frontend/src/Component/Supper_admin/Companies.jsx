import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Search, Trash2, RefreshCcw, X, Plus } from "lucide-react";
import "./Supper_admin.css";
import "./Branches.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [branchForm, setBranchForm] = useState({ branch_name: "", admin_email: "", admin_password: "" });

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
          : emptyForm.branches,
    });

    setEditId(item._id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchChange = (index, e) => {
    const updatedBranches = [...formData.branches];
    updatedBranches[index][e.target.name] = e.target.value;
    setFormData({ ...formData, branches: updatedBranches });
  };

  const addBranch = () => {
    setFormData({
      ...formData,
      branches: [
        ...formData.branches,
        { branch_name: "", admin_email: "", admin_password: "" },
      ],
    });
  };

  const removeBranch = (index) => {
    const updatedBranches = formData.branches.filter((_, i) => i !== index);
    setFormData({ ...formData, branches: updatedBranches });
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/companies/${editId}`,
          formData,
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
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

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

  const handleAddBranchToCompany = async (e) => {
    e.preventDefault();
    if (!branchForm.branch_name || !branchForm.admin_email || !branchForm.admin_password) {
      return alert("All branch fields are required");
    }
    try {
      await axios.post(`http://localhost:5000/api/companies/${selectedCompany._id}/branches`, branchForm);
      alert("Branch added successfully");
      setBranchForm({ branch_name: "", admin_email: "", admin_password: "" });
      getCompanies();
      const updated = await axios.get(`http://localhost:5000/api/companies`);
      setSelectedCompany(updated.data.find((c) => c._id === selectedCompany._id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add branch");
    }
  };

  const getLoginInfo = (branch) => {
    return branch?.admin_id?.loginInfo || branch?.admin_loginInfo || {};
  };

  const showLocation = (info) => {
    if (info?.location?.latitude && info?.location?.longitude) {
      return `${info.location.latitude}, ${info.location.longitude}`;
    }
    return "Not allowed / not found";
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
            <p>Super Admin can view company admin login tracking here.</p>
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
                <th>Company Admin Activity</th>
                <th>Company Admin Login Data</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((item) => (
                  <tr
                    key={item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCompany(item)}
                  >
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
                      {(() => {
                        const login =
                          item.admin_loginInfo ||
                          item.admin_id?.loginInfo ||
                          {};

                        const locationText =
                          typeof login.location === "string"
                            ? login.location
                            : login.location?.latitude &&
                                login.location?.longitude
                              ? `${login.location.latitude}, ${login.location.longitude}`
                              : "Not allowed / not found";

                        const loginTimeText = login.loginTime
                          ? new Date(login.loginTime).toLocaleString()
                          : "Not login yet";

                        return (
                          <div
                            style={{
                              marginBottom: "8px",
                              padding: "8px",
                              borderRadius: "10px",
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              fontSize: "11px",
                              lineHeight: "16px",
                              minWidth: "170px",
                            }}
                          >
                            <strong>Company Admin</strong>
                            <br />
                            <b>Email:</b> {item.admin_email || "No email"}
                            <br />
                            <b>Password:</b>{" "}
                            {item.admin_password || "No password"}
                            <br />
                            <b>IP:</b> {login.ipAddress || "Not login yet"}
                            <br />
                            <b>Device:</b> {login.device || "Not login yet"}
                            <br />
                            <b>Location:</b> {locationText}
                            <br />
                            <b>Login Time:</b> {loginTimeText}
                          </div>
                        );
                      })()}
                    </td>
                    
                    <td>
                      {item.branches?.length > 0
                        ? item.branches.map((branch, index) => {
                            const info = getLoginInfo(branch);

                            return (
                              <div
                                key={index}
                                style={{
                                  marginBottom: "12px",
                                  padding: "10px",
                                  borderRadius: "10px",
                                  background: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  fontSize: "13px",
                                }}
                              >
                                <strong>{branch.branch_name}</strong>
                                <br />
                                <b>Email:</b>{" "}
                                {branch.admin_email ||
                                  branch.admin_id?.email ||
                                  "No email"}
                                <br />
                                <b>IP Address:</b>{" "}
                                {info.ipAddress || "Not login yet"}
                                <br />
                                <b>Device:</b> {info.device || "Not login yet"}
                                <br />
                                <b>Location:</b> {showLocation(info)}
                                <br />
                                <b>Login Time:</b>{" "}
                                {info.loginTime
                                  ? new Date(info.loginTime).toLocaleString()
                                  : "Not login yet"}
                              </div>
                            );
                          })
                        : "No company admin data"}
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
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
                  <td colSpan="9">No company records match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="company-form-card">
        <div className="company-form-head">
          <h2>{editId ? "Edit Company" : "Add Company"}</h2>
          <p>Create company and company admin login.</p>
        </div>

        <form onSubmit={handleAddCompany}>
          <div className="company-form-grid">
            <div>
              <label>Company Name <span className="required-star">*</span></label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>HR Name <span className="required-star">*</span></label>
              <input
                name="HR_name"
                value={formData.HR_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Contact Email <span className="required-star">*</span></label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Contact Phone <span className="required-star">*</span></label>
              <input
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="full-width">
              <label>Job Roles</label>
              <input
                name="job_roles"
                value={formData.job_roles}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <label>Package Range</label>
              <input
                name="package_range"
                value={formData.package_range}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 style={{ marginTop: "20px", marginBottom: "15px" }}>
            Branches + Company Admin Login
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
              <div className="company-form-grid">
                <div>
                  <label>Branch Name</label>
                  <input
                    name="branch_name"
                    value={branch.branch_name}
                    onChange={(e) => handleBranchChange(index, e)}
                  />
                </div>

                <div>
                  <label>Company Admin Email <span style={{ color: "#64748b" }}>(Optional)</span></label>
                  <input
                    type="email"
                    name="admin_email"
                    value={branch.admin_email}
                    onChange={(e) => handleBranchChange(index, e)}
                  />
                </div>

                <div className="full-width">
                  <label>Company Admin Password <span style={{ color: "#64748b" }}>(Optional)</span></label>
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

          <button type="button" className="clear-btn" onClick={addBranch}>
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

      {selectedCompany && (
        <div className="br-overlay" onClick={() => { setSelectedCompany(null); setBranchForm({ branch_name: "", admin_email: "", admin_password: "" }); }}>
          <div className="br-modal br-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="br-modal-header">
              <h2><Building2 size={20} /> {selectedCompany.name}</h2>
              <button className="br-modal-close" onClick={() => { setSelectedCompany(null); setBranchForm({ branch_name: "", admin_email: "", admin_password: "" }); }}>
                <X size={20} />
              </button>
            </div>
            <div className="br-modal-body">
              <div className="br-detail-grid">
                <div className="br-detail-section">
                  <h4>Company Details</h4>
                  <div className="br-detail-rows">
                    <div className="br-detail-row">
                      <span className="br-detail-label">HR Name</span>
                      <span className="br-detail-value">{selectedCompany.HR_name}</span>
                    </div>
                    <div className="br-detail-row">
                      <span className="br-detail-label">Email</span>
                      <span className="br-detail-value">{selectedCompany.contact_email}</span>
                    </div>
                    <div className="br-detail-row">
                      <span className="br-detail-label">Phone</span>
                      <span className="br-detail-value">{selectedCompany.contact_phone}</span>
                    </div>
                    <div className="br-detail-row">
                      <span className="br-detail-label">Job Roles</span>
                      <span className="br-detail-value">{selectedCompany.job_roles}</span>
                    </div>
                    <div className="br-detail-row">
                      <span className="br-detail-label">Package</span>
                      <span className="br-detail-value">{selectedCompany.package_range}</span>
                    </div>
                    <div className="br-detail-row">
                      <span className="br-detail-label">Branches</span>
                      <span className="br-detail-value">{selectedCompany.branches?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="br-detail-section">
                  <h4>Existing Branches</h4>
                  {selectedCompany.branches?.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {selectedCompany.branches.map((b, i) => (
                        <div key={i} style={{ padding: "8px 10px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "13px" }}>
                          <strong>{b.branch_name}</strong>
                          <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{b.admin_email}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No branches yet</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 800, margin: "0 0 14px" }}>
                  <Plus size={16} /> Create Branch
                </h4>
                <form onSubmit={handleAddBranchToCompany}>
                  <div className="br-form-row">
                    <div className="br-form-group">
                      <label>Branch Name <span className="br-req">*</span></label>
                      <input required value={branchForm.branch_name} onChange={(e) => setBranchForm({ ...branchForm, branch_name: e.target.value })} placeholder="Enter branch name" />
                    </div>
                    <div className="br-form-group">
                      <label>Admin Email <span className="br-req">*</span></label>
                      <input required type="email" value={branchForm.admin_email} onChange={(e) => setBranchForm({ ...branchForm, admin_email: e.target.value })} placeholder="Admin login email" />
                    </div>
                  </div>
                  <div className="br-form-row">
                    <div className="br-form-group">
                      <label>Admin Password <span className="br-req">*</span></label>
                      <input required type="password" value={branchForm.admin_password} onChange={(e) => setBranchForm({ ...branchForm, admin_password: e.target.value })} placeholder="Admin login password" />
                    </div>
                  </div>
                  <div className="br-modal-footer" style={{ padding: "12px 0 0", borderTop: "none" }}>
                    <button type="submit" className="br-save-btn"><Plus size={16} /> Create Branch</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;
