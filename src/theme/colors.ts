/**
 * RasaanGo Color Palette
 * Inspired by Skardu's landscape — mountains, sky, snow, and warmth
 */

export const Colors = {
    // Primary
    primary: '#1B7A4E',
    primaryLight: '#2A9D6A',
    primaryDark: '#145C3A',
    primaryFaded: 'rgba(27, 122, 78, 0.1)',

    // Accent
    accent: '#3B82F6',
    accentLight: '#60A5FA',
    accentFaded: 'rgba(59, 130, 246, 0.1)',

    // Warm (Seller/Shop)
    warm: '#F59E0B',
    warmLight: '#FBBF24',
    warmFaded: 'rgba(245, 158, 11, 0.1)',

    // Danger / Urgency
    danger: '#E11D48',
    dangerLight: '#FB7185',
    dangerFaded: 'rgba(225, 29, 72, 0.08)',

    // Success
    success: '#10B981',
    successLight: '#34D399',
    successFaded: 'rgba(16, 185, 129, 0.1)',

    // Neutrals
    white: '#FFFFFF',
    snow: '#FAFAFA',
    ghost: '#F3F4F6',
    mist: '#E5E7EB',
    silver: '#D1D5DB',
    slate: '#9CA3AF',
    gray: '#6B7280',
    charcoal: '#374151',
    dark: '#1E293B',
    black: '#0F172A',

    // Special
    anonymous: '#FEF3C7',    // Warm beige for anonymous/parda mode
    anonymousBorder: '#F59E0B',
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: 'rgba(0, 0, 0, 0.08)',

    // Gradients (start, end)
    gradientPrimary: ['#1B7A4E', '#2A9D6A'] as [string, string],
    gradientAccent: ['#3B82F6', '#6366F1'] as [string, string],
    gradientWarm: ['#F59E0B', '#F97316'] as [string, string],
    gradientDark: ['#1E293B', '#0F172A'] as [string, string],
};
