import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, X, ChevronLeft, ChevronRight, FileText, CheckCircle, Clock } from "lucide-react";
import { dailyReportService } from "../../../services/dailyReportService";
import DailyReportModal from "./DailyReportModal";
import "../Finance/Finance.css";

export default function DailyReports() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, submitted: 0, approved: 0 });
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
    try { const res = await dailyReportService.getStats(); setStats(res.data || {}); } catch (err) { console.error(err); }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await dailyReportService.getAll(params);
      setReports(res.data.dailyReports || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchReports(); }, [fetchReports]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await dailyReportService.update(id, data);
      else await dailyReportService.create(data);
      addToast(id ? "Daily report updated" : "Daily report created");
      fetchReports();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await dailyReportService.delete(id);
      addToast("Daily report deleted");
      setActionOpen(null);
      fetchReports();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (s) => {
    const map = { Draft: "fin-badge-pending", Submitted: "fin-badge-partial", Approved: "fin-badge-approved" };
    return <span className={`fin-badge ${map[s] || ""}`}>{s}</span>;
  };

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Daily Reports</h1>
          <p className="fin-subtitle">Track daily activities and performance</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Report</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><FileText size={18} color="#4f46e5" /><span className="fin-stat-label">Total Reports</span></div>
          <h3 className="fin-stat-value">{stats.total || 0}</h3>
          <span className="fin-stat-sub">All reports</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Submitted</span></div>
          <h3 className="fin-stat-value">{stats.submitted || 0}</h3>
          <span className="fin-stat-sub">Awaiting approval</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Approved</span></div>
          <h3 className="fin-stat-value">{stats.approved || 0}</h3>
          <span className="fin-stat-sub">Approved reports</span>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
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
                <th>Date</th>
                <th>Summary</th>
                <th>Leads</th>
                <th>Admissions</th>
                <th>Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="fin-empty">Loading...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={7} className="fin-empty">No daily reports found.</td></tr>
              ) : reports.map((r) => (
                <tr key={r._id}>
                  <td className="fin-name-cell">{formatDate(r.reportDate)}</td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.summary || "-"}</td>
                  <td>{r.leadsGenerated || 0}</td>
                  <td>{r.admissionsDone || 0}</td>
                  <td>{formatCurrency(r.feesCollected)}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === r._id ? null : r._id)}>•••</button>
                      {actionOpen === r._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(r); setShowModal(true); setActionOpen(null); }}>Edit</button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(r._id)}>Delete</button>
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

      {showModal && <DailyReportModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
