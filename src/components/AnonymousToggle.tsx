import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface AnonymousToggleProps {
    isEnabled: boolean;
    onToggle: (value: boolean) => void;
    compact?: boolean;
}

export default function AnonymousToggle({ isEnabled, onToggle, compact }: AnonymousToggleProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                isEnabled && styles.containerActive,
                compact && styles.containerCompact,
            ]}
            onPress={() => onToggle(!isEnabled)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconWrap, isEnabled && styles.iconWrapActive]}>
                <Text style={styles.icon}>{isEnabled ? '🔒' : '🔓'}</Text>
            </View>
            <View style={styles.textWrap}>
                <Text style={[styles.title, isEnabled && styles.titleActive]}>
                    {isEnabled ? 'Parda Mode ON' : 'Anonymous Delivery?'}
                </Text>
                <Text style={[styles.subtitle, isEnabled && styles.subtitleActive]}>
                    {isEnabled
                        ? 'Your number is hidden from rider'
                        : 'Rider won\'t see your number'}
                </Text>
            </View>
            <View style={[styles.toggle, isEnabled && styles.toggleActive]}>
                <View style={[styles.toggleDot, isEnabled && styles.toggleDotActive]} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: Colors.ghost,
        borderRadius: Radius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    containerActive: {
        backgroundColor: Colors.anonymous,
        borderColor: Colors.anonymousBorder,
    },
    containerCompact: {
        padding: Spacing.md,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.mist,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    iconWrapActive: {
        backgroundColor: 'rgba(245, 158, 11, 0.25)',
    },
    icon: {
        fontSize: 22,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        ...Typography.label,
        color: Colors.dark,
    },
    titleActive: {
        color: '#92400E',
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.slate,
        marginTop: 2,
    },
    subtitleActive: {
        color: '#B45309',
    },
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.silver,
        padding: 3,
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: Colors.warm,
    },
    toggleDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleDotActive: {
        alignSelf: 'flex-end',
    },
});
