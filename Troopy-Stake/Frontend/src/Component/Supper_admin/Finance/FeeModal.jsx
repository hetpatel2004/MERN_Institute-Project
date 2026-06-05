import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Partial", "Paid", "Overdue"];

export default function FeeModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    counselorId: "",
    totalFees: "",
    discount: "0",
    scholarship: "0",
    registrationFees: "0",
    installmentPlan: "",
    dueDate: "",
    status: "Pending",
    notes: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        studentId: editing.studentId?._id || "",
        courseId: editing.courseId?._id || "",
        counselorId: editing.counselorId?._id || "",
        totalFees: editing.totalFees || "",
        discount: editing.discount || "0",
        scholarship: editing.scholarship || "0",
        registrationFees: editing.registrationFees || "0",
        installmentPlan: editing.installmentPlan || "",
        dueDate: editing.dueDate ? editing.dueDate.split("T")[0] : "",
        status: editing.status || "Pending",
        notes: editing.notes || "",
      });
    } else {
      setForm({ studentId: "", courseId: "", counselorId: "", totalFees: "", discount: "0", scholarship: "0", registrationFees: "0", installmentPlan: "", dueDate: "", status: "Pending", notes: "" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      totalFees: parseFloat(form.totalFees) || 0,
      discount: parseFloat(form.discount) || 0,
      scholarship: parseFloat(form.scholarship) || 0,
      registrationFees: parseFloat(form.registrationFees) || 0,
    };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Fee Record" : "Add Fee Record"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Student ID <span className="text-danger">*</span></label>
                <input name="studentId" value={form.studentId} onChange={handleChange} required placeholder="Student MongoDB ID" />
              </div>
              <div className="hl-form-row">
                <label>Course ID</label>
                <input name="courseId" value={form.courseId} onChange={handleChange} placeholder="Course MongoDB ID" />
              </div>
              <div className="hl-form-row">
                <label>Counselor ID</label>
                <input name="counselorId" value={form.counselorId} onChange={handleChange} placeholder="Counselor MongoDB ID" />
              </div>
              <div className="hl-form-row">
                <label>Total Fees</label>
                <input name="totalFees" type="number" value={form.totalFees} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Discount</label>
                <input name="discount" type="number" value={form.discount} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Scholarship</label>
                <input name="scholarship" type="number" value={form.scholarship} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Registration Fees</label>
                <input name="registrationFees" type="number" value={form.registrationFees} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Installment Plan</label>
                <input name="installmentPlan" value={form.installmentPlan} onChange={handleChange} placeholder="e.g. Monthly, Quarterly" />
              </div>
              <div className="hl-form-row">
                <label>Due Date</label>
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
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
