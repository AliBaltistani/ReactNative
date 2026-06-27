import { TextStyle, Platform } from 'react-native';

/**
 * Typography system for RasaanGo
 * Uses Inter for Latin text, system Nastaliq for Urdu
 */

const fontFamily = Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter',
});

export const Typography: Record<string, TextStyle> = {
    // Headings
    h1: {
        fontFamily,
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontFamily,
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        letterSpacing: -0.3,
    },
    h3: {
        fontFamily,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
    },

    // Body
    bodyLarge: {
        fontFamily,
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 26,
    },
    body: {
        fontFamily,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    bodySmall: {
        fontFamily,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },

    // Labels
    label: {
        fontFamily,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 0.2,
    },
    labelSmall: {
        fontFamily,
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
        letterSpacing: 0.3,
    },

    // Special
    button: {
        fontFamily,
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.3,
    },
    caption: {
        fontFamily,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
    price: {
        fontFamily,
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 24,
    },
    priceSmall: {
        fontFamily,
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,
    },
};
