import axios from 'axios';

// Use the environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

console.log('🔧 API Configuration:', { API_URL, env: import.meta.env.VITE_API_URL });

const api = axios.create({
    baseURL: API_URL,
    // Do NOT set Content-Type globally — axios will auto-set it correctly:
    //   'application/json' for plain requests
    //   'multipart/form-data; boundary=...' for FormData (lab report upload)
});

// Add request interceptor for debugging
api.interceptors.request.use(
    async (config) => {
        let token = null;
        if (window.Clerk && window.Clerk.session) {
            try {
                token = await window.Clerk.session.getToken();
            } catch (err) {
                console.error("Failed to get fresh Clerk token", err);
            }
        }
        if (!token) {
            token = localStorage.getItem('token');
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 API Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', response.config.url, response.status, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.config?.url, error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
