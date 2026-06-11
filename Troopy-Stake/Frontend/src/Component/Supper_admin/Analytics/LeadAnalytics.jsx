import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import { leadService } from "../../../services/leadService";
import "../Finance/Finance.css";

export default function LeadAnalytics() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await leadService.getAll({ limit: 10000 });
        setLeads(res.data.leads || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const total = leads.length;
  const converted = leads.filter((l) => l.status === "Converted").length;
  const lost = leads.filter((l) => l.status === "Lost").length;
  const active = leads.filter((l) => l.status === "Active" || l.status === "New").length;

  const sourceMap = {};
  const courseMap = {};
  leads.forEach((l) => {
    const src = l.source || "Unknown";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
    const course = l.courseId?.name || l.course || "Unknown";
    courseMap[course] = (courseMap[course] || 0) + 1;
  });

  const sourceData = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]);
  const courseData = Object.entries(courseMap).sort((a, b) => b[1] - a[1]);
  const maxSource = sourceData[0]?.[1] || 1;
  const maxCourse = courseData[0]?.[1] || 1;

  const barColor = (i) =>
    ["#4f46e5", "#059669", "#d97706", "#dc2626", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6"][i % 8];

  if (loading) {
    return (
      <div className="fin-page">
        <div className="fin-header"><h1>Lead Analytics</h1></div>
        <p style={{ color: "#98a2b3" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Lead Analytics</h1>
          <p className="fin-subtitle">Real-time lead performance overview</p>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Users size={18} color="#4f46e5" /><span className="fin-stat-label">Total Leads</span></div>
          <h3 className="fin-stat-value">{total}</h3>
          <span className="fin-stat-sub">All time leads</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Target size={18} color="#059669" /><span className="fin-stat-label">Converted</span></div>
          <h3 className="fin-stat-value">{converted}</h3>
          <span className="fin-stat-sub">{total ? ((converted / total) * 100).toFixed(1) : 0}% rate</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><TrendingUp size={18} color="#d97706" /><span className="fin-stat-label">Active</span></div>
          <h3 className="fin-stat-value">{active}</h3>
          <span className="fin-stat-sub">Active / New leads</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><BarChart3 size={18} color="#dc2626" /><span className="fin-stat-label">Lost</span></div>
          <h3 className="fin-stat-value">{lost}</h3>
          <span className="fin-stat-sub">{total ? ((lost / total) * 100).toFixed(1) : 0}% rate</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="fin-table-card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#101828" }}>By Source</h3>
          {sourceData.length === 0 ? (
            <p style={{ color: "#98a2b3", fontSize: 14 }}>No data</p>
          ) : (
            sourceData.map(([src, count], i) => (
              <div key={src} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#344054", marginBottom: 4 }}>
                  <span>{src}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ background: "#f2f4f7", borderRadius: 6, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${(count / maxSource) * 100}%`, background: barColor(i), height: 8, borderRadius: 6 }} />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="fin-table-card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#101828" }}>By Course</h3>
          {courseData.length === 0 ? (
            <p style={{ color: "#98a2b3", fontSize: 14 }}>No data</p>
          ) : (
            courseData.map(([course, count], i) => (
              <div key={course} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#344054", marginBottom: 4 }}>
                  <span>{course}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ background: "#f2f4f7", borderRadius: 6, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${(count / maxCourse) * 100}%`, background: barColor(i), height: 8, borderRadius: 6 }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#101828" }}>Lead Breakdown</h3>
        </div>
        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={7} className="fin-empty">No leads found.</td></tr>
              ) : (
                leads.map((l, i) => (
                  <tr key={l._id || i}>
                    <td>{i + 1}</td>
                    <td className="fin-name-cell">{l.name || "-"}</td>
                    <td>{l.email || "-"}</td>
                    <td>{l.phone || "-"}</td>
                    <td>{l.source || "-"}</td>
                    <td>{l.courseId?.name || l.course || "-"}</td>
                    <td><span className={`fin-badge ${l.status === "Converted" ? "fin-badge-paid" : l.status === "Lost" ? "fin-badge-rejected" : "fin-badge-partial"}`}>{l.status}</span></td>
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
