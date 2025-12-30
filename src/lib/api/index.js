import axios from "axios";
import { API_URL } from "@providers/constants";

export const apiClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});