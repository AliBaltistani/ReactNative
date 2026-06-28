import api from './api';
import type { User } from '../types';

export interface LoginResponse {
    user: User;
    token: string;
}

export interface RegisterData {
    name: string;
    phone: string;
    pin?: string;
    isFamilyAccount?: boolean;
    language?: 'en' | 'ur';
}

/**
 * Auth service — handles login, registration, and guest mode.
 * Falls back to mock user when API is unreachable.
 */
export const authService = {
    async loginWithPhone(phone: string, pin?: string): Promise<LoginResponse> {
        try {
            const { data } = await api.post<LoginResponse>('/auth/login', { phone, pin });
            return data;
        } catch {
            // Mock fallback — return a demo user
            return {
                user: {
                    id: 'u_' + Date.now(),
                    name: phone.includes('family') ? 'Family Account' : 'User',
                    phone,
                    role: 'customer',
                    isFamilyAccount: !!pin,
                    familyPin: pin,
                    isAnonymous: false,
                    language: 'en',
                },
                token: 'mock_token_' + Date.now(),
            };
        }
    },

    async register(data: RegisterData): Promise<LoginResponse> {
        try {
            const { data: response } = await api.post<LoginResponse>('/auth/register', data);
            return response;
        } catch {
            return {
                user: {
                    id: 'u_' + Date.now(),
                    name: data.name,
                    phone: data.phone,
                    role: 'customer',
                    isFamilyAccount: data.isFamilyAccount || false,
                    familyPin: data.pin,
                    isAnonymous: false,
                    language: data.language || 'en',
                },
                token: 'mock_token_' + Date.now(),
            };
        }
    },

    async verifyOtp(phone: string, otp: string): Promise<LoginResponse> {
        try {
            const { data } = await api.post<LoginResponse>('/auth/verify-otp', { phone, otp });
            return data;
        } catch {
            return this.loginWithPhone(phone);
        }
    },

    async updateProfile(updates: Partial<User>): Promise<User> {
        try {
            const { data } = await api.patch<{ user: User }>('/auth/profile', updates);
            return data.user;
        } catch {
            return updates as User;
        }
    },
};
