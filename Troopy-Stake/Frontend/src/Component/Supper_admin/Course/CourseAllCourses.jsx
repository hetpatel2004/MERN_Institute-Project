import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  Trash2,
  Pencil,
  Upload,
} from "lucide-react";

function CourseAllCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);

      setCourses((prev) => prev.filter((item) => item._id !== id));

      alert("Course deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const filteredCourses = courses.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="container-fluid py-4 px-4"
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "13px",
              marginBottom: "6px",
              fontWeight: "500",
            }}
          >
            Super Admin / Courses
          </p>

          <h2
            style={{
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "4px",
            }}
          >
            Courses
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Manage all created courses
          </p>
        </div>

        <div className="d-flex flex-column align-items-end gap-3">
          <Link
            to="/superadmin/course/create"
            className="btn"
            style={{
              background:
                "linear-gradient(135deg,#ff9d00,#ff6b00)",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "600",
              boxShadow: "0 6px 20px rgba(255,140,0,0.25)",
            }}
          >
            + Create Course
          </Link>

          <button
            className="btn"
            style={{
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#0f172a",
              borderRadius: "10px",
              padding: "10px 16px",
              fontWeight: "500",
            }}
          >
            <Upload size={15} className="me-2" />
            Bulk Upload (CSV)
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div
        className="card border-0"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <div className="card-body p-4">
          {/* SEARCH */}
          <div
            className="position-relative mb-4"
            style={{ width: "280px" }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "12px",
                color: "#94a3b8",
              }}
            />

            <input
              type="text"
              placeholder="Search course..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "42px",
                height: "45px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "none",
              }}
            />
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  <th>#</th>
                  <th>Thumbnail</th>
                  <th>Course Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <tr key={course._id}>
                      <td
                        style={{
                          fontWeight: "600",
                          color: "#475569",
                        }}
                      >
                        {index + 1}
                      </td>

                      <td>
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt="thumbnail"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "10px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "10px",
                              background: "#e2e8f0",
                            }}
                          />
                        )}
                      </td>

                      <td>
                        <div>
                          <h6
                            style={{
                              marginBottom: "2px",
                              fontWeight: "600",
                              color: "#0f172a",
                            }}
                          >
                            {course.title}
                          </h6>

                          <small
                            style={{
                              color: "#94a3b8",
                            }}
                          >
                            {course.slug}
                          </small>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "30px",
                            background: "#eff6ff",
                            color: "#2563eb",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {course.type || "Online"}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "30px",
                            background:
                              course.status === "Published"
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              course.status === "Published"
                                ? "#15803d"
                                : "#dc2626",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {course.status}
                        </span>
                      </td>

                      <td>{course.duration || "1 Month"}</td>

                      <td>₹{course.price || "0"}</td>

                      <td>
                        {course.createdAt
                          ? new Date(
                              course.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/superadmin/course/edit/${course._id}`}
                            className="btn btn-sm"
                            style={{
                              border:
                                "1px solid #fdba74",
                              color: "#ff8a00",
                              borderRadius: "8px",
                              padding:
                                "6px 12px",
                              fontWeight: "600",
                              background:
                                "#fff7ed",
                            }}
                          >
                            <Pencil size={14} />
                          </Link>

                          <button
                            onClick={() =>
                              deleteCourse(course._id)
                            }
                            className="btn btn-sm"
                            style={{
                              border:
                                "1px solid #fecaca",
                              color: "#ef4444",
                              borderRadius: "8px",
                              padding:
                                "6px 12px",
                              background:
                                "#fef2f2",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >
                      No Courses Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <p
              style={{
                color: "#64748b",
                marginBottom: "0",
                fontSize: "14px",
              }}
            >
              Showing {filteredCourses.length} of{" "}
              {courses.length} results
            </p>

            <div className="d-flex align-items-center gap-3">
              <select
                className="form-select"
                style={{
                  width: "90px",
                  borderRadius: "10px",
                }}
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm"
                  style={{
                    background: "#ff8a00",
                    color: "#fff",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                  }}
                >
                  1
                </button>

                <button
                  className="btn btn-sm"
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                  }}
                >
                  2
                </button>

                <button
                  className="btn btn-sm"
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                  }}
                >
                  3
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseAllCourses;