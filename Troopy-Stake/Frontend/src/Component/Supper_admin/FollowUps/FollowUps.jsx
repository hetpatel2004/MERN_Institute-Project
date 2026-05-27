import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  CheckCircle,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import "./FollowUps.css";

const API = "http://localhost:5000/api/follow-ups";

const relatedTypes = [
  "User",
  "Student",
  "Branch",
  "Course",
  "Lead",
  "Payment",
  "Booking",
  "Organization",
];

const statuses = ["Pending", "In Progress", "Completed", "Overdue"];

const priorities = ["Low", "Medium", "High"];

const defaultForm = {
  title: "",
  description: "",
  relatedType: "Lead",
  relatedId: "",
  userName: "",
  userEmail: "",
  status: "Pending",
  followUpDate: "",
  createdBy: "",
  priority: "Medium",
  note: "",
};

function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [viewItem, setViewItem] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchFollowUps();
  }, [page, filterStatus, filterType, dateFrom, dateTo]);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterType, dateFrom, dateTo]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const params = { page, limit };
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.relatedType = filterType;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (search.trim()) params.search = search.trim();

      const res = await axios.get(`${API}`, { params });
      setFollowUps(res.data.followUps);
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch (err) {
      console.error("Failed to load follow-ups", err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchFollowUps();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      relatedType: item.relatedType || "Lead",
      relatedId: item.relatedId || "",
      userName: item.userName || "",
      userEmail: item.userEmail || "",
      status: item.status || "Pending",
      followUpDate: item.followUpDate
        ? item.followUpDate.slice(0, 10)
        : "",
      createdBy: item.createdBy || "",
      priority: item.priority || "Medium",
      note: item.note || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form);
      } else {
        await axios.post(`${API}`, form);
      }
      setShowModal(false);
      setEditing(null);
      fetchFollowUps();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save follow-up");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this follow-up?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchFollowUps();
      fetchStats();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`${API}/${id}`, { status: "Completed" });
      fetchFollowUps();
      fetchStats();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const statCards = useMemo(
    () => [
      { label: "Total Follow Ups", value: stats.total, color: "#3b82f6" },
      { label: "Pending", value: stats.pending, color: "#f59e0b" },
      { label: "In Progress", value: stats.inProgress, color: "#8b5cf6" },
      { label: "Completed", value: stats.completed, color: "#10b981" },
      { label: "Overdue", value: stats.overdue, color: "#ef4444" },
    ],
    [stats]
  );

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusBadge = (status) => {
    const colors = {
      Pending: "fu-badge-pending",
      "In Progress": "fu-badge-progress",
      Completed: "fu-badge-completed",
      Overdue: "fu-badge-overdue",
    };
    return <span className={`fu-badge ${colors[status] || ""}`}>{status}</span>;
  };

  const priorityBadge = (p) => {
    const colors = {
      Low: "fu-prio-low",
      Medium: "fu-prio-medium",
      High: "fu-prio-high",
    };
    return <span className={`fu-prio ${colors[p] || ""}`}>{p}</span>;
  };

  const [actionOpen, setActionOpen] = useState(null);

  return (
    <div className="fu-page">
      <div className="fu-header">
        <div>
          <h1>Follow Ups</h1>
          <p className="fu-subtitle">
            Manage and track all follow-up activities
          </p>
        </div>
        <button className="fu-add-btn" onClick={openCreate}>
          <Plus size={18} />
          Add Follow Up
        </button>
      </div>

      <div className="fu-stats">
        {statCards.map((s) => (
          <div key={s.label} className="fu-stat-card">
            <div className="fu-stat-dot" style={{ background: s.color }} />
            <p className="fu-stat-label">{s.label}</p>
            <h2 className="fu-stat-value">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="fu-filters">
        <div className="fu-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title, user or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="fu-filter-group">
          <Filter size={16} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {relatedTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
          />

          {(filterStatus || filterType || dateFrom || dateTo || search) && (
            <button
              className="fu-clear-btn"
              onClick={() => {
                setSearch("");
                setFilterStatus("");
                setFilterType("");
                setDateFrom("");
                setDateTo("");
                setPage(1);
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="fu-table-card">
        <div className="fu-table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Related To</th>
                <th>User</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Follow Up Date</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {followUps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="fu-empty">
                    No follow-ups found
                  </td>
                </tr>
              ) : (
                followUps.map((fu, idx) => (
                  <tr key={fu._id}>
                    <td className="fu-id">#{(page - 1) * limit + idx + 1}</td>
                    <td className="fu-title-cell">{fu.title}</td>
                    <td>
                      {fu.relatedType === "Lead" && fu.relatedId ? (
                        <span
                          className="fu-type-badge fu-type-link"
                          onClick={() => navigate(`/superadmin/leads`)}
                          title="View related lead"
                        >
                          {fu.relatedType}
                          <ExternalLink size={12} />
                        </span>
                      ) : (
                        <span className="fu-type-badge">{fu.relatedType}</span>
                      )}
                    </td>
                    <td>
                      <div className="fu-user-cell">
                        <span className="fu-user-name">{fu.userName || "-"}</span>
                        {fu.userEmail && (
                          <span className="fu-user-email">{fu.userEmail}</span>
                        )}
                      </div>
                    </td>
                    <td>{statusBadge(fu.status)}</td>
                    <td>{priorityBadge(fu.priority)}</td>
                    <td>{formatDate(fu.followUpDate)}</td>
                    <td>{formatDate(fu.createdAt)}</td>
                    <td>
                      <div className="fu-action-wrap">
                        <button
                          className="fu-action-btn"
                          onClick={() => setActionOpen(actionOpen === fu._id ? null : fu._id)}
                        >
                          ...
                        </button>
                        {actionOpen === fu._id && (
                          <div className="fu-dropdown">
                            <button onClick={() => { setViewItem(fu); setActionOpen(null); }}>
                              <Eye size={15} /> View
                            </button>
                            <button onClick={() => { openEdit(fu); setActionOpen(null); }}>
                              <Pencil size={15} /> Edit
                            </button>
                            <button onClick={() => { handleComplete(fu._id); setActionOpen(null); }}>
                              <CheckCircle size={15} /> Complete
                            </button>
                            <button
                              className="fu-dropdown-danger"
                              onClick={() => { handleDelete(fu._id); setActionOpen(null); }}
                            >
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
          <div className="fu-pagination">
            <span className="fu-page-info">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, totalItems)} of {totalItems}
            </span>
            <div className="fu-page-btns">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === page ? "active" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fu-overlay" onClick={() => setShowModal(false)}>
          <div className="fu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fu-modal-header">
              <h2>{editing ? "Edit Follow Up" : "Add Follow Up"}</h2>
              <button
                className="fu-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fu-modal-body">
                <div className="fu-form-row">
                  <div className="fu-form-group">
                    <label>Title <span className="required-star">*</span></label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter title"
                    />
                  </div>
                  <div className="fu-form-group">
                    <label>Related Type <span className="required-star">*</span></label>
                    <select
                      name="relatedType"
                      value={form.relatedType}
                      onChange={handleChange}
                      required
                    >
                      {relatedTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="fu-form-row">
                  <div className="fu-form-group">
                    <label>Related ID</label>
                    <input
                      name="relatedId"
                      value={form.relatedId}
                      onChange={handleChange}
                      placeholder="e.g. course or lead ID"
                    />
                  </div>
                  <div className="fu-form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="fu-form-row">
                  <div className="fu-form-group">
                    <label>User Name</label>
                    <input
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div className="fu-form-group">
                    <label>User Email</label>
                    <input
                      name="userEmail"
                      value={form.userEmail}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="fu-form-row">
                  <div className="fu-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fu-form-group">
                    <label>Follow Up Date <span className="required-star">*</span></label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={form.followUpDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="fu-form-group">
                  <label>Created By</label>
                  <input
                    name="createdBy"
                    value={form.createdBy}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="fu-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Brief description"
                  />
                </div>

                <div className="fu-form-group">
                  <label>Note</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <div className="fu-modal-footer">
                <button
                  type="button"
                  className="fu-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="fu-save-btn">
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fu-overlay" onClick={() => setViewItem(null)}>
          <div
            className="fu-modal fu-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fu-modal-header">
              <h2>{viewItem.title}</h2>
              <button
                className="fu-modal-close"
                onClick={() => setViewItem(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="fu-modal-body">
              <div className="fu-view-grid">
                <div>
                  <label>Status</label>
                  <p>{statusBadge(viewItem.status)}</p>
                </div>
                <div>
                  <label>Priority</label>
                  <p>{priorityBadge(viewItem.priority)}</p>
                </div>
                <div>
                  <label>Related Type</label>
                  <p>
                    {viewItem.relatedType}
                    {viewItem.relatedType === "Lead" && viewItem.relatedId && (
                      <button
                        className="fu-view-link"
                        onClick={() => navigate("/superadmin/leads")}
                      >
                        <ExternalLink size={14} /> View Lead
                      </button>
                    )}
                  </p>
                </div>
                <div>
                  <label>Related ID</label>
                  <p>{viewItem.relatedId || "-"}</p>
                </div>
                <div>
                  <label>User Name</label>
                  <p>{viewItem.userName || "-"}</p>
                </div>
                <div>
                  <label>User Email</label>
                  <p>{viewItem.userEmail || "-"}</p>
                </div>
                <div>
                  <label>Follow Up Date</label>
                  <p>{formatDate(viewItem.followUpDate)}</p>
                </div>
                <div>
                  <label>Created By</label>
                  <p>{viewItem.createdBy || "-"}</p>
                </div>
                <div>
                  <label>Created On</label>
                  <p>{formatDate(viewItem.createdAt)}</p>
                </div>
                <div>
                  <label>Description</label>
                  <p>{viewItem.description || "-"}</p>
                </div>
                <div className="fu-view-full">
                  <label>Note</label>
                  <p>{viewItem.note || "-"}</p>
                </div>
              </div>
            </div>
            <div className="fu-modal-footer">
              <button
                className="fu-cancel-btn"
                onClick={() => setViewItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowUps;
