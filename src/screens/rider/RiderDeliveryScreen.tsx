import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_RIDER_DELIVERY } from '../../data/mockData';
import StatusStepper from '../../components/StatusStepper';
import MaskedCallButton from '../../components/MaskedCallButton';
import type { RiderDelivery } from '../../types';

interface RiderDeliveryScreenProps {
    navigation: any;
    route: any;
}

const DELIVERY_STEPS = [
    { key: 'heading_to_shop', icon: '🏪', label: 'Heading to Shop' },
    { key: 'at_shop', icon: '📦', label: 'At Shop — Pick Up Items' },
    { key: 'picked_up', icon: '🏍️', label: 'Items Picked Up' },
    { key: 'heading_to_customer', icon: '📍', label: 'Heading to Customer' },
    { key: 'delivered', icon: '🎉', label: 'Delivered!' },
];

export default function RiderDeliveryScreen({ navigation }: RiderDeliveryScreenProps) {
    const [delivery, setDelivery] = useState<RiderDelivery>(MOCK_RIDER_DELIVERY);

    const currentStepIndex = DELIVERY_STEPS.findIndex((s) => s.key === delivery.status);

    const nextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < DELIVERY_STEPS.length) {
            setDelivery({ ...delivery, status: DELIVERY_STEPS[nextIndex].key as RiderDelivery['status'] });
        }
    };

    const handleComplete = () => {
        Alert.alert(
            '🎉 Delivery Complete!',
            `You earned PKR ${delivery.earnings} for this delivery.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    const getActionButton = () => {
        switch (delivery.status) {
            case 'heading_to_shop':
                return { label: '📍 Arrived at Shop', action: nextStep };
            case 'at_shop':
                return { label: '📦 Picked Up Items', action: nextStep };
            case 'picked_up':
                return { label: '🏍️ Started Delivery', action: nextStep };
            case 'heading_to_customer':
                return { label: '✅ Mark as Delivered', action: handleComplete };
            default:
                return null;
        }
    };

    const actionBtn = getActionButton();

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={Colors.gradientDark} style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.earningsBadge}>
                        <Text style={styles.earningsText}>💰 PKR {delivery.earnings}</Text>
                    </View>
                </View>
                <Text style={styles.headerTitle}>🏍️ Active Delivery</Text>
                <Text style={styles.headerSubtitle}>Order {delivery.orderId} • {delivery.distance}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Delivery Progress */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📋 Delivery Progress</Text>
                    <StatusStepper
                        steps={DELIVERY_STEPS}
                        currentStepIndex={currentStepIndex}
                        accentColor={Colors.accent}
                    />
                </View>

                {/* Pickup Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📦 Pickup</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>🏪</Text>
                        <View style={styles.detailInfo}>
                            <Text style={styles.detailName}>{delivery.shopName}</Text>
                            <Text style={styles.detailAddress}>{delivery.shopAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📦</Text>
                        <Text style={styles.detailInfo}>
                            <Text style={styles.detailName}>{delivery.itemCount} items</Text>
                        </Text>
                    </View>
                </View>

                {/* Delivery Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📍 Delivery To</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <View style={styles.detailInfo}>
                            <Text style={styles.detailName}>{delivery.deliveryAddress}</Text>
                            <Text style={styles.detailAddress}>{delivery.deliveryLandmark}</Text>
                        </View>
                    </View>
                    {delivery.isAnonymous && (
                        <View style={styles.anonymousBadge}>
                            <Text style={styles.anonymousText}>🔒 Anonymous Delivery — No customer phone visible</Text>
                        </View>
                    )}
                </View>

                {/* Contact Customer */}
                {!delivery.isAnonymous && delivery.status !== 'delivered' && (
                    <MaskedCallButton variant="outline" />
                )}

                {/* Photo Proof (placeholder) */}
                {delivery.status === 'heading_to_customer' && (
                    <TouchableOpacity style={styles.photoBtn}>
                        <Text style={styles.photoIcon}>📸</Text>
                        <Text style={styles.photoText}>Take Delivery Photo (proof)</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Action Button */}
            {actionBtn && (
                <View style={styles.actionWrap}>
                    <TouchableOpacity style={styles.actionBtn} onPress={actionBtn.action}>
                        <LinearGradient
                            colors={delivery.status === 'heading_to_customer' ? ['#10B981', '#059669'] : Colors.gradientAccent}
                            style={styles.actionGradient}
                        >
                            <Text style={styles.actionText}>{actionBtn.label}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
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
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.white },
    earningsBadge: {
        backgroundColor: 'rgba(16,185,129,0.25)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    earningsText: { ...Typography.label, color: Colors.successLight, fontSize: 13 },
    headerTitle: { ...Typography.h2, color: Colors.white },
    headerSubtitle: { ...Typography.body, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    body: { padding: Spacing.xl, paddingBottom: 120 },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: { ...Typography.label, color: Colors.dark, marginBottom: Spacing.md },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddiingVertical: Spacing.sm },
    detailIcon: { fontSize: 20, marginRight: Spacing.md, marginTop: 2 },
    detailInfo: { flex: 1 },
    detailName: { ...Typography.body, color: Colors.dark, fontWeight: '600' },
    detailAddress: { ...Typography.bodySmall, color: Colors.slate, marginTop: 2 },
    divider: { height: 1, backgroundColor: Colors.ghost, marginVertical: Spacing.md },
    anonymousBadge: {
        backgroundColor: Colors.anonymous,
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginTop: Spacing.md,
    },
    anonymousText: { ...Typography.bodySmall, color: '#92400E' },
    photoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.base,
        borderRadius: Radius.lg,
        borderWidth: 2,
        borderColor: Colors.mist,
        borderStyle: 'dashed',
        marginTop: Spacing.md,
    },
    photoIcon: { fontSize: 24, marginRight: Spacing.sm },
    photoText: { ...Typography.body, color: Colors.slate },
    actionWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.xl,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.ghost,
    },
    actionBtn: { borderRadius: Radius.xl, overflow: 'hidden' },
    actionGradient: { paddingVertical: Spacing.base, alignItems: 'center' },
    actionText: { ...Typography.button, color: Colors.white, fontSize: 18 },
});
