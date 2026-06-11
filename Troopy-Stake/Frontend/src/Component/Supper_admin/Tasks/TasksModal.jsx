import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];

export default function TasksModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      if (editing) {
        setForm({
          title: editing.title || "",
          description: editing.description || "",
          priority: editing.priority || "Medium",
          status: editing.status || "Pending",
          dueDate: editing.dueDate ? editing.dueDate.slice(0, 10) : "",
        });
      } else {
        setForm({ title: "", description: "", priority: "Medium", status: "Pending", dueDate: "" });
      }
    }
  }, [show, editing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    const ok = await onSave(form, editing?._id);
    if (ok !== false) onClose();
    setSaving(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Task" : "Add Task"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Title <span className="text-danger">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Enter task title" />
              </div>
              <div className="hl-form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Task description..." />
              </div>
              <div className="hl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange}>
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="hl-form-row">
                <label>Due Date</label>
                <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
              </div>
            </div>
            <div className="hl-modal-footer">
              <button type="button" className="hl-btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="hl-btn-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
