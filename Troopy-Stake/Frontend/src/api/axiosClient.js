import axios from "axios";
import { getToken, clearAuthData } from "../utils/storage";

const API_BASE_URL = "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (url, params) => axiosClient.get(url, { params }),
  post: (url, data) => axiosClient.post(url, data),
  put: (url, data) => axiosClient.put(url, data),
  patch: (url, data) => axiosClient.patch(url, data),
  delete: (url) => axiosClient.delete(url),
};

export default axiosClient;
