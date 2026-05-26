import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Trash2, ArrowLeft, BookOpen, FileText, Video, ClipboardList, CheckSquare, HelpCircle, MessageSquare, MessageCircle, Radio, X } from "lucide-react";
import "./Course.css";

const API = "http://localhost:5000/api/modules/topic";

const sections = [
  { key: "articles", icon: FileText, color: "#ede9fe", iconColor: "#4f46e5", label: "Articles", desc: "title, content" },
  { key: "videoAssignments", icon: Video, color: "#dbeafe", iconColor: "#2563eb", label: "Video Assignments", desc: "title, url, description" },
  { key: "assignments", icon: ClipboardList, color: "#fef3c7", iconColor: "#d97706", label: "Assignments", desc: "title, description" },
  { key: "assignmentSolutions", icon: CheckSquare, color: "#d1fae5", iconColor: "#059669", label: "Assignment Solutions", desc: "title, description" },
  { key: "mcqs", icon: HelpCircle, color: "#fce7f3", iconColor: "#db2777", label: "MCQs", desc: "question, options, explanation" },
  { key: "faqs", icon: MessageSquare, color: "#e0e7ff", iconColor: "#4f46e5", label: "FAQs", desc: "question, answer" },
  { key: "interviewQuestions", icon: MessageCircle, color: "#f3e8ff", iconColor: "#7c3aed", label: "Interview Questions", desc: "question, answer" },
  { key: "liveLectures", icon: Radio, color: "#fce7f3", iconColor: "#db2777", label: "Live Lectures", desc: "title, date, time, link" },
];

const defaultForms = {
  articles: { title: "", content: "" },
  videoAssignments: { title: "", url: "", description: "" },
  assignments: { title: "", description: "" },
  assignmentSolutions: { title: "", description: "" },
  mcqs: { question: "", options: [{ text: "", isCorrect: false }], explanation: "" },
  faqs: { question: "", answer: "" },
  interviewQuestions: { question: "", answer: "" },
  liveLectures: { title: "", date: "", time: "", meetingLink: "", description: "" },
};

