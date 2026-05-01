import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Search } from "lucide-react";

function Companies() {
  const API = "http://localhost:3000/companies";

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    companyName: "",
    companyCode: "",
    industryType: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    hrName: "",
    hrEmail: "",
    hrPhone: "",
    collaborationType: "Placement Partner",
    status: "Pending",
    description: "",
  });

  const getCompanies = async () => {
    try {
      const res = await axios.get(API);
      setCompanies(res.data);
    } catch (error) {
      console.log(error);
      alert("Companies API not connected");
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.companyCode || !form.email || !form.phone) {
      alert("Please fill company name, code, email and phone");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }

      clearForm();
      getCompanies();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const editCompany = (company) => {
    setForm(company);
    setEditId(company.id);
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getCompanies();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const clearForm = () => {
    setForm({
      companyName: "",
      companyCode: "",
      industryType: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      hrName: "",
      hrEmail: "",
      hrPhone: "",
      collaborationType: "Placement Partner",
      status: "Pending",
      description: "",
    });
    setEditId(null);
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="sa-header">
        <div>
          <p className="sa-tag">COMPANY COLLABORATION</p>
          <h1>Company Management</h1>
        </div>
      </div>

      <div className="company-page-grid">
        {/* LEFT SIDE LIST */}
        <div className="company-list-card">
          <div className="company-list-header">
            <div>
              <h2>Companies</h2>
              <p>Add, update, remove and monitor company collaborations.</p>
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

          <div className="company-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>HR Contact</th>
                  <th>Phone</th>
                  <th>Collaboration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="7">No company records found.</td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td>
                        <b>{company.companyName}</b>
                        <br />
                        <small>{company.city}</small>
                      </td>

                      <td>{company.industryType}</td>

                      <td>
                        <b>{company.hrName}</b>
                        <br />
                        <small>{company.hrEmail}</small>
                      </td>

                      <td>{company.phone}</td>
                      <td>{company.collaborationType}</td>

                      <td>
                        <span className="sa-status">{company.status}</span>
                      </td>

                      <td>
                        <button
                          className="sa-icon-btn edit"
                          onClick={() => editCompany(company)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="sa-icon-btn delete"
                          onClick={() => deleteCompany(company.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="company-form-card">
          <div className="company-form-head">
            <h2>{editId ? "Update Company" : "Add Company"}</h2>
            <p>Create a new company collaboration record.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="company-form-grid">
              <div>
                <label>Company Name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Company Code</label>
                <input
                  type="text"
                  value={form.companyCode}
                  onChange={(e) =>
                    setForm({ ...form, companyCode: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Industry Type</label>
                <input
                  type="text"
                  placeholder="IT / Finance / Education"
                  value={form.industryType}
                  onChange={(e) =>
                    setForm({ ...form, industryType: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Company Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Company Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <div className="full-width">
                <label>Company Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div>
                <label>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />
              </div>

              <div>
                <label>State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                />
              </div>

              <div className="full-width">
                <label>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
              </div>

              <div>
                <label>HR / Contact Person Name</label>
                <input
                  type="text"
                  value={form.hrName}
                  onChange={(e) =>
                    setForm({ ...form, hrName: e.target.value })
                  }
                />
              </div>

              <div>
                <label>HR Email</label>
                <input
                  type="email"
                  value={form.hrEmail}
                  onChange={(e) =>
                    setForm({ ...form, hrEmail: e.target.value })
                  }
                />
              </div>

              <div>
                <label>HR Phone</label>
                <input
                  type="text"
                  value={form.hrPhone}
                  onChange={(e) =>
                    setForm({ ...form, hrPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Collaboration Type</label>
                <select
                  value={form.collaborationType}
                  onChange={(e) =>
                    setForm({ ...form, collaborationType: e.target.value })
                  }
                >
                  <option>Placement Partner</option>
                  <option>Internship Partner</option>
                  <option>Training Partner</option>
                  <option>Hiring Partner</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="full-width">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="full-width">
                <label>Notes / Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="company-form-actions">
              <button type="button" className="clear-btn" onClick={clearForm}>
                Clear
              </button>

              <button className="sa-primary-btn">
                {editId ? "Update Company" : "Create Company"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Companies;