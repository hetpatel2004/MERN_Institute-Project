import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CreditCard, Search, ChevronLeft } from "lucide-react";
import "./Institute.css";

function InstitutePayments() {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [inst, setInst] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/institutes/${instituteId}`).then((r) => setInst(r.data)).catch(() => {});
    fetchPayments();
  }, [instituteId]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payments?instituteId=${instituteId}`);
      setPayments(res.data.payments || []);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="inst-page">
      <div className="inst-back-bar">
        <button onClick={() => navigate("/superadmin/institute")} className="inst-back-btn">
          <ChevronLeft size={20} /> Institutes
        </button>
        <span className="inst-breadcrumb">/ {inst?.name || "Institute"} / Payments</span>
      </div>

      <div className="inst-sub-header">
        <h2>Payments - {inst?.name || "Loading..."}</h2>
      </div>

      <div className="inst-table-card">
        <div className="inst-table-wrap">
          <table>
            <thead>
              <tr><th>Type</th><th>Amount</th><th>Payment Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={4} className="inst-empty">No payments found</td></tr>
              ) : payments.map((p) => (
                <tr key={p._id}>
                  <td><CreditCard size={16} /> {p.paymentType}</td>
                  <td className="inst-revenue">\u20B9{(p.amount || 0).toLocaleString()}</td>
                  <td><span className={`inst-status ${p.paymentStatus?.toLowerCase()}`}>{p.paymentStatus}</span></td>
                  <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstitutePayments;
