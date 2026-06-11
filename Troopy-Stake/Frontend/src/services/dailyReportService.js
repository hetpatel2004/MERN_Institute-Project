import { api } from "../api/axiosClient";
export const dailyReportService = {
  getAll: (params) => api.get("/daily-reports", params),
  getById: (id) => api.get(`/daily-reports/${id}`),
  create: (data) => api.post("/daily-reports", data),
  update: (id, data) => api.put(`/daily-reports/${id}`, data),
  delete: (id) => api.delete(`/daily-reports/${id}`),
  getStats: () => api.get("/daily-reports/stats"),
};
