import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Ban,
  FileText,
  CreditCard,
  Upload,
} from "lucide-react";
import "./Admission.css";

const API = "http://localhost:5000/api/admissions";

const statuses = ["Confirmed", "Pending", "Cancelled"];
const paymentStatuses = ["Paid", "Partial", "Pending", "Refunded"];
const paymentModes = ["Cash", "UPI", "Bank Transfer", "Card", "EMI"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const categories = ["General", "OBC", "SC", "ST", "EWS", "Other"];
const courseTypes = ["Online", "Offline", "Hybrid"];
const referenceSources = ["Direct", "Referral", "Social Media", "Website", "Walk-in", "Other"];

const defaultForm = {
  studentName: "",
  fatherName: "",
  motherName: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  category: "",
  aadhaarNumber: "",
  nationality: "Indian",
  phone: "",
  alternateMobile: "",
  email: "",
  whatsappNumber: "",
  parentNumbers: "",
  addressLine: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  branchName: "",
  courseName: "",
  courseDuration: "",
  batchName: "",
  semesterYear: "",
  admissionCounselor: "",
  referenceSource: "",
  totalFees: "",
  registrationFees: "",
  discount: "",
  discountPercent: "",
  scholarship: "",
  gstTax: "",
  paidAmount: "",
  paymentMode: "",
  emiAllowed: false,
  installmentCount: "",
  nextInstallmentDate: "",
  courseType: "",
  duration: "",
  startDate: "",
  endDate: "",
  trainerFaculty: "",
  status: "Pending",
  notes: "",
  createdBy: "",
};

function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [stats, setStats] = useState({
    total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0,
  });
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterCourseType, setFilterCourseType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [viewItem, setViewItem] = useState(null);
  const [actionOpen, setActionOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => { fetchStats(); fetchCourses(); fetchBranches(); fetchBatches(); fetchTrainers(); }, []);

  useEffect(() => { fetchAdmissions(); }, [page, filterStatus, filterPayment, filterBranch, filterCourse, filterGender, filterCourseType, dateFrom, dateTo]);

  useEffect(() => { setPage(1); }, [search, filterStatus, filterPayment, filterBranch, filterCourse, filterGender, filterCourseType, dateFrom, dateTo]);

  const fetchStats = async () => {
    try { const res = await axios.get(`${API}/stats`); setStats(res.data); }
    catch (err) { console.error("Failed to load stats", err); }
  };

  const fetchAdmissions = async () => {
    try {
      const params = { page, limit };
      if (filterStatus) params.status = filterStatus;
      if (filterPayment) params.paymentStatus = filterPayment;
      if (filterBranch) params.branch = filterBranch;
      if (filterCourse) params.course = filterCourse;
      if (filterGender) params.gender = filterGender;
      if (filterCourseType) params.courseType = filterCourseType;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (search.trim()) params.search = search.trim();
      const res = await axios.get(`${API}`, { params });
      setAdmissions(res.data.admissions);
      setTotalPages(res.data.pages);
      setTotalItems(res.data.total);
    } catch (err) { console.error("Failed to load admissions", err); }
  };

  const fetchCourses = async () => {
    try { const res = await axios.get("http://localhost:5000/api/courses"); setCourses(res.data || []); }
    catch (err) { console.error(err); }
  };

  const fetchBranches = async () => {
    try { const res = await axios.get("http://localhost:5000/api/branches"); setBranches(res.data || []); }
    catch (err) { console.error(err); }
  };

  const fetchBatches = async () => {
    try { const res = await axios.get("http://localhost:5000/api/batches"); setBatches(res.data || []); }
    catch (err) { console.error(err); }
  };

  const fetchTrainers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const allUsers = res.data || [];
      const trainersList = allUsers.filter((u) => u.role === "branchadmin" || u.role === "superadmin");
      setTrainers(trainersList);
    } catch (err) { console.error(err); }
  };

  const handleSearch = () => { setPage(1); fetchAdmissions(); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      studentName: item.studentName || "",
      fatherName: item.fatherName || "",
      motherName: item.motherName || "",
      gender: item.gender || "",
      dateOfBirth: item.dateOfBirth ? item.dateOfBirth.slice(0, 10) : "",
      bloodGroup: item.bloodGroup || "",
      category: item.category || "",
      aadhaarNumber: item.aadhaarNumber || "",
      nationality: item.nationality || "Indian",
      phone: item.phone || "",
      alternateMobile: item.alternateMobile || "",
      email: item.email || "",
      whatsappNumber: item.whatsappNumber || "",
      parentNumbers: item.parentNumbers ? item.parentNumbers.join(", ") : "",
      addressLine: item.addressLine || "",
      city: item.city || "",
      state: item.state || "",
      country: item.country || "India",
      pincode: item.pincode || "",
      admissionDate: item.admissionDate ? item.admissionDate.slice(0, 10) : "",
      branchName: item.branchName || "",
      courseName: item.courseName || "",
      courseDuration: item.courseDuration || "",
      batchName: item.batchName || "",
      semesterYear: item.semesterYear || "",
      admissionCounselor: item.admissionCounselor || "",
      referenceSource: item.referenceSource || "",
      totalFees: item.totalFees || "",
      registrationFees: item.registrationFees || "",
      discount: item.discount || "",
      discountPercent: item.discountPercent || "",
      scholarship: item.scholarship || "",
      gstTax: item.gstTax || "",
      paidAmount: item.paidAmount || "",
      paymentMode: item.paymentMode || "",
      emiAllowed: item.emiAllowed || false,
      installmentCount: item.installmentCount || "",
      nextInstallmentDate: item.nextInstallmentDate ? item.nextInstallmentDate.slice(0, 10) : "",
      courseType: item.courseType || "",
      duration: item.duration || "",
      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
      trainerFaculty: item.trainerFaculty || "",
      status: item.status || "Pending",
      notes: item.notes || "",
      createdBy: item.createdBy || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        totalFees: Number(form.totalFees) || 0,
        registrationFees: Number(form.registrationFees) || 0,
        paidAmount: Number(form.paidAmount) || 0,
        discount: Number(form.discount) || 0,
        discountPercent: Number(form.discountPercent) || 0,
        scholarship: Number(form.scholarship) || 0,
        gstTax: Number(form.gstTax) || 0,
        installmentCount: Number(form.installmentCount) || 0,
        emiAllowed: form.emiAllowed === true || form.emiAllowed === "true",
        parentNumbers: form.parentNumbers ? form.parentNumbers.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };

      if (editing) {
        await axios.put(`${API}/${editing}`, payload);
      } else {
        await axios.post(`${API}`, payload);
      }

      setShowModal(false);
      setEditing(null);
      fetchAdmissions();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save admission. Please check all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admission?")) return;
    try { await axios.delete(`${API}/${id}`); fetchAdmissions(); fetchStats(); }
    catch (err) { alert("Failed to delete"); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this admission? This will mark payment as refunded.")) return;
    try { await axios.patch(`${API}/${id}/cancel`); fetchAdmissions(); fetchStats(); }
    catch (err) { alert("Failed to cancel"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const statCards = useMemo(() => [
    { label: "Total Admissions", value: stats.total, color: "#3b82f6" },
    { label: "Confirmed", value: stats.confirmed, color: "#10b981" },
    { label: "Pending", value: stats.pending, color: "#f59e0b" },
    { label: "Cancelled", value: stats.cancelled, color: "#ef4444" },
    { label: "Total Revenue", value: `\u20B9${stats.totalRevenue.toLocaleString()}`, color: "#8b5cf6" },
  ], [stats]);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatCurrency = (n) => {
    if (n === undefined || n === null) return "-";
    return `\u20B9${Number(n).toLocaleString()}`;
  };

  const statusBadge = (status) => {
    const map = { Confirmed: "adm-badge-confirmed", Pending: "adm-badge-pending", Cancelled: "adm-badge-cancelled" };
    return <span className={`adm-badge ${map[status] || ""}`}>{status}</span>;
  };

  const paymentBadge = (status) => {
    const map = { Paid: "adm-pay-paid", Partial: "adm-pay-partial", Pending: "adm-pay-pending", Refunded: "adm-pay-refunded" };
    return <span className={`adm-pay-badge ${map[status] || ""}`}>{status}</span>;
  };

  const renderField = (label, name, type = "text", options = null, required = false) => {
    const Tag = type === "textarea" ? "textarea" : type === "select" ? "select" : "input";
    const inputType = type === "select" || type === "textarea" ? undefined : type;

    return (
      <div className="adm-form-group">
        <label>{label}{required && <span className="required-star">*</span>}</label>
        {Tag === "select" ? (
          <select name={name} value={form[name]} onChange={handleChange} required={required}>
            <option value="">-- Select --</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ) : Tag === "textarea" ? (
          <textarea name={name} value={form[name]} onChange={handleChange} rows={3} />
        ) : (
          <input type={inputType} name={name} value={form[name]} onChange={handleChange} required={required} />
        )}
      </div>
    );
  };

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Admissions</h1>
          <p className="adm-subtitle">Manage all student admissions and track payments</p>
        </div>
        <button className="adm-add-btn" onClick={openCreate}>
          <Plus size={18} /> Add Admission
        </button>
      </div>

      <div className="adm-stats">
        {statCards.map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-dot" style={{ background: s.color }} />
            <p className="adm-stat-label">{s.label}</p>
            <h2 className="adm-stat-value">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="adm-filters">
        <div className="adm-search-box">
          <Search size={18} />
          <input type="text" placeholder="Search by name, email, phone, Aadhaar or ID..." value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
        </div>
        <div className="adm-filter-group">
          <Filter size={16} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
            <option value="">All Payments</option>
            {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
            <option value="">All Branches</option>
            {branches.map((b) => <option key={b._id} value={b.branch_name}>{b.branch_name}</option>)}
          </select>
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="">All Courses</option>
            {courses.map((c) => <option key={c._id} value={c.title || c.name}>{c.title || c.name}</option>)}
          </select>
          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select value={filterCourseType} onChange={(e) => setFilterCourseType(e.target.value)}>
            <option value="">All Types</option>
            {courseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To date" />
          {(filterStatus || filterPayment || filterBranch || filterCourse || filterGender || filterCourseType || dateFrom || dateTo || search) && (
            <button className="adm-clear-btn" onClick={() => {
              setSearch(""); setFilterStatus(""); setFilterPayment(""); setFilterBranch("");
              setFilterCourse(""); setFilterGender(""); setFilterCourseType(""); setDateFrom(""); setDateTo(""); setPage(1);
            }}><X size={16} /></button>
          )}
        </div>
      </div>

      <div className="adm-table-card">
        <div className="adm-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Student Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Branch</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.length === 0 ? (
                <tr><td colSpan={11} className="adm-empty">No admissions found</td></tr>
              ) : (
                admissions.map((a) => (
                  <tr key={a._id}>
                    <td className="adm-id">{a.admissionId}</td>
                    <td className="adm-name-cell">{a.studentName}</td>
                    <td>{a.gender || "-"}</td>
                    <td>{a.phone}</td>
                    <td>{a.courseName || "-"}</td>
                    <td>{a.branchName || "-"}</td>
                    <td>{formatDate(a.admissionDate)}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td>{paymentBadge(a.paymentStatus)}</td>
                    <td className="adm-amount">{formatCurrency(a.paidAmount)}</td>
                    <td>
                      <div className="adm-action-wrap">
                        <button className="adm-action-btn"
                          onClick={() => setActionOpen(actionOpen === a._id ? null : a._id)}>...</button>
                        {actionOpen === a._id && (
                          <div className="adm-dropdown">
                            <button onClick={() => { setViewItem(a); setActionOpen(null); }}>
                              <Eye size={15} /> View Details
                            </button>
                            <button onClick={() => { openEdit(a); setActionOpen(null); }}>
                              <Pencil size={15} /> Edit
                            </button>
                            <button onClick={() => alert("Payment History - Coming soon")}>
                              <CreditCard size={15} /> Payment History
                            </button>
                            <button onClick={() => alert("Documents - Coming soon")}>
                              <FileText size={15} /> Documents
                            </button>
                            {a.status !== "Cancelled" && (
                              <button className="adm-dropdown-danger"
                                onClick={() => { handleCancel(a._id); setActionOpen(null); }}>
                                <Ban size={15} /> Cancel Admission
                              </button>
                            )}
                            <button className="adm-dropdown-danger"
                              onClick={() => { handleDelete(a._id); setActionOpen(null); }}>
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="adm-pagination">
            <span className="adm-page-info">
              Showing {(page - 1) * limit + 1} &ndash; {Math.min(page * limit, totalItems)} of {totalItems}
            </span>
            <div className="adm-page-btns">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="adm-overlay" onClick={() => setShowModal(false)}>
          <div className="adm-modal adm-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{editing ? "Edit Admission" : "Add Admission"}</h2>
              <button className="adm-modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="adm-modal-body">
                <h4 className="adm-section-title">
                  Personal Information
                  <span className="adm-section-sub">Fill in basic student details</span>
                </h4>
                <div className="adm-form-row">
                  {renderField("Student Full Name", "studentName", "text", null, true)}
                  {renderField("Father Name", "fatherName")}
                </div>
                <div className="adm-form-row">
                  {renderField("Mother Name", "motherName")}
                  {renderField("Gender", "gender", "select", ["Male", "Female", "Other"], true)}
                </div>
                <div className="adm-form-row">
                  {renderField("Date of Birth", "dateOfBirth", "date", null, true)}
                  {renderField("Blood Group", "bloodGroup", "select", bloodGroups)}
                </div>
                <div className="adm-form-row">
                  {renderField("Category/Caste", "category", "select", categories)}
                  {renderField("Aadhaar Number", "aadhaarNumber", "text", null, true)}
                </div>
                <div className="adm-form-row">
                  {renderField("Nationality", "nationality")}
                  <div className="adm-form-group" />
                </div>

                <h4 className="adm-section-title">
                  Contact Information
                  <span className="adm-section-sub">How to reach the student</span>
                </h4>
                <div className="adm-form-row">
                  {renderField("Mobile Number", "phone", "text", null, true)}
                  {renderField("Alternate Mobile", "alternateMobile")}
                </div>
                <div className="adm-form-row">
                  {renderField("Email Address", "email", "email")}
                  {renderField("WhatsApp Number", "whatsappNumber")}
                </div>
                <div className="adm-form-group">
                  <label>Parent Numbers <span className="adm-hint">(comma separated)</span></label>
                  <input name="parentNumbers" value={form.parentNumbers} onChange={handleChange} placeholder="e.g. 9876543210, 9876543211" />
                </div>

                <h4 className="adm-section-title">
                  Address
                  <span className="adm-section-sub">Current residential address</span>
                </h4>
                <div className="adm-form-group">
                  <label>Address Line</label>
                  <input name="addressLine" value={form.addressLine} onChange={handleChange} placeholder="Street, locality, landmark" />
                </div>
                <div className="adm-form-row">
                  {renderField("City", "city")}
                  {renderField("State", "state")}
                </div>
                <div className="adm-form-row">
                  {renderField("Country", "country")}
                  {renderField("Pincode", "pincode")}
                </div>

                <h4 className="adm-section-title">
                  Admission &amp; Course Details
                  <span className="adm-section-sub">Academic program information</span>
                </h4>
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label>Admission Date</label>
                    <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} />
                  </div>
                  {renderField("Branch", "branchName", "select",
                    branches.map((b) => b.branch_name), true)}
                </div>
                <div className="adm-form-row">
                  {renderField("Course", "courseName", "select",
                    courses.map((c) => c.title || c.name), true)}
                  {renderField("Course Duration", "courseDuration")}
                </div>
                <div className="adm-form-row">
                  {renderField("Batch", "batchName", "select",
                    batches.map((b) => b.batchName || b.batchCode))}
                  {renderField("Semester/Year", "semesterYear")}
                </div>
                <div className="adm-form-row">
                  {renderField("Admission Counselor", "admissionCounselor")}
                  {renderField("Reference Source", "referenceSource", "select", referenceSources)}
                </div>

                <h4 className="adm-section-title">
                  Course Type &amp; Schedule
                  <span className="adm-section-sub">Delivery mode and timeline</span>
                </h4>
                <div className="adm-form-row">
                  {renderField("Course Type", "courseType", "select", courseTypes)}
                  {renderField("Duration", "duration")}
                </div>
                <div className="adm-form-row">
                  {renderField("Start Date", "startDate", "date")}
                  {renderField("End Date", "endDate", "date")}
                </div>
                <div className="adm-form-row">
                  {renderField("Trainer/Faculty", "trainerFaculty")}
                  <div className="adm-form-group" />
                </div>

                <h4 className="adm-section-title">
                  Payment Details
                  <span className="adm-section-sub">Fee structure and payment information</span>
                </h4>
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label>Total Fees <span className="required-star">*</span></label>
                    <input type="number" name="totalFees" value={form.totalFees} onChange={handleChange} min="0" required />
                  </div>
                  {renderField("Registration Fees", "registrationFees", "number")}
                </div>
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label>Discount (Amount)</label>
                    <input type="number" name="discount" value={form.discount} onChange={handleChange} min="0" />
                  </div>
                  <div className="adm-form-group">
                    <label>Discount (%)</label>
                    <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleChange} min="0" max="100" />
                  </div>
                </div>
                <div className="adm-form-row">
                  {renderField("Scholarship", "scholarship", "number")}
                  {renderField("GST/Tax", "gstTax", "number")}
                </div>
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label>Paid Amount <span className="required-star">*</span></label>
                    <input type="number" name="paidAmount" value={form.paidAmount} onChange={handleChange} min="0" required />
                  </div>
                  {renderField("Payment Mode", "paymentMode", "select", paymentModes, true)}
                </div>
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label>
                      <input type="checkbox" name="emiAllowed" checked={form.emiAllowed} onChange={handleChange} />
                      {" "}EMI Allowed
                    </label>
                  </div>
                  <div className="adm-form-group" />
                </div>
                {form.emiAllowed && (
                  <div className="adm-form-row">
                    {renderField("Installment Count", "installmentCount", "number")}
                    {renderField("Next Installment Date", "nextInstallmentDate", "date")}
                  </div>
                )}

                <h4 className="adm-section-title">
                  Additional
                  <span className="adm-section-sub">Status, notes, and other information</span>
                </h4>
                <div className="adm-form-row">
                  {renderField("Status", "status", "select", statuses)}
                  {renderField("Created By", "createdBy")}
                </div>
                <div className="adm-form-group">
                  <label>Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="adm-save-btn" disabled={loading}>
                  {loading ? "Saving..." : editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="adm-overlay" onClick={() => setViewItem(null)}>
          <div className="adm-modal adm-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{viewItem.studentName}</h2>
              <button className="adm-modal-close" onClick={() => setViewItem(null)}><X size={20} /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-view-grid">
                <div className="adm-view-full">
                  <label>Admission ID</label>
                  <p className="adm-view-id">{viewItem.admissionId}</p>
                </div>
                <div><label>Status</label><p>{statusBadge(viewItem.status)}</p></div>
                <div><label>Payment Status</label><p>{paymentBadge(viewItem.paymentStatus)}</p></div>
                <div><label>Student Name</label><p>{viewItem.studentName}</p></div>
                <div><label>Father Name</label><p>{viewItem.fatherName || "-"}</p></div>
                <div><label>Mother Name</label><p>{viewItem.motherName || "-"}</p></div>
                <div><label>Gender</label><p>{viewItem.gender || "-"}</p></div>
                <div><label>Date of Birth</label><p>{formatDate(viewItem.dateOfBirth)}</p></div>
                <div><label>Blood Group</label><p>{viewItem.bloodGroup || "-"}</p></div>
                <div><label>Category</label><p>{viewItem.category || "-"}</p></div>
                <div><label>Aadhaar Number</label><p>{viewItem.aadhaarNumber || "-"}</p></div>
                <div><label>Nationality</label><p>{viewItem.nationality || "-"}</p></div>
                <div><label>Mobile</label><p>{viewItem.phone}</p></div>
                <div><label>Alternate Mobile</label><p>{viewItem.alternateMobile || "-"}</p></div>
                <div><label>Email</label><p>{viewItem.email || "-"}</p></div>
                <div><label>WhatsApp</label><p>{viewItem.whatsappNumber || "-"}</p></div>
                {viewItem.parentNumbers?.length > 0 && (
                  <div className="adm-view-full">
                    <label>Parent Numbers</label>
                    <p>{viewItem.parentNumbers.join(", ")}</p>
                  </div>
                )}
                <div className="adm-view-full"><label>Address</label>
                  <p>{[viewItem.addressLine, viewItem.city, viewItem.state, viewItem.country, viewItem.pincode].filter(Boolean).join(", ") || "-"}</p>
                </div>
                <div><label>Branch</label><p>{viewItem.branchName || "-"}</p></div>
                <div><label>Course</label><p>{viewItem.courseName || "-"}</p></div>
                <div><label>Course Duration</label><p>{viewItem.courseDuration || "-"}</p></div>
                <div><label>Batch</label><p>{viewItem.batchName || "-"}</p></div>
                <div><label>Semester/Year</label><p>{viewItem.semesterYear || "-"}</p></div>
                <div><label>Counselor</label><p>{viewItem.admissionCounselor || "-"}</p></div>
                <div><label>Reference Source</label><p>{viewItem.referenceSource || "-"}</p></div>
                <div><label>Course Type</label><p>{viewItem.courseType || "-"}</p></div>
                <div><label>Duration</label><p>{viewItem.duration || "-"}</p></div>
                <div><label>Start Date</label><p>{formatDate(viewItem.startDate)}</p></div>
                <div><label>End Date</label><p>{formatDate(viewItem.endDate)}</p></div>
                <div><label>Trainer/Faculty</label><p>{viewItem.trainerFaculty || "-"}</p></div>
                <div><label>Total Fees</label><p>{formatCurrency(viewItem.totalFees)}</p></div>
                <div><label>Registration Fees</label><p>{formatCurrency(viewItem.registrationFees)}</p></div>
                <div><label>Discount</label><p>{formatCurrency(viewItem.discount)}</p></div>
                <div><label>Discount %</label><p>{viewItem.discountPercent || 0}%</p></div>
                <div><label>Scholarship</label><p>{formatCurrency(viewItem.scholarship)}</p></div>
                <div><label>GST/Tax</label><p>{formatCurrency(viewItem.gstTax)}</p></div>
                <div><label>Paid Amount</label><p>{formatCurrency(viewItem.paidAmount)}</p></div>
                <div><label>Pending Amount</label><p>{formatCurrency(viewItem.pendingAmount)}</p></div>
                <div><label>Payment Mode</label><p>{viewItem.paymentMode || "-"}</p></div>
                <div><label>EMI Allowed</label><p>{viewItem.emiAllowed ? "Yes" : "No"}</p></div>
                <div><label>Installment Count</label><p>{viewItem.installmentCount || 0}</p></div>
                <div><label>Next Installment</label><p>{formatDate(viewItem.nextInstallmentDate)}</p></div>
                <div><label>Created By</label><p>{viewItem.createdBy || "-"}</p></div>
                <div><label>Admission Date</label><p>{formatDate(viewItem.admissionDate)}</p></div>
                <div className="adm-view-full"><label>Notes</label><p>{viewItem.notes || "-"}</p></div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-cancel-btn" onClick={() => setViewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admissions;
