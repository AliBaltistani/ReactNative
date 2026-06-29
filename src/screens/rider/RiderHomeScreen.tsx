import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_RIDER_STATS, MOCK_DELIVERY_REQUEST } from '../../data/mockData';

interface RiderHomeScreenProps {
    navigation: any;
}

export default function RiderHomeScreen({ navigation }: RiderHomeScreenProps) {
    const [isOnline, setIsOnline] = useState(false);
    const [showRequest, setShowRequest] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const stats = MOCK_RIDER_STATS;
    const request = MOCK_DELIVERY_REQUEST;

    // Pulse animation for online button
    useEffect(() => {
        if (isOnline && !showRequest) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.08,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            // Show a request after 3 seconds
            const reqTimer = setTimeout(() => setShowRequest(true), 3000);
            return () => {
                pulse.stop();
                clearTimeout(reqTimer);
            };
        }
    }, [isOnline, showRequest]);

    // Countdown for delivery request
    useEffect(() => {
        if (showRequest && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [showRequest, timeLeft]);

    const handleAccept = () => {
        setShowRequest(false);
        setTimeLeft(30);
        navigation.navigate('RiderDelivery', { deliveryId: request.id });
    };

    const handleSkip = () => {
        setShowRequest(false);
        setTimeLeft(30);
        Alert.alert('Skipped', 'Order skipped. Waiting for next order...');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={Colors.gradientDark} style={styles.header}>
                <Text style={styles.headerTitle}>🏍️ {t('rider.title')}</Text>
                <Text style={styles.headerRating}>⭐ {stats.rating}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Earnings Card */}
                <View style={styles.earningsCard}>
                    <Text style={styles.earningsLabel}>{t('rider.todayEarnings')}</Text>
                    <Text style={styles.earningsValue}>PKR {stats.todayEarnings.toLocaleString()}</Text>
                    <Text style={styles.deliveryCount}>
                        {stats.todayDeliveries} {t('rider.deliveries')}
                    </Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>PKR {stats.weekEarnings.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>{t('rider.weekly')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>PKR {stats.monthEarnings.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>{t('rider.monthly')}</Text>
                    </View>
                </View>

                {/* Go Online Button */}
                <Animated.View style={[styles.onlineWrap, { transform: [{ scale: isOnline ? pulseAnim : 1 }] }]}>
                    <TouchableOpacity
                        style={[styles.onlineBtn, isOnline && styles.onlineBtnActive]}
                        onPress={() => {
                            setIsOnline(!isOnline);
                            setShowRequest(false);
                        }}
                    >
                        <Text style={styles.onlineBtnIcon}>{isOnline ? '🟢' : '🔴'}</Text>
                        <Text style={styles.onlineBtnText}>
                            {isOnline ? t('rider.online') : t('rider.goOnline')}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {isOnline && !showRequest && (
                    <View style={styles.waitingBox}>
                        <Text style={styles.waitingEmoji}>🏍️</Text>
                        <Text style={styles.waitingText}>{t('rider.waitingOrders')}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Delivery Request Popup */}
            {showRequest && (
                <View style={styles.requestOverlay}>
                    <View style={styles.requestCard}>
                        <Text style={styles.requestTitle}>🔔 {t('rider.newOrder')}</Text>

                        <View style={styles.requestInfo}>
                            <View style={styles.requestRow}>
                                <Text style={styles.requestLabel}>{t('rider.pickup')}:</Text>
                                <Text style={styles.requestValue}>{request.shopName}</Text>
                            </View>
                            <Text style={styles.requestAddress}>{request.shopAddress}</Text>

                            <View style={styles.requestDivider} />

                            <View style={styles.requestRow}>
                                <Text style={styles.requestLabel}>{t('rider.deliverTo')}:</Text>
                                <Text style={styles.requestValue}>{request.deliveryAddress}</Text>
                            </View>
                            <Text style={styles.requestAddress}>{request.deliveryLandmark}</Text>
                        </View>

                        <View style={styles.requestMeta}>
                            <Text style={styles.requestMetaItem}>📦 {request.itemCount} items</Text>
                            <Text style={styles.requestMetaItem}>📍 {request.distance}</Text>
                        </View>

                        <View style={styles.requestEarnings}>
                            <Text style={styles.earnLabel}>{t('rider.earn')}:</Text>
                            <Text style={styles.earnValue}>PKR {request.earnings}</Text>
                        </View>

                        {/* Timer */}
                        <View style={styles.timerWrap}>
                            <Text style={styles.timerText}>{t('rider.acceptIn')} {timeLeft}s</Text>
                            <View style={styles.timerBar}>
                                <View
                                    style={[
                                        styles.timerFill,
                                        { width: `${(timeLeft / 30) * 100}%` },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.requestActions}>
                            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
                                <Text style={styles.acceptBtnText}>✅ {t('rider.accept')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                                <Text style={styles.skipBtnText}>⏭️ {t('rider.skip')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.snow,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 54,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.xl,
    },
    headerTitle: {
        ...Typography.h2,
        color: Colors.white,
    },
    headerRating: {
        ...Typography.label,
        color: Colors.warm,
    },
    body: {
        padding: Spacing.xl,
        paddingBottom: 100,
    },
    earningsCard: {
        backgroundColor: Colors.white,
        padding: Spacing.xl,
        borderRadius: Radius.lg,
        alignItems: 'center',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
        marginBottom: Spacing.lg,
    },
    earningsLabel: {
        ...Typography.label,
        color: Colors.gray,
    },
    earningsValue: {
        fontSize: 36,
        fontWeight: '800',
        color: Colors.primary,
        marginVertical: Spacing.sm,
    },
    deliveryCount: {
        ...Typography.body,
        color: Colors.charcoal,
    },
    quickStats: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: Radius.md,
        alignItems: 'center',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        ...Typography.label,
        color: Colors.primary,
        marginBottom: 2,
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.slate,
    },
    onlineWrap: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    onlineBtn: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: Colors.ghost,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: Colors.mist,
    },
    onlineBtnActive: {
        backgroundColor: Colors.primaryFaded,
        borderColor: Colors.primary,
    },
    onlineBtnIcon: {
        fontSize: 40,
        marginBottom: Spacing.sm,
    },
    onlineBtnText: {
        ...Typography.label,
        color: Colors.dark,
    },
    waitingBox: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    waitingEmoji: {
        fontSize: 40,
        marginBottom: Spacing.sm,
    },
    waitingText: {
        ...Typography.body,
        color: Colors.slate,
    },
    // Request overlay
    requestOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    requestCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
    },
    requestTitle: {
        ...Typography.h2,
        color: Colors.dark,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    requestInfo: {
        backgroundColor: Colors.snow,
        padding: Spacing.base,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },
    requestRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    requestLabel: {
        ...Typography.label,
        color: Colors.gray,
    },
    requestValue: {
        ...Typography.label,
        color: Colors.dark,
    },
    requestAddress: {
        ...Typography.caption,
        color: Colors.slate,
        marginTop: 2,
        marginBottom: Spacing.sm,
    },
    requestDivider: {
        height: 1,
        backgroundColor: Colors.mist,
        marginVertical: Spacing.sm,
    },
    requestMeta: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.md,
    },
    requestMetaItem: {
        ...Typography.label,
        color: Colors.charcoal,
    },
    requestEarnings: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.successFaded,
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginBottom: Spacing.lg,
    },
    earnLabel: {
        ...Typography.body,
        color: Colors.charcoal,
    },
    earnValue: {
        ...Typography.h3,
        color: Colors.primary,
    },
    timerWrap: {
        marginBottom: Spacing.lg,
    },
    timerText: {
        ...Typography.labelSmall,
        color: Colors.slate,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    timerBar: {
        height: 6,
        backgroundColor: Colors.ghost,
        borderRadius: 3,
        overflow: 'hidden',
    },
    timerFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    requestActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    acceptBtn: {
        flex: 2,
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
        alignItems: 'center',
    },
    acceptBtnText: {
        ...Typography.button,
        color: Colors.white,
    },
    skipBtn: {
        flex: 1,
        backgroundColor: Colors.ghost,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
        alignItems: 'center',
    },
    skipBtnText: {
        ...Typography.button,
        color: Colors.gray,
    },
});
