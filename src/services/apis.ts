import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

// ✅ Base URL for all API requests (you can load from .env)
const baseURL = 'https://jsonplaceholder.typicode.com';

// ✅ Create public instance (for unauthenticated requests)
const publicApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Create private instance (for authenticated requests)
const privateApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔒 Attach Bearer token to all private requests
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Axios headers are guaranteed to exist in InternalAxiosRequestConfig
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ❌ Global error handling for private API
privateApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('Unauthorized: Token expired or invalid.');
          localStorage.removeItem('token');
          // Optionally redirect: window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden: You don't have access to this resource.");
          break;
        case 404:
          console.error('Not Found: The requested resource does not exist.');
          break;
        case 500:
          console.error('Server Error: Something went wrong on the server.');
          break;
        default:
          console.error('API Error:', (data as any)?.message || error.message);
          break;
      }
    } else {
      // Network or other error
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);
// ✅ Export both instances
export { privateApi, publicApi };

/*
🔧 Example usage:

import { publicApi, privateApi } from "@/api/api";

// Public call
publicApi.get("/public/data")
  .then(res => console.log(res.data))
  .catch(err => console.error("Public API error:", err));

// Private call
privateApi.get("/user/profile")
  .then(res => console.log(res.data))
  .catch(err => console.error("Private API error:", err));
*/
