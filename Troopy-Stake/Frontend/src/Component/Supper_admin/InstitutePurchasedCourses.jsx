import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, Search, ChevronLeft, Plus } from "lucide-react";
import "./Institute.css";

function InstitutePurchasedCourses() {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [courses, setCourses] = useState([]);
  const [inst, setInst] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/institutes/${instituteId}`).then((r) => setInst(r.data)).catch(() => {});
    fetchPurchases();
    axios.get("http://localhost:5000/api/courses").then((r) => setCourses(r.data || [])).catch(() => {});
  }, [instituteId]);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/institute-course-purchases?instituteId=${instituteId}`);
      setPurchases(res.data.purchases || []);
    } catch (err) { console.error(err); }
  };

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/institute-course-purchases", {
        instituteId,
        courseId: selectedCourse,
        purchaseAmount: Number(purchaseAmount) || 0,
        status: "Active",
        paymentStatus: "Pending",
      });
      setShowAdd(false);
      setSelectedCourse("");
      setPurchaseAmount("");
      fetchPurchases();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add purchase");
    }
  };

  return (
    <div className="inst-page">
      <div className="inst-back-bar">
        <button onClick={() => navigate("/superadmin/institute")} className="inst-back-btn">
          <ChevronLeft size={20} /> Institutes
        </button>
        <span className="inst-breadcrumb">/ {inst?.name || "Institute"} / Purchased Courses</span>
      </div>

      <div className="inst-sub-header">
        <h2>Purchased Courses - {inst?.name || "Loading..."}</h2>
        <button className="inst-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Purchase Course
        </button>
      </div>

      <div className="inst-table-card">
        <div className="inst-table-wrap">
          <table>
            <thead>
              <tr><th>Course</th><th>Amount</th><th>Purchase Date</th><th>Expiry Date</th><th>Status</th><th>Payment</th></tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan={6} className="inst-empty">No purchased courses found</td></tr>
              ) : purchases.map((p) => (
                <tr key={p._id}>
                  <td className="inst-name-cell"><BookOpen size={16} /> {p.courseId?.title || p.courseId || "-"}</td>
                  <td className="inst-revenue">\u20B9{(p.purchaseAmount || 0).toLocaleString()}</td>
                  <td>{p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : "-"}</td>
                  <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "-"}</td>
                  <td><span className={`inst-status ${p.status?.toLowerCase()}`}>{p.status}</span></td>
                  <td><span className={`inst-status ${p.paymentStatus?.toLowerCase()}`}>{p.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="inst-overlay" onClick={() => setShowAdd(false)}>
          <div className="inst-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="inst-modal-header">
              <h2>Purchase Course</h2>
              <button className="inst-modal-close" onClick={() => setShowAdd(false)}><BookOpen size={20} /></button>
            </div>
            <form onSubmit={handleAddPurchase}>
              <div className="inst-modal-body">
                <div className="inst-form-group">
                  <label>Select Course <span className="required-star">*</span></label>
                  <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                    <option value="">-- Select --</option>
                    {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="inst-form-group">
                  <label>Purchase Amount</label>
                  <input type="number" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} min="0" />
                </div>
              </div>
              <div className="inst-modal-footer">
                <button type="button" className="inst-cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="inst-save-btn">Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstitutePurchasedCourses;
