import { api } from "../api/axiosClient";
export const taskService = {
  getAll: (params) => api.get("/tasks", params),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get("/tasks/stats"),
};
