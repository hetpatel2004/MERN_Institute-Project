import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, IndianRupee, CheckCircle, Clock, AlertTriangle, X, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { invoiceService } from "../../../services/invoiceService";
import InvoiceModal from "./InvoiceModal";
import "./Finance.css";

const INVOICE_TYPES = ["Fee", "Installment", "Registration", "Additional Service"];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ totalInvoices: 0, paidInvoices: 0, pendingInvoices: 0, overdueInvoices: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
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
    try { const res = await invoiceService.getStats(); setStats(res.data); } catch (err) { console.error(err); }
  }, []);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.invoiceType = filterType;
      const res = await invoiceService.getAll(params);
      setInvoices(res.data.invoices || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterStatus, filterType]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);
  useEffect(() => { setPage(1); }, [search, filterStatus, filterType]);

  const handleSave = async (data, id) => {
    try {
      if (id) await invoiceService.update(id, data);
      else await invoiceService.create(data);
      addToast(id ? "Invoice updated" : "Invoice created");
      fetchInvoices();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await invoiceService.delete(id);
      addToast("Invoice deleted");
      setActionOpen(null);
      fetchInvoices();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getStatusBadge = (status) => {
    const map = { Paid: "fin-badge-paid", Pending: "fin-badge-pending", Overdue: "fin-badge-overdue", Cancelled: "fin-badge-cancelled" };
    return <span className={`fin-badge ${map[status] || ""}`}>{status}</span>;
  };

  const formatCurrency = (n) => `₹${(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Invoices Management</h1>
          <p className="fin-subtitle">Generate and manage student invoices</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Create Invoice</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><FileText size={18} color="#4f46e5" /><span className="fin-stat-label">Total Invoices</span></div>
          <h3 className="fin-stat-value">{stats.totalInvoices}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Paid</span></div>
          <h3 className="fin-stat-value">{stats.paidInvoices}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Pending</span></div>
          <h3 className="fin-stat-value">{stats.pendingInvoices}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><AlertTriangle size={18} color="#dc2626" /><span className="fin-stat-label">Overdue</span></div>
          <h3 className="fin-stat-value">{stats.overdueInvoices}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><IndianRupee size={18} color="#101828" /><span className="fin-stat-label">Total Amount</span></div>
          <h3 className="fin-stat-value">{formatCurrency(stats.totalAmount)}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              {INVOICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {(search || filterStatus || filterType) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterStatus(""); setFilterType(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Final Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="fin-empty">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={9} className="fin-empty">No invoices found.</td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv._id}>
                  <td className="fin-name-cell">{inv.invoiceNumber}</td>
                  <td>{inv.studentId?.name || inv.studentId?._id?.slice(-6) || "-"}</td>
                  <td><span className="fin-badge" style={{ background: "#eff6ff", color: "#2563eb" }}>{inv.invoiceType}</span></td>
                  <td>{formatCurrency(inv.amount)}</td>
                  <td>{formatCurrency(inv.tax)}</td>
                  <td><strong>{formatCurrency(inv.finalAmount)}</strong></td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td>{getStatusBadge(inv.status)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === inv._id ? null : inv._id)}>•••</button>
                      {actionOpen === inv._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(inv); setShowModal(true); setActionOpen(null); }}>Edit</button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(inv._id)}>Delete</button>
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

      {showModal && <InvoiceModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
