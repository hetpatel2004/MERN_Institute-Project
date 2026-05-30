import { api } from "../api/axiosClient";

export const leadService = {
  getAll: (params) => api.get("/leads", params),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post("/leads", data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  getStats: () => api.get("/leads/stats/stats"),
};
