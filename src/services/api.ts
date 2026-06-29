/**
 * RasaanGo — Base API Configuration
 */

const API_BASE_URL = 'http://localhost:3001/api';
const TIMEOUT = 10000;

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
}

export function getAuthToken(): string | null {
    return authToken;
}

async function apiRequest<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...headers,
        },
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    config.signal = controller.signal;

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Error: ${response.status}`);
        }

        return data as T;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

export const api = {
    get: <T = unknown>(endpoint: string) => apiRequest<T>(endpoint),
    post: <T = unknown>(endpoint: string, body: Record<string, unknown>) =>
        apiRequest<T>(endpoint, { method: 'POST', body }),
    put: <T = unknown>(endpoint: string, body: Record<string, unknown>) =>
        apiRequest<T>(endpoint, { method: 'PUT', body }),
    patch: <T = unknown>(endpoint: string, body: Record<string, unknown>) =>
        apiRequest<T>(endpoint, { method: 'PATCH', body }),
    delete: <T = unknown>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export default api;
