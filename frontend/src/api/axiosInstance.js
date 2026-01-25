import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Global axios performance tweaks
axiosInstance.defaults.headers.common["Accept"] = "application/json";
axiosInstance.defaults.timeout = 15000;

// Avoid sending unnecessary large payloads
axiosInstance.interceptors.request.use((config) => {
  // disable axios default decompression flags; server uses compression
  config.decompress = true;
  return config;
});

export default axiosInstance;
