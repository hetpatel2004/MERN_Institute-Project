import { api } from "../api/axiosClient";

export const courseService = {
  getAll: (params) => api.get("/courses", params),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getModules: (courseId) => api.get(`/courses/${courseId}/modules`),
};
