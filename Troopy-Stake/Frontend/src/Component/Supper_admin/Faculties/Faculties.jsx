import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, Users, UserCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import { facultyService } from "../../../services/facultyService";
import FacultyModal from "./FacultyModal";
import "../Finance/Finance.css";

export default function Faculties() {
  const [faculties, setFaculties] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
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
    try { const res = await facultyService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchFaculties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await facultyService.getAll(params);
      setFaculties(res.data.faculties || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchFaculties(); }, [fetchFaculties]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await facultyService.update(id, data);
      else await facultyService.create(data);
      addToast(id ? "Faculty updated" : "Faculty created");
      fetchFaculties();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty member?")) return;
    try {
      await facultyService.delete(id);
      addToast("Faculty deleted");
      setActionOpen(null);
      fetchFaculties();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    if (status === "Active") return <span className="fin-badge fin-badge-paid">Active</span>;
    return <span className="fin-badge fin-badge-pending">Inactive</span>;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Faculties Management</h1>
          <p className="fin-subtitle">Manage faculty members & their details</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Faculty</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Users size={18} color="#4f46e5" /><span className="fin-stat-label">Total Faculty</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All faculty members</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><UserCheck size={18} color="#059669" /><span className="fin-stat-label">Active</span></div>
          <h3 className="fin-stat-value">{stats.active}</h3>
          <span className="fin-stat-sub">Currently active</span>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search faculties..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
                <th>Specialization</th>
                <th>Qualification</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="fin-empty">Loading...</td></tr>
              ) : faculties.length === 0 ? (
                <tr><td colSpan={7} className="fin-empty">No faculty members found.</td></tr>
              ) : faculties.map((f) => (
                <tr key={f._id}>
                  <td className="fin-name-cell">{f.name || "-"}</td>
                  <td>{f.email || "-"}</td>
                  <td>{f.phone || "-"}</td>
                  <td>{f.specialization || "-"}</td>
                  <td>{f.qualification || "-"}</td>
                  <td>{getStatusBadge(f.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === f._id ? null : f._id)}>•••</button>
                      {actionOpen === f._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(f); setShowModal(true); setActionOpen(null); }}>
                            Edit
                          </button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(f._id)}>
                            Delete
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

        <div className="fin-pagination">
          <span className="fin-page-info">Showing {Math.min((page - 1) * limit + 1, totalItems)}–{Math.min(page * limit, totalItems)} of {totalItems}</span>
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

      {showModal && <FacultyModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
