import en from './en.json';
import ur from './ur.json';

export type TranslationKeys = typeof en;

const translations: Record<string, TranslationKeys> = {
    en,
    ur: ur as unknown as TranslationKeys,
};

let currentLanguage = 'en';

/**
 * Simple i18n helper — no external dependency needed for MVP.
 * Accesses nested keys like "auth.getStarted"
 */
export function t(key: string, defaultValue?: string): string {
    const keys = key.split('.');
    let result: unknown = translations[currentLanguage] || translations.en;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = (result as Record<string, unknown>)[k];
        } else {
            // Fallback to English
            result = translations.en;
            for (const fallbackKey of keys) {
                if (result && typeof result === 'object' && fallbackKey in result) {
                    result = (result as Record<string, unknown>)[fallbackKey];
                } else {
                    return defaultValue || key; // Return key if not found
                }
            }
            break;
        }
    }

    return typeof result === 'string' ? result : (defaultValue || key);
}

export function setLanguage(lang: string): void {
    currentLanguage = lang;
}

export function getLanguage(): string {
    return currentLanguage;
}

export function isRTL(): boolean {
    return currentLanguage === 'ur';
}
