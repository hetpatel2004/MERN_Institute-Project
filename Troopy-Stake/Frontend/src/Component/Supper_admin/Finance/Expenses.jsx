import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, IndianRupee, CheckCircle, Clock, X, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { expenseService } from "../../../services/expenseService";
import ExpenseModal from "./ExpenseModal";
import "./Finance.css";

const CATEGORIES = ["Office Rent", "Salary", "Electricity", "Internet", "Marketing", "Software", "Hardware", "Maintenance", "Miscellaneous"];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ totalExpenses: 0, approvedExpenses: 0, pendingExpenses: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
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
    try { const res = await expenseService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category = filterCategory;
      const res = await expenseService.getAll(params);
      setExpenses(res.data.expenses || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus, filterCategory]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
  useEffect(() => { setPage(1); }, [search, filterStatus, filterCategory]);

  const handleSave = async (data, id) => {
    try {
      if (id) await expenseService.update(id, data);
      else await expenseService.create(data);
      addToast(id ? "Expense updated" : "Expense created");
      fetchExpenses();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await expenseService.delete(id);
      addToast("Expense deleted");
      setActionOpen(null);
      fetchExpenses();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const handleApprove = async (id) => {
    try { await expenseService.approve(id); addToast("Expense approved"); fetchExpenses(); fetchStats(); setActionOpen(null); } catch (err) { addToast("Failed to approve", "error"); }
  };

  const handleReject = async (id) => {
    try { await expenseService.reject(id); addToast("Expense rejected"); fetchExpenses(); fetchStats(); setActionOpen(null); } catch (err) { addToast("Failed to reject", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = { Approved: "fin-badge-approved", Pending: "fin-badge-pending", Rejected: "fin-badge-rejected" };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Expenses Management</h1>
          <p className="fin-subtitle">Track and manage institute expenses</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Expense</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><IndianRupee size={18} color="#4f46e5" /><span className="fin-stat-label">Total Expenses</span></div>
          <h3 className="fin-stat-value">{stats.totalExpenses}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Approved</span></div>
          <h3 className="fin-stat-value">{stats.approvedExpenses}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Pending</span></div>
          <h3 className="fin-stat-value">{stats.pendingExpenses}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><IndianRupee size={18} color="#dc2626" /><span className="fin-stat-label">Total Amount</span></div>
          <h3 className="fin-stat-value">{formatCurrency(stats.totalAmount)}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {(search || filterStatus || filterCategory) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterStatus(""); setFilterCategory(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="fin-empty">Loading...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={8} className="fin-empty">No expenses found.</td></tr>
              ) : expenses.map((e) => (
                <tr key={e._id}>
                  <td className="fin-name-cell">{e.title}</td>
                  <td><span className="fin-badge" style={{ background: "#f0fdf4", color: "#16a34a" }}>{e.category}</span></td>
                  <td><strong>{formatCurrency(e.amount)}</strong></td>
                  <td>{e.vendorName || "-"}</td>
                  <td>{formatDate(e.expenseDate)}</td>
                  <td>{getStatusBadge(e.status)}</td>
                  <td>{e.createdBy?.name || "-"}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === e._id ? null : e._id)}>•••</button>
                      {actionOpen === e._id && (
                        <div className="fin-dropdown">
                          {e.status === "Pending" && (
                            <>
                              <button onClick={() => handleApprove(e._id)}><ThumbsUp size={15} /> Approve</button>
                              <button onClick={() => handleReject(e._id)}><ThumbsDown size={15} /> Reject</button>
                            </>
                          )}
                          <button onClick={() => { setEditing(e); setShowModal(true); setActionOpen(null); }}>Edit</button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(e._id)}>Delete</button>
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

      {showModal && <ExpenseModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
