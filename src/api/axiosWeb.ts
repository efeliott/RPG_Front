// ./src/api/axiosWeb.ts
import axios from 'axios';

const axiosWebInstance = axios.create({
  baseURL: 'http://localhost:8000', // Pas de /api ici pour les cookies CSRF
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Nécessaire pour Sanctum et les cookies
});

export default axiosWebInstance;
