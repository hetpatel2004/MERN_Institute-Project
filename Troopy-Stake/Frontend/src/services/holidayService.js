import { api } from "../api/axiosClient";

export const holidayService = {
  getAll: (params) => api.get("/holidays", params),
  getById: (id) => api.get(`/holidays/${id}`),
  create: (data) => api.post("/holidays", data),
  update: (id, data) => api.put(`/holidays/${id}`, data),
  delete: (id) => api.delete(`/holidays/${id}`),
  getStats: () => api.get("/holidays/stats"),
  getUpcoming: () => api.get("/holidays/upcoming"),
  getNotifications: (params) => api.get("/holidays/notifications", params),
  getNotificationLogs: (holidayId) => api.get(`/holidays/notifications/${holidayId}`),
  getRoleCounts: () => api.get("/holidays/role-counts"),
  preload: (year) => api.post("/holidays/preload", { year }),
  bulkCreate: (data) => api.post("/holidays/bulk", data),
};
