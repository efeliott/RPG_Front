// src/api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Ajoute cette ligne pour permettre l'envoi des cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
