import { api } from "../api/axiosClient";

export const expenseService = {
  getAll: (params) => api.get("/expenses", params),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post("/expenses", data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStats: () => api.get("/expenses/stats"),
  approve: (id) => api.put(`/expenses/${id}/approve`),
  reject: (id) => api.put(`/expenses/${id}/reject`),
};
