import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, X, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, ListTodo } from "lucide-react";
import { taskService } from "../../../services/taskService";
import TasksModal from "./TasksModal";
import "../Finance/Finance.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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
    try { const res = await taskService.getStats(); setStats(res.data || {}); } catch (err) { console.error(err); }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterPriority) params.priority = filterPriority;
      if (filterStatus) params.status = filterStatus;
      const res = await taskService.getAll(params);
      setTasks(res.data.tasks || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterPriority, filterStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { setPage(1); }, [search, filterPriority, filterStatus]);

  const handleSave = async (data, id) => {
    try {
      if (id) await taskService.update(id, data);
      else await taskService.create(data);
      addToast(id ? "Task updated" : "Task created");
      fetchTasks();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskService.delete(id);
      addToast("Task deleted");
      setActionOpen(null);
      fetchTasks();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getPriorityBadge = (p) => {
    const map = { Low: "fin-badge-paid", Medium: "fin-badge-partial", High: "fin-badge-pending", Urgent: "fin-badge-overdue" };
    return <span className={`fin-badge ${map[p] || ""}`}>{p}</span>;
  };

  const getStatusBadge = (s) => {
    const map = { Pending: "fin-badge-pending", "In Progress": "fin-badge-partial", Completed: "fin-badge-paid", Cancelled: "fin-badge-cancelled" };
    return <span className={`fin-badge ${map[s] || ""}`}>{s}</span>;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Tasks Management</h1>
          <p className="fin-subtitle">Create and manage tasks</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Task</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><ListTodo size={18} color="#4f46e5" /><span className="fin-stat-label">Total Tasks</span></div>
          <h3 className="fin-stat-value">{stats.total || 0}</h3>
          <span className="fin-stat-sub">All tasks</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Clock size={18} color="#d97706" /><span className="fin-stat-label">Pending</span></div>
          <h3 className="fin-stat-value">{stats.pending || 0}</h3>
          <span className="fin-stat-sub">Not started</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><AlertCircle size={18} color="#3b82f6" /><span className="fin-stat-label">In Progress</span></div>
          <h3 className="fin-stat-value">{stats.inProgress || 0}</h3>
          <span className="fin-stat-sub">Working on</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><CheckCircle size={18} color="#059669" /><span className="fin-stat-label">Completed</span></div>
          <h3 className="fin-stat-value">{stats.completed || 0}</h3>
          <span className="fin-stat-sub">Done</span>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {(search || filterPriority || filterStatus) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterPriority(""); setFilterStatus(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="fin-empty">Loading...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={5} className="fin-empty">No tasks found.</td></tr>
              ) : tasks.map((t) => (
                <tr key={t._id}>
                  <td className="fin-name-cell">{t.title || "-"}</td>
                  <td>{getPriorityBadge(t.priority)}</td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td>{formatDate(t.dueDate)}</td>
                  <td>
                    <div className="fin-action-wrap">
                      <button className="fin-action-btn" onClick={() => setActionOpen(actionOpen === t._id ? null : t._id)}>•••</button>
                      {actionOpen === t._id && (
                        <div className="fin-dropdown">
                          <button onClick={() => { setEditing(t); setShowModal(true); setActionOpen(null); }}>Edit</button>
                          <button className="fin-dropdown-danger" onClick={() => handleDelete(t._id)}>Delete</button>
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

      {showModal && <TasksModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