function TopicMaterials() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchTopic = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/${topicId}`);
      setTopic(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load topic");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const openForm = (sectionKey) => {
    setActiveSection(sectionKey);
    setFormData(JSON.parse(JSON.stringify(defaultForms[sectionKey])));
  };

  const closeForm = () => {
    setActiveSection(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, field, value) => {
    const opts = [...formData.options];
    opts[index] = { ...opts[index], [field]: value };
    setFormData({ ...formData, options: opts });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, { text: "", isCorrect: false }] });
  };

  const removeOption = (index) => {
    const opts = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: opts });
  };

  const saveItem = async () => {
    if (!activeSection) return;
    const payload = { ...formData };

    if (activeSection === "mcqs") {
      payload.options = payload.options.filter((o) => o.text.trim());
      if (!payload.question || payload.options.length === 0) {
        return alert("Question and at least one option are required");
      }
    } else if (activeSection === "faqs" || activeSection === "interviewQuestions") {
      if (!payload.question) return alert("Question is required");
    } else {
      if (!payload.title) return alert("Title is required");
    }

    try {
      await axios.post(`${API}/${topicId}/${activeSection}`, payload);
      closeForm();
      fetchTopic();
    } catch (error) {
      console.log(error);
      alert("Failed to save item");
    }
  };

  const deleteItem = async (sectionKey, itemId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API}/${topicId}/${sectionKey}/${itemId}`);
      fetchTopic();
    } catch (error) {
      console.log(error);
      alert("Failed to delete item");
    }
  };

  const totalItems = topic
    ? sections.reduce((sum, s) => sum + (topic[s.key]?.length || 0), 0)
    : 0;

  if (loading) {
    return (
      <div className="tm-page">
        <div className="tm-loading">Loading topic materials...</div>
      </div>
    );
  }

  return (
    <div className="tm-page">
      <div className="tm-top">
        <button className="tm-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="tm-hero">
        <div className="tm-hero-icon">
          <BookOpen size={22} />
        </div>
        <div className="tm-hero-info">
          <h1>{topic?.title || "Topic Materials"}</h1>
          <p>{topic?.description || ""}</p>
        </div>
        <div className="tm-hero-stats">
          <span className="tm-hero-stat">{totalItems} items</span>
          <span className="tm-hero-stat">{sections.length} sections</span>
        </div>
      </div>

      <div className="tm-grid">
        {sections.map((sec) => {
          const items = topic?.[sec.key] || [];
          const Icon = sec.icon;

          return (
            <div className="tm-section" key={sec.key}>
              <div className="tm-section-header">
                <div className="tm-section-header-left">
                  <div className="tm-section-icon" style={{ background: sec.color, color: sec.iconColor }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3>{sec.label}</h3>
                  </div>
                  <span className="tm-section-count">{items.length}</span>
                </div>
                <button className="tm-section-add" onClick={() => openForm(sec.key)}>
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="tm-section-body">
                {items.length === 0 ? (
                  <div className="tm-empty">No {sec.label.toLowerCase()} yet</div>
                ) : (
                  items.map((item) => (
                    <div className="tm-item" key={item._id}>
                      <div className="tm-item-info">
                        <strong>{item.title || item.question || "Untitled"}</strong>
                        {item.description && <p>{item.description}</p>}
                        {item.url && <p>{item.url}</p>}
                      </div>
                      <button className="tm-item-del" onClick={() => deleteItem(sec.key, item._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeSection && (
        <div className="tm-form-overlay" onClick={closeForm}>
          <div className="tm-form-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <h3>Add {sections.find((s) => s.key === activeSection)?.label}</h3>
                <p>Fill in the details below</p>
              </div>
              <button onClick={closeForm} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {activeSection === "mcqs" ? (
              <>
                <div className="tm-form-group">
                  <label>Question <span>*</span></label>
                  <textarea rows={3} name="question" value={formData.question || ""} onChange={handleChange} placeholder="Enter the MCQ question" />
                </div>
                <div className="tm-form-group">
                  <label>Options <span>*</span></label>
                  {formData.options?.map((opt, i) => (
                    <div className="tm-option-row" key={i}>
                      <input
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                      />
                      <label>
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)}
                        />
                        Correct
                      </label>
                      {formData.options.length > 1 && (
                        <button onClick={() => removeOption(i)} style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", padding: 4 }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="tm-add-option" onClick={addOption}>+ Add Option</button>
                </div>
                <div className="tm-form-group">
                  <label>Explanation</label>
                  <textarea rows={2} name="explanation" value={formData.explanation || ""} onChange={handleChange} placeholder="Optional explanation" />
                </div>
              </>
            ) : activeSection === "faqs" || activeSection === "interviewQuestions" ? (
              <>
                <div className="tm-form-group">
                  <label>Question <span>*</span></label>
                  <textarea rows={2} name="question" value={formData.question || ""} onChange={handleChange} placeholder="Enter the question" />
                </div>
                <div className="tm-form-group">
                  <label>Answer</label>
                  <textarea rows={3} name="answer" value={formData.answer || ""} onChange={handleChange} placeholder="Enter the answer" />
                </div>
              </>
            ) : activeSection === "liveLectures" ? (
              <>
                <div className="tm-form-group">
                  <label>Title <span>*</span></label>
                  <input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Lecture title" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="tm-form-group">
                    <label>Date</label>
                    <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
                  </div>
                  <div className="tm-form-group">
                    <label>Time</label>
                    <input type="time" name="time" value={formData.time || ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="tm-form-group">
                  <label>Meeting Link</label>
                  <input name="meetingLink" value={formData.meetingLink || ""} onChange={handleChange} placeholder="https://meet.example.com/..." />
                </div>
                <div className="tm-form-group">
                  <label>Description</label>
                  <textarea rows={2} name="description" value={formData.description || ""} onChange={handleChange} placeholder="Brief description" />
                </div>
              </>
            ) : activeSection === "videoAssignments" ? (
              <>
                <div className="tm-form-group">
                  <label>Title <span>*</span></label>
                  <input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Video title" />
                </div>
                <div className="tm-form-group">
                  <label>URL <span>*</span></label>
                  <input name="url" value={formData.url || ""} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="tm-form-group">
                  <label>Description</label>
                  <textarea rows={2} name="description" value={formData.description || ""} onChange={handleChange} placeholder="Brief description" />
                </div>
              </>
            ) : (
              <>
                <div className="tm-form-group">
                  <label>Title <span>*</span></label>
                  <input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Title" />
                </div>
                <div className="tm-form-group">
                  <label>Description</label>
                  <textarea rows={2} name="description" value={formData.description || ""} onChange={handleChange} placeholder="Description" />
                </div>
              </>
            )}

            <div className="tm-form-actions">
              <button className="tm-form-cancel" onClick={closeForm}>Cancel</button>
              <button className="tm-form-save" onClick={saveItem}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicMaterials;
