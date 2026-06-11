import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Calendar, ClipboardList, PlayCircle, CheckCircle } from "lucide-react";
import { examService } from "../../../services/examService";
import ExamModal from "./ExamModal";
import "../Finance/Finance.css";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, ongoing: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
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
    try { const res = await examService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const res = await examService.getAll(params);
      setExams(res.data.exams || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterType, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchExams(); }, [fetchExams]);
  useEffect(() => { setPage(1); }, [search, filterType, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await examService.update(id, data);
      else await examService.create(data);
      addToast(id ? "Exam updated" : "Exam created");
      fetchExams();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await examService.delete(id);
      addToast("Exam deleted");
      setActionOpen(null);
      fetchExams();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = {
      Upcoming: "fin-badge-pending",
      Ongoing: "fin-badge-partial",
      Completed: "fin-badge-paid",
      Cancelled: "fin-badge-cancelled",
    };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Exams Management</h1>
          <p className="fin-subtitle">Manage exams, schedules & results</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Exam</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><ClipboardList size={18} color="#4f46e5" /><span className="fin-stat-label">Total Exams</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All exams</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Calendar size={18} color="#d97706" /><span className="fin-stat-label">Upcoming</span></div>
          <h3 className="fin-stat-value">{stats.upcoming}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><PlayCircle size={18} color="#3b82f6" /><span className="fin-stat-label">Ongoing</span></div>
          <h3 className="fin-stat-value">{stats.ongoing}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Completed</span></div>
          <h3 className="fin-stat-value">{stats.completed}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
              <option value="Practical">Practical</option>
              <option value="Viva">Viva</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {(search || filterType || filterStatus) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterType(""); setFilterStatus(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="fin-empty">Loading...</td></tr>
              ) : exams.length === 0 ? (
                <tr><td colSpan={6} className="fin-empty">No exams found.</td></tr>
              ) : exams.map((e) => (
                <tr key={e._id}>
                  <td className="fin-name-cell">{e.title || "-"}</td>
                  <td>{e.type || "-"}</td>
                  <td>{formatDate(e.examDate)}</td>
                  <td>{e.totalMarks || "-"}</td>
                  <td>{getStatusBadge(e.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === e._id ? null : e._id)}>•••</button>
                      {actionOpen === e._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(e); setShowModal(true); setActionOpen(null); }}>
                            Edit
                          </button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(e._id)}>
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

      {showModal && <ExamModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
