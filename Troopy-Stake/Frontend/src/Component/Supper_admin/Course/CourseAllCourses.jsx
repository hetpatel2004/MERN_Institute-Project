import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Trash2, Pencil, Upload, Layers } from "lucide-react";

const API_URL = "http://localhost:5000/api/courses";

function CourseAllCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await axios.get(API_URL);
      setCourses(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleStatus = async (course) => {
    try {
      const newStatus = course.status === "Published" ? "Draft" : "Published";

      await axios.put(`${API_URL}/${course._id}`, {
        ...course,
        status: newStatus,
      });

      fetchCourses();
    } catch (error) {
      console.log(error);
      alert("Status update failed");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCourses();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{ background: "#f8fafc", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p
            className="text-muted mb-1"
            style={{ fontSize: "13px", fontWeight: "600" }}
          >
            Super Admin / Courses
          </p>
          <h2 className="fw-bold mb-1">All Courses</h2>
          <p className="text-muted mb-0">Manage all created courses</p>
        </div>

        <div className="d-flex flex-column gap-3">
          <Link
            to="/superadmin/course/create"
            className="btn text-white"
            style={{
              background: "#0f172a",
              borderRadius: "12px",
              padding: "10px 18px",
              fontWeight: "700",
            }}
          >
            + Create Course
          </Link>

          <button
            className="btn"
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "10px 18px",
              fontWeight: "600",
            }}
          >
            <Upload size={16} className="me-2" />
            Bulk Upload (CSV)
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: "22px" }}>
        <div className="card-body p-4">
          <div className="position-relative mb-4" style={{ maxWidth: "360px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "15px",
                top: "14px",
                color: "#94a3b8",
              }}
            />

            <input
              className="form-control"
              placeholder="Search course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "45px",
                height: "48px",
                borderRadius: "14px",
              }}
            />
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Modules</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course, index) => (
                  <tr key={course._id}>
                    <td>{index + 1}</td>

                    <td>
                      <h6 className="fw-bold mb-1">{course.title}</h6>
                      <small className="text-muted">{course.slug}</small>
                    </td>

                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {course.type || "Online"}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => toggleStatus(course)}
                        className="btn btn-sm"
                        style={{
                          background:
                            course.status === "Published"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            course.status === "Published"
                              ? "#15803d"
                              : "#dc2626",
                          border: "none",
                          borderRadius: "20px",
                          fontWeight: "700",
                          padding: "6px 14px",
                        }}
                      >
                        {course.status === "Published"
                          ? "Published"
                          : "Unpublished"}
                      </button>
                    </td>

                    <td>
                      {course.duration ||
                        `${course.durationValue || ""} ${course.durationType || ""}`}
                    </td>

                    <td>₹{course.price || 0}</td>

                    <td>
                      <Link
                        to={`/superadmin/course/${course._id}/modules`}
                        className="btn btn-sm"
                        style={{
                          background: "#eef2ff",
                          color: "#3730a3",
                          border: "1px solid #c7d2fe",
                          borderRadius: "10px",
                          fontWeight: "700",
                        }}
                      >
                        Add Modules
                      </Link>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/superadmin/course/${course._id}/modules`}
                          className="btn btn-sm"
                          style={{
                            background: "#0f172a",
                            color: "#fff",
                            borderRadius: "10px",
                            fontWeight: "700",
                          }}
                        >
                          Add Modules
                        </Link>

                        {/* <button
                          onClick={() => deleteCourse(course._id)}
                          className="btn btn-sm"
                          style={{
                            border: "1px solid #fecaca",
                            color: "#ef4444",
                            borderRadius: "9px",
                          }}
                        >
                          Delete
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <p className="text-muted mb-0">
              Showing {filteredCourses.length} of {courses.length} results
            </p>

            <select
              className="form-select"
              style={{ width: "90px", borderRadius: "10px" }}
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseAllCourses;
