import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm Bearer Token vào header nếu người dùng đã đăng nhập
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gamestore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const gameApi = {
  getGames: (params) => api.get('/games', { params }).then((res) => res.data),
  getGameDetail: (id) => api.get(`/games/${id}`).then((res) => res.data),
  checkout: (items) => api.post('/games/checkout', { items }).then((res) => res.data),
  resetPurchases: (gameIds) => api.post('/games/reset-purchases', { gameIds }).then((res) => res.data),
  getSimilarGames: (id, limit = 8) => api.get(`/games/similar/${id}`, { params: { limit } }).then((res) => res.data),
};

export default api;
