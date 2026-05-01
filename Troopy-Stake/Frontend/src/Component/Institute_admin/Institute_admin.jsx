import React from "react";

function InstituteAdmin() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <div style={{ width: "260px", background: "#0f172a", color: "white", padding: "25px" }}>
        <h3>Institute Panel</h3>
        <p className="text-secondary">Institute Admin</p>

        <button className="btn btn-dark w-100 text-start my-2">Dashboard</button>
        <button className="btn btn-dark w-100 text-start my-2">Students</button>
        <button className="btn btn-dark w-100 text-start my-2">Courses</button>
        <button className="btn btn-dark w-100 text-start my-2">Attendance</button>
        <button className="btn btn-dark w-100 text-start my-2">Fees</button>
      </div>

      <div className="container-fluid p-5">
        <h5 className="text-success">INSTITUTE MANAGEMENT</h5>
        <h1 className="fw-bold mb-4">Institute Admin Dashboard</h1>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Total Students</p>
              <h2>320</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Active Courses</p>
              <h2>12</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Faculty</p>
              <h2>18</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 shadow-sm">
              <p>Placement</p>
              <h2>45</h2>
            </div>
          </div>
        </div>

        <div className="card p-5 mt-4 shadow-sm">
          <h2>Institute admin can manage students, courses, attendance and fees.</h2>
          <p className="text-muted">
            This page is UI only for now. Later we will connect this role with MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InstituteAdmin;