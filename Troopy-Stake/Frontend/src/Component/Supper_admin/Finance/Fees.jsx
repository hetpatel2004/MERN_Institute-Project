import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, IndianRupee, Clock, AlertTriangle, CheckCircle, X, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { feeService } from "../../../services/feeService";
import FeeModal from "./FeeModal";
import PaymentModal from "./PaymentModal";
import "./Finance.css";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState({ totalFees: 0, totalCollected: 0, totalPending: 0, overdueCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentFee, setPaymentFee] = useState(null);
  const [actionOpen, setActionOpen] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchStats = useCallback(async () => {
    try { const res = await feeService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await feeService.getAll(params);
      setFees(res.data.fees || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchFees(); }, [fetchFees]);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await feeService.update(id, data);
      else await feeService.create(data);
      addToast(id ? "Fee record updated" : "Fee record created");
      fetchFees();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    try {
      await feeService.delete(id);
      addToast("Fee record deleted");
      setActionOpen(null);
      fetchFees();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const handleCollectPayment = async (feeId, data) => {
    try {
      const res = await feeService.collectPayment(feeId, data);
      addToast(res.data.message || "Payment collected");
      setShowPayment(false);
      setPaymentFee(null);
      fetchFees();
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const getStatusBadge = (status) => {
    const map = { Paid: "fin-badge-paid", Partial: "fin-badge-partial", Pending: "fin-badge-pending", Overdue: "fin-badge-overdue" };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Fees Management</h1>
          <p className="fin-subtitle">Manage student fees, payments & dues</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Fee Record</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><IndianRupee size={18} color="#4f46e5" /><span className="fin-stat-label">Total Fees</span></div>
          <h3 className="fin-stat-value">{stats.totalFees}</h3>
          <span className="fin-stat-sub">All fee records</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Total Collected</span></div>
          <h3 className="fin-stat-value">{formatCurrency(stats.totalCollected)}</h3>
          <span className="fin-stat-sub">Amount received</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Total Pending</span></div>
          <h3 className="fin-stat-value">{formatCurrency(stats.totalPending)}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><AlertTriangle size={18} color="#dc2626" /><span className="fin-stat-label">Overdue</span></div>
          <h3 className="fin-stat-value">{stats.overdueCount}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search fees..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
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
                <th>Student</th>
                <th>Course</th>
                <th>Total Fees</th>
                <th>Discount</th>
                <th>Final Fees</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="fin-empty">Loading...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={10} className="fin-empty">No fee records found.</td></tr>
              ) : fees.map((f) => (
                <tr key={f._id}>
                  <td className="fin-name-cell">{f.studentId?.name || f.studentId?._id?.slice(-6) || "-"}</td>
                  <td>{f.courseId?.name || "-"}</td>
                  <td>{formatCurrency(f.totalFees)}</td>
                  <td>{formatCurrency(f.discount)}</td>
                  <td><strong>{formatCurrency(f.finalFees)}</strong></td>
                  <td style={{ color: "#059669" }}>{formatCurrency(f.paidAmount)}</td>
                  <td style={{ color: f.pendingAmount > 0 ? "#dc2626" : "#059669" }}>{formatCurrency(f.pendingAmount)}</td>
                  <td>{formatDate(f.dueDate)}</td>
                  <td>{getStatusBadge(f.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === f._id ? null : f._id)}>•••</button>
                      {actionOpen === f._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setPaymentFee(f); setShowPayment(true); setActionOpen(null); }}>
                            <DollarSign size={15} /> Collect Payment
                          </button>
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

      {showModal && <FeeModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}
      {showPayment && <PaymentModal show={showPayment} onClose={() => { setShowPayment(false); setPaymentFee(null); }} onCollect={handleCollectPayment} fee={paymentFee} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
