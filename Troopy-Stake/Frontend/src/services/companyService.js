import { api } from "../api/axiosClient";

export const companyService = {
  getAll: (params) => api.get("/companies", params),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post("/companies", data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};
