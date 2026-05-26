import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, BookOpen, FileText, Video, ClipboardList, CheckSquare, HelpCircle, MessageSquare, MessageCircle, Radio, Layers, Plus, Trash2, X, Clock } from "lucide-react";
import "./Course.css";

const MODULE_API = "http://localhost:5000/api/modules";
const TOPIC_API = "http://localhost:5000/api/modules/topic";

const sectionMeta = {
  articles: { icon: FileText, label: "Articles", color: "#ede9fe", iconColor: "#4f46e5" },
  videoAssignments: { icon: Video, label: "Video Assignments", color: "#dbeafe", iconColor: "#2563eb" },
  assignments: { icon: ClipboardList, label: "Assignments", color: "#fef3c7", iconColor: "#d97706" },
  assignmentSolutions: { icon: CheckSquare, label: "Solutions", color: "#d1fae5", iconColor: "#059669" },
  mcqs: { icon: HelpCircle, label: "MCQs", color: "#fce7f3", iconColor: "#db2777" },
  faqs: { icon: MessageSquare, label: "FAQs", color: "#e0e7ff", iconColor: "#4f46e5" },
  interviewQuestions: { icon: MessageCircle, label: "Interview Qs", color: "#f3e8ff", iconColor: "#7c3aed" },
  liveLectures: { icon: Radio, label: "Live Lectures", color: "#fce7f3", iconColor: "#db2777" },
};

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

