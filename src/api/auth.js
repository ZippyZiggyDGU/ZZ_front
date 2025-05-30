// src/api/auth.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
});

// 기존에 작성해 두신 named exports
export function signup(request) {
    return api.post('/signup', request);
}

export function login(request) {
    return api.post('/login', request);
}

// ↓ 추가 ↓
export default api;
