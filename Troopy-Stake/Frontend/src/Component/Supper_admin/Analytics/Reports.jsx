import React, { useEffect, useState } from "react";
import { FileText, BarChart3, Download } from "lucide-react";
import { leadService } from "../../../services/leadService";
import { studentService } from "../../../services/studentService";
import { api } from "../../../api/axiosClient";
import "../Finance/Finance.css";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

export default function Reports() {
  const [leads, setLeads] = useState([]);
  const [students, setStudents] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [leadRes, stuRes, fupRes] = await Promise.all([
          leadService.getAll({ limit: 10000 }),
          studentService.getAll({ limit: 10000 }).catch(() => ({ data: { students: [] } })),
          api.get("/follow-ups", { limit: 50 }).catch(() => ({ data: { data: [] } })),
        ]);
        setLeads(leadRes.data.leads || leadRes.data || []);
        setStudents(stuRes.data.students || stuRes.data || []);
        setFollowUps(fupRes.data?.data || fupRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredLeads = leads.filter((l) => {
    if (!startDate && !endDate) return true;
    const d = new Date(l.createdAt);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    return true;
  });

  const totalLeads = filteredLeads.length;
  const totalStudents = students.length;
  const totalFollowUps = followUps.length;
  const conversions = filteredLeads.filter((l) => l.status === "Converted").length;

  const recentActivity = [
    ...filteredLeads.slice(0, 10).map((l) => ({ type: "Lead", desc: `${l.name || "Unknown"} - ${l.status || "New"}`, date: l.createdAt })),
    ...followUps.slice(0, 10).map((f) => ({ type: "Follow-up", desc: f.note || f.description || "Follow-up activity", date: f.createdAt || f.date })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  const handleDownloadCSV = () => {
    const rows = [
      ["Type", "Description", "Date"],
      ...recentActivity.map((a) => [a.type, a.desc, formatDate(a.date)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="fin-page">
        <div className="fin-header"><h1>Reports</h1></div>
        <p style={{ color: "#98a2b3" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Reports</h1>
          <p className="fin-subtitle">Generate and view activity reports</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={handleDownloadCSV}><Download size={18} /> Download Report</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><FileText size={18} color="#4f46e5" /><span className="fin-stat-label">Total Leads</span></div>
          <h3 className="fin-stat-value">{totalLeads}</h3>
          <span className="fin-stat-sub">{leads.length} total without filter</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><BarChart3 size={18} color="#059669" /><span className="fin-stat-label">Total Students</span></div>
          <h3 className="fin-stat-value">{totalStudents}</h3>
          <span className="fin-stat-sub">Enrolled students</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><FileText size={18} color="#d97706" /><span className="fin-stat-label">Follow-ups</span></div>
          <h3 className="fin-stat-value">{totalFollowUps}</h3>
          <span className="fin-stat-sub">Total follow-ups</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><BarChart3 size={18} color="#14b8a6" /><span className="fin-stat-label">Conversions</span></div>
          <h3 className="fin-stat-value">{conversions}</h3>
          <span className="fin-stat-sub">{totalLeads ? ((conversions / totalLeads) * 100).toFixed(1) : 0}% rate</span>
        </div>
      </div>

      <div className="fin-table-card" style={{ marginBottom: 24 }}>
        <div className="fin-table-filters">
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#101828" }}>Date Range Filter</h3>
          <div className="fin-filter-group">
            <label style={{ fontSize: 13, color: "#667085" }}>From:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, outline: "none" }} />
            <label style={{ fontSize: 13, color: "#667085" }}>To:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, outline: "none" }} />
            {(startDate || endDate) && (
              <button className="fin-clear-btn" onClick={() => { setStartDate(""); setEndDate(""); }}>Clear</button>
            )}
          </div>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#101828" }}>Recent Activity</h3>
        </div>
        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 ? (
                <tr><td colSpan={4} className="fin-empty">No activity found for the selected range.</td></tr>
              ) : (
                recentActivity.map((a, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><span className={`fin-badge ${a.type === "Lead" ? "fin-badge-paid" : "fin-badge-partial"}`}>{a.type}</span></td>
                    <td className="fin-name-cell">{a.desc}</td>
                    <td>{formatDate(a.date)}</td>
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
