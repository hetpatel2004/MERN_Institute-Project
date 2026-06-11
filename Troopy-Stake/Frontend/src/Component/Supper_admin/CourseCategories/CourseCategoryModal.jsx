import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive"];

export default function CourseCategoryModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#4f46e5",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        slug: editing.slug || "",
        description: editing.description || "",
        color: editing.color || "#4f46e5",
        status: editing.status || "Active",
      });
    } else {
      setForm({ name: "", slug: "", description: "", color: "#4f46e5", status: "Active" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    await onSave(form, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Category" : "Add Category"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Name <span className="text-danger">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Category name" />
              </div>
              <div className="hl-form-row">
                <label>Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="category-slug" />
              </div>
              <div className="hl-form-row">
                <label>Color</label>
                <input name="color" type="color" value={form.color} onChange={handleChange} style={{ height: 42, padding: 4 }} />
              </div>
              <div className="hl-form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Category description" />
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
