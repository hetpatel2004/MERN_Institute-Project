import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, Users, UserCheck, UserX, X, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";
import { studentService } from "../../../services/studentService";
import StudentModal from "./StudentModal";
import "../Finance/Finance.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionOpen, setActionOpen] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchStats = useCallback(async () => {
    try { const res = await studentService.getAll({ limit: 1 }); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await studentService.getAll(params);
      setStudents(res.data.students || res.data);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await studentService.update(id, data);
      else await studentService.create(data);
      addToast(id ? "Student updated" : "Student created");
      fetchStudents();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await studentService.delete(id);
      addToast("Student deleted");
      setActionOpen(null);
      fetchStudents();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = { Active: "fin-badge-paid", Inactive: "fin-badge-pending", Blocked: "fin-badge-overdue" };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Students Management</h1>
          <p className="fin-subtitle">Manage all registered students</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Student</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Users size={18} color="#4f46e5" /><span className="fin-stat-label">Total</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All students</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><UserCheck size={18} color="#059669" /><span className="fin-stat-label">Active</span></div>
          <h3 className="fin-stat-value">{stats.active}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><UserX size={18} color="#dc2626" /><span className="fin-stat-label">Inactive</span></div>
          <h3 className="fin-stat-value">{stats.inactive}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
            {(search || filterStatus) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterStatus(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="fin-empty">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={5} className="fin-empty">No students found.</td></tr>
              ) : students.map((s) => (
                <tr key={s._id}>
                  <td className="fin-name-cell">{s.studentName || s.name || "-"}</td>
                  <td>{s.email || "-"}</td>
                  <td>{s.phone || "-"}</td>
                  <td>{getStatusBadge(s.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === s._id ? null : s._id)}>•••</button>
                      {actionOpen === s._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(s); setShowModal(true); setActionOpen(null); }}>
                            <Edit3 size={15} /> Edit
                          </button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fin-pagination">
          <span className="fin-page-info">Showing {Math.min((page - 1) * limit + 1, totalItems)}&ndash;{Math.min(page * limit, totalItems)} of {totalItems}</span>
          <div className="fin-page-btns">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={15} /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, page - 2);
              const p = start + i;
              if (p > totalPages) return null;
              return <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>;
            })}
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>

      {showModal && <StudentModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
