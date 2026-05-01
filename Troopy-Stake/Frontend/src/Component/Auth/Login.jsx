import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (role === "superadmin") {
        const res = await axios.get(
          `http://localhost:3000/superadmins?email=${email}&password=${password}`
        );

        if (res.data.length > 0) {
          const superAdmin = res.data[0];

          localStorage.setItem("superAdmin", JSON.stringify(superAdmin));

          alert(`Welcome ${superAdmin.name}`);
          navigate("/superadmin");
        } else {
          alert("Invalid Super Admin email or password");
        }
      } 
      
      else if (role === "instituteadmin") {
        navigate("/institute-admin");
      } 
      
      else {
        navigate("/student");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed. Please start json-server.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #0f766e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "18px" }}
      >
        <h3 className="text-center mb-2">Welcome Back</h3>
        <p className="text-center text-muted mb-4">
          Login according to your role
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Select Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="superadmin">Super Admin</option>
              <option value="instituteadmin">Institute Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-success w-100 mt-2">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account? <Link to="/registration">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;