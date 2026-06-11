import React, { useEffect, useState } from "react";
import { Activity, TrendingUp, Target, BarChart3 } from "lucide-react";
import { leadService } from "../../../services/leadService";
import { api } from "../../../api/axiosClient";
import "../Finance/Finance.css";

export default function Performance() {
  const [leads, setLeads] = useState([]);
  const [followUpsCount, setFollowUpsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [leadRes, fupRes] = await Promise.all([
          leadService.getAll({ limit: 10000 }),
          api.get("/follow-ups", { limit: 5 }).catch(() => ({ data: { data: [], total: 0 } })),
        ]);
        setLeads(leadRes.data.leads || leadRes.data || []);
        setFollowUpsCount(fupRes.data?.total ?? fupRes.data?.data?.length ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalLeads = leads.length;
  const convertedCount = leads.filter((l) => l.status === "Converted").length;
  const conversionRate = totalLeads ? ((convertedCount / totalLeads) * 100).toFixed(1) : 0;

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const leadsThisMonth = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const leadsLastMonth = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  }).length;

  const monthDiff = leadsLastMonth ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth * 100).toFixed(1) : "+100";

  if (loading) {
    return (
      <div className="fin-page">
        <div className="fin-header"><h1>Performance Metrics</h1></div>
        <p style={{ color: "#98a2b3" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Performance Metrics</h1>
          <p className="fin-subtitle">Key performance indicators at a glance</p>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Activity size={18} color="#4f46e5" /><span className="fin-stat-label">Total Leads</span></div>
          <h3 className="fin-stat-value">{totalLeads}</h3>
          <span className="fin-stat-sub">All time leads</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><TrendingUp size={18} color="#059669" /><span className="fin-stat-label">Follow-ups</span></div>
          <h3 className="fin-stat-value">{followUpsCount}</h3>
          <span className="fin-stat-sub">Total follow-ups</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Target size={18} color="#d97706" /><span className="fin-stat-label">Conversion Rate</span></div>
          <h3 className="fin-stat-value">{conversionRate}%</h3>
          <span className="fin-stat-sub">{convertedCount} converted</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><BarChart3 size={18} color="#14b8a6" /><span className="fin-stat-label">Leads This Month</span></div>
          <h3 className="fin-stat-value">{leadsThisMonth}</h3>
          <span className="fin-stat-sub">
            {monthDiff.startsWith("+") ? "↑" : "↓"} {monthDiff}% vs last month
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="fin-table-card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#101828" }}>This Month vs Last Month</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 160, padding: "0 20px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#667085", marginBottom: 4 }}>Last Month</span>
              <div style={{ width: "100%", maxWidth: 80, background: "#f2f4f7", borderRadius: "8px 8px 0 0", height: 160, display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", background: "#d97706", borderRadius: "8px 8px 0 0", height: `${Math.min((leadsLastMonth / Math.max(leadsThisMonth, leadsLastMonth, 1)) * 100, 100)}%`, transition: "height 0.3s" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#101828", marginTop: 8 }}>{leadsLastMonth}</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#667085", marginBottom: 4 }}>This Month</span>
              <div style={{ width: "100%", maxWidth: 80, background: "#f2f4f7", borderRadius: "8px 8px 0 0", height: 160, display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", background: "#4f46e5", borderRadius: "8px 8px 0 0", height: `${Math.min((leadsThisMonth / Math.max(leadsThisMonth, leadsLastMonth, 1)) * 100, 100)}%`, transition: "height 0.3s" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#101828", marginTop: 8 }}>{leadsThisMonth}</span>
            </div>
          </div>
        </div>

        <div className="fin-table-card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#101828" }}>Conversion Overview</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#344054", marginBottom: 4 }}>
                <span>Conversion Rate</span>
                <span style={{ fontWeight: 600 }}>{conversionRate}%</span>
              </div>
              <div style={{ background: "#f2f4f7", borderRadius: 6, height: 12, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(conversionRate, 100)}%`, background: "#059669", height: 12, borderRadius: 6 }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#344054", marginBottom: 4 }}>
                <span>Leads Converted</span>
                <span style={{ fontWeight: 600 }}>{convertedCount} / {totalLeads}</span>
              </div>
              <div style={{ background: "#f2f4f7", borderRadius: 6, height: 12, overflow: "hidden" }}>
                <div style={{ width: `${totalLeads ? (convertedCount / totalLeads) * 100 : 0}%`, background: "#4f46e5", height: 12, borderRadius: 6 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
