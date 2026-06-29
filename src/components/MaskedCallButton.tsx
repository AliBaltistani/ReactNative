import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface MaskedCallButtonProps {
    riderName?: string;
    onPress?: () => void;
    variant?: 'primary' | 'outline';
}

export default function MaskedCallButton({
    riderName,
    onPress,
    variant = 'primary',
}: MaskedCallButtonProps) {
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            Alert.alert(
                '📞 Masked Call',
                `Calling rider${riderName ? ` (${riderName})` : ''} through RasaanGo...\n\nYour number stays hidden.`,
                [{ text: 'OK' }]
            );
        }
    };

    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[styles.container, isPrimary ? styles.primary : styles.outline]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.iconWrap}>
                <Text style={styles.icon}>📞</Text>
            </View>
            <View style={styles.textWrap}>
                <Text style={[styles.title, !isPrimary && styles.titleOutline]}>
                    Call Rider (Masked)
                </Text>
                <Text style={[styles.subtitle, !isPrimary && styles.subtitleOutline]}>
                    {riderName ? `${riderName} • ` : ''}Your number hidden
                </Text>
            </View>
            <Text style={[styles.badge, !isPrimary && styles.badgeOutline]}>🔒</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.lg,
    },
    primary: {
        backgroundColor: Colors.accent,
    },
    outline: {
        backgroundColor: Colors.accentFaded,
        borderWidth: 1.5,
        borderColor: Colors.accent,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    icon: {
        fontSize: 20,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        ...Typography.label,
        color: Colors.white,
    },
    titleOutline: {
        color: Colors.accent,
    },
    subtitle: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 1,
    },
    subtitleOutline: {
        color: Colors.slate,
    },
    badge: {
        fontSize: 16,
    },
    badgeOutline: {},
});
