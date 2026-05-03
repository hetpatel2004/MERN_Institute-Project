import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { registerUser } from "../../services/authService";

function Registration() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await registerUser({ name, email, password, role });

      alert("Registration successful");
      navigate(ROUTES.login);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <style>{`
        .register-card {
          transition: 0.4s ease;
        }

        .register-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .input-custom {
          border-radius: 12px;
          transition: 0.3s;
        }

        .input-custom:focus {
          border-color: #16a34a;
          box-shadow: 0 0 10px rgba(22, 163, 74, 0.4);
        }

        .btn-custom {
          border-radius: 12px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border: none;
          transition: 0.3s;
        }

        .btn-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(22, 163, 74, 0.4);
          background: linear-gradient(135deg, #15803d, #14532d);
        }

        .link-hover:hover {
          text-decoration: underline;
          color: #15803d !important;
        }
      `}</style>

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #14532d, #16a34a, #4ade80)",
        }}
      >
        <div
          className="card shadow-lg p-5 register-card"
          style={{
            width: "400px",
          }}
        >
          <h2 className="text-center fw-bold mb-2">Create Account 🚀</h2>
          <p className="text-center text-muted mb-4">
            Register to get started
          </p>

          <form onSubmit={handleRegister}>
            {/* ROLE (only student allowed) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Role</label>
              <select
                className="form-control input-custom py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                {/* later you can allow instituteadmin via superadmin */}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control py-3 input-custom"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control py-3 input-custom"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control py-3 input-custom"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success w-100 py-3 fw-semibold btn-custom"
              type="submit"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <Link to={ROUTES.login} className="fw-semibold link-hover">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Registration;