export const API_BASE_URL = "http://localhost:5000/api";
export const JSON_SERVER_BASE_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  institutes: `${JSON_SERVER_BASE_URL}/institutes`,
  courses: `${JSON_SERVER_BASE_URL}/courses`,
  companies: `${JSON_SERVER_BASE_URL}/companies`,
};
