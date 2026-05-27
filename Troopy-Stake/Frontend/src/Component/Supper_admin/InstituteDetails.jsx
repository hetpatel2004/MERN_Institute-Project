import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2, Globe, MapPin, Phone, Mail, ChevronLeft,
  Edit, BookOpen, Users, GraduationCap, IndianRupee, CreditCard,
  ExternalLink,
} from "lucide-react";
import "./Institute.css";

function InstituteDetails() {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [inst, setInst] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitute();
  }, [instituteId]);

  const fetchInstitute = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/institutes/${instituteId}`);
      setInst(res.data);
    } catch (err) {
      alert("Institute not found");
      navigate("/superadmin/institute");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="inst-page"><div className="inst-loading">Loading...</div></div>;
  if (!inst) return null;

  const infoCards = [
    { label: "Total Branches", value: inst.totalBranches ?? 0, color: "#10b981" },
    { label: "Total Students", value: inst.totalStudents ?? 0, color: "#8b5cf6" },
    { label: "Courses Purchased", value: inst.totalCoursesPurchased ?? 0, color: "#f59e0b" },
    { label: "Total Admissions", value: inst.totalAdmissions ?? 0, color: "#ef4444" },
    { label: "Total Revenue", value: `\u20B9${(inst.totalRevenue ?? 0).toLocaleString()}`, color: "#14b8a6" },
  ];

  return (
    <div className="inst-page">
      <div className="inst-back-bar">
        <button onClick={() => navigate("/superadmin/institute")} className="inst-back-btn">
          <ChevronLeft size={20} /> Back to Institutes
        </button>
      </div>

      <div className="inst-detail-header">
        <div className="inst-detail-brand">
          {inst.logo ? (
            <img src={inst.logo} alt="" className="inst-detail-logo" />
          ) : (
            <div className="inst-detail-logo-placeholder"><Building2 size={40} /></div>
          )}
          <div>
            <h1>{inst.name}</h1>
            <p className="inst-detail-id">ID: {inst.instituteId} &bull; Code: {inst.code}</p>
            <span className={`inst-status ${inst.status?.toLowerCase()}`}>{inst.status}</span>
          </div>
        </div>
        <button className="inst-edit-btn" onClick={() => navigate(`/superadmin/institute`)}>
          <Edit size={16} /> Edit
        </button>
      </div>

      <div className="inst-detail-stats">
        {infoCards.map((c) => (
          <div key={c.label} className="inst-stat-card inst-stat-sm">
            <div className="inst-stat-dot" style={{ background: c.color }} />
            <p className="inst-stat-label">{c.label}</p>
            <h3>{c.value}</h3>
          </div>
        ))}
      </div>

      <div className="inst-detail-grid">
        <div className="inst-detail-card">
          <h3><MapPin size={18} /> Address</h3>
          <p>{inst.address || "N/A"}</p>
          <p>{[inst.city, inst.state, inst.country, inst.pincode].filter(Boolean).join(", ") || "N/A"}</p>
        </div>

        <div className="inst-detail-card">
          <h3><Phone size={18} /> Contact</h3>
          <p><Mail size={14} /> {inst.email}</p>
          <p><Phone size={14} /> {inst.phone}</p>
          {inst.alternatePhone && <p><Phone size={14} /> {inst.alternatePhone}</p>}
          {inst.website && (
            <p><Globe size={14} /> <a href={inst.website} target="_blank" rel="noreferrer">{inst.website}</a></p>
          )}
        </div>

        <div className="inst-detail-card">
          <h3>Registration</h3>
          <p><b>Reg No:</b> {inst.registrationNumber || "N/A"}</p>
          <p><b>Type:</b> {inst.instituteType || "N/A"}</p>
          <p><b>Established:</b> {inst.establishedYear || "N/A"}</p>
        </div>

        {(inst.socialLinks?.facebook || inst.socialLinks?.twitter || inst.socialLinks?.linkedin || inst.socialLinks?.youtube) && (
          <div className="inst-detail-card">
            <h3><ExternalLink size={18} /> Social Links</h3>
            <div className="inst-social-links">
              {inst.socialLinks.facebook && <a href={inst.socialLinks.facebook} target="_blank" rel="noreferrer"><Globe size={16} /> FB</a>}
              {inst.socialLinks.twitter && <a href={inst.socialLinks.twitter} target="_blank" rel="noreferrer"><Globe size={16} /> Tw</a>}
              {inst.socialLinks.linkedin && <a href={inst.socialLinks.linkedin} target="_blank" rel="noreferrer"><Globe size={16} /> In</a>}
              {inst.socialLinks.youtube && <a href={inst.socialLinks.youtube} target="_blank" rel="noreferrer"><Globe size={16} /> YT</a>}
            </div>
          </div>
        )}

        {inst.facilities?.length > 0 && (
          <div className="inst-detail-card inst-detail-wide">
            <h3>Facilities</h3>
            <div className="inst-facilities">
              {inst.facilities.map((f, i) => <span key={i} className="inst-facility-tag">{f}</span>)}
            </div>
          </div>
        )}
      </div>

      <div className="inst-quick-actions">
        <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/branches`)}><Building2 size={18} /> Branches</button>
        <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/students`)}><Users size={18} /> Students</button>
        <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/admissions`)}><GraduationCap size={18} /> Admissions</button>
        <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/payments`)}><CreditCard size={18} /> Payments</button>
        <button onClick={() => navigate(`/superadmin/institutes/${inst._id}/purchased-courses`)}><BookOpen size={18} /> Purchased Courses</button>
      </div>
    </div>
  );
}

export default InstituteDetails;
