import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive"];

export default function ProgramModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    name: "",
    duration: "",
    durationMonths: "",
    description: "",
    totalFees: "",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        duration: editing.duration || "",
        durationMonths: editing.durationMonths || "",
        description: editing.description || "",
        totalFees: editing.totalFees || "",
        status: editing.status || "Active",
      });
    } else {
      setForm({ name: "", duration: "", durationMonths: "", description: "", totalFees: "", status: "Active" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    const data = {
      ...form,
      durationMonths: parseInt(form.durationMonths) || 0,
      totalFees: parseFloat(form.totalFees) || 0,
    };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Program" : "Add Program"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Name <span className="text-danger">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Program name" />
              </div>
              <div className="hl-form-row">
                <label>Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 2 Years" />
              </div>
              <div className="hl-form-row">
                <label>Duration (Months)</label>
                <input name="durationMonths" type="number" value={form.durationMonths} onChange={handleChange} placeholder="24" />
              </div>
              <div className="hl-form-row">
                <label>Total Fees</label>
                <input name="totalFees" type="number" step="0.01" value={form.totalFees} onChange={handleChange} placeholder="Total program fees" />
              </div>
              <div className="hl-form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Program description" />
              </div>
              <div className="hl-form-row">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
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
