import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const USER_MODELS = ["User", "Counsellor", "Faculty", "Staff", "Student"];
const STATUS_OPTIONS = ["Present", "Absent", "Late", "Half Day", "Holiday"];

export default function AttendanceModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    userId: "",
    userModel: "User",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
    notes: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        userId: editing.userId?._id || "",
        userModel: editing.userModel || "User",
        date: editing.date ? editing.date.split("T")[0] : "",
        checkIn: editing.checkIn ? new Date(editing.checkIn).toISOString().slice(0, 16) : "",
        checkOut: editing.checkOut ? new Date(editing.checkOut).toISOString().slice(0, 16) : "",
        status: editing.status || "Present",
        notes: editing.notes || "",
      });
    } else {
      setForm({ userId: "", userModel: "User", date: "", checkIn: "", checkOut: "", status: "Present", notes: "" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Attendance" : "Add Attendance"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>User ID</label>
                <input name="userId" value={form.userId} onChange={handleChange} placeholder="User MongoDB ID" />
              </div>
              <div className="hl-form-row">
                <label>User Model</label>
                <select name="userModel" value={form.userModel} onChange={handleChange}>
                  {USER_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Date <span className="text-danger">*</span></label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="hl-form-row">
                <label>Check In</label>
                <input name="checkIn" type="datetime-local" value={form.checkIn} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Check Out</label>
                <input name="checkOut" type="datetime-local" value={form.checkOut} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes..." />
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
