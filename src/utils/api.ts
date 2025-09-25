import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import { toast } from "react-hot-toast";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token && config.headers)
    config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only show session expired toast if there's still a token (meaning it wasn't a deliberate logout)
      const token = Cookies.get("token");
      if (token) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
