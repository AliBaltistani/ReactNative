import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_ORDERS } from '../../data/mockData';
import OrderCard from '../../components/OrderCard';

interface OrdersScreenProps {
    navigation: any;
}

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
    const [tab, setTab] = useState<'active' | 'past'>('active');

    const activeOrders = MOCK_ORDERS.filter(
        (o) => !['delivered', 'cancelled'].includes(o.status)
    );
    const pastOrders = MOCK_ORDERS.filter((o) =>
        ['delivered', 'cancelled'].includes(o.status)
    );

    const orders = tab === 'active' ? activeOrders : pastOrders;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📋 {t('orders.title')}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'active' && styles.tabActive]}
                    onPress={() => setTab('active')}
                >
                    <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
                        {t('orders.active')}
                    </Text>
                    {activeOrders.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{activeOrders.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'past' && styles.tabActive]}
                    onPress={() => setTab('past')}
                >
                    <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>
                        {t('orders.past')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Orders List */}
            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
            >
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onPress={() =>
                                navigation.navigate('Tracking', {
                                    orderId: order.id,
                                    shopName: order.shop.name,
                                    total: order.total + order.deliveryFee,
                                    isAnonymous: order.isAnonymous,
                                })
                            }
                        />
                    ))
                ) : (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyText}>{t('orders.noOrders')}</Text>
                        <TouchableOpacity
                            style={styles.shopBtn}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.shopBtnText}>🛒 Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.xl,
        backgroundColor: Colors.white,
    },
    headerTitle: {
        ...Typography.h2,
        color: Colors.dark,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.xl,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
        gap: Spacing.xl,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        gap: Spacing.sm,
    },
    tabActive: {
        borderBottomColor: Colors.primary,
    },
    tabText: {
        ...Typography.label,
        color: Colors.gray,
    },
    tabTextActive: {
        color: Colors.primary,
    },
    tabBadge: {
        backgroundColor: Colors.danger,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    tabBadgeText: {
        ...Typography.labelSmall,
        color: Colors.white,
        fontSize: 11,
    },
    body: {
        flex: 1,
    },
    bodyContent: {
        padding: Spacing.xl,
        paddingBottom: 100,
    },
    empty: {
        alignItems: 'center',
        paddingVertical: Spacing.xxxl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.slate,
        marginBottom: Spacing.xl,
    },
    shopBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
    },
    shopBtnText: {
        ...Typography.button,
        color: Colors.white,
    },
});
