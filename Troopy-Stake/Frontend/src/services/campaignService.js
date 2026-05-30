import { api } from "../api/axiosClient";

export const campaignService = {
  getAll: (params) => api.get("/campaigns", params),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post("/campaigns", data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getStats: () => api.get("/campaigns/stats"),
  getAnalytics: () => api.get("/campaigns/analytics"),
};
