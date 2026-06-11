import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, BookOpen, Activity, X, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";
import { programService } from "../../../services/programService";
import ProgramModal from "./ProgramModal";
import "../Finance/Finance.css";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
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
    try { const res = await programService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await programService.getAll(params);
      setPrograms(res.data.programs || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await programService.update(id, data);
      else await programService.create(data);
      addToast(id ? "Program updated" : "Program created");
      fetchPrograms();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await programService.delete(id);
      addToast("Program deleted");
      setActionOpen(null);
      fetchPrograms();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = { Active: "fin-badge-paid", Inactive: "fin-badge-pending" };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString()}`;

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Programs Management</h1>
          <p className="fin-subtitle">Manage academic programs and courses</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Program</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><BookOpen size={18} color="#4f46e5" /><span className="fin-stat-label">Total</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All programs</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Activity size={18} color="#059669" /><span className="fin-stat-label">Active</span></div>
          <h3 className="fin-stat-value">{stats.active}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <th>Duration</th>
                <th>Courses</th>
                <th>Total Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="fin-empty">Loading...</td></tr>
              ) : programs.length === 0 ? (
                <tr><td colSpan={6} className="fin-empty">No programs found.</td></tr>
              ) : programs.map((p) => (
                <tr key={p._id}>
                  <td className="fin-name-cell">{p.name}</td>
                  <td>{p.duration || `${p.durationMonths || 0} months`}</td>
                  <td>{p.courses?.length || 0}</td>
                  <td>{formatCurrency(p.totalFees)}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === p._id ? null : p._id)}>•••</button>
                      {actionOpen === p._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(p); setShowModal(true); setActionOpen(null); }}>
                            <Edit3 size={15} /> Edit
                          </button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(p._id)}>Delete</button>
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

      {showModal && <ProgramModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
