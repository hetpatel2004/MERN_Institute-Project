import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Trash2,
  ArrowLeft,
  BookOpen,
  FileText,
  Clock,
  ListOrdered,
  UploadCloud,
} from "lucide-react";
import "./Course.css";

const API = "http://localhost:5000/api/modules";

function ModuleTopics() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("moduleId");

  const [modules, setModules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicDurationValue, setTopicDurationValue] = useState("");
  const [topicDurationType, setTopicDurationType] = useState("Days");

  const fetchModules = async () => {
    try {
      const res = await axios.get(API);
      setModules(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load module topics");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const resetTopicForm = () => {
    setTopicTitle("");
    setTopicDescription("");
    setTopicDurationValue("");
    setTopicDurationType("Days");
  };

  const getTotalModuleDuration = (topics = []) => {
    const totalDays = topics.reduce((total, topic) => {
      const value = Number(topic.durationValue || 0);

      if (topic.durationType === "Hours") return total + value / 8;
      if (topic.durationType === "Weeks") return total + value * 7;
      if (topic.durationType === "Months") return total + value * 30;

      return total + value;
    }, 0);

    return Math.ceil(totalDays);
  };

  const addTopic = async (mId) => {
    if (!topicTitle.trim() || !topicDescription.trim()) {
      alert("Topic title and description are required");
      return;
    }

    if (!topicDurationValue) {
      alert("Topic duration is required");
      return;
    }

    await axios.post(`${API}/${mId}/topics`, {
      title: topicTitle,
      description: topicDescription,
      durationValue: Number(topicDurationValue),
      durationType: topicDurationType,
    });

    resetTopicForm();
    setShowForm(false);
    fetchModules();
  };

  const deleteTopic = async (mId, topicId) => {
    if (!window.confirm("Delete this topic?")) return;

    await axios.delete(`${API}/${mId}/topics/${topicId}`);
    fetchModules();
  };

  const module = moduleId ? modules.find((m) => m._id === moduleId) : null;
  const moduleTotalDays = getTotalModuleDuration(module?.topics || []);

  return (
    <div className="mt-page">
      <div className="mt-top-bar">
        <button
          className="mt-back-btn"
          onClick={() => navigate("/superadmin/course/all-modules")}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="mt-hero">
        <div className="mt-hero-icon">
          <BookOpen size={28} />
        </div>

        <div className="mt-hero-info">
          <span className="mt-hero-course">
            {module?.courseId?.title || "Course"}
          </span>
          <h1>{module?.title || "Module Topics"}</h1>
          <p>{module?.description || "Manage topics for this module"}</p>
        </div>

        <div className="mt-hero-stats">
          <div className="mt-hero-stat">
            <ListOrdered size={16} />
            <span>{module?.topics?.length || 0} Topics</span>
          </div>

          <div className="mt-hero-stat">
            <Clock size={16} />
            <span>{moduleTotalDays || 0} Days</span>
          </div>
        </div>
      </div>

      <div className="mt-content-card">
        <div className="mt-content-head">
          <h2>
            <FileText size={20} />
            Topics
            <span className="mt-count">{module?.topics?.length || 0}</span>
          </h2>

          <button className="mt-add-btn" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add Topic
          </button>
        </div>

        {!module ? (
          <div className="mt-empty-state">
            <p>Module not found.</p>
          </div>
        ) : module.topics?.length === 0 && !showForm ? (
          <div className="mt-empty-state">
            <BookOpen size={40} />
            <h3>No topics yet</h3>
            <p>Click "Add Topic" to create the first topic for this module.</p>
          </div>
        ) : (
          <div className="mt-topic-list">
            {module.topics?.map((topic, i) => (
              <div className="mt-topic-item" key={topic._id}>
                <div className="mt-topic-num">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="mt-topic-body">
                  <strong>{topic.title}</strong>
                  <p>
                    {topic.description}
                    {topic.durationValue ? (
                      <span className="mt-topic-duration">
                        {" "}
                        • {topic.durationValue} {topic.durationType}
                      </span>
                    ) : null}
                  </p>
                </div>

                <button
                  className="mt-add-btn"
                  onClick={() =>
                    navigate(`/superadmin/course/topic-content/${topic._id}`)
                  }
                >
                  <UploadCloud size={15} />
                  Manage Content
                </button>

                <button
                  className="mt-topic-del"
                  onClick={() => deleteTopic(module._id, topic._id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="mt-inline-form">
            <div className="mt-inline-form-header">
              <h4>New Topic</h4>

              <button
                className="mt-inline-close"
                onClick={() => {
                  setShowForm(false);
                  resetTopicForm();
                }}
              >
                <ArrowLeft size={16} /> Cancel
              </button>
            </div>

            <div className="mt-inline-grid">
              <div>
                <label>
                  Title <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Variables"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                />
              </div>

              <div>
                <label>
                  Description <span>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this topic"
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                />
              </div>

              <div>
                <label>
                  Duration <span>*</span>
                </label>

                <div className="mt-duration-row">
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={topicDurationValue}
                    onChange={(e) => setTopicDurationValue(e.target.value)}
                  />

                  <select
                    value={topicDurationType}
                    onChange={(e) => setTopicDurationType(e.target.value)}
                  >
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-inline-actions">
              <button
                className="mt-inline-cancel"
                onClick={() => {
                  setShowForm(false);
                  resetTopicForm();
                }}
              >
                Cancel
              </button>

              <button
                className="mt-inline-save"
                onClick={() => addTopic(module._id)}
              >
                Save Topic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModuleTopics;