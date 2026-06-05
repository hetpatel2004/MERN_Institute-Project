import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CATEGORIES = ["Office Rent", "Salary", "Electricity", "Internet", "Marketing", "Software", "Hardware", "Maintenance", "Miscellaneous"];
const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

export default function ExpenseModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    title: "",
    category: "Miscellaneous",
    amount: "",
    vendorName: "",
    invoiceNumber: "",
    expenseDate: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        category: editing.category || "Miscellaneous",
        amount: editing.amount || "",
        vendorName: editing.vendorName || "",
        invoiceNumber: editing.invoiceNumber || "",
        expenseDate: editing.expenseDate ? editing.expenseDate.split("T")[0] : "",
        description: editing.description || "",
        status: editing.status || "Pending",
      });
    } else {
      setForm({ title: "", category: "Miscellaneous", amount: "", vendorName: "", invoiceNumber: "", expenseDate: "", description: "", status: "Pending" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, amount: parseFloat(form.amount) || 0 };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Expense" : "Add Expense"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Title <span className="text-danger">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Expense title" />
              </div>
              <div className="hl-form-row">
                <label>Category <span className="text-danger">*</span></label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="hl-form-row">
                <label>Amount <span className="text-danger">*</span></label>
                <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required />
              </div>
              <div className="hl-form-row">
                <label>Vendor Name</label>
                <input name="vendorName" value={form.vendorName} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Invoice Number</label>
                <input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Expense Date</label>
                <input name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
              {editing && (
                <div className="hl-form-row">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
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
