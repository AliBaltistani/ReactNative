import { Platform } from 'react-native';

/**
 * Location utilities — GPS permissions, tracking, distance calculation.
 * Uses lazy imports to avoid crashes on web.
 */
export const locationService = {
    async requestPermission(): Promise<boolean> {
        if (Platform.OS === 'web') return false;

        try {
            const Location = await import('expo-location');
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch {
            return false;
        }
    },

    async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
        if (Platform.OS === 'web') return null;

        try {
            const Location = await import('expo-location');
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            return { lat: loc.coords.latitude, lng: loc.coords.longitude };
        } catch {
            return null;
        }
    },

    /**
     * Haversine formula — distance between two points in km.
     */
    calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10; // rounded to 1 decimal
    },
};
