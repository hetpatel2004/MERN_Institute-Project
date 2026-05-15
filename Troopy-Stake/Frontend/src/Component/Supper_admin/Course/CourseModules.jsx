import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";

const COURSE_API = "http://localhost:5000/api/courses";
const MODULE_API = "http://localhost:5000/api/modules";

function CourseModules() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const THEME = "#0f172a";

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDurationValue, setModuleDurationValue] = useState("");
  const [moduleDurationType, setModuleDurationType] = useState("Days");
  const [editingModuleId, setEditingModuleId] = useState(null);

  const [topicTitle, setTopicTitle] = useState("");
  const [activeModule, setActiveModule] = useState(null);

  const fetchData = async () => {
    try {
      const courseRes = await axios.get(`${COURSE_API}/${courseId}`);
      const moduleRes = await axios.get(MODULE_API);

      setCourse(courseRes.data);

      const filtered = moduleRes.data.filter(
        (m) => m.courseId?._id === courseId || m.courseId === courseId
      );

      setModules(filtered);
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

  const saveModule = async () => {
    if (!moduleTitle) return alert("Enter module title");

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

  const addTopic = async (moduleId) => {
    if (!topicTitle) return alert("Enter topic title");

    try {
      await axios.post(`${MODULE_API}/${moduleId}/topics`, {
        title: topicTitle,
      });

      setTopicTitle("");
      setActiveModule(null);
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Topic add failed");
    }
  };

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{ background: "#f5f7fb", minHeight: "100vh" }}
    >
      <button
        className="btn mb-3"
        onClick={() => navigate("/superadmin/course")}
        style={{
          background: "#fff",
          border: "1px solid #dbe3ef",
          borderRadius: "10px",
          fontWeight: "600",
        }}
      >
        <ArrowLeft size={16} className="me-2" />
        Back to Courses
      </button>

      <div
        className="p-4 mb-4"
        style={{
          background: `linear-gradient(135deg, ${THEME}, #1e293b)`,
          borderRadius: "22px",
          color: "#fff",
        }}
      >
        <p style={{ color: "#cbd5e1", marginBottom: "8px" }}>
          Super Admin / Courses / Modules
        </p>

        <h2 className="fw-bold mb-2">{course?.title || "Course"} Modules</h2>

        <p className="mb-0" style={{ color: "#e2e8f0" }}>
          Manage modules and add multiple topics inside each module.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div
            className="card border-0"
            style={{
              borderRadius: "20px",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                {editingModuleId ? "Edit Module" : "Add New Module"}
              </h5>

              <label className="form-label fw-semibold">Module Title</label>
              <input
                className="form-control mb-3"
                placeholder="Enter module title"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />

              <label className="form-label fw-semibold">Duration</label>

              <div className="d-flex gap-2 mb-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Example: 5"
                  value={moduleDurationValue}
                  onChange={(e) => setModuleDurationValue(e.target.value)}
                />

                <select
                  className="form-select"
                  value={moduleDurationType}
                  onChange={(e) => setModuleDurationType(e.target.value)}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </select>
              </div>

              <button
                className="btn w-100 text-white"
                onClick={saveModule}
                style={{
                  background: THEME,
                  borderRadius: "12px",
                  padding: "11px",
                  fontWeight: "700",
                }}
              >
                <Plus size={16} className="me-2" />
                {editingModuleId ? "Update Module" : "Add Module"}
              </button>

              {editingModuleId && (
                <button
                  className="btn w-100 mt-2"
                  onClick={resetModuleForm}
                  style={{
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    fontWeight: "600",
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div
            className="card border-0"
            style={{
              borderRadius: "20px",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">All Modules</h5>
                <span className="badge bg-dark">{modules.length} Modules</span>
              </div>

              {modules.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No modules added yet
                </div>
              ) : (
                modules.map((module, index) => (
                  <div
                    key={module._id}
                    className="mb-3 p-3"
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      background: "#fff",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="fw-bold mb-1">
                          {index + 1}. {module.title}
                        </h6>

                        <small className="text-muted">
                          Duration: {module.duration || "Not added"} | Topics:{" "}
                          {module.topics?.length || 0}
                        </small>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => setActiveModule(module._id)}
                          style={{
                            background: "#eef2ff",
                            color: "#3730a3",
                            borderRadius: "9px",
                            fontWeight: "600",
                          }}
                        >
                          + Add Topic
                        </button>

                        <button
                          className="btn btn-sm"
                          onClick={() => editModule(module)}
                          style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: "9px",
                          }}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="btn btn-sm"
                          onClick={() => deleteModule(module._id)}
                          style={{
                            border: "1px solid #fecaca",
                            color: "#ef4444",
                            borderRadius: "9px",
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {module.topics?.length > 0 && (
                      <div
                        className="mt-3 p-3"
                        style={{
                          background: "#f8fafc",
                          borderRadius: "12px",
                        }}
                      >
                        <b>Topics</b>

                        <ul className="mb-0 mt-2">
                          {module.topics.map((topic, i) => (
                            <li key={i}>{topic.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeModule === module._id && (
                      <div className="d-flex gap-2 mt-3">
                        <input
                          className="form-control"
                          placeholder="Enter topic title"
                          value={topicTitle}
                          onChange={(e) => setTopicTitle(e.target.value)}
                        />

                        <button
                          className="btn text-white"
                          onClick={() => addTopic(module._id)}
                          style={{
                            background: THEME,
                            borderRadius: "10px",
                            fontWeight: "600",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseModules;