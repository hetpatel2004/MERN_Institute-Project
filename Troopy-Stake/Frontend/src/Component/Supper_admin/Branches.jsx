import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2, Plus, Search, Eye, Pencil, Trash2, X, ChevronDown,
  Phone, Mail, MapPin, User, Shield, Power, KeyRound, BookOpen,
  Users, GraduationCap, IndianRupee, Target, MessageCircle, Calendar,
  Clock, Layers, School, FileText,
} from "lucide-react";
import "./Branches.css";

const API = "http://localhost:5000/api/branches";
const INST_API = "http://localhost:5000/api/institutes";

const defaultForm = {
  instituteId: "", branchName: "", branchCode: "", city: "", state: "",
  address: "", phone: "", email: "", status: "Active",
  adminName: "", adminEmail: "", adminPhone: "", adminPassword: "", adminConfirm: "",
};

function Branches() {
  const [branches, setBranches] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedInst, setSelectedInst] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [resetId, setResetId] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [actionOpen, setActionOpen] = useState(null);

  const limit = 20;

  useEffect(() => { fetchInstitutes(); }, []);
  useEffect(() => { fetchBranches(); }, [page, filterStatus, selectedInst]);

  const fetchInstitutes = async () => {
    try {
      const res = await axios.get(INST_API);
      setInstitutes(res.data.institutes || res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (filterStatus) params.status = filterStatus;
      if (selectedInst) params.instituteId = selectedInst;
      if (search.trim()) params.search = search.trim();
      const res = await axios.get(API, { params });
      setBranches(res.data.branches || []);
      setStats(res.data.stats || {});
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch (err) { console.error("Failed to load branches", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!search && !filterStatus) return;
    const t = setTimeout(() => fetchBranches(), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleEdit = (b) => {
    setForm({
      instituteId: b.instituteId?._id || b.instituteId || "",
      branchName: b.branchName || "",
      branchCode: b.branchCode || "",
      city: b.city || "", state: b.state || "",
      address: b.address || "", phone: b.phone || "", email: b.email || "",
      status: b.status || "Active",
      adminName: b.adminId?.name || "",
      adminEmail: b.adminId?.email || "",
      adminPhone: b.adminId?.phone || "",
      adminPassword: "", adminConfirm: "",
    });
    setEditing(b._id);
    setShowModal(true);
  };

  const handleView = async (b) => {
    try {
      const res = await axios.get(`${API}/${b._id}`);
      setViewItem(res.data);
    } catch (err) { alert("Failed to load branch details"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/${deleteId}`);
      setDeleteId(null);
      fetchBranches();
    } catch (err) { alert("Failed to delete branch"); }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API}/${id}/status`);
      fetchBranches();
    } catch (err) { alert("Failed to update status"); }
  };

  const handleResetPassword = async () => {
    if (!resetId || !resetPassword) return;
    try {
      await axios.patch(`${API}/${resetId}/reset-password`, { newPassword: resetPassword });
      setResetId(null);
      setResetPassword("");
      alert("Password reset successfully");
    } catch (err) { alert(err.response?.data?.message || "Failed to reset password"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && form.adminPassword !== form.adminConfirm) {
      return alert("Passwords do not match");
    }
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form);
      } else {
        await axios.post(API, form);
      }
      setShowModal(false);
      setEditing(null);
      setForm(defaultForm);
      fetchBranches();
    } catch (err) { alert(err.response?.data?.message || "Operation failed"); }
  };

  const selectedInstData = institutes.find((i) => (i._id === selectedInst));
  const instBranches = branches.filter((b) => b.instituteId?._id === selectedInst || b.instituteId === selectedInst);

  const statCards = [
    { label: "Total Institutes", value: stats.totalInstitutes || 0, icon: Building2, color: "#2563eb" },
    { label: "Total Branches", value: stats.totalBranches || 0, icon: Building2, color: "#0f766e" },
    { label: "Active Branches", value: stats.activeBranches || 0, icon: Shield, color: "#047857" },
    { label: "Branch Admins", value: stats.totalBranchAdmins || 0, icon: User, color: "#d97706" },
    { label: "Total Students", value: stats.totalStudents || 0, icon: Users, color: "#7c3aed" },
    { label: "Total Admissions", value: stats.totalAdmissions || 0, icon: GraduationCap, color: "#0891b2" },
    { label: "Total Revenue", value: `\u20B9${(stats.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: "#059669" },
  ];

  return (
    <div className="br-page">
      <div className="br-header">
        <div>
          <h1>Branches</h1>
          <p className="br-subtitle">Manage all branches under institutes</p>
        </div>
      </div>

      <div className="br-stats">
        {statCards.map((s, i) => (
          <div className="br-stat-card" key={i}>
            <div className="br-stat-dot" style={{ background: s.color }} />
            <div className="br-stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={20} />
            </div>
            <p className="br-stat-label">{s.label}</p>
            <h3 className="br-stat-value">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="br-filters">
        <div className="br-search-box">
          <Search size={16} />
          <input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <X size={16} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
        </div>
        <div className="br-filter-group">
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="br-inst-select-section">
        <div className="br-inst-select-row">
          <label>Select Institute:</label>
          <select value={selectedInst} onChange={(e) => { setSelectedInst(e.target.value); setPage(1); }}>
            <option value="">-- Select an Institute --</option>
            {institutes.map((inst) => (
              <option key={inst._id} value={inst._id}>{inst.name} ({inst.code})</option>
            ))}
          </select>
        </div>

        {selectedInstData && (
          <div className="br-inst-info">
            <div className="br-inst-info-left">
              <h3>{selectedInstData.name}</h3>
              <p><MapPin size={14} /> {selectedInstData.city} | Code: {selectedInstData.code}</p>
              <p className="br-branch-count">{instBranches.length} branch{instBranches.length !== 1 ? "es" : ""} under this institute</p>
            </div>
            <button className="br-add-btn" onClick={() => {
              setForm({ ...defaultForm, instituteId: selectedInst });
              setEditing(null);
              setShowModal(true);
            }}>
              <Plus size={18} /> Add Branch
            </button>
          </div>
        )}

        {!selectedInst && (
          <div className="br-no-inst">
            <Building2 size={40} />
            <h3>Please select an institute first</h3>
            <p>Select an institute above to manage its branches, or create a new institute from the Institutes page.</p>
          </div>
        )}
      </div>

      <div className="br-table-card">
        <div className="br-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Institute</th>
                <th>City</th>
                <th>Admin / Email</th>
                <th>Phone</th>
                <th>Students</th>
                <th>Admissions</th>
                <th>Leads</th>
                <th>Counsellors</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="br-empty">Loading...</td></tr>
              ) : branches.length === 0 ? (
                <tr><td colSpan={11} className="br-empty">No branches found</td></tr>
              ) : branches.map((b) => (
                <tr key={b._id} className={b.status !== "Active" ? "br-row-inactive" : ""}>
                  <td>
                    <div className="br-name-cell">
                      <div className="br-avatar-placeholder"><Building2 size={16} /></div>
                      <div>
                        <div className="br-name">{b.branchName}</div>
                        <div className="br-code">{b.branchCode}</div>
                      </div>
                    </div>
                  </td>
                  <td>{b.instituteId?.name || "N/A"}</td>
                  <td>{b.city || "-"}</td>
                  <td>
                    <div className="br-admin-info">
                      <span>{b.adminId?.name || "No admin"}</span>
                      {b.adminId?.email && <span className="br-email-text">{b.adminId.email}</span>}
                    </div>
                  </td>
                  <td>{b.phone || "-"}</td>
                  <td><span className="br-count">{b.studentCount || 0}</span></td>
                  <td><span className="br-count">{b.admissionCount || 0}</span></td>
                  <td><span className="br-count">{b.leadCount || 0}</span></td>
                  <td><span className="br-count">{b.counsellorCount || 0}</span></td>
                  <td>
                    <span className={`br-status br-${(b.status || "active").toLowerCase()}`}>{b.status}</span>
                  </td>
                  <td>
                    <div className="br-action-wrap">
                      <button className="br-action-btn" onClick={() => setActionOpen(actionOpen === b._id ? null : b._id)}>
                        <ChevronDown size={16} />
                      </button>
                      {actionOpen === b._id && (
                        <div className="br-dropdown">
                          <button onClick={() => { handleView(b); setActionOpen(null); }}><Eye size={15} /> View Details</button>
                          <button onClick={() => { handleEdit(b); setActionOpen(null); }}><Pencil size={15} /> Edit</button>
                          <button className="br-dropdown-danger" onClick={() => { setDeleteId(b._id); setActionOpen(null); }}><Trash2 size={15} /> Delete</button>
                          <button onClick={() => { handleToggleStatus(b._id); setActionOpen(null); }}>
                            <Power size={15} /> {b.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                          <button onClick={() => { setResetId(b._id); setResetPassword(""); setActionOpen(null); }}>
                            <KeyRound size={15} /> Reset Admin Password
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
          <div className="br-pagination">
            <span>Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, totalItems)} of {totalItems}</span>
            <div className="br-page-btns">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="br-overlay" onClick={() => setShowModal(false)}>
          <div className="br-modal br-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="br-modal-header">
              <h2>{editing ? "Edit Branch" : "Add Branch"}</h2>
              <button className="br-modal-close" onClick={() => { setShowModal(false); setEditing(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="br-modal-body">
                <h4 className="br-section-title"><Building2 size={16} /> Branch Details</h4>
                <div className="br-form-row">
                  <div className="br-form-group">
                    <label>Institute <span className="br-req">*</span></label>
                    <select required value={form.instituteId} onChange={(e) => setForm({ ...form, instituteId: e.target.value })}>
                      <option value="">Select Institute</option>
                      {institutes.map((inst) => (
                        <option key={inst._id} value={inst._id}>{inst.name} ({inst.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="br-form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="br-form-row">
                  <div className="br-form-group">
                    <label>Branch Name <span className="br-req">*</span></label>
                    <input required value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} placeholder="Enter branch name" />
                  </div>
                  <div className="br-form-group">
                    <label>Branch Code <span className="br-req">*</span></label>
                    <input required value={form.branchCode} onChange={(e) => setForm({ ...form, branchCode: e.target.value })} placeholder="Unique branch code" />
                  </div>
                </div>
                <div className="br-form-row">
                  <div className="br-form-group">
                    <label>City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
                  </div>
                  <div className="br-form-group">
                    <label>State</label>
                    <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" />
                  </div>
                </div>
                <div className="br-form-group">
                  <label>Address</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" />
                </div>
                <div className="br-form-row">
                  <div className="br-form-group">
                    <label>Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Branch phone number" />
                  </div>
                  <div className="br-form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Branch email" />
                  </div>
                </div>

                <h4 className="br-section-title" style={{ marginTop: 24 }}><User size={16} /> Branch Admin Details</h4>
                {!editing && <p className="br-section-note">Create a Branch Admin who can login and manage this branch.</p>}
                <div className="br-form-row">
                  <div className="br-form-group">
                    <label>Admin Name</label>
                    <input value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} placeholder="Admin full name" />
                  </div>
                  <div className="br-form-group">
                    <label>Admin Email</label>
                    <input type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} placeholder="Admin login email" />
                  </div>
                </div>
                <div className="br-form-row">
                  <div className="br-form-group">
                    <label>Admin Phone</label>
                    <input value={form.adminPhone} onChange={(e) => setForm({ ...form, adminPhone: e.target.value })} placeholder="Admin phone" />
                  </div>
                  {!editing && (
                    <div className="br-form-group">
                      <label>Admin Password {!editing && <span className="br-req">*</span>}</label>
                      <input type="password" value={form.adminPassword} onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                        placeholder="Admin login password" required={!editing} />
                    </div>
                  )}
                </div>
                {!editing && (
                  <div className="br-form-group">
                    <label>Confirm Password <span className="br-req">*</span></label>
                    <input type="password" value={form.adminConfirm} onChange={(e) => setForm({ ...form, adminConfirm: e.target.value })}
                      placeholder="Confirm admin password" required={!editing} />
                  </div>
                )}
              </div>
              <div className="br-modal-footer">
                <button type="button" className="br-cancel-btn" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</button>
                <button type="submit" className="br-save-btn">{editing ? "Update" : "Create"} Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="br-overlay" onClick={() => setViewItem(null)}>
          <div className="br-modal br-modal-xl" onClick={(e) => e.stopPropagation()}>
            <div className="br-modal-header">
              <h2>Branch Details - {viewItem.branch?.branchName}</h2>
              <button className="br-modal-close" onClick={() => setViewItem(null)}><X size={20} /></button>
            </div>
            <div className="br-modal-body">
              <div className="br-detail-grid">
                <div className="br-detail-section">
                  <h4><Building2 size={16} /> Branch Information</h4>
                  <div className="br-detail-rows">
                    <Row label="Name" value={viewItem.branch?.branchName} />
                    <Row label="Code" value={viewItem.branch?.branchCode} />
                    <Row label="City" value={viewItem.branch?.city} />
                    <Row label="State" value={viewItem.branch?.state} />
                    <Row label="Address" value={viewItem.branch?.address} />
                    <Row label="Phone" value={viewItem.branch?.phone} />
                    <Row label="Email" value={viewItem.branch?.email} />
                    <Row label="Status" value={viewItem.branch?.status} badge />
                  </div>
                </div>

                <div className="br-detail-section">
                  <h4><School size={16} /> Institute Information</h4>
                  <div className="br-detail-rows">
                    <Row label="Institute" value={viewItem.branch?.instituteId?.name} />
                    <Row label="Code" value={viewItem.branch?.instituteId?.code} />
                    <Row label="City" value={viewItem.branch?.instituteId?.city} />
                    <Row label="Email" value={viewItem.branch?.instituteId?.email} />
                    <Row label="Phone" value={viewItem.branch?.instituteId?.phone} />
                  </div>
                </div>

                <div className="br-detail-section">
                  <h4><User size={16} /> Branch Admin</h4>
                  <div className="br-detail-rows">
                    <Row label="Name" value={viewItem.branch?.adminId?.name || "Not assigned"} />
                    <Row label="Email" value={viewItem.branch?.adminId?.email} />
                    <Row label="Phone" value={viewItem.branch?.adminId?.phone} />
                    <Row label="Status" value={viewItem.branch?.adminId?.status || "-"} />
                  </div>
                  {viewItem.branch?.adminId?.loginInfo && (
                    <>
                      <h4 style={{ marginTop: 16 }}><Shield size={16} /> Login Info</h4>
                      <div className="br-detail-rows">
                        <Row label="Last Login" value={viewItem.branch?.adminId?.loginInfo?.loginTime
                          ? new Date(viewItem.branch.adminId.loginInfo.loginTime).toLocaleString() : "Never"} />
                        <Row label="IP Address" value={viewItem.branch?.adminId?.loginInfo?.ipAddress || "-"} />
                        <Row label="Device" value={viewItem.branch?.adminId?.loginInfo?.device || "-"} />
                      </div>
                    </>
                  )}
                </div>

                {viewItem.students?.length > 0 && (
                  <Section title={`Students (${viewItem.students.length})`} icon={Users}>
                    <MiniTable headers={["Name", "Email", "Phone"]}>
                      {viewItem.students.slice(0, 10).map((s) => (
                        <tr key={s._id}><td>{s.name || s.studentName}</td><td>{s.email}</td><td>{s.phone}</td></tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}

                {viewItem.admissions?.length > 0 && (
                  <Section title={`Admissions (${viewItem.admissions.length})`} icon={GraduationCap}>
                    <MiniTable headers={["Student", "Course", "Amount", "Status"]}>
                      {viewItem.admissions.slice(0, 10).map((a) => (
                        <tr key={a._id}>
                          <td>{a.studentName}</td>
                          <td>{a.courseName}</td>
                          <td>\u20B9{(a.paidAmount || 0).toLocaleString()}</td>
                          <td><span className={`br-status br-${(a.status || "").toLowerCase()}`}>{a.status}</span></td>
                        </tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}

                {viewItem.leads?.length > 0 && (
                  <Section title={`Leads (${viewItem.leads.length})`} icon={Target}>
                    <MiniTable headers={["Name", "Phone", "Course", "Status"]}>
                      {viewItem.leads.slice(0, 10).map((l) => (
                        <tr key={l._id}>
                          <td>{l.studentName}</td>
                          <td>{l.phone}</td>
                          <td>{l.course}</td>
                          <td><span className={`br-status br-${(l.status || "").toLowerCase()}`}>{l.status}</span></td>
                        </tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}

                {viewItem.counsellors?.length > 0 && (
                  <Section title={`Counsellors (${viewItem.counsellors.length})`} icon={User}>
                    <MiniTable headers={["Name", "Email", "Phone"]}>
                      {viewItem.counsellors.slice(0, 10).map((c) => (
                        <tr key={c._id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td></tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}

                {viewItem.followUps?.length > 0 && (
                  <Section title={`Follow-ups (${viewItem.followUps.length})`} icon={MessageCircle}>
                    <MiniTable headers={["Title", "Status", "Date"]}>
                      {viewItem.followUps.slice(0, 10).map((f) => (
                        <tr key={f._id}>
                          <td>{f.title || "-"}</td>
                          <td><span className={`br-status br-${(f.status || "").toLowerCase()}`}>{f.status}</span></td>
                          <td>{f.followUpDate ? new Date(f.followUpDate).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}

                {viewItem.batches?.length > 0 && (
                  <Section title={`Batches (${viewItem.batches.length})`} icon={Layers}>
                    <MiniTable headers={["Name", "Timing"]}>
                      {viewItem.batches.slice(0, 10).map((b) => (
                        <tr key={b._id}><td>{b.name || b.batchName}</td><td>{b.timing || "-"}</td></tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}

                {viewItem.courses?.length > 0 && (
                  <Section title={`Purchased Courses (${viewItem.courses.length})`} icon={BookOpen}>
                    <MiniTable headers={["Course", "Status"]}>
                      {viewItem.courses.slice(0, 10).map((c) => (
                        <tr key={c._id}>
                          <td>{c.courseName || c.title || c.courseId?.title}</td>
                          <td><span className={`br-status br-${(c.status || "").toLowerCase()}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </MiniTable>
                  </Section>
                )}
              </div>
            </div>
            <div className="br-modal-footer">
              <button className="br-cancel-btn" onClick={() => setViewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="br-overlay" onClick={() => setDeleteId(null)}>
          <div className="br-modal br-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="br-modal-header">
              <h2>Delete Branch</h2>
              <button className="br-modal-close" onClick={() => setDeleteId(null)}><X size={20} /></button>
            </div>
            <div className="br-modal-body" style={{ textAlign: "center", padding: "30px" }}>
              <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                This will permanently delete the branch and its associated admin account. Are you sure?
              </p>
            </div>
            <div className="br-modal-footer">
              <button className="br-cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="br-delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {resetId && (
        <div className="br-overlay" onClick={() => setResetId(null)}>
          <div className="br-modal br-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="br-modal-header">
              <h2>Reset Admin Password</h2>
              <button className="br-modal-close" onClick={() => setResetId(null)}><X size={20} /></button>
            </div>
            <div className="br-modal-body" style={{ padding: "24px" }}>
              <div className="br-form-group">
                <label>New Password <span className="br-req">*</span></label>
                <input type="password" value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Enter new password" required />
              </div>
            </div>
            <div className="br-modal-footer">
              <button className="br-cancel-btn" onClick={() => setResetId(null)}>Cancel</button>
              <button className="br-save-btn" onClick={handleResetPassword}>Reset Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, badge }) {
  if (!value && value !== 0) return null;
  return (
    <div className="br-detail-row">
      <span className="br-detail-label">{label}</span>
      <span className="br-detail-value">
        {badge ? <span className={`br-status br-${(value || "").toLowerCase()}`}>{value}</span> : value}
      </span>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="br-detail-section br-detail-full">
      <h4><Icon size={16} /> {title}</h4>
      {children}
    </div>
  );
}

function MiniTable({ headers, children }) {
  return (
    <div className="br-detail-table-wrap">
      <table className="br-detail-table">
        <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default Branches;
