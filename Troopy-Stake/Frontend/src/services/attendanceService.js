import { api } from "../api/axiosClient";
export const attendanceService = {
  getAll: (params) => api.get("/attendance", params),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post("/attendance", data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  getStats: () => api.get("/attendance/stats"),
};
