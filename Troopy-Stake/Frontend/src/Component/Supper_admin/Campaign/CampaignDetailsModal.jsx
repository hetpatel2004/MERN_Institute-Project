import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, ExternalLink, TrendingUp, Users, DollarSign, Target, Calendar } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const API = "http://localhost:5000/api";

const chartColors = ["#4f46e5", "#7c3aed", "#0f766e", "#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#ec4899"];

export default function CampaignDetailsModal({ campaignId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (campaignId) fetchDetails();
  }, [campaignId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/campaigns/${campaignId}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load campaign details", err);
    } finally {
      setLoading(false);
    }
  };

  if (!campaignId) return null;

  const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  const leadsChartData = data ? {
    labels: ["Total Leads", "Interested", "Follow-ups", "Admissions"],
    datasets: [{
      label: "Leads",
      data: [
        data.stats.totalLeads,
        data.stats.interestedLeads,
        data.stats.followUpLeads,
        data.stats.admissions,
      ],
      backgroundColor: ["#4f46e5", "#7c3aed", "#f59e0b", "#10b981"],
      borderRadius: 6,
    }],
  } : null;

  const revenueChartData = data ? {
    labels: ["Revenue", "Campaign Cost", "Profit/Loss"],
    datasets: [{
      label: "Amount (₹)",
      data: [data.stats.revenueGenerated, data.campaign.budget || 0, data.stats.profitLoss],
      backgroundColor: ["#10b981", "#ef4444", data.stats.profitLoss >= 0 ? "#4f46e5" : "#f59e0b"],
      borderRadius: 6,
    }],
  } : null;

  const doughnutData = data ? {
    labels: ["Converted", "Interested", "Follow-up", "New", "Not Interested"],
    datasets: [{
      data: (() => {
        const leads = data.leads || [];
        return [
          leads.filter((l) => l.status === "Converted" || l.status === "Admitted").length,
          leads.filter((l) => l.status === "Interested").length,
          leads.filter((l) => l.status === "Follow-up").length,
          leads.filter((l) => l.status === "New" || l.status === "Contacted").length,
          leads.filter((l) => l.status === "Not Interested").length,
        ];
      })(),
      backgroundColor: ["#10b981", "#7c3aed", "#f59e0b", "#3b82f6", "#ef4444"],
      borderWidth: 0,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { padding: 12, usePointStyle: true, font: { size: 11, weight: "bold" } } } },
    cutout: "65%",
  };

  return (
    <div className="fu-overlay" onClick={onClose}>
      <div
        className="fu-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 900, maxHeight: "95vh" }}
      >
        <div className="fu-modal-header">
          <h2>{data?.campaign?.name || "Campaign Details"}</h2>
          <button className="fu-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !data ? (
          <div className="text-center py-5 text-muted">Failed to load campaign details</div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="cam-detail-tabs">
              {["overview", "leads", "revenue", "timeline"].map((tab) => (
                <button
                  key={tab}
                  className={`cam-detail-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "overview" && "Overview"}
                  {tab === "leads" && "Leads & Admissions"}
                  {tab === "revenue" && "Revenue & ROI"}
                  {tab === "timeline" && "Timeline"}
                </button>
              ))}
            </div>

            <div className="fu-modal-body" style={{ maxHeight: "65vh", overflowY: "auto" }}>

              {/* ─── OVERVIEW TAB ─── */}
              {activeTab === "overview" && (
                <div>
                  {/* Campaign Info Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
                    <div className="cam-stat-card-mini">
                      <Target size={18} color="#4f46e5" />
                      <p>Type</p>
                      <h4>{data.campaign.type}</h4>
                    </div>
                    <div className="cam-stat-card-mini">
                      <Users size={18} color="#7c3aed" />
                      <p>Counsellor</p>
                      <h4>{data.campaign.counsellorId?.name || "Unassigned"}</h4>
                    </div>
                    <div className="cam-stat-card-mini">
                      <Calendar size={18} color="#0f766e" />
                      <p>Duration</p>
                      <h4>{formatDate(data.campaign.startDate)} - {formatDate(data.campaign.endDate)}</h4>
                    </div>
                    <div className="cam-stat-card-mini">
                      <DollarSign size={18} color="#f59e0b" />
                      <p>Budget</p>
                      <h4>{formatCurrency(data.campaign.budget)}</h4>
                    </div>
                  </div>

                  {/* Description */}
                  {data.campaign.description && (
                    <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                      <p style={{ margin: 0, fontSize: 14, color: "#475467" }}>{data.campaign.description}</p>
                    </div>
                  )}

                  {/* Institute / Branch info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#667085", marginBottom: 4 }}>Institute</p>
                      <p style={{ fontWeight: 700, margin: 0 }}>{data.campaign.instituteId?.name || "All Institutes"}</p>
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#667085", marginBottom: 4 }}>Branch</p>
                      <p style={{ fontWeight: 700, margin: 0 }}>{data.campaign.branchId?.branchName || "All Branches"}</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                    <div className="cam-metric-box" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                      <p>Total Leads</p>
                      <h3>{data.stats.totalLeads}</h3>
                    </div>
                    <div className="cam-metric-box" style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}>
                      <p>Admissions</p>
                      <h3>{data.stats.admissions}</h3>
                    </div>
                    <div className="cam-metric-box" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
                      <p>Conversion</p>
                      <h3>{data.stats.conversionRate}%</h3>
                    </div>
                  </div>

                  {/* Chart Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#071739", marginBottom: 12 }}>Lead Funnel</p>
                      <div style={{ height: 200 }}>{leadsChartData && <Bar data={leadsChartData} options={chartOptions} />}</div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#071739", marginBottom: 12 }}>Lead Status Distribution</p>
                      <div style={{ height: 200 }}>{doughnutData && <Doughnut data={doughnutData} options={doughnutOptions} />}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── LEADS TAB ─── */}
              {activeTab === "leads" && (
                <div>
                  <h4 style={{ marginBottom: 14, color: "#071739", fontWeight: 800 }}>
                    Leads Generated ({data.leads.length})
                  </h4>
                  {data.leads.length === 0 ? (
                    <p className="text-muted">No leads linked to this campaign yet</p>
                  ) : (
                    <div className="fu-table-wrap" style={{ border: "1px solid #eef2f6", borderRadius: 12 }}>
                      <table className="fu-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Student</th>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Phone</th>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Status</th>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Follow-up</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.leads.map((lead) => (
                            <tr key={lead._id}>
                              <td style={{ padding: "10px 12px", fontWeight: 600, borderTop: "1px solid #eef2f6" }}>{lead.studentName}</td>
                              <td style={{ padding: "10px 12px", borderTop: "1px solid #eef2f6" }}>{lead.phone}</td>
                              <td style={{ padding: "10px 12px", borderTop: "1px solid #eef2f6" }}>
                                <span className="fu-badge" style={{
                                  background: lead.status === "Converted" || lead.status === "Admitted" ? "#d1fae5" : lead.status === "Interested" ? "#ede9fe" : lead.status === "Follow-up" ? "#fef3c7" : "#f3f4f6",
                                  color: lead.status === "Converted" || lead.status === "Admitted" ? "#047857" : lead.status === "Interested" ? "#7c3aed" : lead.status === "Follow-up" ? "#b45309" : "#475467",
                                  padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                                }}>
                                  {lead.status}
                                </span>
                              </td>
                              <td style={{ padding: "10px 12px", borderTop: "1px solid #eef2f6" }}>{lead.followUpDate ? formatDate(lead.followUpDate) : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Admissions from this campaign */}
                  <h4 style={{ marginTop: 24, marginBottom: 14, color: "#071739", fontWeight: 800 }}>
                    Admissions Converted ({data.admissions.length})
                  </h4>
                  {data.admissions.length === 0 ? (
                    <p className="text-muted">No admissions from this campaign yet</p>
                  ) : (
                    <div className="fu-table-wrap" style={{ border: "1px solid #eef2f6", borderRadius: 12 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Student</th>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Course</th>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Paid</th>
                            <th style={{ padding: "10px 12px", fontSize: 11, textAlign: "left", background: "#f8fafc" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.admissions.map((adm) => (
                            <tr key={adm._id}>
                              <td style={{ padding: "10px 12px", fontWeight: 600, borderTop: "1px solid #eef2f6" }}>{adm.studentName}</td>
                              <td style={{ padding: "10px 12px", borderTop: "1px solid #eef2f6" }}>{adm.courseName || "-"}</td>
                              <td style={{ padding: "10px 12px", borderTop: "1px solid #eef2f6" }}>{formatCurrency(adm.paidAmount)}</td>
                              <td style={{ padding: "10px 12px", borderTop: "1px solid #eef2f6" }}>
                                <span className="fu-badge" style={{
                                  background: adm.status === "Confirmed" ? "#d1fae5" : adm.status === "Pending" ? "#fef3c7" : "#fee2e2",
                                  color: adm.status === "Confirmed" ? "#047857" : adm.status === "Pending" ? "#b45309" : "#b91c1c",
                                  padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                                }}>
                                  {adm.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ─── REVENUE TAB ─── */}
              {activeTab === "revenue" && (
                <div>
                  {/* Revenue Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
                    <div style={{ background: "#f0fdf4", borderRadius: 14, padding: 18, border: "1px solid #bbf7d0" }}>
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#166534", marginBottom: 4 }}>Revenue Generated</p>
                      <h3 style={{ color: "#166534", fontWeight: 900 }}>{formatCurrency(data.stats.revenueGenerated)}</h3>
                    </div>
                    <div style={{ background: "#fef2f2", borderRadius: 14, padding: 18, border: "1px solid #fecaca" }}>
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#991b1b", marginBottom: 4 }}>Campaign Cost</p>
                      <h3 style={{ color: "#991b1b", fontWeight: 900 }}>{formatCurrency(data.campaign.budget)}</h3>
                    </div>
                    <div style={{
                      background: data.stats.profitLoss >= 0 ? "#f0fdf4" : "#fef2f2",
                      borderRadius: 14, padding: 18,
                      border: data.stats.profitLoss >= 0 ? "1px solid #bbf7d0" : "1px solid #fecaca",
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: data.stats.profitLoss >= 0 ? "#166534" : "#991b1b", marginBottom: 4 }}>
                        {data.stats.profitLoss >= 0 ? "Profit" : "Loss"}
                      </p>
                      <h3 style={{ color: data.stats.profitLoss >= 0 ? "#166534" : "#991b1b", fontWeight: 900 }}>
                        {formatCurrency(Math.abs(data.stats.profitLoss))}
                      </h3>
                    </div>
                  </div>

                  {/* ROI Details */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#071739", marginBottom: 12 }}>Revenue vs Cost</p>
                      <div style={{ height: 220 }}>{revenueChartData && <Bar data={revenueChartData} options={chartOptions} />}</div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#071739", marginBottom: 12 }}>ROI Summary</p>
                      <div style={{ padding: "20px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                          <span style={{ color: "#667085", fontWeight: 600 }}>ROI</span>
                          <span style={{ fontWeight: 900, fontSize: 24, color: data.stats.profitLoss >= 0 ? "#10b981" : "#ef4444" }}>
                            {data.campaign.budget > 0
                              ? `${((data.stats.revenueGenerated - data.campaign.budget) / data.campaign.budget * 100).toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                          <span style={{ color: "#667085", fontWeight: 600 }}>Cost per Lead</span>
                          <span style={{ fontWeight: 800 }}>
                            {data.stats.totalLeads > 0 ? formatCurrency(data.campaign.budget / data.stats.totalLeads) : "N/A"}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                          <span style={{ color: "#667085", fontWeight: 600 }}>Cost per Admission</span>
                          <span style={{ fontWeight: 800 }}>
                            {data.stats.admissions > 0 ? formatCurrency(data.campaign.budget / data.stats.admissions) : "N/A"}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#667085", fontWeight: 600 }}>Revenue per Lead</span>
                          <span style={{ fontWeight: 800 }}>
                            {data.stats.totalLeads > 0 ? formatCurrency(data.stats.revenueGenerated / data.stats.totalLeads) : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TIMELINE TAB ─── */}
              {activeTab === "timeline" && (
                <div>
                  <h4 style={{ marginBottom: 14, color: "#071739", fontWeight: 800 }}>Campaign Timeline</h4>
                  {data.timeline.length === 0 ? (
                    <p className="text-muted">No activity recorded yet</p>
                  ) : (
                    <div style={{ position: "relative", paddingLeft: 28 }}>
                      {/* Vertical line */}
                      <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 2, background: "#e5e7eb" }} />
                      {data.timeline.map((event, idx) => (
                        <div key={idx} style={{ position: "relative", marginBottom: 18, paddingLeft: 20 }}>
                          {/* Dot */}
                          <div style={{
                            position: "absolute", left: -24, top: 4, width: 14, height: 14, borderRadius: "50%",
                            background: event.type === "lead" ? "#4f46e5" : "#10b981",
                            border: "3px solid #fff", boxShadow: "0 0 0 2px rgba(79,70,229,0.15)",
                          }} />
                          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <p style={{ fontWeight: 700, margin: 0, fontSize: 14 }}>{event.label}</p>
                              <span style={{ fontSize: 11, color: "#667085" }}>{formatDate(event.date)}</span>
                            </div>
                            <p style={{ fontSize: 12, color: "#667085", margin: "4px 0 0" }}>{event.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="fu-modal-footer">
              <button className="fu-cancel-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
