import { api } from "../api/axiosClient";
export const broadcastService = {
  getAll: (params) => api.get("/broadcasts", params),
  getById: (id) => api.get(`/broadcasts/${id}`),
  create: (data) => api.post("/broadcasts", data),
  update: (id, data) => api.put(`/broadcasts/${id}`, data),
  delete: (id) => api.delete(`/broadcasts/${id}`),
  getStats: () => api.get("/broadcasts/stats"),
};
