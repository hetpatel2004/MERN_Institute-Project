import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { loginUser } from "../../services/authService";
import { setAuthData } from "../../utils/storage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          latitude: null,
          longitude: null,
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({
            latitude: null,
            longitude: null,
          });
        },
      );
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const location = await getLocation();

      const res = await loginUser({
        email,
        password,
        device: navigator.userAgent,
        location,
      });

      const user = res.data.user;
      const token = res.data.token;

      setAuthData({ token, user });

      alert("Login successful");

      const role = user.role?.toLowerCase();

      if (role === "superadmin") {
        navigate(ROUTES.superAdminDashboard);
      } else if (role === "branchadmin") {
        navigate(ROUTES.branchAdmin);
      } else if (role === "companyadmin") {
        navigate(ROUTES.companyAdmin);
      } else if (role === "student") {
        navigate(ROUTES.student);
      } else {
        alert("Role not found");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <style>{`
        .login-card {
          transition: 0.4s ease;
        }

        .login-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .input-custom {
          border-radius: 12px;
          transition: 0.3s;
        }

        .input-custom:focus {
          border-color: #2563eb;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
        }

        .btn-custom {
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border: none;
          transition: 0.3s;
        }

        .btn-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.4);
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
        }

        .link-hover:hover {
          text-decoration: underline;
          color: #1e40af !important;
        }
      `}</style>

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #2563eb, #60a5fa)",
        }}
      >
        <div
          className="card shadow-lg p-5 login-card"
          style={{
            width: "400px",
          }}
        >
          <h2 className="text-center fw-bold mb-2">Welcome Back 👋</h2>
          <p className="text-center text-muted mb-4">Login to continue</p>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control py-3 input-custom"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control py-3 input-custom"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100 py-3 fw-semibold btn-custom"
              type="submit"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don&apos;t have an account?{" "}
            <Link to={ROUTES.registration} className="fw-semibold link-hover">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
