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
import { riderService } from '../../services/riderService';
import type { DeliveryRequest, RiderStats } from '../../types';

interface RiderHomeScreenProps {
    navigation: any;
}

export default function RiderHomeScreen({ navigation }: RiderHomeScreenProps) {
    const [isOnline, setIsOnline] = useState(false);
    const [stats, setStats] = useState<RiderStats | null>(null);
    const [requests, setRequests] = useState<DeliveryRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setIsLoading(true);
        try {
            const [statsData, reqsData] = await Promise.all([
                riderService.getRiderStats(),
                riderService.getDeliveryRequests()
            ]);
            setStats(statsData);
            setRequests(reqsData);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOnline = async () => {
        const temp = !isOnline;
        setIsOnline(temp); // Optimistic UI
        const success = temp ? await riderService.goOnline() : await riderService.goOffline();
        if (!success) {
            setIsOnline(!temp); // Revert
            setToast('Network error modifying status');
        } else {
            setToast(`You are now ${temp ? 'online' : 'offline'}`);
        }
    };

    const handleAccept = async (id: string) => {
        const success = await riderService.acceptDelivery(id);
        if (success) {
            setToast('Delivery Accepted! Navigating to map...');
            // In a real app we would navigate to RiderTracking 
            // For now, reload list to remove request
            setRequests(prev => prev.filter(req => req.id !== id));
        }
    };

    const handleDecline = async (id: string) => {
        await riderService.skipDelivery(id);
        setRequests(prev => prev.filter(req => req.id !== id));
    };

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

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Rider Dashboard 🏍️</Text>
                    <Text style={styles.statusText}>
                        Status: <Text style={isOnline ? styles.online : styles.offline}>
                            {isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </Text>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={toggleOnline}
                    trackColor={{ false: Colors.mist, true: Colors.primary + '60' }}
                    thumbColor={isOnline ? Colors.primary : Colors.silver}
                />
            </View>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>💰</Text>
                        <Text style={styles.statValue}>Rs {stats.todayEarnings}</Text>
                        <Text style={styles.statLabel}>Today's Earnings</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📦</Text>
                        <Text style={styles.statValue}>{stats.todayDeliveries}</Text>
                        <Text style={styles.statLabel}>Deliveries</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⭐</Text>
                        <Text style={styles.statValue}>{stats.rating}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⚡</Text>
                        <Text style={styles.statValue}>98%</Text>
                        <Text style={styles.statLabel}>Acceptance</Text>
                    </View>
                </View>

                {/* Pending Requests */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>New Requests</Text>
                    {isOnline && <ActivityIndicator size="small" color={Colors.primary} />}
                </View>

                {!isOnline ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>😴</Text>
                        <Text style={styles.emptyTitle}>You're offline</Text>
                        <Text style={styles.emptyLabel}>Go online to receive delivery requests.</Text>
                    </View>
                ) : requests.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📡</Text>
                        <Text style={styles.emptyTitle}>Searching for orders...</Text>
                        <Text style={styles.emptyLabel}>Stay in a busy area to get requests faster.</Text>
                    </View>
                ) : (
                    requests.map(req => (
                        <View key={req.id} style={styles.requestCard}>
                            <View style={styles.reqTop}>
                                <Text style={styles.reqTitle}>New Delivery Request</Text>
                                <Text style={styles.reqFee}>+ Rs {req.earnings}</Text>
                            </View>

                            <View style={styles.routeContainer}>
                                <View style={styles.routePoint}>
                                    <View style={styles.routeDot} />
                                    <Text style={styles.routeText} numberOfLines={1}>
                                        <Text style={{ fontWeight: 'bold' }}>Pickup:</Text> {req.shopName}
                                    </Text>
                                </View>
                                <View style={styles.routeLine} />
                                <View style={styles.routePoint}>
                                    <View style={[styles.routeDot, { backgroundColor: Colors.accent }]} />
                                    <Text style={styles.routeText} numberOfLines={1}>
                                        <Text style={{ fontWeight: 'bold' }}>Dropoff:</Text> {req.deliveryAddress}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.reqMeta}>
                                <Text style={styles.metaBadge}>📍 {req.distance} away</Text>
                                <Text style={styles.metaBadge}>📦 {req.itemCount} items</Text>
                            </View>

                            <View style={styles.reqActions}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.declineBtn]}
                                    onPress={() => handleDecline(req.id)}
                                >
                                    <Text style={styles.declineText}>Decline</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.acceptBtn]}
                                    onPress={() => handleAccept(req.id)}
                                >
                                    <Text style={styles.acceptText}>Accept</Text>
                                </TouchableOpacity>
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
    offline: { color: Colors.slate, fontWeight: 'bold' },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xxl },
    statCard: { width: '47%', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.mist },
    statIcon: { fontSize: 24, marginBottom: Spacing.sm },
    statValue: { ...Typography.h3, color: Colors.dark },
    statLabel: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
    sectionTitle: { ...Typography.h3, color: Colors.charcoal },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.mist },
    emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
    emptyTitle: { ...Typography.label, color: Colors.dark },
    emptyLabel: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
    requestCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 2, borderColor: Colors.primaryFaded, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    reqTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    reqTitle: { ...Typography.label, color: Colors.dark },
    reqFee: { ...Typography.h3, color: Colors.primary },
    routeContainer: { paddingLeft: Spacing.sm, marginBottom: Spacing.md },
    routePoint: { flexDirection: 'row', alignItems: 'center' },
    routeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, marginRight: Spacing.md },
    routeLine: { width: 2, height: 20, backgroundColor: Colors.mist, marginLeft: 4, marginVertical: 2 },
    routeText: { ...Typography.body, color: Colors.dark, flex: 1 },
    reqMeta: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg, paddingBottom: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.ghost },
    metaBadge: { backgroundColor: Colors.ghost, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, ...Typography.caption, color: Colors.gray },
    reqActions: { flexDirection: 'row', gap: Spacing.md },
    actionBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md },
    declineBtn: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.mist },
    declineText: { ...Typography.button, color: Colors.gray },
    acceptBtn: { backgroundColor: Colors.primary },
    acceptText: { ...Typography.button, color: Colors.white },
});
