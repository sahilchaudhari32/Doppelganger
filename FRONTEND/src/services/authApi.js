import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_BASE });

// Attach token to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('styleforge_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Register a new user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {{ token, user }}
 */
export async function registerUser(username, email, password) {
    const { data } = await api.post('/api/auth/register', { username, email, password });
    if (data.token) localStorage.setItem('styleforge_token', data.token);
    return data;
}

/**
 * Login an existing user
 * @param {string} email
 * @param {string} password
 * @returns {{ token, user }}
 */
export async function loginUser(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (data.token) localStorage.setItem('styleforge_token', data.token);
    return data;
}

/**
 * Logout — clear stored token and user data
 */
export function logoutUser() {
    localStorage.removeItem('styleforge_token');
    localStorage.removeItem('styleforge_user');
}

/**
 * Get the stored JWT token
 */
export function getToken() {
    return localStorage.getItem('styleforge_token');
}

export default api;
