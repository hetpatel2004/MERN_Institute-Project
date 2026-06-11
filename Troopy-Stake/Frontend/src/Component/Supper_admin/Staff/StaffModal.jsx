import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function StaffModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    salary: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
        department: editing.department || "",
        designation: editing.designation || "",
        joiningDate: editing.joiningDate ? editing.joiningDate.split("T")[0] : "",
        salary: editing.salary || "",
        address: editing.address || "",
        status: editing.status || "Active",
      });
    } else {
      setForm({ name: "", email: "", phone: "", department: "", designation: "", joiningDate: "", salary: "", address: "", status: "Active" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, salary: parseFloat(form.salary) || 0 };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Staff" : "Add Staff"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Name <span className="text-danger">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Staff name" />
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
                <label>Department</label>
                <input name="department" value={form.department} onChange={handleChange} placeholder="Department" />
              </div>
              <div className="hl-form-row">
                <label>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" />
              </div>
              <div className="hl-form-row">
                <label>Joining Date</label>
                <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Salary</label>
                <input name="salary" type="number" value={form.salary} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="Address" />
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
