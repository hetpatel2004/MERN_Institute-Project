import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  BookOpen,
  X,
} from "lucide-react";
import "./Course.css";

const COURSE_API = "http://localhost:5000/api/courses";
const MODULE_API = "http://localhost:5000/api/modules";

function CourseModules() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDurationValue, setModuleDurationValue] = useState("");
  const [moduleDurationType, setModuleDurationType] = useState("Days");
  const [editingModuleId, setEditingModuleId] = useState(null);

  const [activeModule, setActiveModule] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");

  const fetchData = async () => {
    try {
      const courseRes = await axios.get(`${COURSE_API}/${courseId}`);
      const moduleRes = await axios.get(`${MODULE_API}/course/${courseId}`);

      setCourse(courseRes.data);
      setModules(moduleRes.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load modules");
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const resetModuleForm = () => {
    setModuleTitle("");
    setModuleDurationValue("");
    setModuleDurationType("Days");
    setEditingModuleId(null);
  };

  const resetTopicForm = () => {
    setTopicTitle("");
    setTopicDescription("");
    setActiveModule(null);
  };

  const saveModule = async () => {
    if (!moduleTitle.trim()) {
      alert("Enter module title");
      return;
    }

    const duration = moduleDurationValue
      ? `${moduleDurationValue} ${moduleDurationType}`
      : "";

    try {
      if (editingModuleId) {
        await axios.put(`${MODULE_API}/${editingModuleId}`, {
          title: moduleTitle,
          duration,
        });
      } else {
        await axios.post(MODULE_API, {
          courseId,
          title: moduleTitle,
          duration,
        });
      }

      resetModuleForm();
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Module save failed");
    }
  };

  const editModule = (module) => {
    const parts = module.duration?.split(" ") || ["", "Days"];

    setEditingModuleId(module._id);
    setModuleTitle(module.title);
    setModuleDurationValue(parts[0] || "");
    setModuleDurationType(parts[1] || "Days");
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      await axios.delete(`${MODULE_API}/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const openTopicBox = (moduleId) => {
    if (activeModule === moduleId) {
      resetTopicForm();
    } else {
      setActiveModule(moduleId);
      setTopicTitle("");
      setTopicDescription("");
    }
  };

  const addTopic = async (moduleId) => {
    if (!topicTitle.trim() || !topicDescription.trim()) {
      alert("Topic title and description are required");
      return;
    }

    try {
      await axios.post(`${MODULE_API}/${moduleId}/topics`, {
        title: topicTitle,
        description: topicDescription,
      });

      resetTopicForm();
      fetchData();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Topic add failed");
    }
  };

  const deleteTopic = async (moduleId, topicId) => {
    if (!window.confirm("Delete this topic?")) return;

    try {
      await axios.delete(`${MODULE_API}/${moduleId}/topics/${topicId}`);
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Topic delete failed");
    }
  };

  return (
    <div className="module-topic-page">
      <button
        className="back-course-btn"
        onClick={() => navigate("/superadmin/course")}
      >
        <ArrowLeft size={16} />
        Back to Courses
      </button>

      <div className="module-topic-header">
        <div className="header-left">
          <div className="header-icon">
            <BookOpen size={30} />
          </div>

          <div>
            <h2>{course?.title || "Course"} Modules</h2>
            <p>
              Add modules and manage topics inside each module. Topic title and
              description are compulsory.
            </p>
          </div>
        </div>
      </div>

      <div className="add-module-card">
        <h4>{editingModuleId ? "Edit Module" : "Add New Module"}</h4>

        <div className="add-module-grid">
          <div>
            <label>
              Module Title <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter module title"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Duration</label>
            <div className="duration-row">
              <input
                type="number"
                placeholder="Example: 5"
                value={moduleDurationValue}
                onChange={(e) => setModuleDurationValue(e.target.value)}
              />

              <select
                value={moduleDurationType}
                onChange={(e) => setModuleDurationType(e.target.value)}
              >
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>

          <div className="module-btn-box">
            <button className="save-module-btn" onClick={saveModule}>
              <Plus size={16} />
              {editingModuleId ? "Update Module" : "Add Module"}
            </button>

            {editingModuleId && (
              <button className="cancel-module-btn" onClick={resetModuleForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="module-grid">
        {modules.length === 0 ? (
          <div className="empty-module-box">
            <h3>No modules found</h3>
            <p>Please create module first.</p>
          </div>
        ) : (
          modules.map((module, index) => (
            <div className="module-card" key={module._id}>
              <div className="module-card-header">
                <div className="module-left">
                  <div className="module-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h4>{module.title}</h4>
                    <span>
                      {module.topics?.length || 0} Topics
                      {module.duration ? ` • ${module.duration}` : ""}
                    </span>
                  </div>
                </div>

                <div className="module-actions">
                  <button onClick={() => editModule(module)}>
                    <Pencil size={16} />
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteModule(module._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="topic-box">
                <div className="topic-title-row">
                  <h5>Topics ({module.topics?.length || 0})</h5>

                  <button
                    className="add-topic-btn"
                    onClick={() => openTopicBox(module._id)}
                  >
                    <Plus size={15} />
                    Add Topic
                  </button>
                </div>

                {module.topics && module.topics.length > 0 ? (
                  module.topics.map((topic) => (
                    <div className="topic-item" key={topic._id}>
                      <div className="topic-content">
                        <div>
                          <span className="topic-dot"></span>
                          <strong>{topic.title}</strong>
                        </div>
                        <p>{topic.description}</p>
                      </div>

                      <button
                        className="topic-delete"
                        onClick={() => deleteTopic(module._id, topic._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="empty-topic">No topics added yet.</p>
                )}
              </div>

              {activeModule === module._id && (
                <div className="add-topic-form">
                  <div className="form-header">
                    <h5>Add New Topic</h5>

                    <button onClick={resetTopicForm}>
                      <X size={18} />
                    </button>
                  </div>

                  <div className="topic-form-grid">
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
                        placeholder="Enter topic description"
                        value={topicDescription}
                        onChange={(e) => setTopicDescription(e.target.value)}
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="required-text">* Required fields</div>

                  <div className="form-actions">
                    <button className="cancel-topic-btn" onClick={resetTopicForm}>
                      Cancel
                    </button>

                    <button
                      className="submit-topic-btn"
                      onClick={() => addTopic(module._id)}
                    >
                      Add Topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseModules;