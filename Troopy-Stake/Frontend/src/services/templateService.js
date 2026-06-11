import { api } from "../api/axiosClient";
export const templateService = {
  getAll: (params) => api.get("/templates", params),
  getById: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post("/templates", data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
  getStats: () => api.get("/templates/stats"),
};
