import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    visible: boolean;
    onHide?: () => void;
    duration?: number;
}

const ICONS: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
};

const BG_COLORS: Record<string, string> = {
    success: '#059669',
    error: Colors.danger,
    info: Colors.accent,
};

export default function Toast({
    message,
    type = 'info',
    visible,
    onHide,
    duration = 3000,
}: ToastProps) {
    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide?.());
            }, duration);

            return () => clearTimeout(timer);
        } else {
            translateY.setValue(-100);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: BG_COLORS[type], transform: [{ translateY }] },
            ]}
        >
            <Text style={styles.icon}>{ICONS[type]}</Text>
            <Text style={styles.message} numberOfLines={2}>
                {message}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        left: Spacing.xl,
        right: Spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        borderRadius: Radius.lg,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    icon: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    message: {
        ...Typography.body,
        color: Colors.white,
        flex: 1,
    },
});
