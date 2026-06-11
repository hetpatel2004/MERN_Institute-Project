import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive", "Blocked"];

export default function StudentModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    studentName: "",
    email: "",
    phone: "",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        studentName: editing.studentName || editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
        status: editing.status || "Active",
      });
    } else {
      setForm({ studentName: "", email: "", phone: "", status: "Active" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName) return;
    await onSave(form, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Student" : "Add Student"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Student Name <span className="text-danger">*</span></label>
                <input name="studentName" value={form.studentName} onChange={handleChange} required placeholder="Enter student name" />
              </div>
              <div className="hl-form-row">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" />
              </div>
              <div className="hl-form-row">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
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
