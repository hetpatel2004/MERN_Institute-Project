import { api } from "../api/axiosClient";

export const instituteService = {
  getAll: (params) => api.get("/institutes", params),
  getById: (id) => api.get(`/institutes/${id}`),
  create: (data) => api.post("/institutes", data),
  update: (id, data) => api.put(`/institutes/${id}`, data),
  delete: (id) => api.delete(`/institutes/${id}`),
};
