import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EXAM_TYPES = ["Midterm", "Final", "Quiz", "Assignment", "Practical", "Viva"];
const EXAM_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

export default function ExamModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    title: "",
    examDate: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    type: "Midterm",
    status: "Upcoming",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        examDate: editing.examDate ? editing.examDate.split("T")[0] : "",
        duration: editing.duration || "",
        totalMarks: editing.totalMarks || "",
        passingMarks: editing.passingMarks || "",
        type: editing.type || "Midterm",
        status: editing.status || "Upcoming",
      });
    } else {
      setForm({ title: "", examDate: "", duration: "", totalMarks: "", passingMarks: "", type: "Midterm", status: "Upcoming" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      totalMarks: parseInt(form.totalMarks) || 0,
      passingMarks: parseInt(form.passingMarks) || 0,
    };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Exam" : "Add Exam"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Title <span className="text-danger">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Exam title" />
              </div>
              <div className="hl-form-row">
                <label>Exam Date</label>
                <input name="examDate" type="date" value={form.examDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 hours" />
              </div>
              <div className="hl-form-row">
                <label>Total Marks</label>
                <input name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Passing Marks</label>
                <input name="passingMarks" type="number" value={form.passingMarks} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {EXAM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
