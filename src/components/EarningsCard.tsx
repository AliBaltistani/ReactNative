import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { EarningsPeriod } from '../types';

interface EarningsCardProps {
    period: EarningsPeriod;
    amount: number;
    deliveries: number;
    icon?: string;
}

export default function EarningsCard({ period, amount, deliveries, icon }: EarningsCardProps) {
    const periodLabels: Record<EarningsPeriod, string> = {
        daily: "Today's Earnings",
        weekly: 'This Week',
        monthly: 'This Month',
    };

    const gradients: Record<EarningsPeriod, [string, string]> = {
        daily: Colors.gradientPrimary,
        weekly: Colors.gradientAccent,
        monthly: Colors.gradientWarm,
    };

    return (
        <LinearGradient
            colors={gradients[period]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <View style={styles.header}>
                <Text style={styles.icon}>{icon || '💰'}</Text>
                <Text style={styles.periodLabel}>{periodLabels[period]}</Text>
            </View>

            <Text style={styles.amount}>PKR {amount.toLocaleString()}</Text>

            <View style={styles.footer}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{deliveries}</Text>
                    <Text style={styles.statLabel}>Deliveries</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        PKR {deliveries > 0 ? Math.round(amount / deliveries) : 0}
                    </Text>
                    <Text style={styles.statLabel}>Per Delivery</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    icon: {
        fontSize: 24,
        marginRight: Spacing.sm,
    },
    periodLabel: {
        ...Typography.label,
        color: 'rgba(255,255,255,0.85)',
    },
    amount: {
        ...Typography.h1,
        color: Colors.white,
        fontSize: 36,
        marginBottom: Spacing.lg,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: Spacing.xxl,
    },
    stat: {},
    statValue: {
        ...Typography.h3,
        color: Colors.white,
    },
    statLabel: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
});
