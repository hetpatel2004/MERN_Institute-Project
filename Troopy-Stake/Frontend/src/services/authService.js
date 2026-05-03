import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const loginUser = (payload) => axios.post(API_ENDPOINTS.login, payload);

export const registerUser = (payload) =>
  axios.post(API_ENDPOINTS.register, payload);
