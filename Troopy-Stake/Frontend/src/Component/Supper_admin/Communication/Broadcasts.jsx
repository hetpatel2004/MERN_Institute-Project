import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, Send, FileText, Clock, CheckCircle, X, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { broadcastService } from "../../../services/broadcastService";
import BroadcastModal from "./BroadcastModal";
import "../Finance/Finance.css";

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [stats, setStats] = useState({ total: 0, draft: 0, scheduled: 0, sent: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
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
    try { const res = await broadcastService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchBroadcasts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterChannel) params.channel = filterChannel;
      const res = await broadcastService.getAll(params);
      setBroadcasts(res.data.broadcasts || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus, filterChannel]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchBroadcasts(); }, [fetchBroadcasts]);
  useEffect(() => { setPage(1); }, [search, filterStatus, filterChannel]);

  const handleSave = async (data, id) => {
    try {
      if (id) await broadcastService.update(id, data);
      else await broadcastService.create(data);
      addToast(id ? "Broadcast updated" : "Broadcast created");
      fetchBroadcasts();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this broadcast?")) return;
    try {
      await broadcastService.delete(id);
      addToast("Broadcast deleted");
      setActionOpen(null);
      fetchBroadcasts();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = { Draft: "fin-badge-pending", Scheduled: "fin-badge-partial", Sent: "fin-badge-paid", Failed: "fin-badge-overdue" };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Broadcast Management</h1>
          <p className="fin-subtitle">Create and manage broadcast messages across channels</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> New Broadcast</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Send size={18} color="#4f46e5" /><span className="fin-stat-label">Total</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All broadcasts</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><FileText size={18} color="#d97706" /><span className="fin-stat-label">Draft</span></div>
          <h3 className="fin-stat-value">{stats.draft}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#2563eb" /><span className="fin-stat-label">Scheduled</span></div>
          <h3 className="fin-stat-value">{stats.scheduled}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Sent</span></div>
          <h3 className="fin-stat-value">{stats.sent}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search broadcasts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)}>
              <option value="">All Channels</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
              <option value="In-App">In-App</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Sent">Sent</option>
              <option value="Failed">Failed</option>
            </select>
            {(search || filterStatus || filterChannel) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterStatus(""); setFilterChannel(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Scheduled At</th>
                <th>Sent At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="fin-empty">Loading...</td></tr>
              ) : broadcasts.length === 0 ? (
                <tr><td colSpan={6} className="fin-empty">No broadcasts found.</td></tr>
              ) : broadcasts.map((b) => (
                <tr key={b._id}>
                  <td className="fin-name-cell">{b.title}</td>
                  <td><span className="fin-badge" style={{ background: "#eff6ff", color: "#2563eb" }}>{b.channel}</span></td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>{b.scheduledAt ? formatDate(b.scheduledAt) : "-"}</td>
                  <td>{b.sentAt ? formatDate(b.sentAt) : "-"}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === b._id ? null : b._id)}>•••</button>
                      {actionOpen === b._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(b); setShowModal(true); setActionOpen(null); }}>
                            <MessageSquare size={15} /> Edit
                          </button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(b._id)}>Delete</button>
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

      {showModal && <BroadcastModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
