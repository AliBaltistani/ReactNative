import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

interface OrdersScreenProps {
    navigation: any;
}

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
    const { fetchOrders, activeOrders, pastOrders, isLoading } = useOrderStore();
    const currentRole = useAuthStore((s) => s.currentRole);
    const [tab, setTab] = useState<'active' | 'past'>('active');

    // Only Customer role has orders fetched this way for this screen
    // (Rider/Seller see their own lists fetched from their dashboards, though they could share this UI)
    useEffect(() => {
        if (currentRole === 'customer') {
            fetchOrders();
        }
    }, [currentRole]);

    const activeList = activeOrders();
    const pastList = pastOrders();
    const displayList = tab === 'active' ? activeList : pastList;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🧾 {t('orders.title', 'My Orders')}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsWrap}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, tab === 'active' && styles.tabActive]}
                        onPress={() => setTab('active')}
                    >
                        <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
                            {t('orders.active', 'Active')} ({activeList.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, tab === 'past' && styles.tabActive]}
                        onPress={() => setTab('past')}
                    >
                        <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>
                            {t('orders.past', 'Past')} ({pastList.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* List */}
            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchOrders} tintColor={Colors.primary} />
                }
            >
                {isLoading && displayList.length === 0 ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                ) : displayList.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyTitle}>No {tab} orders</Text>
                        <Text style={styles.emptySubtitle}>
                            {tab === 'active' ? "You don't have any ongoing deliveries." : 'Your past orders will appear here.'}
                        </Text>
                    </View>
                ) : (
                    displayList.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            style={styles.orderCard}
                            onPress={() => navigation.navigate('Tracking', { orderId: order.id })}
                        >
                            <View style={styles.orderHeader}>
                                <Text style={styles.shopName}>{order.shop.name}</Text>
                                <Text style={[
                                    styles.statusBadge,
                                    order.status === 'delivered' ? styles.statusBadgeDelivered :
                                        order.status === 'cancelled' ? styles.statusBadgeCancelled : {}
                                ]}>
                                    {order.status.replace('_', ' ').toUpperCase()}
                                </Text>
                            </View>

                            <View style={styles.orderMeta}>
                                <Text style={styles.orderId}>{order.id}</Text>
                                <Text style={styles.orderDate}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </Text>
                            </View>

                            <Text style={styles.itemsSummary} numberOfLines={1}>
                                {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                            </Text>

                            <View style={styles.orderFooter}>
                                <View style={styles.totalWrap}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>PKR {order.total.toLocaleString()}</Text>
                                </View>
                                {order.status === 'delivered' && (
                                    <TouchableOpacity style={styles.reorderBtn}>
                                        <Text style={styles.reorderBtnText}>Reorder</Text>
                                    </TouchableOpacity>
                                )}
                                {tab === 'active' && (
                                    <TouchableOpacity
                                        style={styles.trackBtn}
                                        onPress={() => navigation.navigate('Tracking', { orderId: order.id })}
                                    >
                                        <Text style={styles.trackBtnText}>Track Order</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: {
        backgroundColor: Colors.white,
        paddingTop: 60,
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    headerTitle: { ...Typography.h1, color: Colors.dark },
    tabsWrap: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.ghost,
        borderRadius: Radius.md,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: Radius.sm,
    },
    tabActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    tabText: { ...Typography.label, color: Colors.gray },
    tabTextActive: { color: Colors.dark },
    body: { flex: 1 },
    bodyContent: { padding: Spacing.xl, paddingBottom: 100 },
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
    emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
    emptyTitle: { ...Typography.h2, color: Colors.charcoal, marginBottom: Spacing.xs },
    emptySubtitle: { ...Typography.body, color: Colors.gray, textAlign: 'center' },
    orderCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.mist,
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    shopName: { ...Typography.h3, color: Colors.dark, flex: 1, marginRight: Spacing.sm },
    statusBadge: { backgroundColor: Colors.primaryFaded, color: Colors.primary, ...Typography.labelSmall, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, overflow: 'hidden' },
    statusBadgeDelivered: { backgroundColor: '#D1FAE5', color: '#059669' },
    statusBadgeCancelled: { backgroundColor: '#FEE2E2', color: '#DC2626' },
    orderMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
    orderId: { ...Typography.caption, color: Colors.gray },
    orderDate: { ...Typography.caption, color: Colors.gray },
    itemsSummary: { ...Typography.body, color: Colors.charcoal, marginBottom: Spacing.md },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.ghost, paddingTop: Spacing.md },
    totalWrap: {},
    totalLabel: { ...Typography.caption, color: Colors.gray },
    totalValue: { ...Typography.label, color: Colors.dark },
    reorderBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md, backgroundColor: Colors.ghost },
    reorderBtnText: { ...Typography.label, color: Colors.dark },
    trackBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.md, backgroundColor: Colors.primary },
    trackBtnText: { ...Typography.label, color: Colors.white },
});
