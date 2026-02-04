import axios from 'axios'
import * as tokenService from './token'
const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

const api = axios.create({
    baseURL: SERVER_URL,
});

api.interceptors.request.use((config) => {
    const token = tokenService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
);

export default api;