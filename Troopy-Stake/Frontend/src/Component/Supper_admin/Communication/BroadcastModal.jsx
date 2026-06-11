import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CHANNEL_OPTIONS = ["Email", "WhatsApp", "SMS", "In-App"];

export default function BroadcastModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    channel: "Email",
    scheduledAt: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        message: editing.message || "",
        channel: editing.channel || "Email",
        scheduledAt: editing.scheduledAt ? editing.scheduledAt.slice(0, 16) : "",
      });
    } else {
      setForm({ title: "", message: "", channel: "Email", scheduledAt: "" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    await onSave(form, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Broadcast" : "New Broadcast"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Title <span className="text-danger">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Broadcast title" />
              </div>
              <div className="hl-form-row">
                <label>Message <span className="text-danger">*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Enter broadcast message" />
              </div>
              <div className="hl-form-row">
                <label>Channel <span className="text-danger">*</span></label>
                <select name="channel" value={form.channel} onChange={handleChange}>
                  {CHANNEL_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Scheduled At</label>
                <input name="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={handleChange} />
              </div>
            </div>
            <div className="hl-modal-footer">
              <button type="button" className="hl-btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="hl-btn-primary">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
