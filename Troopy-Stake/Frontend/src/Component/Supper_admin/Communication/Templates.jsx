import React, { useEffect, useState, useCallback } from "react";
import { Search, Plus, X, ChevronLeft, ChevronRight, FileText, Mail, MessageSquare, File, Layout } from "lucide-react";
import { templateService } from "../../../services/templateService";
import TemplateModal from "./TemplateModal";
import "./Communication.css";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState({ total: 0, email: 0, whatsapp: 0, sms: 0, document: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    try { const res = await templateService.getStats(); setStats(res.data || {}); } catch (err) { console.error(err); }
  }, []);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filterType) params.type = filterType;
      const res = await templateService.getAll(params);
      setTemplates(res.data.templates || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filterType]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);
  useEffect(() => { setPage(1); }, [search, filterType]);

  const handleSave = async (data, id) => {
    try {
      if (id) await templateService.update(id, data);
      else await templateService.create(data);
      addToast(id ? "Template updated" : "Template created");
      fetchTemplates();
      fetchStats();
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await templateService.delete(id);
      addToast("Template deleted");
      setActionOpen(null);
      fetchTemplates();
      fetchStats();
    } catch (err) { addToast("Failed to delete", "error"); }
  };

  const getTypeIcon = (type) => {
    const icons = {
      Email: <Mail size={16} />,
      WhatsApp: <MessageSquare size={16} />,
      SMS: <MessageSquare size={16} />,
      Document: <File size={16} />,
    };
    return icons[type] || <FileText size={16} />;
  };

  const getTypeBadge = (type) => {
    const colors = {
      Email: "#4f46e5",
      WhatsApp: "#25D366",
      SMS: "#0891b2",
      Document: "#d97706",
    };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500,
        background: `${colors[type] || "#667085"}15`,
        color: colors[type] || "#667085",
      }}>
        {getTypeIcon(type)} {type}
      </span>
    );
  };

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <h1>Communication Templates</h1>
          <p className="fin-subtitle">Manage email, WhatsApp, SMS & document templates</p>
        </div>
        <div className="fin-header-actions">
          <button className="fin-add-btn" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={18} /> Add Template</button>
        </div>
      </div>

      <div className="fin-stats">
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Layout size={18} color="#4f46e5" /><span className="fin-stat-label">Total Templates</span></div>
          <h3 className="fin-stat-value">{stats.total || 0}</h3>
          <span className="fin-stat-sub">All templates</span>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><Mail size={18} color="#4f46e5" /><span className="fin-stat-label">Email</span></div>
          <h3 className="fin-stat-value">{stats.email || 0}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><MessageSquare size={18} color="#25D366" /><span className="fin-stat-label">WhatsApp</span></div>
          <h3 className="fin-stat-value">{stats.whatsapp || 0}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><MessageSquare size={18} color="#0891b2" /><span className="fin-stat-label">SMS</span></div>
          <h3 className="fin-stat-value">{stats.sms || 0}</h3>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top"><File size={18} color="#d97706" /><span className="fin-stat-label">Document</span></div>
          <h3 className="fin-stat-value">{stats.document || 0}</h3>
        </div>
      </div>

      <div className="fin-table-card">
        <div className="fin-table-filters">
          <div className="fin-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="fin-filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
              <option value="Document">Document</option>
            </select>
            {(search || filterType) && (
              <button className="fin-clear-btn" onClick={() => { setSearch(""); setFilterType(""); setPage(1); }}><X size={16} /></button>
            )}
          </div>
        </div>

        <div className="fin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="fin-empty">Loading...</td></tr>
              ) : templates.length === 0 ? (
                <tr><td colSpan={5} className="fin-empty">No templates found.</td></tr>
              ) : templates.map((t) => (
                <tr key={t._id}>
                  <td className="fin-name-cell">{t.name || "-"}</td>
                  <td>{getTypeBadge(t.type)}</td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject || "-"}</td>
                  <td>{t.category || "-"}</td>
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

      {showModal && <TemplateModal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />}

      <div className="fin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
