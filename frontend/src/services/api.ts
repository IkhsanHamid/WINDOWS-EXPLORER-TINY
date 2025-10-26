import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

apiClient.interceptors.response.use(
  (response: AxiosResponse): any => response.data,
  (error: AxiosError<ApiErrorResponse>): never => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export default apiClient;
