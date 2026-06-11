import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { attendanceService } from "../../../services/attendanceService";
import AttendanceModal from "./AttendanceModal";
import "../Finance/Finance.css";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });
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
    try { const res = await attendanceService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await attendanceService.getAll(params);
      setAttendance(res.data.attendance || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await attendanceService.update(id, data);
      else await attendanceService.create(data);
      addToast(id ? "Attendance updated" : "Attendance recorded");
      fetchAttendance();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await attendanceService.delete(id);
      addToast("Attendance deleted");
      setActionOpen(null);
      fetchAttendance();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = {
      Present: "fin-badge-paid",
      Absent: "fin-badge-pending",
      Late: "fin-badge-partial",
      "Half Day": "fin-badge-overdue",
      Holiday: "fin-badge-cancelled",
    };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatDateTime = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Attendance Management</h1>
          <p className="fin-subtitle">Track attendance for all users</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Attendance</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Calendar size={18} color="#4f46e5" /><span className="fin-stat-label">Total Records</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All attendance records</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Present</span></div>
          <h3 className="fin-stat-value">{stats.present}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><XCircle size={18} color="#dc2626" /><span className="fin-stat-label">Absent</span></div>
          <h3 className="fin-stat-value">{stats.absent}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Late</span></div>
          <h3 className="fin-stat-value">{stats.late}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search attendance..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
              <option value="Holiday">Holiday</option>
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
                <th>User ID</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="fin-empty">Loading...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan={6} className="fin-empty">No attendance records found.</td></tr>
              ) : attendance.map((a) => (
                <tr key={a._id}>
                  <td className="fin-name-cell">{a.userId?.name || a.userId?._id?.slice(-6) || "-"}</td>
                  <td>{formatDate(a.date)}</td>
                  <td>{a.checkIn ? formatDateTime(a.checkIn) : "-"}</td>
                  <td>{a.checkOut ? formatDateTime(a.checkOut) : "-"}</td>
                  <td>{getStatusBadge(a.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === a._id ? null : a._id)}>•••</button>
                      {actionOpen === a._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(a); setShowModal(true); setActionOpen(null); }}>
                            Edit
                          </button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(a._id)}>
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

      {showModal && <AttendanceModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
