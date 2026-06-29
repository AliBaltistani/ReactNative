/**
 * RasaanGo — Auth Service
 */
import api, { setAuthToken } from './api';

export interface LoginResponse {
    token: string;
    user: { id: string; name: string; phone: string; role: string };
}

export const authService = {
    register: (data: { name: string; phone: string; role?: string }) =>
        api.post<LoginResponse>('/auth/register', data),

    login: (phone: string) =>
        api.post<{ message: string; otpSent: boolean }>('/auth/login', { phone }),

    verifyOTP: (phone: string, otp: string) =>
        api.post<LoginResponse>('/auth/verify-otp', { phone, otp }),

    createFamilyAccount: (data: { headName: string; headPhone: string; members: { name: string; pin: string; role: string }[] }) =>
        api.post<LoginResponse>('/auth/family/create', data),

    loginWithPin: (familyId: string, pin: string) =>
        api.post<LoginResponse>('/auth/family/login', { familyId, pin }),

    logout: () => {
        setAuthToken(null);
        return Promise.resolve();
    },
};

export default authService;
