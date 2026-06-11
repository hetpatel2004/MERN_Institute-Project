import { api } from "../api/axiosClient";
export const programService = {
  getAll: (params) => api.get("/programs", params),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post("/programs", data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
  getStats: () => api.get("/programs/stats"),
};
