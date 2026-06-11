import { api } from "../api/axiosClient";
export const courseCategoryService = {
  getAll: (params) => api.get("/course-categories", params),
  getById: (id) => api.get(`/course-categories/${id}`),
  create: (data) => api.post("/course-categories", data),
  update: (id, data) => api.put(`/course-categories/${id}`, data),
  delete: (id) => api.delete(`/course-categories/${id}`),
  getStats: () => api.get("/course-categories/stats"),
};
