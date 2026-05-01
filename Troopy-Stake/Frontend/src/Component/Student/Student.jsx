import React from "react";

function Student() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ width: "250px", background: "#111827", color: "white", padding: "25px" }}>
        <h3>Student Panel</h3>
        <p className="text-secondary">Student</p>

        <button className="btn btn-dark w-100 text-start my-2">Dashboard</button>
        <button className="btn btn-dark w-100 text-start my-2">My Courses</button>
        <button className="btn btn-dark w-100 text-start my-2">Attendance</button>
        <button className="btn btn-dark w-100 text-start my-2">Jobs</button>
        <button className="btn btn-dark w-100 text-start my-2">Profile</button>
      </div>

      <div className="container-fluid p-5">
        <h5 className="text-success">STUDENT WORKSPACE</h5>
        <h1 className="fw-bold mb-4">Student Dashboard</h1>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Enrolled Courses</p>
              <h2>4</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Attendance</p>
              <h2>86%</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Assignments</p>
              <h2>12</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Job Offers</p>
              <h2>3</h2>
            </div>
          </div>
        </div>

        <div className="card p-5 mt-4 shadow-sm">
          <h2>Student can view courses, attendance, assignments and job opportunities.</h2>
          <p className="text-muted">
            This page is UI only for now. Later we will fetch student data from MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Student;