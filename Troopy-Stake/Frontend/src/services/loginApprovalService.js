import { api } from "../api/axiosClient";
export const loginApprovalService = {
  getAll: (params) => api.get("/login-approvals", params),
  getById: (id) => api.get(`/login-approvals/${id}`),
  create: (data) => api.post("/login-approvals", data),
  approve: (id) => api.put(`/login-approvals/${id}/approve`),
  reject: (id) => api.put(`/login-approvals/${id}/reject`),
  delete: (id) => api.delete(`/login-approvals/${id}`),
  getStats: () => api.get("/login-approvals/stats"),
};
