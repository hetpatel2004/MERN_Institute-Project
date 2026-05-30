import { api } from "../api/axiosClient";

export const loginUser = (payload) => api.post("/auth/login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);

export const authService = {
  login: loginUser,
  register: registerUser,
  getProfile: () => api.get("/users/profile"),
};
