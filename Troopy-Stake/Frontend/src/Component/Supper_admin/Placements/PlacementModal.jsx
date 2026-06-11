import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Offered", "Accepted", "Joined", "Declined"];

export default function PlacementModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    companyName: "",
    position: "",
    package: "",
    offerDate: "",
    joiningDate: "",
    status: "Offered",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        companyName: editing.companyName || "",
        position: editing.position || "",
        package: editing.package || "",
        offerDate: editing.offerDate ? editing.offerDate.slice(0, 10) : "",
        joiningDate: editing.joiningDate ? editing.joiningDate.slice(0, 10) : "",
        status: editing.status || "Offered",
      });
    } else {
      setForm({ companyName: "", position: "", package: "", offerDate: "", joiningDate: "", status: "Offered" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.position) return;
    const data = { ...form, package: parseFloat(form.package) || 0 };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Placement" : "Add Placement"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Company Name <span className="text-danger">*</span></label>
                <input name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Company name" />
              </div>
              <div className="hl-form-row">
                <label>Position <span className="text-danger">*</span></label>
                <input name="position" value={form.position} onChange={handleChange} required placeholder="Job position" />
              </div>
              <div className="hl-form-row">
                <label>Package (LPA)</label>
                <input name="package" type="number" step="0.01" value={form.package} onChange={handleChange} placeholder="Annual package" />
              </div>
              <div className="hl-form-row">
                <label>Offer Date</label>
                <input name="offerDate" type="date" value={form.offerDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Joining Date</label>
                <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
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
