import React, { useEffect, useState } from "react";
import axios from "axios";

const COURSE_API = "http://localhost:5000/api/courses";
const MODULE_API = "http://localhost:5000/api/modules";

function CourseModules() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDuration, setModuleDuration] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [topicTitle, setTopicTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);

  const fetchData = async () => {
    const courseRes = await axios.get(COURSE_API);
    const moduleRes = await axios.get(MODULE_API);

    setCourses(courseRes.data || []);
    setModules(moduleRes.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addModule = async (courseId) => {
    if (!moduleTitle) return alert("Enter module name");

    await axios.post(MODULE_API, {
      courseId,
      title: moduleTitle,
      duration: moduleDuration,
    });

    setModuleTitle("");
    setModuleDuration("");
    setSelectedCourse(null);
    fetchData();
  };

  const addTopic = async (moduleId) => {
    if (!topicTitle) return alert("Enter topic name");

    await axios.post(`${MODULE_API}/${moduleId}/topics`, {
      title: topicTitle,
    });

    setTopicTitle("");
    setSelectedModule(null);
    fetchData();
  };

  const getCourseModules = (courseId) => {
    return modules.filter((item) => item.courseId?._id === courseId || item.courseId === courseId);
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <p className="text-muted mb-1" style={{ fontSize: "13px" }}>
        Super Admin / Courses / Modules
      </p>

      <h2 className="fw-bold mb-1">Course Modules</h2>
      <p className="text-muted mb-4">Add modules and topics course wise</p>

      <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
        <div className="card-body p-4">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Modules</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course, index) => {
                const courseModules = getCourseModules(course._id);

                return (
                  <tr key={course._id}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">{course.title}</td>

                    <td>
                      {courseModules.length === 0 ? (
                        <span className="text-muted">No modules added</span>
                      ) : (
                        courseModules.map((module) => (
                          <div
                            key={module._id}
                            className="mb-3 p-3"
                            style={{
                              background: "#fff7ed",
                              border: "1px solid #fed7aa",
                              borderRadius: "12px",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <b>{module.title}</b>
                                <br />
                                <small className="text-muted">
                                  Duration: {module.duration || "Not added"}
                                </small>
                              </div>

                              <button
                                className="btn btn-sm text-white"
                                style={{
                                  background: "linear-gradient(135deg,#ff9d00,#ff6b00)",
                                  borderRadius: "8px",
                                }}
                                onClick={() => setSelectedModule(module._id)}
                              >
                                + Add Topic
                              </button>
                            </div>

                            {module.topics?.length > 0 && (
                              <ul className="mt-2 mb-0">
                                {module.topics.map((topic, i) => (
                                  <li key={i}>{topic.title}</li>
                                ))}
                              </ul>
                            )}

                            {selectedModule === module._id && (
                              <div className="d-flex gap-2 mt-3">
                                <input
                                  className="form-control"
                                  placeholder="Enter topic name"
                                  value={topicTitle}
                                  onChange={(e) => setTopicTitle(e.target.value)}
                                />

                                <button
                                  className="btn text-white"
                                  style={{ background: "#ff8a00" }}
                                  onClick={() => addTopic(module._id)}
                                >
                                  Save
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </td>

                    <td>
                      <button
                        className="btn text-white"
                        style={{
                          background: "linear-gradient(135deg,#ff9d00,#ff6b00)",
                          borderRadius: "10px",
                          fontWeight: "600",
                        }}
                        onClick={() => setSelectedCourse(course._id)}
                      >
                        + Add Module
                      </button>

                      {selectedCourse === course._id && (
                        <div className="mt-3">
                          <input
                            className="form-control mb-2"
                            placeholder="Module name"
                            value={moduleTitle}
                            onChange={(e) => setModuleTitle(e.target.value)}
                          />

                          <input
                            className="form-control mb-2"
                            placeholder="Duration e.g. 10 Days"
                            value={moduleDuration}
                            onChange={(e) => setModuleDuration(e.target.value)}
                          />

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => addModule(course._id)}
                          >
                            Save Module
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {courses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseModules;