import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    
    const isTokenExpired =
      status === 401 && String(data?.data || "").includes("jwt expired");

    if (isTokenExpired) {
      console.log("Logging out because token expired");

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/auth";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
