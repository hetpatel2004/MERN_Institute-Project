import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GraduationCap, Search, ChevronLeft } from "lucide-react";
import "./Institute.css";

function InstituteAdmissions() {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [inst, setInst] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/institutes/${instituteId}`).then((r) => setInst(r.data)).catch(() => {});
    fetchAdmissions();
  }, [instituteId]);

  const fetchAdmissions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admissions?instituteId=${instituteId}`);
      setAdmissions(res.data.admissions || []);
    } catch (err) { console.error(err); }
  };

  const filtered = admissions.filter((a) =>
    !search || a.studentName?.toLowerCase().includes(search.toLowerCase()) || a.admissionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inst-page">
      <div className="inst-back-bar">
        <button onClick={() => navigate("/superadmin/institute")} className="inst-back-btn">
          <ChevronLeft size={20} /> Institutes
        </button>
        <span className="inst-breadcrumb">/ {inst?.name || "Institute"} / Admissions</span>
      </div>

      <div className="inst-sub-header">
        <h2>Admissions - {inst?.name || "Loading..."}</h2>
        <div className="inst-search-box" style={{ maxWidth: 300 }}>
          <Search size={16} />
          <input placeholder="Search admissions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="inst-table-card">
        <div className="inst-table-wrap">
          <table>
            <thead>
              <tr><th>Admission ID</th><th>Student Name</th><th>Course</th><th>Date</th><th>Status</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="inst-empty">No admissions found</td></tr>
              ) : filtered.map((a) => (
                <tr key={a._id}>
                  <td className="inst-id">{a.admissionId}</td>
                  <td className="inst-name-cell"><GraduationCap size={16} /> {a.studentName}</td>
                  <td>{a.courseName || "-"}</td>
                  <td>{a.admissionDate ? new Date(a.admissionDate).toLocaleDateString() : "-"}</td>
                  <td><span className={`inst-status ${a.status?.toLowerCase()}`}>{a.status}</span></td>
                  <td>\u20B9{(a.paidAmount || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstituteAdmissions;
