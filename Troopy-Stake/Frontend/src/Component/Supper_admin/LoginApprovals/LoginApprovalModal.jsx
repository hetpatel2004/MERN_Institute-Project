import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function LoginApprovalModal({ show, onClose, onSave, editing, readOnly }) {
  const [form, setForm] = useState({
    userId: "",
  });

  useEffect(() => {
    if (show) {
      if (editing && !readOnly) {
        setForm({ userId: editing.userId?._id || "" });
      } else {
        setForm({ userId: "" });
      }
    }
  }, [show, editing, readOnly]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form, editing?._id);
  };

  if (readOnly && editing) {
    return (
      <>
        <div className="fin-overlay" onClick={onClose} />
        <div className="hl-modal-overlay">
          <div className="hl-modal" style={{ maxWidth: 500 }}>
            <div className="hl-modal-header">
              <h3>Login Request Details</h3>
              <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>User</label>
                <input value={editing.userId?.name || editing.userId?._id || "-"} disabled />
              </div>
              <div className="hl-form-row">
                <label>Login Time</label>
                <input value={editing.loginTime ? new Date(editing.loginTime).toLocaleString("en-IN") : "-"} disabled />
              </div>
              <div className="hl-form-row">
                <label>IP Address</label>
                <input value={editing.ipAddress || "-"} disabled />
              </div>
              <div className="hl-form-row">
                <label>Device</label>
                <input value={editing.device || "-"} disabled />
              </div>
              <div className="hl-form-row">
                <label>Browser</label>
                <input value={editing.browser || "-"} disabled />
              </div>
              <div className="hl-form-row">
                <label>Location</label>
                <input value={editing.location || "-"} disabled />
              </div>
              <div className="hl-form-row">
                <label>Status</label>
                <input value={editing.status || "-"} disabled />
              </div>
            </div>
            <div className="hl-modal-footer">
              <button type="button" className="hl-btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 450 }}>
          <div className="hl-modal-header">
            <h3>New Login Request</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>User ID <span className="text-danger">*</span></label>
                <input name="userId" value={form.userId} onChange={handleChange} required placeholder="User MongoDB ID" />
              </div>
            </div>
            <div className="hl-modal-footer">
              <button type="button" className="hl-btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="hl-btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
