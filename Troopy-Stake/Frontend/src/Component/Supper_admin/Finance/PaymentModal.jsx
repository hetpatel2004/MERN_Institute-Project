import React, { useState } from "react";
import { X, DollarSign } from "lucide-react";

const PAYMENT_METHODS = ["Cash", "UPI", "Credit Card", "Debit Card", "Bank Transfer", "Cheque"];

export default function PaymentModal({ show, onClose, onCollect, fee }) {
  const [form, setForm] = useState({ amount: "", paymentMethod: "Cash", transactionId: "", remarks: "" });
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCollect(fee._id, form);
      setForm({ amount: "", paymentMethod: "Cash", transactionId: "", remarks: "" });
    } finally {
      setLoading(false);
    }
  };

  const pending = fee ? fee.finalFees - fee.paidAmount : 0;

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 450 }}>
          <div className="hl-modal-header">
            <h3><DollarSign size={18} style={{ marginRight: 6 }} /> Collect Payment</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          {fee && (
            <div style={{ padding: "0 24px", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#667085" }}>
                <span>Total: ₹{fee.finalFees?.toLocaleString()}</span>
                <span>Paid: ₹{fee.paidAmount?.toLocaleString()}</span>
                <span style={{ fontWeight: 600, color: "#dc2626" }}>Pending: ₹{pending.toLocaleString()}</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Amount <span className="text-danger">*</span></label>
                <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required placeholder="Enter amount" max={pending} />
              </div>
              <div className="hl-form-row">
                <label>Payment Method <span className="text-danger">*</span></label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Transaction ID</label>
                <input name="transactionId" value={form.transactionId} onChange={handleChange} placeholder="Optional" />
              </div>
              <div className="hl-form-row">
                <label>Remarks</label>
                <textarea name="remarks" value={form.remarks} onChange={handleChange} rows={2} placeholder="Optional" />
              </div>
            </div>
            <div className="hl-modal-footer">
              <button type="button" className="hl-btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="hl-btn-primary" disabled={loading}>
                {loading ? "Processing..." : "Collect Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
