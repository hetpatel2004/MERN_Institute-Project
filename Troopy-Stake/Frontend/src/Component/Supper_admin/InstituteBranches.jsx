import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Building2, Plus, Edit, Trash2, Search, ChevronLeft } from "lucide-react";
import "./Institute.css";

function InstituteBranches() {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [inst, setInst] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/institutes/${instituteId}`).then((r) => setInst(r.data)).catch(() => {});
    fetchBranches();
  }, [instituteId]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/branches?instituteId=${instituteId}`);
      setBranches(res.data.branches || []);
    } catch (err) { console.error(err); }
  };

  const filtered = branches.filter((b) =>
    !search || b.branchName?.toLowerCase().includes(search.toLowerCase()) || b.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inst-page">
      <div className="inst-back-bar">
        <button onClick={() => navigate("/superadmin/institute")} className="inst-back-btn">
          <ChevronLeft size={20} /> Institutes
        </button>
        <span className="inst-breadcrumb">/ {inst?.name || "Institute"} / Branches</span>
      </div>

      <div className="inst-sub-header">
        <h2>Branches - {inst?.name || "Loading..."}</h2>
        <div className="inst-search-box" style={{ maxWidth: 300 }}>
          <Search size={16} />
          <input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="inst-table-card">
        <div className="inst-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Branch Name</th><th>Code</th><th>City</th><th>State</th><th>Phone</th><th>Email</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="inst-empty">No branches found</td></tr>
              ) : filtered.map((b) => (
                <tr key={b._id}>
                  <td className="inst-name-cell"><Building2 size={16} /> {b.branchName}</td>
                  <td>{b.branchCode || "-"}</td>
                  <td>{b.city || "-"}</td>
                  <td>{b.state || "-"}</td>
                  <td>{b.phone || "-"}</td>
                  <td>{b.email || "-"}</td>
                  <td><span className={`inst-status ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstituteBranches;
