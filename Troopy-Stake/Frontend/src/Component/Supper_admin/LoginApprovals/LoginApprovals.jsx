import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, LogIn, Clock, CheckCircle, XCircle } from "lucide-react";
import { loginApprovalService } from "../../../services/loginApprovalService";
import LoginApprovalModal from "./LoginApprovalModal";
import "../Finance/Finance.css";

export default function LoginApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [actionOpen, setActionOpen] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchStats = useCallback(async () => {
    try { const res = await loginApprovalService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await loginApprovalService.getAll(params);
      setApprovals(res.data.loginApprovals || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      await loginApprovalService.create(data);
      addToast("Login approval request created");
      fetchApprovals();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create", "error");
      return false;
    }
  };

  const handleApprove = async (id) => {
    try {
      await loginApprovalService.approve(id);
      addToast("Login request approved");
      setActionOpen(null);
      fetchApprovals();
      fetchStats();
    } catch (err) { addToast("Failed to approve", "error"); }
  };

  const handleReject = async (id) => {
    try {
      await loginApprovalService.reject(id);
      addToast("Login request rejected");
      setActionOpen(null);
      fetchApprovals();
      fetchStats();
    } catch (err) { addToast("Failed to reject", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this login approval record?")) return;
    try {
      await loginApprovalService.delete(id);
      addToast("Login approval deleted");
      setActionOpen(null);
      fetchApprovals();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: "fin-badge-pending",
      Approved: "fin-badge-approved",
      Rejected: "fin-badge-rejected",
    };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatDateTime = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Login Approvals</h1>
          <p className="fin-subtitle">Approve or reject user login requests</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> New Login Request</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><LogIn size={18} color="#4f46e5" /><span className="fin-stat-label">Total Requests</span></div>
          <h3 className="fin-stat-value">{stats.total}</h3>
          <span className="fin-stat-sub">All login requests</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Pending</span></div>
          <h3 className="fin-stat-value">{stats.pending}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Approved</span></div>
          <h3 className="fin-stat-value">{stats.approved}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><XCircle size={18} color="#dc2626" /><span className="fin-stat-label">Rejected</span></div>
          <h3 className="fin-stat-value">{stats.rejected}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search login requests..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
                <th>User</th>
                <th>Login Time</th>
                <th>IP</th>
                <th>Device</th>
                <th>Browser</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="fin-empty">Loading...</td></tr>
              ) : approvals.length === 0 ? (
                <tr><td colSpan={7} className="fin-empty">No login requests found.</td></tr>
              ) : approvals.map((a) => (
                <tr key={a._id}>
                  <td className="fin-name-cell">{a.userId?.name || a.userId?._id?.slice(-6) || "-"}</td>
                  <td>{a.loginTime ? formatDateTime(a.loginTime) : "-"}</td>
                  <td>{a.ipAddress || "-"}</td>
                  <td>{a.device || "-"}</td>
                  <td>{a.browser || "-"}</td>
                  <td>{getStatusBadge(a.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === a._id ? null : a._id)}>•••</button>
                      {actionOpen === a._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setViewing(a); setActionOpen(null); }}>
                            View Details
                          </button>
                          {a.status === "Pending" && (
                            <>
                              <button style={{ color: "#059669" }} onClick={() => handleApprove(a._id)}>
                                <CheckCircle size={15} /> Approve
                              </button>
                              <button style={{ color: "#dc2626" }} onClick={() => handleReject(a._id)}>
                                <XCircle size={15} /> Reject
                              </button>
                            </>
                          )}
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

      {showModal && <LoginApprovalModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      {viewing && (
        <LoginApprovalModal
          show={!!viewing}
          onClose={() => setViewing(null)}
          onSave={handleSave}
          editing={viewing}
          readOnly
        />
      )}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
