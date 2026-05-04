import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Plus, Trash2, Search, RefreshCcw } from "lucide-react";
import "./Supper_admin.css";

function Branches() {
  const [branches, setBranches] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    institute_id: "",
    branch_name: "",
    city: "",
    address: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
    status: "Active",
  });

  const getBranches = async () => {
    const res = await axios.get("http://localhost:5000/api/branches");
    setBranches(res.data);
  };

  const getInstitutes = async () => {
    const res = await axios.get("http://localhost:5000/api/institutes");
    setInstitutes(res.data);
  };

  useEffect(() => {
    getBranches();
    getInstitutes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();

    if (
      !formData.institute_id ||
      !formData.branch_name ||
      !formData.city ||
      !formData.address ||
      !formData.admin_name ||
      !formData.admin_email ||
      !formData.admin_password
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/branches", formData);

      alert("Branch and Branch Admin created successfully");

      handleClear();
      getBranches();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create branch");
    }
  };

  const handleDeleteBranch = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this branch?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/branches/${id}`);
      alert("Branch deleted successfully");
      getBranches();
    } catch (error) {
      alert("Failed to delete branch");
    }
  };

  const handleClear = () => {
    setFormData({
      institute_id: "",
      branch_name: "",
      city: "",
      address: "",
      admin_name: "",
      admin_email: "",
      admin_password: "",
      status: "Active",
    });
  };

  const filteredBranches = branches.filter((item) => {
    return (
      item.branch_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase()) ||
      item.institute_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.admin_id?.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <div className="sa-header">
        <div>
          <p className="sa-tag">SUPER ADMIN / BRANCHES</p>
          <h1>Branch Management</h1>
        </div>

        <button className="sa-primary-btn" type="button">
          <Plus size={18} />
          Add Branch
        </button>
      </div>

      <div className="institute-page-grid">
        <div className="institute-list-card">
          <div className="institute-list-header">
            <div>
              <h2>Branches</h2>
              <p>Manage institute branches and assigned branch admins.</p>
            </div>

            <div className="institute-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search branch"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="institute-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Institute</th>
                  <th>City</th>
                  <th>Admin</th>
                  <th>Admin Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBranches.length > 0 ? (
                  filteredBranches.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <Building2 size={17} color="#0f766e" />{" "}
                        <strong>{item.branch_name}</strong>
                      </td>
                      <td>{item.institute_id?.name}</td>
                      <td>{item.city}</td>
                      <td>{item.admin_id?.name}</td>
                      <td>{item.admin_id?.email}</td>
                      <td>
                        <span className="sa-status">{item.status}</span>
                      </td>
                      <td>
                        <button
                          className="sa-icon-btn delete"
                          onClick={() => handleDeleteBranch(item._id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No branch records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="institute-form-card">
          <div className="institute-form-head">
            <h2>Add Branch</h2>
            <p>Create branch and assign one branch admin.</p>
          </div>

          <form onSubmit={handleCreateBranch}>
            <div className="institute-form-grid">
              <div className="full-width">
                <label>Select Institute</label>
                <select
                  name="institute_id"
                  value={formData.institute_id}
                  onChange={handleChange}
                >
                  <option value="">Select Institute</option>
                  {institutes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} - {item.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Branch Name</label>
                <input
                  type="text"
                  name="branch_name"
                  value={formData.branch_name}
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

              <div className="full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Admin Name</label>
                <input
                  type="text"
                  name="admin_name"
                  value={formData.admin_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Admin Email</label>
                <input
                  type="email"
                  name="admin_email"
                  value={formData.admin_email}
                  onChange={handleChange}
                />
              </div>

              <div className="full-width">
                <label>Admin Password</label>
                <input
                  type="text"
                  name="admin_password"
                  value={formData.admin_password}
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

            <div className="institute-form-actions">
              <button type="button" className="clear-btn" onClick={handleClear}>
                <RefreshCcw size={16} /> Clear
              </button>

              <button type="submit" className="sa-primary-btn">
                Create Branch
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Branches;