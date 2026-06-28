import { Platform } from 'react-native';
import { ENV } from '../config/env';

/**
 * Notification service — push notification registration and handling.
 * Uses lazy imports to avoid crashes on web.
 */
export const notificationService = {
    async registerForPushNotifications(): Promise<string | null> {
        if (Platform.OS === 'web' || !ENV.PUSH_NOTIFICATIONS_ENABLED) {
            return null;
        }

        try {
            const Notifications = await import('expo-notifications');

            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('[Notifications] Permission not granted');
                return null;
            }

            const tokenData = await Notifications.getExpoPushTokenAsync();
            return tokenData.data;
        } catch (err) {
            console.warn('[Notifications] Registration failed:', err);
            return null;
        }
    },

    async scheduleLocalNotification(
        title: string,
        body: string,
        data?: Record<string, unknown>
    ): Promise<void> {
        if (Platform.OS === 'web') return;

        try {
            const Notifications = await import('expo-notifications');
            await Notifications.scheduleNotificationAsync({
                content: { title, body, data },
                trigger: null, // Immediate
            });
        } catch {
            // Silent fail
        }
    },
};
