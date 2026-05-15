import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Search, Upload } from "lucide-react";
import "./Course.css"
const API_URL = "http://localhost:5000/api/courses";

function CourseAllCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

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

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p
            className="text-muted mb-1"
            style={{
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            Super Admin / Courses
          </p>

          <h1
            className="fw-bold mb-1"
            style={{
              fontSize: "52px",
              color: "#0f172a",
            }}
          >
            All Courses
          </h1>

          <p
            className="text-muted mb-0"
            style={{
              fontSize: "18px",
            }}
          >
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

      {/* TABLE CARD */}
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "26px",
          overflow: "hidden",
        }}
      >
        <div className="card-body p-4">
          {/* SEARCH */}
          <div
            className="position-relative mb-4"
            style={{
              maxWidth: "400px",
            }}
          >
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

          {/* TABLE */}
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
                  <tr key={course._id}>
                    <td className="fw-bold">{index + 1}</td>

                    {/* THUMBNAIL */}
                    <td>
                      <div className="course-thumb">
                        {course.thumbnail ? (
                          <img
                            src={`http://localhost:5000${course.thumbnail}`}
                            alt={course.title}
                          />
                        ) : (
                          <div className="thumb-placeholder">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TITLE */}
                    <td>
                      <div className="course-title-box">
                        <h6>{course.title}</h6>
                        <p>{course.slug}</p>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td>
                      <span className="type-badge">
                        {course.type || "Online"}
                      </span>
                    </td>

                    {/* STATUS */}
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

                    {/* DURATION */}
                    <td className="fw-semibold">
                      {course.duration}
                    </td>

                    {/* PRICE */}
                    <td className="fw-semibold">
                      ₹{course.price}
                    </td>

                    {/* ACTION */}
                    <td>
                      <div className="d-flex gap-2">
                        
                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          className="course-edit-btn"
                          onClick={() =>
                            navigate(
                              "/superadmin/course/create",
                              {
                                state: {
                                  editCourse: course,
                                },
                              }
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* MODULE BUTTON */}
                        <button
                          type="button"
                          className="course-add-module-btn"
                          onClick={() =>
                            navigate(
                              `/superadmin/course/${course._id}/modules`,
                              {
                                state: { course },
                              }
                            )
                          }
                        >
                          Add Modules
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <p className="text-muted mb-0 fw-semibold">
              Showing {filteredCourses.length} of {courses.length} results
            </p>

            <select
              className="form-select"
              style={{
                width: "95px",
                borderRadius: "12px",
                height: "46px",
              }}
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