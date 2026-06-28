import axios from 'axios';
import { ENV } from '../config/env';
import { useAuthStore } from '../store/authStore';

/**
 * Central Axios instance — all API calls go through this.
 * Automatically injects auth token and handles common errors.
 */
const api = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: ENV.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// ─── Request Interceptor: inject auth token ─────────────────
api.interceptors.request.use(
    (config) => {
        if (ENV.FORCE_MOCK) {
            return Promise.reject(new Error('MOCK_MODE_ACTIVE'));
        }

        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle errors globally ───────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired → force logout
            useAuthStore.getState().logout();
        }

        // Network error — no response received
        if (!error.response && error.message !== 'MOCK_MODE_ACTIVE') {
            console.warn('[API] Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;

/**
 * Helper: check if the API server is reachable.
 * Used to decide whether to call API or use mock data.
 */
export async function isApiReachable(): Promise<boolean> {
    if (ENV.FORCE_MOCK) return false;

    try {
        await api.get('/health', { timeout: 3000 });
        return true;
    } catch {
        return false;
    }
}
