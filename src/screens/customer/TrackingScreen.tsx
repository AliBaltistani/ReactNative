import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import MapView, { Marker, Polyline } from '../../components/MapView';
import { useOrderStore } from '../../store/orderStore';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';

interface TrackingScreenProps {
    navigation: any;
    route: any;
}

const { height } = Dimensions.get('window');

export default function TrackingScreen({ navigation, route }: TrackingScreenProps) {
    const { orderId } = route.params;
    const { orders, cancelOrder } = useOrderStore();
    const [order, setOrder] = useState<Order | null>(null);

    // Slide up animation for details sheet
    const slideAnim = React.useRef(new Animated.Value(height * 0.4)).current;

    useEffect(() => {
        // Sync local order state with store (store simulates live tracking via timeouts for demo)
        const currentOrder = orders.find((o) => o.id === orderId);
        setOrder(currentOrder || null);
    }, [orders, orderId]);

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleCancel = async () => {
        const success = await orderService.cancelOrder(orderId);
        if (success) {
            cancelOrder(orderId);
            navigation.goBack();
        }
    };

    if (!order) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.orderId}>Order not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.backBtn, { marginTop: 20 }]}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { status, shop, isAnonymous } = order;

    // Steps configuration based on status
    const steps = [
        { key: 'confirmed', label: 'Confirmed', icon: '📝' },
        { key: 'preparing', label: 'Preparing', icon: '🍳' },
        { key: 'picked_up', label: 'Picked Up', icon: '🛍️' },
        { key: 'on_the_way', label: 'On The Way', icon: '🛵' },
        { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === status);

    // Mock coordinates for Skardu map
    const SKARDU_REGION = {
        latitude: 35.2974,
        longitude: 75.6333,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
    const shopCoord = { latitude: 35.2950, longitude: 75.6350 };
    const deliveryCoord = { latitude: 35.3000, longitude: 75.6300 };

    return (
        <View style={styles.container}>
            {/* Map Background */}
            <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={SKARDU_REGION}
                scrollEnabled={false}
                zoomEnabled={false}
            >
                <Marker coordinate={shopCoord} title={shop.name} description="Shop" />
                <Marker coordinate={deliveryCoord} title="Delivery" pinColor="blue" />
                <Polyline coordinates={[shopCoord, deliveryCoord]} strokeColor={Colors.primary} strokeWidth={3} lineDashPattern={[5, 10]} />
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerPill}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.etaText}>
                    {status === 'delivered' ? 'Completed' : (order.eta || '15 min')}
                </Text>
            </View>

            {/* Bottom Sheet Details */}
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                {isAnonymous && (
                    <View style={styles.anonymousBanner}>
                        <Text style={styles.anonIcon}>🔒</Text>
                        <Text style={styles.anonText}>{t('tracking.privacyActive', 'Privacy Active: Rider cannot see your number')}</Text>
                    </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>
                    <Text style={styles.shopName}>{shop.name}</Text>

                    {/* Status Stepper */}
                    <View style={styles.stepper}>
                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isActive = index === currentStepIndex;
                            return (
                                <View key={step.key} style={styles.step}>
                                    <View style={[styles.stepIconWrap, isCompleted && styles.stepIconCompleted]}>
                                        <Text style={styles.stepIcon}>{step.icon}</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                                            {step.label}
                                        </Text>
                                    </View>
                                    {index < steps.length - 1 && (
                                        <View style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* Rider Info */}
                    {status === 'on_the_way' && order.riderName && (
                        <View style={styles.riderCard}>
                            <View style={styles.riderAvatar} />
                            <View style={styles.riderInfo}>
                                <Text style={styles.riderName}>{order.riderName}</Text>
                                <Text style={styles.riderMeta}>⭐ {order.riderRating} • Motorcycle</Text>
                            </View>
                            <TouchableOpacity style={styles.callBtn}>
                                <Text style={styles.callIcon}>📞</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Items Summary */}
                    <View style={styles.itemsSummary}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                        {order.items.map((item, idx) => (
                            <View key={idx} style={styles.summaryItem}>
                                <Text style={styles.summaryItemText}>
                                    {item.quantity}x {item.product.name}
                                </Text>
                                <Text style={styles.summaryItemPrice}>
                                    Rs {(item.quantity * item.product.price).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.summaryTotalRow}>
                            <Text style={styles.summaryTotalLabel}>Total</Text>
                            <Text style={styles.summaryTotalValue}>Rs {order.total.toLocaleString()}</Text>
                        </View>
                    </View>

                    {/* Cancel Button */}
                    {status === 'confirmed' && (
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                            <Text style={styles.cancelBtnText}>Cancel Order</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.snow,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: Spacing.lg,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
    },
    backBtnText: {
        fontSize: 24,
        color: Colors.dark,
        lineHeight: 28,
    },
    headerPill: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 9,
        alignItems: 'center',
    },
    orderId: {
        ...Typography.label,
        color: Colors.dark,
    },
    etaText: {
        ...Typography.h3,
        color: Colors.primary,
        marginTop: 2,
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: Radius.xxl,
        borderTopRightRadius: Radius.xxl,
        maxHeight: '65%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    sheetScroll: {
        padding: Spacing.xl,
        paddingBottom: 40,
    },
    anonymousBanner: {
        backgroundColor: Colors.anonymous,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        borderTopLeftRadius: Radius.xxl,
        borderTopRightRadius: Radius.xxl,
    },
    anonIcon: {
        fontSize: 16,
        marginRight: Spacing.sm,
    },
    anonText: {
        ...Typography.caption,
        color: Colors.white,
        fontWeight: 'bold',
    },
    shopName: {
        ...Typography.h2,
        color: Colors.dark,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    stepper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xxxl,
    },
    step: {
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    stepIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.mist,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    stepIconCompleted: {
        backgroundColor: Colors.primary,
    },
    stepIcon: {
        fontSize: 18,
    },
    stepContent: {
        marginTop: Spacing.xs,
        position: 'absolute',
        top: 40,
        width: 80,
    },
    stepLabel: {
        ...Typography.labelSmall,
        color: Colors.gray,
        fontSize: 10,
        textAlign: 'center',
    },
    stepLabelActive: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    stepLine: {
        position: 'absolute',
        top: 18,
        left: '50%',
        width: '100%',
        height: 2,
        backgroundColor: Colors.mist,
        zIndex: 1,
    },
    stepLineCompleted: {
        backgroundColor: Colors.primary,
    },
    riderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.ghost,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.xl,
    },
    riderAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.silver,
    },
    riderInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    riderName: {
        ...Typography.label,
        color: Colors.dark,
    },
    riderMeta: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: 2,
    },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primaryFaded,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    callIcon: {
        fontSize: 20,
    },
    itemsSummary: {
        backgroundColor: Colors.snow,
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        marginBottom: Spacing.xl,
    },
    summaryTitle: {
        ...Typography.label,
        color: Colors.charcoal,
        marginBottom: Spacing.md,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryItemText: {
        ...Typography.body,
        color: Colors.dark,
        flex: 1,
    },
    summaryItemPrice: {
        ...Typography.body,
        color: Colors.gray,
    },
    summaryTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: Colors.mist,
        marginTop: Spacing.sm,
        paddingTop: Spacing.md,
    },
    summaryTotalLabel: {
        ...Typography.label,
        color: Colors.dark,
    },
    summaryTotalValue: {
        ...Typography.h3,
        color: Colors.primary,
    },
    cancelBtn: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    cancelBtnText: {
        ...Typography.label,
        color: Colors.danger,
    },
    backBtn: {
        ...Typography.label,
        color: Colors.accent,
    },
});
