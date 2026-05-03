import React from "react";
import { useNavigate } from "react-router-dom";
import Navba from "./Navba";
import { ROUTES } from "../constants/routes";

function Index() {
  const navigate = useNavigate();

  return (
    <>
      <Navba />
      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(to right, #000000, #434343)",
          color: "white",
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <h1 className="fw-bold">Welcome to Smart LMS System</h1>
        <p className="mt-3">
          Manage Institutes, Courses, Students, Attendance, Quiz & Fees easily
        </p>

        <button
          className="btn btn-primary mt-4 px-4"
          onClick={() => navigate(ROUTES.login)}
        >
          Get Started
        </button>
      </div>

      {/* FEATURES SECTION */}
      <div className="container mt-5">
        <div className="row text-center">

          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow">
              <h4>📚 Courses</h4>
              <p>Manage courses, modules & concepts easily.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow">
              <h4>🎓 Students</h4>
              <p>Track student progress & attendance.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow">
              <h4>📝 Quiz</h4>
              <p>Conduct quizzes and practice tasks.</p>
            </div>
          </div>

        </div>
      </div>

      {/* EXTRA SECTION */}
      <div className="container mt-4">
        <div className="row text-center">

          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow">
              <h4>📊 Reports</h4>
              <p>Generate monthly reports for parents.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow">
              <h4>💰 Fees</h4>
              <p>Manage fees & installments easily.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow">
              <h4>🏫 Institutes</h4>
              <p>Handle multiple institutes & roles.</p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          background: "#000",
          color: "white",
          textAlign: "center",
          padding: "15px",
          marginTop: "40px",
        }}
      >
        <p>© 2026 LMS Project | All Rights Reserved</p>
      </div>
    </>
  );
}

export default Index;