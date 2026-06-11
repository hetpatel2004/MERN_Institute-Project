import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const TYPE_OPTIONS = ["Email", "WhatsApp", "SMS", "Document"];

export default function TemplateModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    name: "",
    type: "Email",
    subject: "",
    content: "",
    category: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      if (editing) {
        setForm({
          name: editing.name || "",
          type: editing.type || "Email",
          subject: editing.subject || "",
          content: editing.content || "",
          category: editing.category || "",
        });
      } else {
        setForm({ name: "", type: "Email", subject: "", content: "", category: "" });
      }
    }
  }, [show, editing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.content) return;
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
        <div className="hl-modal" style={{ maxWidth: 600 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Template" : "Add Template"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Name <span className="text-danger">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Template name" />
              </div>
              <div className="hl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Welcome, Follow-up" />
                </div>
              </div>
              <div className="hl-form-row">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Email subject line" />
              </div>
              <div className="hl-form-row">
                <label>Content <span className="text-danger">*</span></label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={6} required placeholder="Template content..." />
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
