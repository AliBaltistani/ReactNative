import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLanguage as setI18nLanguage } from '../i18n';

export interface SettingsState {
    language: 'en' | 'ur';
    defaultAnonymous: boolean;
    notificationsEnabled: boolean;
    hasSeenOnboarding: boolean;

    // For reactive re-renders
    _languageVersion: number;

    // Actions
    setLanguage: (lang: 'en' | 'ur') => void;
    toggleDefaultAnonymous: () => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    markOnboardingSeen: () => void;
    resetOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            language: 'en',
            defaultAnonymous: false,
            notificationsEnabled: true,
            hasSeenOnboarding: false,
            _languageVersion: 0,

            setLanguage: (lang) => {
                setI18nLanguage(lang);
                set((state) => ({
                    language: lang,
                    _languageVersion: state._languageVersion + 1,
                }));
            },

            toggleDefaultAnonymous: () =>
                set((state) => ({ defaultAnonymous: !state.defaultAnonymous })),

            setNotificationsEnabled: (enabled) =>
                set({ notificationsEnabled: enabled }),

            markOnboardingSeen: () => set({ hasSeenOnboarding: true }),

            resetOnboarding: () => set({ hasSeenOnboarding: false }),
        }),
        {
            name: 'rasaango-settings',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => {
                return (state, error) => {
                    // Sync i18n language on app start
                    if (state?.language) {
                        setI18nLanguage(state.language);
                    }
                };
            },
        }
    )
);
