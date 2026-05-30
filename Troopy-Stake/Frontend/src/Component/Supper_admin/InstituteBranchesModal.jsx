import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Plus, X, Eye, Pencil, Trash2, Power, KeyRound, Search, User, School, Shield, Users, GraduationCap, Target, MessageCircle, Layers, BookOpen } from "lucide-react";
import BranchTable from "./BranchTable";

const API = "http://localhost:5000/api/branches";
const defaultForm = {
  instituteId: "", branchName: "", branchCode: "", city: "", state: "",
  address: "", phone: "", email: "", status: "Active",
  adminName: "", adminEmail: "", adminPhone: "", adminPassword: "", adminConfirm: "",
};

function InstituteBranchesModal({ instituteId, instituteName, onClose }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionOpen, setActionOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [resetId, setResetId] = useState(null);
  const [resetPassword, setResetPassword] = useState("");

  useEffect(() => { fetchBranches(); }, [instituteId]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}?instituteId=${instituteId}&limit=100`);
      setBranches(res.data.branches || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleView = async (b) => {
    try {
      const res = await axios.get(`${API}/${b._id}`);
      setViewItem(res.data);
    } catch (err) { alert("Failed to load branch details"); }
  };

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
    setShowForm(true);
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
      setShowForm(false);
      setEditing(null);
      setForm(defaultForm);
      fetchBranches();
    } catch (err) { alert(err.response?.data?.message || "Operation failed"); }
  };

  const filtered = branches.filter((b) =>
    !search || b.branchName?.toLowerCase().includes(search.toLowerCase()) || b.branchCode?.toLowerCase().includes(search.toLowerCase()) || b.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inst-overlay" onClick={onClose}>
      <div className="inst-modal inst-modal-wide" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 1100 }}>
        <div className="inst-modal-header">
          <h2><Building2 size={20} /> Branches - {instituteName}</h2>
          <button className="inst-modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="inst-modal-body">
          <div className="br-filters" style={{ marginBottom: 16 }}>
            <div className="br-search-box" style={{ flex: 1 }}>
              <Search size={16} />
              <input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <X size={16} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
            </div>
            <button className="br-add-btn" onClick={() => { setForm({ ...defaultForm, instituteId }); setEditing(null); setShowForm(true); }}>
              <Plus size={18} /> Add Branch
            </button>
          </div>

          <BranchTable
            branches={filtered}
            loading={loading}
            actionOpen={actionOpen}
            setActionOpen={setActionOpen}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(b) => setDeleteId(b._id)}
            onToggleStatus={handleToggleStatus}
            onResetPassword={(b) => { setResetId(b._id); setResetPassword(""); }}
            emptyMessage="No branches found for this institute"
          />
        </div>

        {showForm && (
          <div className="inst-overlay" onClick={() => setShowForm(false)} style={{ position: "absolute" }}>
            <div className="br-modal br-modal-wide" onClick={(e) => e.stopPropagation()}>
              <div className="br-modal-header">
                <h2>{editing ? "Edit Branch" : "Add Branch"} - {instituteName}</h2>
                <button className="br-modal-close" onClick={() => { setShowForm(false); setEditing(null); }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="br-modal-body">
                  <h4 className="br-section-title"><Building2 size={16} /> Branch Details</h4>
                  <div className="br-form-row">
                    <div className="br-form-group">
                      <label>Institute <span className="br-req">*</span></label>
                      <input value={instituteName} disabled />
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
                  <button type="button" className="br-cancel-btn" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                  <button type="submit" className="br-save-btn">{editing ? "Update" : "Create"} Branch</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewItem && (
          <div className="inst-overlay" onClick={() => setViewItem(null)} style={{ position: "absolute" }}>
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
                            <td>₹{(a.paidAmount || 0).toLocaleString()}</td>
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
          <div className="inst-overlay" onClick={() => setDeleteId(null)} style={{ position: "absolute" }}>
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
          <div className="inst-overlay" onClick={() => setResetId(null)} style={{ position: "absolute" }}>
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

export default InstituteBranchesModal;
