import axios from 'axios';

const getBaseURL = () => {
    // Use environment variable if set (for production/Vercel)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Fallback: dynamic localhost for local development
    const hostname = window.location.hostname;
    return `http://${hostname}:8000/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Inject Auth Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tribe_token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('tribe_token');
            // Optional: redirect to login if not already there
            if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
