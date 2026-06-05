import { api } from "../api/axiosClient";

export const invoiceService = {
  getAll: (params) => api.get("/invoices", params),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getStats: () => api.get("/invoices/stats"),
  generateNumber: () => api.get("/invoices/generate-number"),
};
