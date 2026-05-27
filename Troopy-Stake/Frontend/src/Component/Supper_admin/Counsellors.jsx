import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users, UserCheck, Target, GraduationCap, TrendingUp, IndianRupee,
  Search, Plus, Eye, Pencil, Trash2, X, ChevronDown, ChevronUp,
  Phone, Mail, MapPin, Calendar, Shield, Power, BarChart3,
  Clock, Activity, FileText, MessageCircle, Camera,
} from "lucide-react";
import "./Counsellors.css";

const API = "http://localhost:5000/api/counsellors";

const defaultForm = {
  name: "", email: "", phone: "", password: "", branch: "", branchName: "", status: "Active", profileImage: "",
};

function Counsellors() {
  const [counsellors, setCounsellors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [actionOpen, setActionOpen] = useState(null);

  const limit = 20;

  useEffect(() => { fetchBranches(); }, []);
  useEffect(() => { fetchCounsellors(); }, [page, filterStatus]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/branches");
      setBranches(res.data.branches || []);
    } catch (err) { console.error(err); }
  };

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (filterStatus) params.status = filterStatus;
      if (search.trim()) params.search = search.trim();
      const res = await axios.get(API, { params });
      setCounsellors(res.data.counsellors || []);
      setStats(res.data.stats || {});
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch (err) { console.error("Failed to load counsellors", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!search && !filterStatus) return;
    const timer = setTimeout(() => fetchCounsellors(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleEdit = (c) => {
    setForm({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      password: "",
      branch: c.branch?._id || c.branch || "",
      branchName: c.branchName || "",
      status: c.status || "Active",
      profileImage: c.profileImage || "",
    });
    setEditing(c._id);
    setShowModal(true);
  };

  const handleView = async (c) => {
    try {
      const res = await axios.get(`${API}/${c._id}`);
      setViewItem(res.data);
    } catch (err) {
      alert("Failed to load counsellor details");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/${deleteId}`);
      setDeleteId(null);
      fetchCounsellors();
    } catch (err) {
      alert("Failed to delete counsellor");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API}/${id}/status`);
      fetchCounsellors();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form);
      } else {
        await axios.post(API, form);
      }
      setShowModal(false);
      setEditing(null);
      setForm(defaultForm);
      fetchCounsellors();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const filtered = useMemo(() => {
    let data = counsellors;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    }
    return data;
  }, [counsellors, search]);

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  };

  const getAvatar = (c) => {
    if (c.profileImage) return <img src={c.profileImage} alt={c.name} className="csl-avatar-img" />;
    return <div className="csl-avatar-initials">{getInitials(c.name)}</div>;
  };

  const statCards = [
    { label: "Total Counsellors", value: stats.totalCounsellors || 0, icon: Users, color: "#2563eb" },
    { label: "Active Counsellors", value: stats.activeCounsellors || 0, icon: UserCheck, color: "#047857" },
    { label: "Total Leads Assigned", value: stats.totalLeadsAssigned || 0, icon: Target, color: "#d97706" },
    { label: "Admissions Converted", value: stats.totalAdmissionsConverted || 0, icon: GraduationCap, color: "#7c3aed" },
    { label: "Conversion Rate", value: `${stats.overallConversionRate || "0.0"}%`, icon: TrendingUp, color: "#0f766e" },
    { label: "Revenue Generated", value: `\u20B9${(stats.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: "#0891b2" },
  ];

  return (
    <div className="csl-page">
      <div className="csl-header">
        <div>
          <h1>Counsellors</h1>
          <p className="csl-subtitle">Manage all counsellors and track performance</p>
        </div>
        <button className="csl-add-btn" onClick={() => { setEditing(null); setForm(defaultForm); setShowModal(true); }}>
          <Plus size={18} /> Add Counsellor
        </button>
      </div>

      <div className="csl-stats">
        {statCards.map((s, i) => (
          <div className="csl-stat-card" key={i}>
            <div className="csl-stat-dot" style={{ background: s.color }} />
            <div className="csl-stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={20} />
            </div>
            <p className="csl-stat-label">{s.label}</p>
            <h3 className="csl-stat-value">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="csl-filters">
        <div className="csl-search-box">
          <Search size={16} />
          <input placeholder="Search counsellors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <X size={16} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
        </div>
        <div className="csl-filter-group">
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="csl-table-card">
        <div className="csl-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Counsellor</th>
                <th>Email / Phone</th>
                <th>Branch</th>
                <th>Assigned Leads</th>
                <th>Follow-ups Done</th>
                <th>Pending</th>
                <th>Converted</th>
                <th>Conv. Rate</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} className="csl-empty">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={12} className="csl-empty">No counsellors found</td></tr>
              ) : filtered.map((c) => (
                <tr key={c._id} className={c.status !== "Active" ? "csl-row-inactive" : ""}>
                  <td>
                    <div className="csl-name-cell">
                      {getAvatar(c)}
                      <div>
                        <div className="csl-name">{c.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="csl-contact-info">
                      <span><Mail size={12} /> {c.email}</span>
                      <span><Phone size={12} /> {c.phone}</span>
                    </div>
                  </td>
                  <td>{c.branchName || "N/A"}</td>
                  <td><span className="csl-count">{c.assignedLeads || 0}</span></td>
                  <td><span className="csl-count">{c.followUpsDone || 0}</span></td>
                  <td><span className="csl-count" style={{ color: "#d97706" }}>{c.pendingFollowUps || 0}</span></td>
                  <td><span className="csl-count" style={{ color: "#047857" }}>{c.convertedStudents || 0}</span></td>
                  <td><span className="csl-rate">{c.conversionRate || "0.0"}%</span></td>
                  <td className="csl-revenue">\u20B9{(c.revenueGenerated || 0).toLocaleString()}</td>
                  <td>
                    <span className={`csl-status csl-${(c.status || "active").toLowerCase()}`}>{c.status}</span>
                  </td>
                  <td className="csl-login-time">
                    {c.loginInfo?.loginTime ? new Date(c.loginInfo.loginTime).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <div className="csl-action-wrap">
                      <button className="csl-action-btn" onClick={() => setActionOpen(actionOpen === c._id ? null : c._id)}>
                        <ChevronDown size={16} />
                      </button>
                      {actionOpen === c._id && (
                        <div className="csl-dropdown">
                          <button onClick={() => { handleView(c); setActionOpen(null); }}>
                            <Eye size={15} /> View Details
                          </button>
                          <button onClick={() => { handleEdit(c); setActionOpen(null); }}>
                            <Pencil size={15} /> Edit
                          </button>
                          <button className="csl-dropdown-danger" onClick={() => { setDeleteId(c._id); setActionOpen(null); }}>
                            <Trash2 size={15} /> Delete
                          </button>
                          <button onClick={() => { handleToggleStatus(c._id); setActionOpen(null); }}>
                            <Power size={15} /> {c.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="csl-pagination">
            <span>Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, totalItems)} of {totalItems}</span>
            <div className="csl-page-btns">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="csl-overlay" onClick={() => setShowModal(false)}>
          <div className="csl-modal csl-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="csl-modal-header">
              <h2>{editing ? "Edit Counsellor" : "Add Counsellor"}</h2>
              <button className="csl-modal-close" onClick={() => { setShowModal(false); setEditing(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="csl-modal-body">
                <div className="csl-form-row">
                  <div className="csl-form-group">
                    <label>Full Name <span className="csl-req">*</span></label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
                  </div>
                  <div className="csl-form-group">
                    <label>Email <span className="csl-req">*</span></label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
                  </div>
                </div>
                <div className="csl-form-row">
                  <div className="csl-form-group">
                    <label>Phone <span className="csl-req">*</span></label>
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" />
                  </div>
                  <div className="csl-form-group">
                    <label>Password {!editing && <span className="csl-req">*</span>}</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder={editing ? "Leave blank to keep current" : "Enter password"} required={!editing} />
                  </div>
                </div>
                <div className="csl-form-row">
                  <div className="csl-form-group">
                    <label>Branch</label>
                    <select value={form.branch} onChange={(e) => {
                      const selected = branches.find((b) => b._id === e.target.value);
                      setForm({ ...form, branch: e.target.value, branchName: selected?.branchName || "" });
                    }}>
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>{b.branchName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="csl-form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="csl-form-group">
                  <label>Profile Image URL</label>
                  <input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="Enter image URL" />
                </div>
              </div>
              <div className="csl-modal-footer">
                <button type="button" className="csl-cancel-btn" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</button>
                <button type="submit" className="csl-save-btn">{editing ? "Update" : "Create"} Counsellor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="csl-overlay" onClick={() => setViewItem(null)}>
          <div className="csl-modal csl-modal-xl" onClick={(e) => e.stopPropagation()}>
            <div className="csl-modal-header">
              <h2>Counsellor Details</h2>
              <button className="csl-modal-close" onClick={() => setViewItem(null)}><X size={20} /></button>
            </div>
            <div className="csl-modal-body">
              <div className="csl-detail-grid">
                <div className="csl-detail-section">
                  <h4><UserCheck size={16} /> Personal Details</h4>
                  <div className="csl-detail-rows">
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Name</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.name}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Email</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.email}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Phone</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.phone}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Branch</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.branchName || viewItem.counsellor?.branch?.branchName || "N/A"}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Status</span>
                      <span className={`csl-status csl-${(viewItem.counsellor?.status || "").toLowerCase()}`}>{viewItem.counsellor?.status}</span>
                    </div>
                  </div>
                </div>

                <div className="csl-detail-section">
                  <h4><BarChart3 size={16} /> Performance</h4>
                  <div className="csl-detail-rows">
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Assigned Leads</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.assignedLeads || 0}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Follow-ups Done</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.followUpsDone || 0}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Pending Follow-ups</span>
                      <span className="csl-detail-value" style={{ color: "#d97706" }}>{viewItem.counsellor?.pendingFollowUps || 0}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Converted Students</span>
                      <span className="csl-detail-value" style={{ color: "#047857" }}>{viewItem.counsellor?.convertedStudents || 0}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Conversion Rate</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.conversionRate || "0.0"}%</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Revenue Generated</span>
                      <span className="csl-detail-value csl-revenue">\u20B9{(viewItem.counsellor?.revenueGenerated || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="csl-detail-section">
                  <h4><Shield size={16} /> Login Info</h4>
                  <div className="csl-detail-rows">
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Last Login</span>
                      <span className="csl-detail-value">
                        {viewItem.counsellor?.loginInfo?.loginTime
                          ? new Date(viewItem.counsellor.loginInfo.loginTime).toLocaleString()
                          : "Never"}
                      </span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">IP Address</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.loginInfo?.ipAddress || "-"}</span>
                    </div>
                    <div className="csl-detail-row">
                      <span className="csl-detail-label">Device</span>
                      <span className="csl-detail-value">{viewItem.counsellor?.loginInfo?.device || "-"}</span>
                    </div>
                  </div>
                  {viewItem.counsellor?.loginHistory?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Login History</p>
                      {viewItem.counsellor.loginHistory.slice(-5).reverse().map((h, i) => (
                        <div key={i} className="csl-history-item">
                          <Calendar size={12} />
                          <span>{h.loginTime ? new Date(h.loginTime).toLocaleString() : "-"}</span>
                          <span style={{ color: "var(--text-muted)" }}>{h.ipAddress}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="csl-detail-section csl-detail-full">
                  <h4><Target size={16} /> Assigned Leads ({viewItem.leads?.length || 0})</h4>
                  {viewItem.leads?.length > 0 ? (
                    <div className="csl-detail-table-wrap">
                      <table className="csl-detail-table">
                        <thead>
                          <tr><th>Name</th><th>Phone</th><th>Course</th><th>Source</th><th>Status</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                          {viewItem.leads.slice(0, 10).map((l) => (
                            <tr key={l._id}>
                              <td>{l.studentName}</td>
                              <td>{l.phone}</td>
                              <td>{l.course}</td>
                              <td>{l.source}</td>
                              <td><span className={`csl-status csl-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                              <td className="csl-login-time">{new Date(l.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="csl-empty">No leads assigned</p>
                  )}
                </div>

                <div className="csl-detail-section csl-detail-full">
                  <h4><FileText size={16} /> Follow-up History ({viewItem.followUps?.length || 0})</h4>
                  {viewItem.followUps?.length > 0 ? (
                    <div className="csl-detail-table-wrap">
                      <table className="csl-detail-table">
                        <thead>
                          <tr><th>Title</th><th>Status</th><th>Date</th><th>Note</th></tr>
                        </thead>
                        <tbody>
                          {viewItem.followUps.slice(0, 10).map((f) => (
                            <tr key={f._id}>
                              <td>{f.title || f.studentName || "-"}</td>
                              <td><span className={`csl-status csl-${f.status?.toLowerCase()}`}>{f.status}</span></td>
                              <td className="csl-login-time">{f.followUpDate ? new Date(f.followUpDate).toLocaleDateString() : "-"}</td>
                              <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{f.note || f.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="csl-empty">No follow-ups found</p>
                  )}
                </div>

                <div className="csl-detail-section csl-detail-full">
                  <h4><GraduationCap size={16} /> Admission Conversions ({viewItem.conversions?.length || 0})</h4>
                  {viewItem.conversions?.length > 0 ? (
                    <div className="csl-detail-table-wrap">
                      <table className="csl-detail-table">
                        <thead>
                          <tr><th>Student</th><th>Course</th><th>Amount</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                          {viewItem.conversions.slice(0, 10).map((a) => (
                            <tr key={a._id}>
                              <td>{a.studentName}</td>
                              <td>{a.courseName}</td>
                              <td className="csl-revenue">\u20B9{(a.paidAmount || 0).toLocaleString()}</td>
                              <td className="csl-login-time">{new Date(a.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="csl-empty">No conversions yet</p>
                  )}
                </div>
              </div>
            </div>
            <div className="csl-modal-footer">
              <button className="csl-cancel-btn" onClick={() => setViewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="csl-overlay" onClick={() => setDeleteId(null)}>
          <div className="csl-modal csl-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="csl-modal-header">
              <h2>Delete Counsellor</h2>
              <button className="csl-modal-close" onClick={() => setDeleteId(null)}><X size={20} /></button>
            </div>
            <div className="csl-modal-body" style={{ textAlign: "center", padding: "30px" }}>
              <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                Are you sure you want to delete this counsellor? This action cannot be undone.
              </p>
            </div>
            <div className="csl-modal-footer">
              <button className="csl-cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="csl-delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Counsellors;
