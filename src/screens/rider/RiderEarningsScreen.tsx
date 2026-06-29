import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_RIDER_STATS, MOCK_EARNINGS_HISTORY } from '../../data/mockData';
import EarningsCard from '../../components/EarningsCard';
import type { EarningsPeriod } from '../../types';

interface RiderEarningsScreenProps {
    navigation: any;
}

export default function RiderEarningsScreen({ navigation }: RiderEarningsScreenProps) {
    const [period, setPeriod] = useState<EarningsPeriod>('daily');
    const stats = MOCK_RIDER_STATS;
    const earnings = MOCK_EARNINGS_HISTORY;

    const periodData: Record<EarningsPeriod, { amount: number; deliveries: number }> = {
        daily: { amount: stats.todayEarnings, deliveries: stats.todayDeliveries },
        weekly: { amount: stats.weekEarnings, deliveries: stats.weekDeliveries },
        monthly: { amount: stats.monthEarnings, deliveries: stats.monthDeliveries },
    };

    const dailyBarData = [
        { day: 'Mon', amount: 720 },
        { day: 'Tue', amount: 940 },
        { day: 'Wed', amount: 580 },
        { day: 'Thu', amount: 1100 },
        { day: 'Fri', amount: 860 },
        { day: 'Sat', amount: 1200 },
        { day: 'Sun', amount: 840 },
    ];
    const maxBarAmount = Math.max(...dailyBarData.map(d => d.amount));

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={Colors.gradientDark} style={styles.header}>
                <Text style={styles.headerTitle}>💰 {t('rider.earnings')}</Text>
                <Text style={styles.headerSubtitle}>⭐ {stats.rating} rating</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Period Tabs */}
                <View style={styles.tabs}>
                    {(['daily', 'weekly', 'monthly'] as EarningsPeriod[]).map((p) => (
                        <TouchableOpacity
                            key={p}
                            style={[styles.tab, period === p && styles.tabActive]}
                            onPress={() => setPeriod(p)}
                        >
                            <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                                {t(`rider.${p}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Earnings Card */}
                <EarningsCard
                    period={period}
                    amount={periodData[period].amount}
                    deliveries={periodData[period].deliveries}
                />

                {/* Weekly Bar Chart */}
                {period === 'weekly' && (
                    <View style={styles.chartSection}>
                        <Text style={styles.chartTitle}>📊 This Week</Text>
                        <View style={styles.chart}>
                            {dailyBarData.map((item) => (
                                <View key={item.day} style={styles.barCol}>
                                    <Text style={styles.barAmount}>
                                        {item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}k` : item.amount}
                                    </Text>
                                    <View style={styles.barTrack}>
                                        <View
                                            style={[
                                                styles.barFill,
                                                {
                                                    height: `${(item.amount / maxBarAmount) * 100}%`,
                                                    backgroundColor: item.day === 'Sun' ? Colors.primary : Colors.accent,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.barDay}>{item.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Payout Summary */}
                <View style={styles.payoutCard}>
                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutLabel}>💳 Payout Method</Text>
                        <Text style={styles.payoutValue}>JazzCash</Text>
                    </View>
                    <View style={styles.payoutDivider} />
                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutLabel}>📅 Next Payout</Text>
                        <Text style={styles.payoutValue}>Today, 6:00 PM</Text>
                    </View>
                    <View style={styles.payoutDivider} />
                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutLabel}>✅ Pending Amount</Text>
                        <Text style={[styles.payoutValue, { color: Colors.primary }]}>
                            PKR {stats.todayEarnings}
                        </Text>
                    </View>
                </View>

                {/* Transaction History */}
                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>📋 Recent Transactions</Text>
                    {earnings.map((entry) => (
                        <View key={entry.id} style={styles.historyItem}>
                            <View style={styles.historyLeft}>
                                <Text style={styles.historyShop}>{entry.shopName}</Text>
                                <Text style={styles.historyMeta}>
                                    {entry.orderId} • {entry.time}
                                </Text>
                            </View>
                            <Text style={styles.historyAmount}>+PKR {entry.amount}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: {
        paddingTop: 54,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.xl,
    },
    headerTitle: { ...Typography.h2, color: Colors.white },
    headerSubtitle: { ...Typography.body, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.ghost,
        borderRadius: Radius.xl,
        padding: 4,
        marginBottom: Spacing.xl,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: Radius.lg,
        alignItems: 'center',
    },
    tabActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    tabText: { ...Typography.label, color: Colors.slate },
    tabTextActive: { color: Colors.primary },
    chartSection: {
        marginTop: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    chartTitle: { ...Typography.label, color: Colors.dark, marginBottom: Spacing.lg },
    chart: { flexDirection: 'row', justifyContent: 'space-between', height: 140 },
    barCol: { alignItems: 'center', flex: 1 },
    barAmount: { ...Typography.caption, color: Colors.slate, fontSize: 9, marginBottom: 4 },
    barTrack: { flex: 1, width: 24, backgroundColor: Colors.ghost, borderRadius: Radius.md, overflow: 'hidden', justifyContent: 'flex-end' },
    barFill: { width: '100%', borderRadius: Radius.md },
    barDay: { ...Typography.caption, color: Colors.gray, marginTop: 4, fontSize: 10 },
    payoutCard: {
        marginTop: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    payoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
    payoutLabel: { ...Typography.body, color: Colors.gray },
    payoutValue: { ...Typography.label, color: Colors.dark },
    payoutDivider: { height: 1, backgroundColor: Colors.ghost, marginVertical: Spacing.xs },
    historySection: { marginTop: Spacing.xl },
    historyTitle: { ...Typography.label, color: Colors.dark, marginBottom: Spacing.md },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Radius.md,
        padding: Spacing.base,
        marginBottom: Spacing.sm,
    },
    historyLeft: {},
    historyShop: { ...Typography.body, color: Colors.dark },
    historyMeta: { ...Typography.caption, color: Colors.slate, marginTop: 2 },
    historyAmount: { ...Typography.label, color: Colors.success },
});
