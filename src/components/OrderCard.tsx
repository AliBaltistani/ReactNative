import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { Order } from '../types';

interface OrderCardProps {
    order: Order;
    onPress: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: '⏳ Pending', color: Colors.warm, bg: Colors.warmFaded },
    confirmed: { label: '✅ Confirmed', color: Colors.primary, bg: Colors.primaryFaded },
    preparing: { label: '👨‍🍳 Preparing', color: Colors.accent, bg: Colors.accentFaded },
    picked_up: { label: '📦 Picked Up', color: Colors.accent, bg: Colors.accentFaded },
    on_the_way: { label: '🏍️ On the Way', color: Colors.primary, bg: Colors.primaryFaded },
    delivered: { label: '✅ Delivered', color: Colors.success, bg: Colors.successFaded },
    cancelled: { label: '❌ Cancelled', color: Colors.danger, bg: Colors.dangerFaded },
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[styles.statusTag, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
            </View>

            <Text style={styles.shopName}>🏪 {order.shop.name}</Text>

            <View style={styles.itemsList}>
                {order.items.slice(0, 3).map((item, i) => (
                    <Text key={i} style={styles.itemText}>
                        {item.product.name} × {item.quantity}
                    </Text>
                ))}
                {order.items.length > 3 && (
                    <Text style={styles.moreItems}>+{order.items.length - 3} more items</Text>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.total}>PKR {(order.total + order.deliveryFee).toLocaleString()}</Text>
                {order.eta && <Text style={styles.eta}>🕐 {order.eta}</Text>}
            </View>

            {order.isAnonymous && (
                <View style={styles.anonymousBadge}>
                    <Text style={styles.anonymousText}>🔒 Anonymous</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    orderId: {
        ...Typography.label,
        color: Colors.dark,
    },
    statusTag: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    statusText: {
        ...Typography.labelSmall,
    },
    shopName: {
        ...Typography.body,
        color: Colors.charcoal,
        marginBottom: Spacing.sm,
    },
    itemsList: {
        marginBottom: Spacing.sm,
    },
    itemText: {
        ...Typography.bodySmall,
        color: Colors.gray,
        marginBottom: 2,
    },
    moreItems: {
        ...Typography.caption,
        color: Colors.accent,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.ghost,
        paddingTop: Spacing.sm,
    },
    total: {
        ...Typography.price,
        color: Colors.primary,
    },
    eta: {
        ...Typography.label,
        color: Colors.accent,
    },
    anonymousBadge: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        backgroundColor: Colors.anonymous,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.sm,
        borderWidth: 1,
        borderColor: Colors.anonymousBorder,
    },
    anonymousText: {
        ...Typography.caption,
        color: Colors.charcoal,
    },
});
