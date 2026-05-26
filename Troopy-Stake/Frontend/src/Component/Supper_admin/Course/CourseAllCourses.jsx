import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Search, Upload, X, Pencil, Plus, Trash2, BookOpen, Layers, Clock, ListOrdered, FileText } from "lucide-react";
import "./Course.css";

const COURSE_API = "http://localhost:5000/api/courses";
const MODULE_API = "http://localhost:5000/api/modules";

function CourseAllCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleDuration, setModuleDuration] = useState("");
  const [moduleDurationType, setModuleDurationType] = useState("Days");

  const [topicFormModule, setTopicFormModule] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicDuration, setTopicDuration] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSE_API);
      setCourses(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourseModules = async (courseId) => {
    setLoadingModules(true);
    try {
      const res = await axios.get(`${MODULE_API}/course/${courseId}`);
      setCourseModules(res.data || []);
    } catch (error) {
      console.log(error);
      setCourseModules([]);
    }
    setLoadingModules(false);
  };

  const openModal = async (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setShowAddForm(false);
    setTopicFormModule(null);
    resetForm();
    await fetchCourseModules(course._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setCourseModules([]);
    setShowAddForm(false);
    setTopicFormModule(null);
    resetForm();
  };

  const resetForm = () => {
    setModuleTitle("");
    setModuleDescription("");
    setModuleDuration("");
    setModuleDurationType("Days");
  };

  const resetTopicForm = () => {
    setTopicTitle("");
    setTopicDescription("");
    setTopicDuration("");
    setTopicFormModule(null);
  };

  const saveModule = async () => {
    if (!moduleTitle.trim()) return alert("Please enter module title");

    try {
      await axios.post(MODULE_API, {
        courseId: selectedCourse._id,
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
      });

      resetForm();
      setShowAddForm(false);
      await fetchCourseModules(selectedCourse._id);
      fetchCourses();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Module save failed");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module? This action cannot be undone.")) return;

    try {
      await axios.delete(`${MODULE_API}/${id}`);
      await fetchCourseModules(selectedCourse._id);
      fetchCourses();
    } catch (error) {
      console.log(error);
      alert("Module delete failed");
    }
  };

  const saveTopic = async (moduleId) => {
    if (!topicTitle.trim()) return alert("Please enter topic title");

    try {
      await axios.post(`${MODULE_API}/${moduleId}/topics`, {
        title: topicTitle.trim(),
        description: topicDescription.trim(),
        duration: topicDuration.trim(),
      });

      resetTopicForm();
      await fetchCourseModules(selectedCourse._id);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Topic save failed");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p className="text-muted mb-1" style={{ fontSize: "13px", fontWeight: "700" }}>
            Super Admin / Courses
          </p>
          <h1 className="fw-bold mb-1" style={{ fontSize: "52px", color: "#0f172a" }}>
            All Courses
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: "18px" }}>
            Manage all created courses
          </p>
        </div>

        <div className="d-flex flex-column gap-3">
          <Link
            to="/superadmin/course/create"
            className="btn text-white"
            style={{
              background: "#0f172a",
              borderRadius: "14px",
              padding: "12px 22px",
              fontWeight: "800",
              fontSize: "16px",
            }}
          >
            + Create Course
          </Link>

          <button
            className="btn"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "12px 20px",
              fontWeight: "700",
            }}
          >
            <Upload size={16} className="me-2" />
            Bulk Upload (CSV)
          </button>
        </div>
      </div>

      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "26px", overflow: "hidden" }}
      >
        <div className="card-body p-4">
          <div className="position-relative mb-4" style={{ maxWidth: "400px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "15px",
                color: "#94a3b8",
              }}
            />
            <input
              className="form-control"
              placeholder="Search course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "46px",
                height: "52px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "none",
              }}
            />
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Thumbnail</th>
                  <th>Course Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, index) => (
                  <tr key={course._id} className="course-row">
                    <td className="fw-bold">{index + 1}</td>

                    <td>
                      <div className="course-thumb">
                        {course.thumbnail ? (
                          <img
                            src={`http://localhost:5000${course.thumbnail}`}
                            alt={course.title}
                          />
                        ) : (
                          <div className="thumb-placeholder">No Image</div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="course-title-box course-title-clickable" onClick={() => openModal(course)}>
                        <h6>{course.title}</h6>
                        <p>{course.slug}</p>
                      </div>
                    </td>

                    <td>
                      <span className="type-badge">{course.type || "Online"}</span>
                    </td>

                    <td>
                      <span
                        className={
                          course.status === "Published"
                            ? "status-published"
                            : "status-draft"
                        }
                      >
                        {course.status}
                      </span>
                    </td>

                    <td className="fw-semibold">{course.duration}</td>

                    <td className="fw-semibold">₹{course.price}</td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="course-edit-btn"
                          onClick={() =>
                            navigate("/superadmin/course/create", {
                              state: { editCourse: course },
                            })
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="course-add-module-btn"
                          onClick={() => openModal(course)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <p className="text-muted mb-0 fw-semibold">
              Showing {filteredCourses.length} of {courses.length} results
            </p>
            <select
              className="form-select"
              style={{ width: "95px", borderRadius: "12px", height: "46px" }}
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>

      {showModal && selectedCourse && (
        <div className="c-modal-overlay" onClick={closeModal}>
          <div className="c-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c-modal-header">
              <div className="c-modal-header-left">
                <div className="c-modal-icon">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2>{selectedCourse.title}</h2>
                  <p className="c-modal-slug">{selectedCourse.slug}</p>
                </div>
              </div>
              <button className="c-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="c-modal-badges">
              <span className="type-badge">{selectedCourse.type || "Online"}</span>
              <span
                className={
                  selectedCourse.status === "Published"
                    ? "status-published"
                    : "status-draft"
                }
              >
                {selectedCourse.status}
              </span>
              <span className="c-badge">
                <Clock size={14} />
                {selectedCourse.duration || "N/A"}
              </span>
              <span className="c-badge">
                <ListOrdered size={14} />
                {courseModules.length} Module{courseModules.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="c-modal-actions-bar">
              <button
                className="c-action-btn c-action-edit"
                onClick={() => {
                  closeModal();
                  navigate("/superadmin/course/create", {
                    state: { editCourse: selectedCourse },
                  });
                }}
              >
                <Pencil size={15} />
                Edit Course
              </button>
              <button
                className="c-action-btn c-action-add"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={15} />
                Add Module
              </button>
            </div>

            <div className="c-modal-body">
              {loadingModules ? (
                <div className="c-modal-loading">Loading modules...</div>
              ) : courseModules.length === 0 && !showAddForm ? (
                <div className="c-modal-empty">
                  <Layers size={36} />
                  <h4>No modules yet</h4>
                  <p>Click "Add Module" to create the first module for this course.</p>
                </div>
              ) : (
                <div className="c-module-list">
                  {courseModules.map((mod, i) => (
                    <div className="c-module-card" key={mod._id}>
                      <div className="c-module-head">
                        <div className="c-module-info c-module-clickable" onClick={() => { closeModal(); navigate(`/superadmin/course/module/${mod._id}`); }}>
                          <span className="c-module-num">{String(i + 1).padStart(2, "0")}</span>
                          <div>
                            <strong>{mod.title}</strong>
                          </div>
                        </div>
                        <div className="c-module-head-actions">
                          <button
                            className="c-module-add-topic"
                            onClick={() => setTopicFormModule(topicFormModule === mod._id ? null : mod._id)}
                            title="Add Topic"
                          >
                            <FileText size={14} />
                            Add Topic
                          </button>
                          <button
                            className="c-module-del"
                            onClick={() => deleteModule(mod._id)}
                            title="Delete module"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {mod.description && (
                        <p className="c-module-desc">{mod.description}</p>
                      )}
                      <div className="c-topic-list">
                        {mod.topics?.length > 0 ? (
                          mod.topics.map((topic) => (
                            <div
                              className="c-topic-item c-topic-clickable"
                              key={topic._id}
                              onClick={(e) => { e.stopPropagation(); closeModal(); navigate(`/superadmin/course/topic/${topic._id}/materials`); }}
                              title="Manage topic materials"
                            >
                              <span className="c-topic-dot" />
                              <span>{topic.title}</span>
                            </div>
                          ))
                        ) : (
                          <span className="c-no-topics">No topics</span>
                        )}
                      </div>

                      {topicFormModule === mod._id && (
                        <div className="c-topic-form">
                          <div className="c-topic-form-head">
                            <h5><FileText size={14} /> New Topic</h5>
                            <button className="c-topic-form-close" onClick={resetTopicForm}>
                              <X size={14} />
                            </button>
                          </div>
                          <div className="c-topic-form-fields">
                            <input
                              type="text"
                              placeholder="Topic title"
                              value={topicTitle}
                              onChange={(e) => setTopicTitle(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Topic description"
                              value={topicDescription}
                              onChange={(e) => setTopicDescription(e.target.value)}
                            />
                            <div className="c-dur-row">
                              <input
                                type="number"
                                placeholder="Duration"
                                value={topicDuration}
                                onChange={(e) => setTopicDuration(e.target.value)}
                              />
                              <select value="Days" disabled style={{ width: 100, borderRadius: 8, border: "1px solid #cbd5e1", padding: "9px 12px", fontSize: 13, background: "white" }}>
                                <option>Days</option>
                              </select>
                            </div>
                          </div>
                          <div className="c-topic-form-btns">
                            <button className="c-topic-cancel" onClick={resetTopicForm}>Cancel</button>
                            <button className="c-topic-save" onClick={() => saveTopic(mod._id)}>Save</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {showAddForm && (
                <div className="c-add-form">
                  <div className="c-add-form-head">
                    <h4>
                      <Plus size={16} />
                      New Module
                    </h4>
                    <button
                      className="c-add-form-close"
                      onClick={() => { setShowAddForm(false); resetForm(); }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="c-add-form-grid">
                    <div>
                      <label>Module Title <span>*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Introduction to React"
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Description</label>
                      <textarea
                        rows={3}
                        placeholder="Brief description of the module"
                        value={moduleDescription}
                        onChange={(e) => setModuleDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="c-add-form-btns">
                    <button
                      className="c-add-cancel"
                      onClick={() => { setShowAddForm(false); resetForm(); }}
                    >
                      Cancel
                    </button>
                    <button className="c-add-save" onClick={saveModule}>
                      Save Module
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseAllCourses;
