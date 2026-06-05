import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { invoiceService } from "../../../services/invoiceService";

const INVOICE_TYPES = ["Fee", "Installment", "Registration", "Additional Service"];
const STATUS_OPTIONS = ["Pending", "Paid", "Overdue", "Cancelled"];

export default function InvoiceModal({ show, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    invoiceNumber: "",
    studentId: "",
    feeId: "",
    counselorId: "",
    amount: "",
    tax: "0",
    discount: "0",
    dueDate: "",
    invoiceType: "Fee",
    status: "Pending",
    notes: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        invoiceNumber: editing.invoiceNumber || "",
        studentId: editing.studentId?._id || "",
        feeId: editing.feeId?._id || "",
        counselorId: editing.counselorId?._id || "",
        amount: editing.amount || "",
        tax: editing.tax || "0",
        discount: editing.discount || "0",
        dueDate: editing.dueDate ? editing.dueDate.split("T")[0] : "",
        invoiceType: editing.invoiceType || "Fee",
        status: editing.status || "Pending",
        notes: editing.notes || "",
      });
    } else {
      invoiceService.generateNumber().then((res) => {
        setForm((prev) => ({ ...prev, invoiceNumber: res.data.invoiceNumber || "" }));
      }).catch(() => {});
      setForm({ invoiceNumber: "", studentId: "", feeId: "", counselorId: "", amount: "", tax: "0", discount: "0", dueDate: "", invoiceType: "Fee", status: "Pending", notes: "" });
    }
  }, [editing, show]);

  if (!show) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      tax: parseFloat(form.tax) || 0,
      discount: parseFloat(form.discount) || 0,
    };
    await onSave(data, editing?._id);
  };

  return (
    <>
      <div className="fin-overlay" onClick={onClose} />
      <div className="hl-modal-overlay">
        <div className="hl-modal" style={{ maxWidth: 500 }}>
          <div className="hl-modal-header">
            <h3>{editing ? "Edit Invoice" : "Create Invoice"}</h3>
            <button className="hl-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="hl-modal-body">
              <div className="hl-form-row">
                <label>Invoice Number <span className="text-danger">*</span></label>
                <input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} required placeholder="INV-00001" />
              </div>
              <div className="hl-form-row">
                <label>Student ID <span className="text-danger">*</span></label>
                <input name="studentId" value={form.studentId} onChange={handleChange} required placeholder="Student MongoDB ID" />
              </div>
              <div className="hl-form-row">
                <label>Fee ID</label>
                <input name="feeId" value={form.feeId} onChange={handleChange} placeholder="Fee MongoDB ID" />
              </div>
              <div className="hl-form-row">
                <label>Counselor ID</label>
                <input name="counselorId" value={form.counselorId} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Amount</label>
                <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Tax</label>
                <input name="tax" type="number" step="0.01" value={form.tax} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Discount</label>
                <input name="discount" type="number" step="0.01" value={form.discount} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Due Date</label>
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
              </div>
              <div className="hl-form-row">
                <label>Invoice Type</label>
                <select name="invoiceType" value={form.invoiceType} onChange={handleChange}>
                  {INVOICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {editing && (
                <div className="hl-form-row">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div className="hl-form-row">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
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
