import axios from "axios";

const api = axios.create({
  baseURL: "https://apiteste.mobieduca.me/api",
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("meu_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("meu_token");
    }
    return Promise.reject(error);
  }
);

export default api;