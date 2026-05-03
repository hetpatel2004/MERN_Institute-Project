import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const getInstitutes = () => axios.get(API_ENDPOINTS.institutes);
export const createInstitute = (payload) =>
  axios.post(API_ENDPOINTS.institutes, payload);
export const updateInstitute = (id, payload) =>
  axios.put(`${API_ENDPOINTS.institutes}/${id}`, payload);
export const deleteInstituteById = (id) =>
  axios.delete(`${API_ENDPOINTS.institutes}/${id}`);

export const getCourses = () => axios.get(API_ENDPOINTS.courses);
export const createCourse = (payload) => axios.post(API_ENDPOINTS.courses, payload);
export const updateCourse = (id, payload) =>
  axios.put(`${API_ENDPOINTS.courses}/${id}`, payload);
export const deleteCourseById = (id) =>
  axios.delete(`${API_ENDPOINTS.courses}/${id}`);

export const getCompanies = () => axios.get(API_ENDPOINTS.companies);
export const createCompany = (payload) =>
  axios.post(API_ENDPOINTS.companies, payload);
export const updateCompany = (id, payload) =>
  axios.put(`${API_ENDPOINTS.companies}/${id}`, payload);
export const deleteCompanyById = (id) =>
  axios.delete(`${API_ENDPOINTS.companies}/${id}`);
