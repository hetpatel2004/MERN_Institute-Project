import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const holidayTypes = ["National Holiday", "Festival Holiday", "Company Holiday", "Optional Holiday", "Bank Holiday"];
const reminderOptions = [1, 2, 3, 7];
const statuses = ["Active", "Inactive"];

const defaultForm = {
  holidayName: "",
  holidayDate: "",
  holidayType: "",
  description: "",
  reminderDays: 1,
  status: "Active",
};

export default function HolidayModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      if (editing) {
        setForm({
          holidayName: editing.holidayName || "",
          holidayDate: editing.holidayDate ? editing.holidayDate.slice(0, 10) : "",
          holidayType: editing.holidayType || "",
          description: editing.description || "",
          reminderDays: editing.reminderDays || 1,
          status: editing.status || "Active",
        });
      } else {
        setForm(defaultForm);
      }
    }
  }, [show, editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.holidayName || !form.holidayDate || !form.holidayType) return;
    setLoading(true);
    const ok = await onSave(form, editing?._id);
    if (ok !== false) onClose();
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="fu-overlay" onClick={onClose}>
      <div className="fu-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="fu-modal-header">
          <h2>{editing ? "Edit Holiday" : "Add Holiday"}</h2>
          <button className="fu-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fu-modal-body">
            <div className="fu-form-row">
              <div className="fu-form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Holiday Name <span className="required-star">*</span></label>
                <input name="holidayName" value={form.holidayName} onChange={handleChange} required placeholder="Enter holiday name" />
              </div>
            </div>

            <div className="fu-form-row">
              <div className="fu-form-group">
                <label>Holiday Date <span className="required-star">*</span></label>
                <input type="date" name="holidayDate" value={form.holidayDate} onChange={handleChange} required />
              </div>
              <div className="fu-form-group">
                <label>Holiday Type <span className="required-star">*</span></label>
                <select name="holidayType" value={form.holidayType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  {holidayTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="fu-form-row">
              <div className="fu-form-group">
                <label>Reminder Days Before</label>
                <select name="reminderDays" value={form.reminderDays} onChange={handleChange}>
                  {reminderOptions.map((d) => (
                    <option key={d} value={d}>{d} day{d > 1 ? "s" : ""} before</option>
                  ))}
                </select>
              </div>
              <div className="fu-form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="fu-form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Holiday description..." />
            </div>
          </div>

          <div className="fu-modal-footer">
            <button type="button" className="fu-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="fu-save-btn" disabled={loading}>
              {loading ? "Saving..." : editing ? "Update Holiday" : "Add Holiday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
