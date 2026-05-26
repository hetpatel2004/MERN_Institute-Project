import React, { useEffect, useState } from "react";
import "./Course.css";

import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const sections = [
  { key: "articles", title: "Articles", icon: "📄", btn: "Add Article" },
  { key: "videoAssignments", title: "Video Assignments", icon: "🎥", btn: "Add Video Assignment" },
  { key: "assignments", title: "Assignments", icon: "📝", btn: "Add Assignment" },
  { key: "assignmentSolutions", title: "Assignment Solutions", icon: "✅", btn: "Add Solution" },
  { key: "mcqs", title: "MCQs", icon: "❓", btn: "Add MCQ" },
  { key: "faqs", title: "FAQs", icon: "💬", btn: "Add FAQ" },
  { key: "interviewQuestions", title: "Interview Questions", icon: "🎤", btn: "Add Question" },
  { key: "liveLectures", title: "Live Lectures", icon: "📡", btn: "Add Live Lecture" },
];

function TopicContent() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchContent = async () => {
    const res = await axios.get(`http://localhost:5000/api/topic-content/${topicId}`);
    setContent(res.data);
  };

  useEffect(() => {
    fetchContent();
  }, [topicId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addContent = async () => {
    if (!activeSection) return;

    await axios.put(
      `http://localhost:5000/api/topic-content/${topicId}/${activeSection}`,
      formData
    );

    setFormData({});
    setActiveSection(null);
    fetchContent();
  };

  const deleteItem = async (section, itemId) => {
    await axios.delete(
      `http://localhost:5000/api/topic-content/${topicId}/${section}/${itemId}`
    );
    fetchContent();
  };

  return (
    <div className="topic-content-page">
      <div className="topic-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div>
          <h2>Manage Topic Content</h2>
          <p>Add articles, assignments, MCQs, FAQs, interview questions and live lectures.</p>
        </div>

        <button className="publish-btn">Publish Topic</button>
      </div>

      <div className="topic-info-card">
        <div className="topic-icon">📚</div>
        <div>
          <span>Selected Topic</span>
          <h4>Topic Content Management</h4>
        </div>
        <div>
          <span>Total Sections</span>
          <h4>8 Sections</h4>
        </div>
        <div>
          <span>Status</span>
          <h4 className="published">Active</h4>
        </div>
      </div>

      <div className="content-section-wrapper">
        {sections.map((sec, index) => (
          <div className="content-card" key={sec.key}>
            <div className="content-left">
              <div className="content-icon">{sec.icon}</div>
              <div>
                <span className="section-number">0{index + 1}</span>
                <h4>{sec.title}</h4>
                <p>Manage {sec.title.toLowerCase()} for this topic</p>
              </div>
            </div>

            <div className="content-actions">
              <span className="count-badge">
                {content?.[sec.key]?.length || 0} Items
              </span>

              <button
                className="add-btn"
                onClick={() => setActiveSection(sec.key)}
              >
                + {sec.btn}
              </button>
            </div>

            {content?.[sec.key]?.length > 0 && (
              <div className="items-list">
                {content[sec.key].map((item) => (
                  <div className="item-row" key={item._id}>
                    <span>{item.title || item.question || "Untitled"}</span>
                    <button onClick={() => deleteItem(sec.key, item._id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {activeSection && (
        <div className="modal-overlay">
          <div className="content-modal">
            <h3>Add {sections.find((s) => s.key === activeSection)?.title}</h3>

            {activeSection === "mcqs" ? (
              <>
                <input name="question" placeholder="Question" onChange={handleChange} />
                <input name="options" placeholder="Options comma separated" onChange={handleChange} />
                <input name="correctAnswer" placeholder="Correct Answer" onChange={handleChange} />
                <input name="marks" placeholder="Marks" onChange={handleChange} />
              </>
            ) : activeSection === "faqs" || activeSection === "interviewQuestions" ? (
              <>
                <input name="question" placeholder="Question" onChange={handleChange} />
                <textarea name="answer" placeholder="Answer" onChange={handleChange}></textarea>
              </>
            ) : activeSection === "liveLectures" ? (
              <>
                <input name="title" placeholder="Lecture Title" onChange={handleChange} />
                <input name="meetingLink" placeholder="Meeting Link" onChange={handleChange} />
                <input name="lectureDate" type="date" onChange={handleChange} />
                <input name="lectureTime" type="time" onChange={handleChange} />
              </>
            ) : (
              <>
                <input name="title" placeholder="Title" onChange={handleChange} />
                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
                <input name="fileUrl" placeholder="File URL / PDF URL" onChange={handleChange} />
                <input name="videoUrl" placeholder="Video URL if available" onChange={handleChange} />
              </>
            )}

            <div className="modal-actions">
              <button onClick={() => setActiveSection(null)}>Cancel</button>
              <button onClick={addContent}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicContent;