import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_SELLER_STATS, MOCK_SELLER_ORDERS } from '../../data/mockData';
import type { SellerOrder } from '../../types';

interface SellerDashboardProps {
    navigation: any;
}

export default function SellerDashboard({ navigation }: SellerDashboardProps) {
    const [isOpen, setIsOpen] = useState(true);
    const stats = MOCK_SELLER_STATS;
    const [orders, setOrders] = useState<SellerOrder[]>(MOCK_SELLER_ORDERS);

    const updateOrderStatus = (id: string, newStatus: SellerOrder['status']) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const rejectOrder = (id: string) => {
        Alert.alert('Reject Order', 'Are you sure?', [
            { text: 'No' },
            { text: 'Yes', style: 'destructive', onPress: () => setOrders(orders.filter(o => o.id !== id)) },
        ]);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'new': return { bg: Colors.warmFaded, color: Colors.warm, label: '🔔 New' };
            case 'accepted': return { bg: Colors.accentFaded, color: Colors.accent, label: '✅ Accepted' };
            case 'preparing': return { bg: Colors.primaryFaded, color: Colors.primary, label: '👨‍🍳 Preparing' };
            case 'ready': return { bg: Colors.successFaded, color: Colors.success, label: '📦 Ready' };
            default: return { bg: Colors.ghost, color: Colors.gray, label: status };
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={Colors.gradientWarm} style={styles.header}>
                <Text style={styles.headerTitle}>🏪 Abdul&apos;s Karyana</Text>
                <View style={styles.shopToggle}>
                    <Text style={styles.shopStatus}>
                        {isOpen ? t('seller.shopOpen') : t('seller.shopClosed')}
                    </Text>
                    <Switch
                        value={isOpen}
                        onValueChange={setIsOpen}
                        trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
                        thumbColor={Colors.white}
                    />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { borderLeftColor: Colors.accent }]}>
                        <Text style={styles.statIcon}>📦</Text>
                        <Text style={styles.statValue}>{stats.todayOrders}</Text>
                        <Text style={styles.statLabel}>{t('seller.orders')}</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
                        <Text style={styles.statIcon}>💰</Text>
                        <Text style={styles.statValue}>{stats.todaySales.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>{t('seller.sales')}</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: Colors.warm }]}>
                        <Text style={styles.statIcon}>⭐</Text>
                        <Text style={styles.statValue}>{stats.rating}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Active Orders */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Active Orders</Text>

                    {orders.map((order) => {
                        const status = getStatusStyle(order.status);
                        return (
                            <View key={order.id} style={styles.orderCard}>
                                <View style={styles.orderHeader}>
                                    <Text style={styles.orderId}>{order.id}</Text>
                                    <View style={[styles.statusTag, { backgroundColor: status.bg }]}>
                                        <Text style={[styles.statusText, { color: status.color }]}>
                                            {status.label}
                                        </Text>
                                    </View>
                                </View>

                                {order.items.map((item, i) => (
                                    <Text key={i} style={styles.orderItem}>
                                        {item.name} × {item.quantity} — PKR {(item.price * item.quantity).toLocaleString()}
                                    </Text>
                                ))}

                                <View style={styles.orderFooter}>
                                    <Text style={styles.orderTotal}>PKR {order.total.toLocaleString()}</Text>
                                    <Text style={styles.orderTime}>{order.createdAt}</Text>
                                </View>

                                {order.status === 'new' && (
                                    <View style={styles.orderActions}>
                                        <TouchableOpacity style={styles.acceptBtn} onPress={() => updateOrderStatus(order.id, 'preparing')}>
                                            <Text style={styles.acceptBtnText}>✅ {t('seller.acceptOrder')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectOrder(order.id)}>
                                            <Text style={styles.rejectBtnText}>❌ {t('seller.rejectOrder')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {order.status === 'preparing' && (
                                    <TouchableOpacity style={styles.readyBtn} onPress={() => updateOrderStatus(order.id, 'ready')}>
                                        <Text style={styles.readyBtnText}>📦 {t('seller.ready')}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Add Item */}
                <TouchableOpacity style={styles.addItemBtn} onPress={() => navigation.navigate('SellerItems')}>
                    <Text style={styles.addItemIcon}>➕</Text>
                    <Text style={styles.addItemText}>{t('seller.addItem')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.snow,
    },
    header: {
        paddingTop: 54,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.xl,
    },
    headerTitle: {
        ...Typography.h2,
        color: Colors.white,
        marginBottom: Spacing.sm,
    },
    shopToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    shopStatus: {
        ...Typography.label,
        color: 'rgba(255,255,255,0.9)',
    },
    body: {
        padding: Spacing.xl,
        paddingBottom: 100,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: Radius.md,
        alignItems: 'center',
        borderLeftWidth: 3,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    statIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    statValue: {
        ...Typography.h3,
        color: Colors.dark,
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.slate,
        marginTop: 2,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.dark,
        marginBottom: Spacing.md,
    },
    orderCard: {
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
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
    orderItem: {
        ...Typography.bodySmall,
        color: Colors.gray,
        marginBottom: 2,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.ghost,
        paddingTop: Spacing.sm,
        marginTop: Spacing.sm,
    },
    orderTotal: {
        ...Typography.price,
        color: Colors.primary,
    },
    orderTime: {
        ...Typography.caption,
        color: Colors.slate,
    },
    orderActions: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    acceptBtn: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    acceptBtnText: {
        ...Typography.label,
        color: Colors.white,
    },
    rejectBtn: {
        flex: 1,
        backgroundColor: Colors.dangerFaded,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    rejectBtnText: {
        ...Typography.label,
        color: Colors.danger,
    },
    readyBtn: {
        backgroundColor: Colors.successFaded,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        alignItems: 'center',
        marginTop: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.success,
    },
    readyBtnText: {
        ...Typography.label,
        color: Colors.success,
    },
    addItemBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        borderWidth: 2,
        borderColor: Colors.mist,
        borderStyle: 'dashed',
        gap: Spacing.sm,
    },
    addItemIcon: {
        fontSize: 24,
    },
    addItemText: {
        ...Typography.label,
        color: Colors.gray,
    },
});
