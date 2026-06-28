import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, UserRole, FamilyMember } from '../types';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    currentRole: UserRole;
    familyMembers: FamilyMember[];
    isLoading: boolean;

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
    setGuest: () => void;
    switchRole: (role: UserRole) => void;
    updateUser: (partial: Partial<User>) => void;
    setFamilyMembers: (members: FamilyMember[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: false,
            currentRole: 'customer',
            familyMembers: [],
            isLoading: false,

            login: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isGuest: false,
                    currentRole: user.role || 'customer',
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isGuest: false,
                    currentRole: 'customer',
                    familyMembers: [],
                }),

            setGuest: () =>
                set({
                    user: {
                        id: 'guest',
                        name: 'Guest',
                        phone: '',
                        role: 'customer',
                        isFamilyAccount: false,
                        isAnonymous: true,
                        language: 'en',
                    },
                    token: null,
                    isAuthenticated: true,
                    isGuest: true,
                    currentRole: 'customer',
                }),

            switchRole: (role) =>
                set((state) => ({
                    currentRole: role,
                    user: state.user ? { ...state.user, role } : state.user,
                })),

            updateUser: (partial) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...partial } : state.user,
                })),

            setFamilyMembers: (members) => set({ familyMembers: members }),

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'rasaango-auth',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                isGuest: state.isGuest,
                currentRole: state.currentRole,
                familyMembers: state.familyMembers,
            }),
        }
    )
);
