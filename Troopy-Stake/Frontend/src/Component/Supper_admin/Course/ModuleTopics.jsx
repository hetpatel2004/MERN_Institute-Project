import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil, BookOpen, X } from "lucide-react";
import "./Course.css";

const API = "http://localhost:5000/api/modules";

function ModuleTopics() {
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");

  const fetchModules = async () => {
    const res = await axios.get(API);
    setModules(res.data || []);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const addTopic = async (moduleId) => {
    if (!topicTitle || !topicDescription) {
      alert("Topic title and description are required");
      return;
    }

    await axios.post(`${API}/${moduleId}/topics`, {
      title: topicTitle,
      description: topicDescription,
    });

    setTopicTitle("");
    setTopicDescription("");
    setActiveModule(null);
    fetchModules();
  };

  const deleteTopic = async (moduleId, topicId) => {
    if (!window.confirm("Delete this topic?")) return;

    await axios.delete(`${API}/${moduleId}/topics/${topicId}`);
    fetchModules();
  };

  return (
    <div className="mt-page">
      <div className="mt-header">
        <div className="mt-icon">
          <BookOpen size={28} />
        </div>
        <div>
          <h2>Course Modules</h2>
          <p>Organize your course by adding modules and topics.</p>
        </div>
      </div>

      <div className="mt-grid">
        {modules.map((module, index) => (
          <div className="mt-card" key={module._id}>
            <div className="mt-card-top">
              <div className="mt-module-info">
                <div className="mt-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h4>{module.title}</h4>
              </div>

              <div className="mt-actions">
                <Pencil size={17} />
                <Trash2 size={17} className="delete-icon" />
              </div>
            </div>

            <div className="mt-topic-box">
              <div className="mt-topic-head">
                <h5>Topics ({module.topics?.length || 0})</h5>

                <button onClick={() => setActiveModule(module._id)}>
                  <Plus size={15} /> Add Topic
                </button>
              </div>

              {module.topics?.length > 0 ? (
                module.topics.map((topic) => (
                  <div className="mt-topic-row" key={topic._id}>
                    <div>
                      <span></span>
                      <b>{topic.title}</b>
                      <p>{topic.description}</p>
                    </div>

                    <button onClick={() => deleteTopic(module._id, topic._id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="mt-empty">No topics added yet.</p>
              )}
            </div>

            {activeModule === module._id && (
              <div className="mt-add-topic">
                <div className="mt-form-title">
                  <h5>Add New Topic</h5>
                  <button onClick={() => setActiveModule(null)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-form-grid">
                  <div>
                    <label>
                      Topic Title <span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter topic title"
                      value={topicTitle}
                      onChange={(e) => setTopicTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>
                      Description <span>*</span>
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Enter topic description"
                      value={topicDescription}
                      onChange={(e) => setTopicDescription(e.target.value)}
                    />
                  </div>
                </div>

                <small>* Required fields</small>

                <div className="mt-form-btns">
                  <button
                    className="cancel-btn"
                    onClick={() => setActiveModule(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-btn"
                    onClick={() => addTopic(module._id)}
                  >
                    Add Topic
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-add-module">
          <div>
            <Plus size={30} />
          </div>
          <h4>Add New Module</h4>
          <p>Create a new module to organize your course content.</p>
        </div>
      </div>
    </div>
  );
}

export default ModuleTopics;