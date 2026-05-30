import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const API = "http://localhost:5000/api";

const campaignTypes = [
  "Facebook Ads",
  "Instagram Ads",
  "Google Ads",
  "WhatsApp Campaign",
  "Referral",
  "Walk-in",
  "Email Marketing",
];

const statuses = ["Active", "Paused", "Completed"];

const defaultForm = {
  name: "",
  type: "",
  instituteId: "",
  branchId: "",
  counsellorId: "",
  budget: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Active",
};

export default function CampaignModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState(defaultForm);
  const [institutes, setInstitutes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchInstitutes();
      fetchBranches();
      fetchCounsellors();
      if (editing) {
        setForm({
          name: editing.name || "",
          type: editing.type || "",
          instituteId: editing.instituteId?._id || editing.instituteId || "",
          branchId: editing.branchId?._id || editing.branchId || "",
          counsellorId: editing.counsellorId?._id || editing.counsellorId || "",
          budget: editing.budget || "",
          description: editing.description || "",
          startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
          endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
          status: editing.status || "Active",
        });
      } else {
        setForm(defaultForm);
      }
    }
  }, [show, editing]);

  const fetchInstitutes = async () => {
    try {
      const res = await axios.get(`${API}/institutes`);
      setInstitutes(res.data.institutes || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.branches || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCounsellors = async () => {
    try {
      const res = await axios.get(`${API}/counsellors`);
      const data = res.data.counsellors || res.data || [];
      setCounsellors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) {
      alert("Please fill Campaign Name and Type");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        budget: Number(form.budget) || 0,
      };
      await onSave(payload, editing?._id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save campaign");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fu-overlay" onClick={onClose}>
      <div className="fu-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="fu-modal-header">
          <h2>{editing ? "Edit Campaign" : "Create Campaign"}</h2>
          <button className="fu-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fu-modal-body">
            <div className="fu-form-row">
              <div className="fu-form-group">
                <label>Campaign Name <span className="required-star">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Enter campaign name" />
              </div>
              <div className="fu-form-group">
                <label>Campaign Type <span className="required-star">*</span></label>
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  {campaignTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="fu-form-row">
              <div className="fu-form-group">
                <label>Institute</label>
                <select name="instituteId" value={form.instituteId} onChange={handleChange}>
                  <option value="">All Institutes</option>
                  {institutes.map((inst) => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div className="fu-form-group">
                <label>Branch</label>
                <select name="branchId" value={form.branchId} onChange={handleChange}>
                  <option value="">All Branches</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>{b.branchName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fu-form-row">
              <div className="fu-form-group">
                <label>Assign Counsellor</label>
                <select name="counsellorId" value={form.counsellorId} onChange={handleChange}>
                  <option value="">Select Counsellor</option>
                  {counsellors.map((c) => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div className="fu-form-group">
                <label>Budget (₹)</label>
                <input name="budget" type="number" value={form.budget} onChange={handleChange} placeholder="0" min="0" />
              </div>
            </div>

            <div className="fu-form-row">
              <div className="fu-form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="fu-form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
              </div>
            </div>

            <div className="fu-form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="fu-form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Campaign description, goals, target audience..." />
            </div>
          </div>

          <div className="fu-modal-footer">
            <button type="button" className="fu-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="fu-save-btn" disabled={loading}>
              {loading ? "Saving..." : editing ? "Update Campaign" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
