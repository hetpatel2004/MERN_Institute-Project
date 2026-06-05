import { api } from "../api/axiosClient";

export const feeService = {
  getAll: (params) => api.get("/fees", params),
  getById: (id) => api.get(`/fees/${id}`),
  create: (data) => api.post("/fees", data),
  update: (id, data) => api.put(`/fees/${id}`, data),
  delete: (id) => api.delete(`/fees/${id}`),
  getStats: () => api.get("/fees/stats"),
  collectPayment: (feeId, data) => api.post(`/fees/${feeId}/payments`, data),
  getPaymentHistory: (feeId) => api.get(`/fees/${feeId}/payments`),
};
