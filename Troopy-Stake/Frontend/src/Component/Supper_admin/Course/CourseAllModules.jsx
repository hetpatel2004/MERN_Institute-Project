import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Layers,
  CheckCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

const COURSE_API = "http://localhost:5000/api/courses";
const MODULE_API = "http://localhost:5000/api/modules";

function CourseAllModules() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [openCourse, setOpenCourse] = useState(null);
  const [search, setSearch] = useState("");

  const [activeCourseId, setActiveCourseId] = useState("");
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationType, setDurationType] = useState("Days");

  const fetchData = async () => {
    try {
      const courseRes = await axios.get(COURSE_API);
      const moduleRes = await axios.get(MODULE_API);

      setCourses(courseRes.data || []);
      setModules(moduleRes.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load courses/modules");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCourseModules = (courseId) => {
    return modules.filter(
      (m) => m.courseId?._id === courseId || m.courseId === courseId,
    );
  };

  const stats = useMemo(() => {
    return {
      totalCourses: courses.length,
      totalModules: modules.length,
      published: courses.filter((c) => c.status === "Published").length,
      draft: courses.filter((c) => c.status !== "Published").length,
    };
  }, [courses, modules]);

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setActiveCourseId("");
    setEditingModuleId(null);
    setModuleTitle("");
    setModuleDescription("");
    setDurationValue("");
    setDurationType("Days");
  };

  const handleAddClick = (courseId) => {
    setActiveCourseId(courseId);
    setEditingModuleId(null);
    setModuleTitle("");
    setModuleDescription("");
    setDurationValue("");
    setDurationType("Days");
    setOpenCourse(courseId);
  };

  const handleEditClick = (module) => {
    const durationParts = module.duration?.split(" ") || ["", "Days"];

    setActiveCourseId(module.courseId?._id || module.courseId);
    setEditingModuleId(module._id);
    setModuleTitle(module.title || "");
    setModuleDescription(module.description || "");
    setDurationValue(durationParts[0] || "");
    setDurationType(durationParts[1] || "Days");
    setOpenCourse(module.courseId?._id || module.courseId);
  };

  const saveModule = async () => {
    if (!activeCourseId) return alert("Please select course");
    if (!moduleTitle.trim()) return alert("Please enter module title");

    const duration = durationValue ? `${durationValue} ${durationType}` : "";

    try {
      if (editingModuleId) {
        await axios.put(`${MODULE_API}/${editingModuleId}`, {
          title: moduleTitle,
          description: moduleDescription,
          duration,
        });
      } else {
        await axios.post(MODULE_API, {
          courseId: activeCourseId,
          title: moduleTitle,
          description: moduleDescription,
          duration,
        });
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Module save failed");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      await axios.delete(`${MODULE_API}/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Module delete failed");
    }
  };

  return (
    <div className="course-module-page">
      <div className="cm-header">
        <div>
          <p>SUPER ADMIN / COURSE MODULES</p>
          <h1>All Courses & Modules</h1>
          <span>
            View every course with its modules and manage them dynamically.
          </span>
        </div>
      </div>

      <div className="cm-stats">
        <div className="cm-stat-card">
          <BookOpen size={28} />
          <p>Total Courses</p>
          <h2>{stats.totalCourses}</h2>
        </div>

        <div className="cm-stat-card">
          <Layers size={28} />
          <p>Total Modules</p>
          <h2>{stats.totalModules}</h2>
        </div>

        <div className="cm-stat-card">
          <CheckCircle size={28} />
          <p>Published</p>
          <h2>{stats.published}</h2>
        </div>

        <div className="cm-stat-card">
          <FileText size={28} />
          <p>Draft</p>
          <h2>{stats.draft}</h2>
        </div>
      </div>

      <div className="cm-grid">
        <div className="cm-list-card">
          <div className="cm-list-top">
            <div>
              <h2>Course Module List</h2>
              <p>Click course to see all modules.</p>
            </div>

            <div className="cm-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="cm-empty">No course found</div>
          ) : (
            filteredCourses.map((course) => {
              const courseModules = getCourseModules(course._id);
              const isOpen = openCourse === course._id;

              return (
                <div className="cm-course-box" key={course._id}>
                  <div className="cm-course-head">
                    <div className="cm-course-info">
                      <div className="cm-thumb">
                        {course.thumbnail ? (
                          <img
                            src={`http://localhost:5000${course.thumbnail}`}
                          />
                        ) : (
                          <BookOpen size={26} />
                        )}
                      </div>

                      <div>
                        <h3>{course.title}</h3>
                        <p>
                          {course.duration || "No duration"} ·{" "}
                          <span
                            className={
                              course.status === "Published"
                                ? "cm-published"
                                : "cm-draft"
                            }
                          >
                            {course.status || "Draft"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="cm-actions">
                      <button
                        className="cm-add-btn"
                        onClick={() => handleAddClick(course._id)}
                      >
                        <Plus size={16} />
                        Add Module
                      </button>

                      <button
                        className="cm-collapse-btn"
                        onClick={() =>
                          setOpenCourse(isOpen ? null : course._id)
                        }
                      >
                        {courseModules.length} Modules
                        {isOpen ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="cm-module-table">
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Module Title</th>
                            <th>Duration</th>
                            <th>Topics</th>
                            <th>Add Topic</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {courseModules.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="cm-no-module">
                                No modules added yet
                              </td>
                            </tr>
                          ) : (
                            courseModules.map((module, index) => (
                              <tr key={module._id}>
                                <td>{index + 1}</td>
                                <td>{module.title}</td>
                                <td>{module.duration || "No duration"}</td>
                                <td>{module.topics?.length || 0}</td>

                                <td>
                                  <button
                                    className="cm-topic-btn"
                                    onClick={() => handleAddTopicClick(module)}
                                  >
                                    + Add Topic
                                  </button>
                                </td>

                                <td>
                                  <div className="cm-row-actions">
                                    <button
                                      className="cm-edit"
                                      onClick={() => handleEditClick(module)}
                                    >
                                      <Pencil size={15} />
                                    </button>

                                    <button
                                      className="cm-delete"
                                      onClick={() => deleteModule(module._id)}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="cm-form-card">
          <h2>{editingModuleId ? "Edit Module" : "Add Module"}</h2>
          <p>Store module directly in backend.</p>

          <label>Course</label>
          <select
            value={activeCourseId}
            onChange={(e) => setActiveCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          <label>Module Title</label>
          <input
            type="text"
            placeholder="Example: Introduction to React"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            rows="4"
            placeholder="Write module description..."
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
          />

          <label>Duration</label>
          <div className="cm-duration">
            <input
              type="number"
              placeholder="5"
              value={durationValue}
              onChange={(e) => setDurationValue(e.target.value)}
            />

            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
            >
              <option value="Days">Days</option>
              <option value="Weeks">Weeks</option>
              <option value="Months">Months</option>
              <option value="Years">Years</option>
            </select>
          </div>

          <button className="cm-save-btn" onClick={saveModule}>
            {editingModuleId ? "Update Module" : "Save Module"}
          </button>

          {editingModuleId && (
            <button className="cm-cancel-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseAllModules;
