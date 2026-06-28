import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import Toast from '../../components/Toast';
import { sellerService } from '../../services/sellerService';
import type { SellerOrder, SellerStats } from '../../types';

interface SellerDashboardProps {
    navigation: any;
}

export default function SellerDashboard({ navigation }: SellerDashboardProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [stats, setStats] = useState<SellerStats | null>(null);
    const [orders, setOrders] = useState<SellerOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [statsData, ordersData] = await Promise.all([
                sellerService.getSellerStats(),
                sellerService.getSellerOrders()
            ]);
            setStats(statsData);
            setOrders(ordersData);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOpen = async () => {
        const temp = !isOpen;
        setIsOpen(temp);
        const success = await sellerService.toggleShopOpen(temp);
        if (!success) {
            setIsOpen(!temp); // revert
            setToast('Failed to change shop status');
        }
    };

    const handleAccept = async (orderId: string) => {
        await sellerService.acceptOrder(orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'preparing' } : o));
        setToast('Order accepted for preparation');
    };

    const handleReady = async (orderId: string) => {
        await sellerService.updateOrderStatus(orderId, 'ready');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
        setToast('Order accepted for preparation');
    };

    const activeOrders = orders.filter(o => ['new', 'preparing'].includes(o.status));

    if (isLoading || !stats) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toast visible={!!toast} message={toast} type="success" onHide={() => setToast('')} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Seller Dashboard 🏪</Text>
                    <Text style={styles.statusText}>
                        Shop is <Text style={isOpen ? styles.online : styles.offline}>
                            {isOpen ? 'OPEN' : 'CLOSED'}
                        </Text>
                    </Text>
                </View>
                <Switch
                    value={isOpen}
                    onValueChange={toggleOpen}
                    trackColor={{ false: Colors.mist, true: Colors.primary + '60' }}
                    thumbColor={isOpen ? Colors.primary : Colors.silver}
                />
            </View>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.pendingOrders}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.todayOrders}</Text>
                        <Text style={styles.statLabel}>Total Today</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>PKR {stats.todaySales}</Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                    </View>
                </View>

                {/* Orders Queue */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Live Orders Queue ({activeOrders.length})</Text>
                </View>

                {activeOrders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>☕</Text>
                        <Text style={styles.emptyTitle}>All caught up</Text>
                        <Text style={styles.emptyLabel}>No active orders at the moment.</Text>
                    </View>
                ) : (
                    activeOrders.map(order => (
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <View style={styles.orderIdBadge}>
                                    <Text style={styles.orderIdText}>{order.id}</Text>
                                </View>
                                <Text style={styles.orderTime}>{new Date(order.createdAt).toLocaleTimeString()}</Text>
                            </View>

                            <View style={styles.orderItems}>
                                {order.items.map((item, idx) => (
                                    <Text key={idx} style={styles.itemRow}>
                                        <Text style={styles.itemQty}>{item.quantity}x </Text>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.orderFooter}>
                                <Text style={styles.orderTotal}>Total: PKR {order.total}</Text>

                                {order.status === 'new' && (
                                    <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(order.id)}>
                                        <Text style={styles.acceptBtnText}>Accept & Prepare</Text>
                                    </TouchableOpacity>
                                )}

                                {order.status === 'preparing' && (
                                    <TouchableOpacity style={styles.readyBtn} onPress={() => handleReady(order.id)}>
                                        <Text style={styles.readyBtnText}>Mark as Ready</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.xl, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.ghost },
    greeting: { ...Typography.h2, color: Colors.dark },
    statusText: { ...Typography.label, marginTop: 4, color: Colors.gray },
    online: { color: Colors.primary, fontWeight: 'bold' },
    offline: { color: Colors.danger, fontWeight: 'bold' },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    statsGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
    statCard: { flex: 1, backgroundColor: Colors.white, padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.mist, alignItems: 'center' },
    statValue: { ...Typography.h3, color: Colors.dark },
    statLabel: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
    sectionHeader: { marginBottom: Spacing.lg },
    sectionTitle: { ...Typography.h3, color: Colors.charcoal },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.mist },
    emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
    emptyTitle: { ...Typography.label, color: Colors.dark },
    emptyLabel: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
    orderCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 2, borderColor: Colors.primaryFaded, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.ghost },
    orderIdBadge: { backgroundColor: Colors.dark, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
    orderIdText: { ...Typography.labelSmall, color: Colors.white },
    orderTime: { ...Typography.caption, color: Colors.danger, fontWeight: 'bold' },
    orderItems: { marginBottom: Spacing.md },
    itemRow: { marginBottom: 4 },
    itemQty: { ...Typography.label, color: Colors.primary },
    itemName: { ...Typography.body, color: Colors.dark },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.ghost },
    orderTotal: { ...Typography.label, color: Colors.charcoal },
    acceptBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.md },
    acceptBtnText: { ...Typography.button, color: Colors.white },
    readyBtn: { backgroundColor: Colors.accent, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.md },
    readyBtnText: { ...Typography.button, color: Colors.white },
});
