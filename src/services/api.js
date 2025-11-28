import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apiteste.mobieduca.me/api/documentation' 
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('meu_token'); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;