function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [mod, setMod] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicLoading, setTopicLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formSection, setFormSection] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchModule = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${MODULE_API}/${moduleId}`);
      setMod(res.data);
      if (res.data.topics?.length > 0) {
        setActiveTopic(res.data.topics[0]._id);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load module");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  useEffect(() => {
    if (!activeTopic) return;
    setTopicLoading(true);
    axios.get(`${TOPIC_API}/${activeTopic}`)
      .then((res) => setTopicData(res.data))
      .catch(() => setTopicData(null))
      .finally(() => setTopicLoading(false));
  }, [activeTopic]);

  const openForm = (section) => {
    setFormSection(section);
    setFormData(JSON.parse(JSON.stringify(defaultForms[section])));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormSection(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (idx, field, value) => {
    const opts = [...formData.options];
    opts[idx] = { ...opts[idx], [field]: value };
    setFormData({ ...formData, options: opts });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...(formData.options || []), { text: "", isCorrect: false }] });
  };

  const removeOption = (idx) => {
    setFormData({ ...formData, options: formData.options.filter((_, i) => i !== idx) });
  };

  const saveItem = async () => {
    if (!formSection) return;
    const payload = { ...formData };

    if (formSection === "mcqs") {
      payload.options = payload.options.filter((o) => o.text.trim());
      if (!payload.question || payload.options.length === 0) return alert("Question and at least one option required");
    } else if (["faqs", "interviewQuestions"].includes(formSection)) {
      if (!payload.question) return alert("Question is required");
    } else {
      if (!payload.title) return alert("Title is required");
    }

    try {
      await axios.post(`${TOPIC_API}/${activeTopic}/${formSection}`, payload);
      closeForm();
      const res = await axios.get(`${TOPIC_API}/${activeTopic}`);
      setTopicData(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to save");
    }
  };

  const deleteItem = async (section, itemId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${TOPIC_API}/${activeTopic}/${section}/${itemId}`);
      const res = await axios.get(`${TOPIC_API}/${activeTopic}`);
      setTopicData(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to delete");
    }
  };

  const renderFormFields = () => {
    if (formSection === "mcqs") {
      return (
        <>
          <div className="md-form-group">
            <label>Question <span>*</span></label>
            <textarea rows={3} name="question" value={formData.question || ""} onChange={handleChange} placeholder="MCQ question" />
          </div>
          <div className="md-form-group">
            <label>Options <span>*</span></label>
            {formData.options?.map((opt, i) => (
              <div className="md-opt-row" key={i}>
                <input placeholder={`Option ${i + 1}`} value={opt.text} onChange={(e) => handleOptionChange(i, "text", e.target.value)} />
                <label><input type="checkbox" checked={opt.isCorrect} onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)} /> Correct</label>
                {formData.options.length > 1 && <button className="md-opt-del" onClick={() => removeOption(i)}><X size={14} /></button>}
              </div>
            ))}
            <button className="md-add-opt" onClick={addOption}>+ Add Option</button>
          </div>
          <div className="md-form-group">
            <label>Explanation</label>
            <textarea rows={2} name="explanation" value={formData.explanation || ""} onChange={handleChange} placeholder="Optional explanation" />
          </div>
        </>
      );
    }

    if (["faqs", "interviewQuestions"].includes(formSection)) {
      return (
        <>
          <div className="md-form-group"><label>Question <span>*</span></label><textarea rows={2} name="question" value={formData.question || ""} onChange={handleChange} placeholder="Question" /></div>
          <div className="md-form-group"><label>Answer</label><textarea rows={3} name="answer" value={formData.answer || ""} onChange={handleChange} placeholder="Answer" /></div>
        </>
      );
    }

    if (formSection === "liveLectures") {
      return (
        <>
          <div className="md-form-group"><label>Title <span>*</span></label><input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Lecture title" /></div>
          <div className="md-form-row"><div className="md-form-group"><label>Date</label><input type="date" name="date" value={formData.date || ""} onChange={handleChange} /></div><div className="md-form-group"><label>Time</label><input type="time" name="time" value={formData.time || ""} onChange={handleChange} /></div></div>
          <div className="md-form-group"><label>Meeting Link</label><input name="meetingLink" value={formData.meetingLink || ""} onChange={handleChange} placeholder="https://..." /></div>
          <div className="md-form-group"><label>Description</label><textarea rows={2} name="description" value={formData.description || ""} onChange={handleChange} placeholder="Description" /></div>
        </>
      );
    }

    if (formSection === "videoAssignments") {
      return (
        <>
          <div className="md-form-group"><label>Title <span>*</span></label><input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Video title" /></div>
          <div className="md-form-group"><label>URL <span>*</span></label><input name="url" value={formData.url || ""} onChange={handleChange} placeholder="https://..." /></div>
          <div className="md-form-group"><label>Description</label><textarea rows={2} name="description" value={formData.description || ""} onChange={handleChange} placeholder="Description" /></div>
        </>
      );
    }

    return (
      <>
        <div className="md-form-group"><label>Title <span>*</span></label><input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Title" /></div>
        <div className="md-form-group"><label>Description</label><textarea rows={2} name="description" value={formData.description || ""} onChange={handleChange} placeholder="Description" /></div>
      </>
    );
  };

  if (loading) {
    return <div className="md-page"><div className="md-loading">Loading module...</div></div>;
  }

  if (!mod) {
    return <div className="md-page"><div className="md-loading">Module not found.</div></div>;
  }

  return (
    <div className="md-page">
      <div className="md-top">
        <button className="md-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="md-layout">
        {/* Sidebar */}
        <div className="md-sidebar">
          <div className="md-sidebar-head">
            <div className="md-sidebar-icon">
              <Layers size={20} />
            </div>
            <div>
              <h3>{mod.title}</h3>
              <p>{mod.courseId?.title || "Course"}</p>
            </div>
          </div>

          <div className="md-sidebar-topics">
            <div className="md-sidebar-label">
              Topics <span className="md-count">{mod.topics?.length || 0}</span>
            </div>
            {mod.topics?.length === 0 ? (
              <div className="md-sidebar-empty">No topics yet</div>
            ) : (
              mod.topics.map((topic) => (
                <div
                  key={topic._id}
                  className={`md-sidebar-topic ${activeTopic === topic._id ? "active" : ""}`}
                  onClick={() => setActiveTopic(topic._id)}
                >
                  <div className="md-sidebar-topic-num">
                    {topic.duration ? <Clock size={12} /> : <FileText size={12} />}
                  </div>
                  <div className="md-sidebar-topic-info">
                    <span className="md-sidebar-topic-title">{topic.title}</span>
                    {topic.duration && <span className="md-sidebar-topic-dur">{topic.duration}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main */}
        <div className="md-main">
          {!activeTopic ? (
            <div className="md-empty">
              <Layers size={40} />
              <h3>Select a topic</h3>
              <p>Choose a topic from the sidebar to view its materials.</p>
            </div>
          ) : topicLoading ? (
            <div className="md-loading">Loading topic...</div>
          ) : !topicData ? (
            <div className="md-empty">
              <FileText size={40} />
              <h3>Topic not found</h3>
            </div>
          ) : (
            <>
              <div className="md-topic-head">
                <div className="md-topic-head-info">
                  <h2>{topicData.title}</h2>
                  <p>{topicData.description}</p>
                </div>
                {topicData.duration && <span className="md-topic-head-dur"><Clock size={15} /> {topicData.duration}</span>}
              </div>

              <div className="md-sections">
                {Object.entries(sectionMeta).map(([key, meta]) => {
                  const items = topicData[key] || [];
                  const Icon = meta.icon;

                  return (
                    <div className="md-section" key={key}>
                      <div className="md-section-head">
                        <div className="md-section-head-left">
                          <div className="md-section-icon" style={{ background: meta.color, color: meta.iconColor }}>
                            <Icon size={16} />
                          </div>
                          <h4>{meta.label}</h4>
                          <span className="md-section-count">{items.length}</span>
                        </div>
                        <button className="md-section-add" onClick={() => openForm(key)}>
                          <Plus size={14} />
                          Add
                        </button>
                      </div>

                      <div className="md-section-body">
                        {items.length === 0 ? (
                          <div className="md-section-empty">No items</div>
                        ) : (
                          <div className="md-card-grid">
                            {items.map((item) => (
                              <div className="md-card" key={item._id}>
                                <button className="md-card-del" onClick={() => deleteItem(key, item._id)}>
                                  <Trash2 size={13} />
                                </button>
                                <div className="md-card-body">
                                  <strong>{item.title || item.question || "Untitled"}</strong>
                                  {item.description && <p>{item.description}</p>}
                                  {item.url && <p className="md-card-url">{item.url}</p>}
                                  {item.content && <p>{item.content}</p>}
                                  {item.options && (
                                    <div className="md-card-options">
                                      {item.options.filter((o) => o.text).map((o, i) => (
                                        <span key={i} className={o.isCorrect ? "correct" : ""}>
                                          {o.text}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {item.answer && <p className="md-card-answer">{item.answer}</p>}
                                  {item.date && <p className="md-card-date">{item.date}{item.time ? ` at ${item.time}` : ""}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div className="md-form-overlay" onClick={closeForm}>
          <div className="md-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="md-form-head">
              <div>
                <h3>Add {formSection && sectionMeta[formSection]?.label}</h3>
                <p>Fill in the details below</p>
              </div>
              <button className="md-form-close" onClick={closeForm}><X size={18} /></button>
            </div>
            {renderFormFields()}
            <div className="md-form-actions">
              <button className="md-form-cancel" onClick={closeForm}>Cancel</button>
              <button className="md-form-save" onClick={saveItem}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleDetail;
