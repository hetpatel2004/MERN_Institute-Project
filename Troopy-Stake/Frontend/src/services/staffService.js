import { api } from "../api/axiosClient";
export const staffService = {
  getAll: (params) => api.get("/staff", params),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post("/staff", data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  getStats: () => api.get("/staff/stats"),
};
