import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search, Plus, Pencil, Trash2, X, Eye, Filter, ChevronLeft, ChevronRight,
  TrendingUp, Users, Target, DollarSign, BarChart3,
} from "lucide-react";
import CampaignModal from "./CampaignModal";
import CampaignDetailsModal from "./CampaignDetailsModal";
import "./Campaigns.css";

const API = "http://localhost:5000/api/campaigns";

const campaignTypes = [
  "Facebook Ads", "Instagram Ads", "Google Ads",
  "WhatsApp Campaign", "Referral", "Walk-in", "Email Marketing",
];

const statuses = ["Active", "Paused", "Completed"];

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [stats, setStats] = useState({
    total: 0, active: 0, totalLeads: 0, totalAdmissions: 0, conversionRate: 0,
    totalCampaignCost: 0, totalRevenue: 0, profitLoss: 0,
  });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterInstitute, setFilterInstitute] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterCounsellor, setFilterCounsellor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [actionOpen, setActionOpen] = useState(null);
  const limit = 15;

  useEffect(() => { fetchStats(); fetchInstitutes(); fetchBranches(); fetchCounsellors(); }, []);

  useEffect(() => { fetchCampaigns(); }, [page, filterType, filterInstitute, filterBranch, filterCounsellor, filterStatus, dateFrom, dateTo]);

  useEffect(() => { setPage(1); }, [search, filterType, filterInstitute, filterBranch, filterCounsellor, filterStatus, dateFrom, dateTo]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`);
      setStats(res.data);
    } catch (err) { console.error("Failed to load campaign stats", err); }
  };

  const fetchCampaigns = async () => {
    try {
      const params = { page, limit };
      if (filterType) params.type = filterType;
      if (filterInstitute) params.instituteId = filterInstitute;
      if (filterBranch) params.branchId = filterBranch;
      if (filterCounsellor) params.counsellorId = filterCounsellor;
      if (filterStatus) params.status = filterStatus;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (search.trim()) params.search = search.trim();

      const res = await axios.get(`${API}`, { params });
      setCampaigns(res.data.campaigns);
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch (err) { console.error("Failed to load campaigns", err); }
  };

  const fetchInstitutes = async () => {
    try { const res = await axios.get("http://localhost:5000/api/institutes"); setInstitutes(res.data.institutes || res.data || []); }
    catch (err) { console.error(err); }
  };

  const fetchBranches = async () => {
    try { const res = await axios.get("http://localhost:5000/api/branches"); setBranches(res.data.branches || []); }
    catch (err) { console.error(err); }
  };

  const fetchCounsellors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/counsellors");
      const data = res.data.counsellors || res.data || [];
      setCounsellors(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (payload, id) => {
    if (id) {
      await axios.put(`${API}/${id}`, payload);
    } else {
      await axios.post(`${API}`, payload);
    }
    fetchCampaigns();
    fetchStats();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign? Leads linked to this campaign will be unlinked.")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchCampaigns();
      fetchStats();
    } catch (err) { alert("Failed to delete"); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  const formatCurrency = (n) => n !== undefined && n !== null ? `₹${Number(n).toLocaleString()}` : "-";

  const statCards = useMemo(() => [
    { label: "Total Campaigns", value: stats.total, icon: BarChart3, color: "#3b82f6" },
    { label: "Active Campaigns", value: stats.active, icon: TrendingUp, color: "#10b981" },
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "#8b5cf6" },
    { label: "Admissions", value: stats.totalAdmissions, icon: Target, color: "#0f766e" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "#f59e0b" },
    { label: "Total Cost", value: formatCurrency(stats.totalCampaignCost), icon: DollarSign, color: "#ef4444" },
    { label: "Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "#10b981" },
    { label: "Profit / Loss", value: formatCurrency(stats.profitLoss), icon: BarChart3, color: stats.profitLoss >= 0 ? "#10b981" : "#ef4444" },
  ], [stats]);

  const typeBadge = (type) => {
    const colors = {
      "Facebook Ads": "#1877f2", "Instagram Ads": "#e4405f", "Google Ads": "#4285f4",
      "WhatsApp Campaign": "#25d366", Referral: "#8b5cf6", "Walk-in": "#f59e0b", "Email Marketing": "#ef4444",
    };
    return <span className="cam-type-badge" style={{ background: `${colors[type] || "#667085"}15`, color: colors[type] || "#667085", borderColor: `${colors[type] || "#667085"}30` }}>{type}</span>;
  };

  const statusBadge = (status) => {
    const map = { Active: "cam-badge-active", Paused: "cam-badge-paused", Completed: "cam-badge-completed" };
    return <span className={`cam-badge ${map[status] || ""}`}>{status}</span>;
  };

  return (
    <div className="cam-page">
      <div className="cam-header">
        <div>
          <h1>Campaign Management</h1>
          <p className="cam-subtitle">Track marketing campaigns, leads, conversions & ROI</p>
        </div>
        <button className="cam-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus size={18} /> Create Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="cam-stats">
        {statCards.map((s) => (
          <div key={s.label} className="cam-stat-card">
            <div className="cam-stat-top">
              <s.icon size={20} style={{ color: s.color }} />
              <span className="cam-stat-label">{s.label}</span>
            </div>
            <h2 className="cam-stat-value" style={{ color: s.label === "Profit / Loss" ? (stats.profitLoss >= 0 ? "#10b981" : "#ef4444") : "#071739" }}>
              {s.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="cam-filters">
        <div className="cam-search-box">
          <Search size={18} />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="cam-filter-group">
          <Filter size={16} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {campaignTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterInstitute} onChange={(e) => setFilterInstitute(e.target.value)}>
            <option value="">All Institutes</option>
            {institutes.map((inst) => <option key={inst._id} value={inst._id}>{inst.name}</option>)}
          </select>
          <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
            <option value="">All Branches</option>
            {branches.map((b) => <option key={b._id} value={b._id}>{b.branchName}</option>)}
          </select>
          <select value={filterCounsellor} onChange={(e) => setFilterCounsellor(e.target.value)}>
            <option value="">All Counsellors</option>
            {counsellors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To date" />
          {(filterType || filterInstitute || filterBranch || filterCounsellor || filterStatus || dateFrom || dateTo || search) && (
            <button className="cam-clear-btn" onClick={() => {
              setSearch(""); setFilterType(""); setFilterInstitute(""); setFilterBranch("");
              setFilterCounsellor(""); setFilterStatus(""); setDateFrom(""); setDateTo(""); setPage(1);
            }}><X size={16} /></button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="cam-table-card">
        <div className="cam-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Type</th>
                <th>Institute</th>
                <th>Branch</th>
                <th>Counsellor</th>
                <th>Leads</th>
                <th>Interested</th>
                <th>Follow-ups</th>
                <th>Admissions</th>
                <th>Conv.%</th>
                <th>Budget</th>
                <th>Revenue</th>
                <th>P/L</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr><td colSpan={17} className="cam-empty">No campaigns found. Click "Create Campaign" to get started.</td></tr>
              ) : (
                campaigns.map((camp) => (
                  <tr key={camp._id}>
                    <td className="cam-name-cell">{camp.name}</td>
                    <td>{typeBadge(camp.type)}</td>
                    <td>{camp.instituteId?.name || "-"}</td>
                    <td>{camp.branchId?.branchName || "-"}</td>
                    <td>{camp.counsellorId?.name || "Unassigned"}</td>
                    <td className="cam-number">{camp.totalLeads}</td>
                    <td className="cam-number">{camp.interestedLeads}</td>
                    <td className="cam-number">{camp.followUpLeads}</td>
                    <td className="cam-number">{camp.admissions}</td>
                    <td className="cam-number">{camp.conversionRate}%</td>
                    <td className="cam-currency">{formatCurrency(camp.budget)}</td>
                    <td className="cam-currency">{formatCurrency(camp.revenueGenerated)}</td>
                    <td className="cam-currency" style={{ color: camp.profitLoss >= 0 ? "#10b981" : "#ef4444", fontWeight: 800 }}>
                      {camp.profitLoss >= 0 ? "+" : ""}{formatCurrency(camp.profitLoss)}
                    </td>
                    <td>{formatDate(camp.startDate)}</td>
                    <td>{formatDate(camp.endDate)}</td>
                    <td>{statusBadge(camp.status)}</td>
                    <td>
                      <div className="cam-action-wrap">
                        <button className="cam-action-btn" onClick={() => setActionOpen(actionOpen === camp._id ? null : camp._id)}>...</button>
                        {actionOpen === camp._id && (
                          <div className="cam-dropdown">
                            <button onClick={() => { setViewId(camp._id); setActionOpen(null); }}>
                              <Eye size={15} /> View Details
                            </button>
                            <button onClick={() => { setEditing(camp); setShowModal(true); setActionOpen(null); }}>
                              <Pencil size={15} /> Edit
                            </button>
                            <button className="cam-dropdown-danger" onClick={() => { handleDelete(camp._id); setActionOpen(null); }}>
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="cam-pagination">
            <span className="cam-page-info">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalItems)} of {totalItems}
            </span>
            <div className="cam-page-btns">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <CampaignModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
      />

      {/* Details Modal */}
      <CampaignDetailsModal
        campaignId={viewId}
        onClose={() => setViewId(null)}
      />
    </div>
  );
}

export default Campaigns;
