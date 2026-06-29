import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_SELLER_ORDERS } from '../../data/mockData';
import type { SellerOrder } from '../../types';

interface Props { navigation: any; }

type TabKey = 'new' | 'preparing' | 'ready' | 'picked_up';

const TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: 'new', label: 'New', icon: '🔔' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'ready', label: 'Ready', icon: '✅' },
    { key: 'picked_up', label: 'Done', icon: '📦' },
];

export default function SellerOrdersScreen({ navigation }: Props) {
    const [tab, setTab] = useState<TabKey>('new');
    const [orders, setOrders] = useState<SellerOrder[]>(MOCK_SELLER_ORDERS);

    const filtered = orders.filter(o => o.status === tab);

    const updateStatus = (id: string, newStatus: SellerOrder['status']) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const handleAccept = (id: string) => updateStatus(id, 'accepted');
    const handleReject = (id: string) => {
        Alert.alert('Reject Order', 'Are you sure?', [
            { text: 'No' },
            { text: 'Yes', style: 'destructive', onPress: () => setOrders(orders.filter(o => o.id !== id)) },
        ]);
    };
    const handlePreparing = (id: string) => updateStatus(id, 'preparing');
    const handleReady = (id: string) => updateStatus(id, 'ready');

    const getActions = (order: SellerOrder) => {
        switch (order.status) {
            case 'new':
                return (
                    <View style={s.actRow}>
                        <TouchableOpacity style={s.acceptBtn} onPress={() => handleAccept(order.id)}>
                            <Text style={s.acceptTxt}>✅ {t('seller.acceptOrder')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.rejectBtn} onPress={() => handleReject(order.id)}>
                            <Text style={s.rejectTxt}>❌ {t('seller.rejectOrder')}</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'accepted':
                return (
                    <TouchableOpacity style={s.statusBtn} onPress={() => handlePreparing(order.id)}>
                        <Text style={s.statusTxt}>👨‍🍳 Start Preparing</Text>
                    </TouchableOpacity>
                );
            case 'preparing':
                return (
                    <TouchableOpacity style={[s.statusBtn, s.readyBtn]} onPress={() => handleReady(order.id)}>
                        <Text style={s.statusTxt}>✅ {t('seller.ready')}</Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <View style={s.container}>
            <LinearGradient colors={Colors.gradientWarm} style={s.header}>
                <Text style={s.headerTitle}>📦 {t('seller.orders')}</Text>
            </LinearGradient>

            <View style={s.tabs}>
                {TABS.map(t => {
                    const count = orders.filter(o => o.status === t.key).length;
                    return (
                        <TouchableOpacity
                            key={t.key}
                            style={[s.tab, tab === t.key && s.tabActive]}
                            onPress={() => setTab(t.key)}
                        >
                            <Text style={s.tabIcon}>{t.icon}</Text>
                            <Text style={[s.tabTxt, tab === t.key && s.tabTxtActive]}>{t.label}</Text>
                            {count > 0 && (
                                <View style={s.tabBadge}>
                                    <Text style={s.tabBadgeTxt}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
                {filtered.length > 0 ? filtered.map(order => (
                    <View key={order.id} style={s.orderCard}>
                        <View style={s.orderHeader}>
                            <Text style={s.orderId}>{order.id}</Text>
                            <Text style={s.orderTime}>{order.createdAt}</Text>
                        </View>

                        {order.items.map((item, i) => (
                            <View key={i} style={s.itemRow}>
                                <Text style={s.itemName}>{item.name} × {item.quantity}</Text>
                                <Text style={s.itemPrice}>PKR {item.price * item.quantity}</Text>
                            </View>
                        ))}

                        <View style={s.orderFooter}>
                            <Text style={s.totalLabel}>Total</Text>
                            <Text style={s.totalVal}>PKR {order.total}</Text>
                        </View>

                        {order.deliveryAddress && (
                            <View style={s.addrRow}>
                                <Text style={s.addrIcon}>📍</Text>
                                <Text style={s.addrTxt}>{order.deliveryAddress}</Text>
                                {order.isAnonymous && <Text style={s.anonBadge}>🔒</Text>}
                            </View>
                        )}

                        {getActions(order)}
                    </View>
                )) : (
                    <View style={s.empty}>
                        <Text style={s.emptyIcon}>📭</Text>
                        <Text style={s.emptyTxt}>No {tab} orders</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: { paddingTop: 54, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.xl },
    headerTitle: { ...Typography.h2, color: Colors.white },
    tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.ghost, paddingHorizontal: Spacing.md },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, gap: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: Colors.warm },
    tabIcon: { fontSize: 14 },
    tabTxt: { ...Typography.caption, color: Colors.slate },
    tabTxtActive: { color: Colors.warm, fontWeight: '700' },
    tabBadge: { backgroundColor: Colors.danger, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    tabBadgeTxt: { ...Typography.caption, color: Colors.white, fontSize: 10 },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    orderCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
    orderId: { ...Typography.label, color: Colors.dark },
    orderTime: { ...Typography.caption, color: Colors.slate },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    itemName: { ...Typography.body, color: Colors.charcoal },
    itemPrice: { ...Typography.body, color: Colors.dark },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.ghost, paddingTop: Spacing.md, marginTop: Spacing.sm },
    totalLabel: { ...Typography.label, color: Colors.gray },
    totalVal: { ...Typography.h3, color: Colors.primary },
    addrRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: 4 },
    addrIcon: { fontSize: 14 },
    addrTxt: { ...Typography.bodySmall, color: Colors.slate, flex: 1 },
    anonBadge: { fontSize: 14 },
    actRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
    acceptBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Colors.success },
    acceptTxt: { ...Typography.label, color: Colors.white },
    rejectBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Colors.dangerFaded },
    rejectTxt: { ...Typography.label, color: Colors.danger },
    statusBtn: { marginTop: Spacing.md, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Colors.warm },
    readyBtn: { backgroundColor: Colors.success },
    statusTxt: { ...Typography.label, color: Colors.white },
    empty: { alignItems: 'center', paddingVertical: Spacing.xxxl },
    emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
    emptyTxt: { ...Typography.body, color: Colors.slate },
});
