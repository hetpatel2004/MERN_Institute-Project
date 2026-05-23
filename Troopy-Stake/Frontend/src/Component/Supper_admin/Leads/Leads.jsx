import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Phone,
  MessageCircle,
  Pencil,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import "./Leads.css";

const API_BASE = "http://localhost:5000/api";

const leadSources = [
  "Instagram Ad",
  "Facebook Ad",
  "Google Search",
  "Google Ad",
  "Walk-in",
  "WhatsApp Campaign",
  "Referral",
  "Website Form",
  "YouTube",
  "Cold Call",
];

const statuses = [
  "New",
  "Contacted",
  "Interested",
  "Follow-up",
  "Admitted",
  "Not Interested",
];

const defaultForm = {
  studentName: "",
  phone: "",
  email: "",
  city: "",
  course: "",
  source: "",
  status: "New",
  counsellor: "",
  followUpDate: "",
  preferredBatch: "",
  priority: "Warm",
  notes: "",
};

function Leads() {
  const [view, setView] = useState("board");
  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    fetchLeads();
    fetchCourses();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leads`);
      setLeads(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load leads");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/courses`);
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = useMemo(() => {
    let data = [...leads];

    if (activeStatus !== "All") {
      data = data.filter((lead) => lead.status === activeStatus);
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      data = data.filter(
        (lead) =>
          lead.studentName?.toLowerCase().includes(value) ||
          lead.phone?.toLowerCase().includes(value) ||
          lead.email?.toLowerCase().includes(value) ||
          lead.course?.toLowerCase().includes(value)
      );
    }

    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.studentName.localeCompare(b.studentName));
    }

    return data;
  }, [leads, activeStatus, search, sortBy]);

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    followUp: leads.filter((l) => l.status === "Follow-up").length,
    admitted: leads.filter((l) => l.status === "Admitted").length,
    revenue: "₹4.8L",
  };

  const openAddModal = () => {
    setEditingLead(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setForm({
      studentName: lead.studentName || "",
      phone: lead.phone || "",
      email: lead.email || "",
      city: lead.city || "",
      course: lead.course || "",
      source: lead.source || "",
      status: lead.status || "New",
      counsellor: lead.counsellor || "",
      followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : "",
      preferredBatch: lead.preferredBatch || "",
      priority: lead.priority || "Warm",
      notes: lead.notes || "",
    });
    setShowModal(true);
  };

  const handleSaveLead = async (e) => {
    e.preventDefault();

    if (!form.studentName || !form.phone || !form.course || !form.source) {
      alert("Please fill required fields");
      return;
    }

    try {
      if (editingLead) {
        await axios.put(`${API_BASE}/leads/${editingLead._id}`, form);
      } else {
        await axios.post(`${API_BASE}/leads`, form);
      }

      setShowModal(false);
      setEditingLead(null);
      setForm(defaultForm);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert("Failed to save lead");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`${API_BASE}/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lead");
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/91${phone}`, "_blank");
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="lead-page">
      <div className="lead-topbar">
        <div>
          <h1>Lead Management</h1>
          <p>Track & convert every inquiry into admission</p>
        </div>

        <div className="lead-actions">
          <div className="lead-search">
            <Search size={18} />
            <input
              placeholder="Search by name, phone, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className={view === "board" ? "view-btn active" : "view-btn"}
            onClick={() => setView("board")}
          >
            <LayoutGrid size={17} />
            Board
          </button>

          <button
            className={view === "list" ? "view-btn active" : "view-btn"}
            onClick={() => setView("list")}
          >
            <List size={17} />
            List
          </button>

          <button className="add-lead-btn" onClick={openAddModal}>
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="lead-stats">
        <div className="lead-stat-card">
          <span>Total Leads</span>
          <h2>{stats.total}</h2>
          <p>↑ 12% this month</p>
        </div>

        <div className="lead-stat-card">
          <span>New Today</span>
          <h2>{stats.new}</h2>
          <p>↑ 8 from yesterday</p>
        </div>

        <div className="lead-stat-card">
          <span>Follow-ups Due</span>
          <h2>{stats.followUp}</h2>
          <p className="danger">32 overdue</p>
        </div>

        <div className="lead-stat-card">
          <span>Admissions</span>
          <h2>{stats.admitted}</h2>
          <p>↑ 7.6% rate</p>
        </div>

        <div className="lead-stat-card">
          <span>Revenue Pipeline</span>
          <h2>{stats.revenue}</h2>
          <p>Projected</p>
        </div>
      </div>

      <div className="lead-filter-row">
        <button
          className={activeStatus === "All" ? "pill active" : "pill"}
          onClick={() => setActiveStatus("All")}
        >
          All Leads
        </button>

        {statuses.map((status) => (
          <button
            key={status}
            className={activeStatus === status ? "pill active" : "pill"}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {view === "board" ? (
        <div className="lead-board">
          {statuses.map((status) => {
            const statusLeads = filteredLeads.filter(
              (lead) => lead.status === status
            );

            return (
              <div className="lead-column" key={status}>
                <div className="lead-column-head">
                  <h3>{status}</h3>
                  <span>{statusLeads.length}</span>
                </div>

                <div className="lead-column-body">
                  {statusLeads.map((lead) => (
                    <div
                      className="lead-card"
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="lead-card-top">
                        <div className="avatar">{getInitials(lead.studentName)}</div>
                        <div>
                          <h4>{lead.studentName}</h4>
                          <p>{lead.phone}</p>
                        </div>
                      </div>

                      <span className="course-badge">{lead.course}</span>

                      <p className="small-info">{lead.source}</p>
                      <p className="small-info">{lead.counsellor || "Unassigned"}</p>
                      <p className="small-info">
                        {lead.followUpDate
                          ? new Date(lead.followUpDate).toLocaleDateString()
                          : "No follow-up"}
                      </p>

                      <div className="lead-card-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsApp(lead.phone);
                          }}
                        >
                          <MessageCircle size={15} />
                          WhatsApp
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(lead.phone);
                          }}
                        >
                          <Phone size={15} />
                          Call
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(lead);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="lead-list-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Source</th>
                <th>Counsellor</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className="student-cell">
                      <div className="avatar">{getInitials(lead.studentName)}</div>
                      <div>
                        <b>{lead.studentName}</b>
                        <p>{lead.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td>{lead.course}</td>
                  <td>{lead.source}</td>
                  <td>{lead.counsellor || "Unassigned"}</td>
                  <td>{lead.priority}</td>
                  <td>
                    <span className="status-badge">{lead.status}</span>
                  </td>
                  <td>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => setSelectedLead(lead)}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleWhatsApp(lead.phone)}>
                        <MessageCircle size={16} />
                      </button>
                      <button onClick={() => handleCall(lead.phone)}>
                        <Phone size={16} />
                      </button>
                      <button onClick={() => openEditModal(lead)}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="lead-modal-overlay">
          <form className="lead-modal" onSubmit={handleSaveLead}>
            <div className="modal-head">
              <div>
                <h2>{editingLead ? "Edit Lead" : "Add New Lead"}</h2>
                <p>Fill in student enquiry details</p>
              </div>

              <button type="button" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <h4>Personal Information</h4>

            <div className="form-grid">
              <input
                placeholder="Student Name *"
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
              />

              <input
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="City / Location"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <h4>Course & Source</h4>

            <div className="form-grid">
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id || course.id} value={course.title || course.name}>
                    {course.title || course.name}
                  </option>
                ))}
              </select>

              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                <option value="">Select Source</option>
                {leadSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <input
                placeholder="Assign Counsellor"
                value={form.counsellor}
                onChange={(e) =>
                  setForm({ ...form, counsellor: e.target.value })
                }
              />

              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) =>
                  setForm({ ...form, followUpDate: e.target.value })
                }
              />

              <input
                placeholder="Preferred Batch"
                value={form.preferredBatch}
                onChange={(e) =>
                  setForm({ ...form, preferredBatch: e.target.value })
                }
              />
            </div>

            <div className="priority-row">
              {["Hot", "Warm", "Cold"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={form.priority === item ? "priority active" : "priority"}
                  onClick={() => setForm({ ...form, priority: item })}
                >
                  {item}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Notes / Remarks"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="modal-footer">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit">
                {editingLead ? "Update Lead" : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedLead && (
        <div className="lead-drawer-overlay" onClick={() => setSelectedLead(null)}>
          <div className="lead-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setSelectedLead(null)}>
              <X size={18} />
            </button>

            <div className="drawer-head">
              <div className="avatar big">{getInitials(selectedLead.studentName)}</div>
              <h2>{selectedLead.studentName}</h2>
              <p>{selectedLead.course} • {selectedLead.city}</p>
              <span>{selectedLead.status}</span>
            </div>

            <div className="drawer-actions">
              <button onClick={() => handleWhatsApp(selectedLead.phone)}>WhatsApp</button>
              <button onClick={() => handleCall(selectedLead.phone)}>Call Now</button>
              <button onClick={() => openEditModal(selectedLead)}>Edit</button>
            </div>

            <h4>Contact Details</h4>
            <p><b>Phone:</b> {selectedLead.phone}</p>
            <p><b>Email:</b> {selectedLead.email || "-"}</p>
            <p><b>City:</b> {selectedLead.city || "-"}</p>

            <h4>Lead Info</h4>
            <p><b>Course:</b> {selectedLead.course}</p>
            <p><b>Source:</b> {selectedLead.source}</p>
            <p><b>Counsellor:</b> {selectedLead.counsellor || "Unassigned"}</p>
            <p>
              <b>Follow-up Date:</b>{" "}
              {selectedLead.followUpDate
                ? new Date(selectedLead.followUpDate).toLocaleDateString()
                : "-"}
            </p>

            <h4>Notes</h4>
            <div className="note-box">{selectedLead.notes || "No notes added"}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;