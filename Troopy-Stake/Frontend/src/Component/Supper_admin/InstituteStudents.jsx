import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Search, ChevronLeft } from "lucide-react";
import "./Institute.css";

function InstituteStudents() {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [inst, setInst] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/institutes/${instituteId}`).then((r) => setInst(r.data)).catch(() => {});
    fetchStudents();
  }, [instituteId]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students?instituteId=${instituteId}`);
      setStudents(res.data.students || []);
    } catch (err) { console.error(err); }
  };

  const filtered = students.filter((s) =>
    !search || s.studentName?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search)
  );

  return (
    <div className="inst-page">
      <div className="inst-back-bar">
        <button onClick={() => navigate("/superadmin/institute")} className="inst-back-btn">
          <ChevronLeft size={20} /> Institutes
        </button>
        <span className="inst-breadcrumb">/ {inst?.name || "Institute"} / Students</span>
      </div>

      <div className="inst-sub-header">
        <h2>Students - {inst?.name || "Loading..."}</h2>
        <div className="inst-search-box" style={{ maxWidth: 300 }}>
          <Search size={16} />
          <input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="inst-table-card">
        <div className="inst-table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="inst-empty">No students found</td></tr>
              ) : filtered.map((s) => (
                <tr key={s._id}>
                  <td className="inst-name-cell"><Users size={16} /> {s.studentName}</td>
                  <td>{s.email || "-"}</td>
                  <td>{s.phone || "-"}</td>
                  <td><span className={`inst-status ${s.status?.toLowerCase()}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstituteStudents;
