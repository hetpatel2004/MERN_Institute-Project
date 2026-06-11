import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Draft", "Submitted", "Approved"];

export default function DailyReportModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    reportDate: "",
    summary: "",
    leadsGenerated: "",
    followUpsDone: "",
    admissionsDone: "",
    feesCollected: "",
    callsMade: "",
    meetingsHeld: "",
    notes: "",
    status: "Draft",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      if (editing) {
        setForm({
          reportDate: editing.reportDate ? editing.reportDate.slice(0, 10) : "",
          summary: editing.summary || "",
          leadsGenerated: editing.leadsGenerated || "",
          followUpsDone: editing.followUpsDone || "",
          admissionsDone: editing.admissionsDone || "",
          feesCollected: editing.feesCollected || "",
          callsMade: editing.callsMade || "",
          meetingsHeld: editing.meetingsHeld || "",
          notes: editing.notes || "",
          status: editing.status || "Draft",
        });
      } else {
        setForm({ reportDate: "", summary: "", leadsGenerated: "", followUpsDone: "", admissionsDone: "", feesCollected: "", callsMade: "", meetingsHeld: "", notes: "", status: "Draft" });
      }
    }
  }, [show, editing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reportDate) return;
    setSaving(true);
    const data = {
      ...form,
      leadsGenerated: parseInt(form.leadsGenerated) || 0,
      followUpsDone: parseInt(form.followUpsDone) || 0,
      admissionsDone: parseInt(form.admissionsDone) || 0,
      feesCollected: parseFloat(form.feesCollected) || 0,
      callsMade: parseInt(form.callsMade) || 0,
      meetingsHeld: parseInt(form.meetingsHeld) || 0,
    };
    const ok = await onSave(data, editing?._id);
    if (ok !== false) onClose();
    setSaving(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 600 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Daily Report" : "Add Daily Report"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Report Date <span className="text-danger">*</span></label>
                <input type="date" name="reportDate" value={form.reportDate} onChange={handleChange} required />
              </div>
              <div className="hl-form-row">
                <label>Summary</label>
                <textarea name="summary" value={form.summary} onChange={handleChange} rows={2} placeholder="Brief summary of the day..." />
              </div>
              <div className="hl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label>Leads Generated</label>
                  <input type="number" min="0" name="leadsGenerated" value={form.leadsGenerated} onChange={handleChange} />
                </div>
                <div>
                  <label>Follow Ups Done</label>
                  <input type="number" min="0" name="followUpsDone" value={form.followUpsDone} onChange={handleChange} />
                </div>
                <div>
                  <label>Admissions Done</label>
                  <input type="number" min="0" name="admissionsDone" value={form.admissionsDone} onChange={handleChange} />
                </div>
              </div>
              <div className="hl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label>Fees Collected (₹)</label>
                  <input type="number" min="0" step="0.01" name="feesCollected" value={form.feesCollected} onChange={handleChange} />
                </div>
                <div>
                  <label>Calls Made</label>
                  <input type="number" min="0" name="callsMade" value={form.callsMade} onChange={handleChange} />
                </div>
                <div>
                  <label>Meetings Held</label>
                  <input type="number" min="0" name="meetingsHeld" value={form.meetingsHeld} onChange={handleChange} />
                </div>
              </div>
              <div className="hl-form-row">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Additional notes..." />
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
              <button type="submit" className="hl-btn-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
