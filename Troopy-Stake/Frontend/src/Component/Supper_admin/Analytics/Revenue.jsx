import React, { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, BarChart3, Wallet } from "lucide-react";
import { feeService } from "../../../services/feeService";
import { invoiceService } from "../../../services/invoiceService";
import "../Finance/Finance.css";

const formatCurrency = (n) => `₹${(n || 0).toLocaleString()}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

export default function Revenue() {
  const [feeStats, setFeeStats] = useState({ totalFees: 0, totalCollected: 0, totalPending: 0, overdueCount: 0 });
  const [invoiceStats, setInvoiceStats] = useState({ totalInvoiced: 0, paidCount: 0, pendingCount: 0, overdueCount: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [feeRes, invRes, payRes] = await Promise.all([
          feeService.getStats(),
          invoiceService.getStats().catch(() => ({ data: { totalInvoiced: 0, paidCount: 0, pendingCount: 0, overdueCount: 0 } })),
          feeService.getAll({ limit: 10, status: "Paid" }).catch(() => ({ data: { fees: [] } })),
        ]);
        setFeeStats(feeRes.data);
        setInvoiceStats(invRes.data);
        setRecentPayments(payRes.data.fees || payRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const paidCount = recentPayments.filter((f) => f.status === "Paid").length;
  const pendingCount = recentPayments.filter((f) => f.status === "Pending" || f.status === "Partial").length;
  const overdueCount = recentPayments.filter((f) => f.status === "Overdue").length;
  const totalForBar = paidCount + pendingCount + overdueCount || 1;

  if (loading) {
    return (
      <div className="fin-page">
        <div className="fin-header"><h1>Revenue Dashboard</h1></div>
        <p style={{ color: "#98a2b3" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Revenue Dashboard</h1>
          <p className="fin-subtitle">Track collections, invoices & payments</p>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><IndianRupee size={18} color="#4f46e5" /><span className="fin-stat-label">Total Collected</span></div>
          <h3 className="fin-stat-value">{formatCurrency(feeStats.totalCollected)}</h3>
          <span className="fin-stat-sub">Amount received</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><TrendingUp size={18} color="#d97706" /><span className="fin-stat-label">Total Pending</span></div>
          <h3 className="fin-stat-value">{formatCurrency(feeStats.totalPending)}</h3>
          <span className="fin-stat-sub">Outstanding amount</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><BarChart3 size={18} color="#059669" /><span className="fin-stat-label">Total Invoiced</span></div>
          <h3 className="fin-stat-value">{formatCurrency(invoiceStats.totalInvoiced)}</h3>
          <span className="fin-stat-sub">Invoice total</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Wallet size={18} color="#dc2626" /><span className="fin-stat-label">Overdue Count</span></div>
          <h3 className="fin-stat-value">{feeStats.overdueCount}</h3>
          <span className="fin-stat-sub">Overdue records</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="fin-table-card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#101828" }}>Status Distribution</h3>
          <div style={{ display: "flex", gap: 4, height: 40, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
            {paidCount > 0 && <div style={{ flex: paidCount / totalForBar, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>Paid {paidCount}</div>}
            {pendingCount > 0 && <div style={{ flex: pendingCount / totalForBar, background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>Pending {pendingCount}</div>}
            {overdueCount > 0 && <div style={{ flex: overdueCount / totalForBar, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>Overdue {overdueCount}</div>}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#667085" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#059669", marginRight: 6 }} />Paid: {paidCount}</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#d97706", marginRight: 6 }} />Pending: {pendingCount}</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#dc2626", marginRight: 6 }} />Overdue: {overdueCount}</span>
          </div>
        </div>

        <div className="fin-table-card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600, color: "#101828" }}>Quick Summary</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f2f4f7" }}>
              <span style={{ color: "#667085", fontSize: 13 }}>Total Fees Records</span>
              <span style={{ fontWeight: 600, color: "#101828" }}>{feeStats.totalFees}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f2f4f7" }}>
              <span style={{ color: "#667085", fontSize: 13 }}>Invoices Paid</span>
              <span style={{ fontWeight: 600, color: "#101828" }}>{invoiceStats.paidCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f2f4f7" }}>
              <span style={{ color: "#667085", fontSize: 13 }}>Invoices Pending</span>
              <span style={{ fontWeight: 600, color: "#101828" }}>{invoiceStats.pendingCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span style={{ color: "#667085", fontSize: 13 }}>Invoices Overdue</span>
              <span style={{ fontWeight: 600, color: "#dc2626" }}>{invoiceStats.overdueCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#101828" }}>Recent Payments</h3>
        </div>
        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length === 0 ? (
                <tr><td colSpan={6} className="fin-empty">No recent payments found.</td></tr>
              ) : (
                recentPayments.map((f, i) => (
                  <tr key={f._id || i}>
                    <td className="fin-name-cell">{f.studentId?.name || f.student || "-"}</td>
                    <td>{f.courseId?.name || f.course || "-"}</td>
                    <td>{formatCurrency(f.paidAmount || f.amount)}</td>
                    <td>{formatCurrency(f.paidAmount)}</td>
                    <td>
                      <span className={`fin-badge ${f.status === "Paid" ? "fin-badge-paid" : f.status === "Partial" ? "fin-badge-partial" : f.status === "Overdue" ? "fin-badge-overdue" : "fin-badge-pending"}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>{formatDate(f.paymentDate || f.updatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
