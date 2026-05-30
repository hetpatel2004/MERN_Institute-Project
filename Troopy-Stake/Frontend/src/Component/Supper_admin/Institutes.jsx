import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2, Search, Plus, Edit, Trash2, X, Eye, Filter,
  ChevronLeft, ChevronRight, Ban, CheckCircle, ExternalLink,
  BookOpen, Users, GraduationCap, IndianRupee, CreditCard,
  Globe, MapPin, Phone, Mail, ChevronDown,
} from "lucide-react";
import InstituteBranchesModal from "./InstituteBranchesModal";
import "./Institute.css";

const API = "http://localhost:5000/api/institutes";

const defaultForm = {
  name: "", code: "", email: "", phone: "", alternatePhone: "",
  address: "", city: "", state: "", country: "India", pincode: "",
  website: "", registrationNumber: "", instituteType: "", establishedYear: "",
  logo: "", status: "Active",
  socialLinks: { facebook: "", twitter: "", linkedin: "", youtube: "" },
  facilities: "",
};

function Institutes() {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [stats, setStats] = useState({
    totalInstitutes: 0, totalBranches: 0, totalStudents: 0,
    totalAdmissions: 0, totalCoursesPurchased: 0, totalRevenue: 0,
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [actionOpen, setActionOpen] = useState(null);
  const [selected, setSelected] = useState([]);
  const [branchModalInstitute, setBranchModalInstitute] = useState(null);
  const limit = 10;

  useEffect(() => { fetchStats(); fetchInstitutes(); }, []);

  useEffect(() => { fetchInstitutes(); }, [page, filterStatus, filterCity, filterState, dateFrom, dateTo]);

  useEffect(() => { setPage(1); }, [search, filterStatus, filterCity, filterState, dateFrom, dateTo]);

  const fetchStats = async () => {
    try { const res = await axios.get(`${API}/stats`); setStats(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchInstitutes = async () => {
    try {
      const params = { page, limit };
      if (filterStatus) params.status = filterStatus;
      if (filterCity) params.city = filterCity;
      if (filterState) params.state = filterState;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (search.trim()) params.search = search.trim();
      const res = await axios.get(`${API}`, { params });
      setInstitutes(res.data.institutes);
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        facilities: form.facilities ? form.facilities.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await axios.put(`${API}/${editing}`, payload);
      } else {
        await axios.post(`${API}`, payload);
      }
      setShowModal(false);
      setEditing(null);
      setForm(defaultForm);
      fetchInstitutes();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save institute");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this institute? Data will be hidden but kept for audit.")) return;
    try { await axios.delete(`${API}/${id}`); fetchInstitutes(); fetchStats(); }
    catch (err) { alert("Failed to delete"); }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this institute? All branches and students will be disabled.")) return;
    try { await axios.patch(`${API}/${id}/deactivate`); fetchInstitutes(); fetchStats(); }
    catch (err) { alert("Failed to deactivate"); }
  };

  const handleActivate = async (id) => {
    try { await axios.patch(`${API}/${id}/activate`); fetchInstitutes(); }
    catch (err) { alert("Failed to activate"); }
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      name: item.name || "", code: item.code || "", email: item.email || "",
      phone: item.phone || "", alternatePhone: item.alternatePhone || "",
      address: item.address || "", city: item.city || "", state: item.state || "",
      country: item.country || "India", pincode: item.pincode || "",
      website: item.website || "", registrationNumber: item.registrationNumber || "",
      instituteType: item.instituteType || "", establishedYear: item.establishedYear || "",
      logo: item.logo || "", status: item.status || "Active",
      socialLinks: item.socialLinks || { facebook: "", twitter: "", linkedin: "", youtube: "" },
      facilities: item.facilities ? item.facilities.join(", ") : "",
    });
    setShowModal(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(institutes.map((i) => i._id));
    else setSelected([]);
  };

  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const statCards = useMemo(() => [
    { label: "Total Institutes", value: stats.totalInstitutes, color: "#3b82f6", icon: Building2 },
    { label: "Total Branches", value: stats.totalBranches, color: "#10b981", icon: Building2 },
    { label: "Total Students", value: stats.totalStudents, color: "#8b5cf6", icon: Users },
    { label: "Total Courses", value: stats.totalCoursesPurchased, color: "#f59e0b", icon: BookOpen },
    { label: "Total Admissions", value: stats.totalAdmissions, color: "#ef4444", icon: GraduationCap },
    { label: "Total Revenue", value: `\u20B9${stats.totalRevenue.toLocaleString()}`, color: "#14b8a6", icon: IndianRupee },
  ], [stats]);

  const cities = [...new Set(institutes.map((i) => i.city).filter(Boolean))];
  const states = [...new Set(institutes.map((i) => i.state).filter(Boolean))];

  return (
    <div className="inst-page">
      <div className="inst-header">
        <div>
          <h1>Institutes</h1>
          <p className="inst-subtitle">Manage all registered institutes and their resources</p>
        </div>
        <button className="inst-add-btn" onClick={() => { setEditing(null); setForm(defaultForm); setShowModal(true); }}>
          <Plus size={18} /> Add Institute
        </button>
      </div>

      <div className="inst-stats">
        {statCards.map((s) => (
          <div key={s.label} className="inst-stat-card">
            <div className="inst-stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={22} />
            </div>
            <p className="inst-stat-label">{s.label}</p>
            <h2 className="inst-stat-value">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="inst-filters">
        <div className="inst-search-box">
          <Search size={18} />
          <input type="text" placeholder="Search by name, code, email, phone or ID..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInstitutes()} />
        </div>
        <div className="inst-filter-group">
          <Filter size={16} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)}>
            <option value="">All States</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To" />
          {(filterStatus || filterCity || filterState || dateFrom || dateTo || search) && (
            <button className="inst-clear-btn" onClick={() => {
              setSearch(""); setFilterStatus(""); setFilterCity(""); setFilterState("");
              setDateFrom(""); setDateTo(""); setPage(1);
            }}><X size={16} /></button>
          )}
        </div>
      </div>

      <div className="inst-table-card">
        <div className="inst-table-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selected.length === institutes.length && institutes.length > 0} /></th>
                <th>Institute ID</th>
                <th>Logo</th>
                <th>Institute Name</th>
                <th>Code</th>
                <th>City / State</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Branches</th>
                <th>Students</th>
                <th>Courses</th>
                <th>Admissions</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutes.length === 0 ? (
                <tr><td colSpan={15} className="inst-empty">No institutes found</td></tr>
              ) : (
                institutes.map((inst) => (
                  <tr key={inst._id}
                    className={inst.status === "Inactive" ? "inst-row-inactive" : ""}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      if (e.target.type === "checkbox" || e.target.closest(".inst-action-wrap")) return;
                      setBranchModalInstitute(inst);
                    }}>
                    <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.includes(inst._id)} onChange={() => handleSelect(inst._id)} /></td>
                    <td className="inst-id">{inst.instituteId || "-"}</td>
                    <td>
                      {inst.logo ? <img src={inst.logo} alt="" className="inst-logo" /> : <div className="inst-logo-placeholder"><Building2 size={18} /></div>}
                    </td>
                    <td className="inst-name-cell">{inst.name}</td>
                    <td>{inst.code}</td>
                    <td>{[inst.city, inst.state].filter(Boolean).join(", ") || "-"}</td>
                    <td className="inst-email">{inst.email}</td>
                    <td>{inst.phone}</td>
                    <td><span className="inst-count">{inst.totalBranches ?? "-"}</span></td>
                    <td><span className="inst-count">{inst.totalStudents ?? "-"}</span></td>
                    <td><span className="inst-count">{inst.totalCoursesPurchased ?? "-"}</span></td>
                    <td><span className="inst-count">{inst.totalAdmissions ?? "-"}</span></td>
                    <td className="inst-revenue">\u20B9{(inst.totalRevenue ?? 0).toLocaleString()}</td>
                    <td><span className={`inst-status ${inst.status?.toLowerCase()}`}>{inst.status}</span></td>
                    <td>
                      <div className="inst-action-wrap">
                        <button className="inst-action-btn" onClick={() => setActionOpen(actionOpen === inst._id ? null : inst._id)}>
                          <ChevronDown size={16} />
                        </button>
                        {actionOpen === inst._id && (
                          <div className="inst-dropdown" onClick={() => setActionOpen(null)}>
                            <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/details`)}>
                              <Eye size={15} /> View Details
                            </button>
                            <button onClick={() => { openEdit(inst); }}>
                              <Edit size={15} /> Edit Institute
                            </button>
                            <button onClick={() => setBranchModalInstitute(inst)}>
                              <Building2 size={15} /> Manage Branches
                            </button>
                            <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/students`)}>
                              <Users size={15} /> View Students
                            </button>
                            <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/admissions`)}>
                              <GraduationCap size={15} /> View Admissions
                            </button>
                            <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/payments`)}>
                              <CreditCard size={15} /> View Payments
                            </button>
                            <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/purchased-courses`)}>
                              <BookOpen size={15} /> Courses Purchased
                            </button>
                            {inst.status === "Active" ? (
                              <button className="inst-dropdown-warn" onClick={() => handleDeactivate(inst._id)}>
                                <Ban size={15} /> Deactivate Institute
                              </button>
                            ) : (
                              <button onClick={() => handleActivate(inst._id)}>
                                <CheckCircle size={15} /> Activate Institute
                              </button>
                            )}
                            <button className="inst-dropdown-danger" onClick={() => handleDelete(inst._id)}>
                              <Trash2 size={15} /> Delete Institute
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="inst-pagination">
            <span>Showing {(page - 1) * limit + 1} &ndash; {Math.min(page * limit, totalItems)} of {totalItems}</span>
            <div className="inst-page-btns">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="inst-overlay" onClick={() => setShowModal(false)}>
          <div className="inst-modal inst-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="inst-modal-header">
              <h2>{editing ? "Edit Institute" : "Add Institute"}</h2>
              <button className="inst-modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="inst-modal-body">
                <h4 className="inst-section-title">Basic Information</h4>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Institute Name <span className="required-star">*</span></label>
                    <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="inst-form-group">
                    <label>Institute Code <span className="required-star">*</span></label>
                    <input name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                  </div>
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Email <span className="required-star">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="inst-form-group">
                    <label>Phone <span className="required-star">*</span></label>
                    <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Alternate Phone</label>
                    <input name="alternatePhone" value={form.alternatePhone} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} />
                  </div>
                  <div className="inst-form-group">
                    <label>Website</label>
                    <input name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
                  </div>
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Registration Number</label>
                    <input name="registrationNumber" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
                  </div>
                  <div className="inst-form-group">
                    <label>Institute Type</label>
                    <input name="instituteType" value={form.instituteType} onChange={(e) => setForm({ ...form, instituteType: e.target.value })} placeholder="College / School / Academy" />
                  </div>
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Established Year</label>
                    <input name="establishedYear" value={form.establishedYear} onChange={(e) => setForm({ ...form, establishedYear: e.target.value })} placeholder="YYYY" />
                  </div>
                  <div className="inst-form-group">
                    <label>Status</label>
                    <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <h4 className="inst-section-title">Address</h4>
                <div className="inst-form-group">
                  <label>Address</label>
                  <input name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>City <span className="required-star">*</span></label>
                    <input name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div className="inst-form-group">
                    <label>State</label>
                    <input name="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </div>
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Country</label>
                    <input name="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  </div>
                  <div className="inst-form-group">
                    <label>Pincode</label>
                    <input name="pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                  </div>
                </div>

                <h4 className="inst-section-title">Social Links</h4>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>Facebook</label>
                    <input name="facebook" value={form.socialLinks.facebook} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} />
                  </div>
                  <div className="inst-form-group">
                    <label>Twitter</label>
                    <input name="twitter" value={form.socialLinks.twitter} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })} />
                  </div>
                </div>
                <div className="inst-form-row">
                  <div className="inst-form-group">
                    <label>LinkedIn</label>
                    <input name="linkedin" value={form.socialLinks.linkedin} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} />
                  </div>
                  <div className="inst-form-group">
                    <label>YouTube</label>
                    <input name="youtube" value={form.socialLinks.youtube} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })} />
                  </div>
                </div>

                <h4 className="inst-section-title">Additional</h4>
                <div className="inst-form-group">
                  <label>Facilities <span className="inst-hint">(comma separated)</span></label>
                  <input name="facilities" value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} placeholder="Library, Lab, Sports, Hostel" />
                </div>
              </div>
              <div className="inst-modal-footer">
                <button type="button" className="inst-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="inst-save-btn">{editing ? "Update" : "Create Institute"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {branchModalInstitute && (
        <InstituteBranchesModal
          instituteId={branchModalInstitute._id}
          instituteName={branchModalInstitute.name}
          onClose={() => setBranchModalInstitute(null)}
        />
      )}
    </div>
  );
}

export default Institutes;
