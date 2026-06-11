import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function FacultyModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    joiningDate: "",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
        specialization: editing.specialization || "",
        qualification: editing.qualification || "",
        experience: editing.experience || "",
        joiningDate: editing.joiningDate ? editing.joiningDate.split("T")[0] : "",
        status: editing.status || "Active",
      });
    } else {
      setForm({ name: "", email: "", phone: "", specialization: "", qualification: "", experience: "", joiningDate: "", status: "Active" });
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
            <h3>{editing ? "Edit Faculty" : "Add Faculty"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Name <span className="text-danger">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Faculty name" />
              </div>
              <div className="hl-form-row">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" />
              </div>
              <div className="hl-form-row">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
              </div>
              <div className="hl-form-row">
                <label>Specialization</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" />
              </div>
              <div className="hl-form-row">
                <label>Qualification</label>
                <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" />
              </div>
              <div className="hl-form-row">
                <label>Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5 years" />
              </div>
              <div className="hl-form-row">
                <label>Joining Date</label>
                <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
