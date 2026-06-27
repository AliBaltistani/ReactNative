import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';

interface TrackingScreenProps {
    navigation: any;
    route: any;
}

const STEPS = [
    { key: 'confirmed', icon: '✅', label: 'tracking.confirmed' },
    { key: 'preparing', icon: '👨‍🍳', label: 'tracking.preparing' },
    { key: 'picked_up', icon: '📦', label: 'tracking.pickedUp' },
    { key: 'on_the_way', icon: '🏍️', label: 'tracking.onTheWay' },
    { key: 'delivered', icon: '🎉', label: 'tracking.delivered' },
];

export default function TrackingScreen({ navigation, route }: TrackingScreenProps) {
    const orderId = route.params?.orderId || '#1234';
    const shopName = route.params?.shopName || 'Shop';
    const total = route.params?.total || 0;
    const isAnonymous = route.params?.isAnonymous || false;

    const [currentStep, setCurrentStep] = useState(0);

    // Simulate status progression
    useEffect(() => {
        if (currentStep < STEPS.length - 1) {
            const timer = setTimeout(() => setCurrentStep((s) => s + 1), 4000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← {t('common.back')}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('tracking.title')}</Text>
                <Text style={styles.orderId}>{orderId}</Text>
            </View>

            {/* Status Card */}
            <View style={styles.statusCard}>
                <Text style={styles.statusEmoji}>{STEPS[currentStep].icon}</Text>
                <Text style={styles.statusText}>{t(STEPS[currentStep].label)}</Text>
                {currentStep < STEPS.length - 1 && (
                    <Text style={styles.eta}>🕐 {t('tracking.eta')}: ~{12 - currentStep * 3} min</Text>
                )}
            </View>

            {/* Progress Steps */}
            <View style={styles.stepsContainer}>
                {STEPS.map((step, i) => {
                    const isCompleted = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                        <View key={step.key} style={styles.stepRow}>
                            <View style={styles.stepIndicator}>
                                <View
                                    style={[
                                        styles.stepDot,
                                        isCompleted && styles.stepDotCompleted,
                                        isCurrent && styles.stepDotCurrent,
                                    ]}
                                >
                                    <Text style={styles.stepIcon}>
                                        {isCompleted ? step.icon : '○'}
                                    </Text>
                                </View>
                                {i < STEPS.length - 1 && (
                                    <View
                                        style={[
                                            styles.stepLine,
                                            i < currentStep && styles.stepLineCompleted,
                                        ]}
                                    />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.stepLabel,
                                    isCompleted && styles.stepLabelCompleted,
                                    isCurrent && styles.stepLabelCurrent,
                                ]}
                            >
                                {t(step.label)}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapIcon}>🗺️</Text>
                <Text style={styles.mapText}>Live map will appear here</Text>
            </View>

            {/* Rider Info */}
            {currentStep >= 2 && (
                <View style={styles.riderCard}>
                    <View style={styles.riderInfo}>
                        <Text style={styles.riderAvatar}>🏍️</Text>
                        <View>
                            <Text style={styles.riderName}>{t('tracking.riderName')}: Ahmed</Text>
                            <Text style={styles.riderRating}>⭐ 4.9</Text>
                        </View>
                    </View>
                    <View style={styles.riderActions}>
                        <TouchableOpacity style={styles.callBtn}>
                            <Text style={styles.actionBtnText}>📞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatBtn}>
                            <Text style={styles.actionBtnText}>💬</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Anonymous Badge */}
            {isAnonymous && (
                <View style={styles.anonBadge}>
                    <Text style={styles.anonText}>🔒 {t('cart.anonymousHint')}</Text>
                </View>
            )}

            {/* Order Info Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerShop}>🏪 {shopName}</Text>
                <Text style={styles.footerTotal}>PKR {total.toLocaleString()}</Text>
            </View>
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
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.xl,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    backBtn: {
        ...Typography.label,
        color: Colors.accent,
    },
    headerTitle: {
        ...Typography.h3,
        color: Colors.dark,
    },
    orderId: {
        ...Typography.labelSmall,
        color: Colors.gray,
    },
    statusCard: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
        backgroundColor: Colors.white,
        marginHorizontal: Spacing.xl,
        marginTop: Spacing.xl,
        borderRadius: Radius.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    statusEmoji: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    statusText: {
        ...Typography.h3,
        color: Colors.dark,
    },
    eta: {
        ...Typography.label,
        color: Colors.accent,
        marginTop: Spacing.sm,
    },
    stepsContainer: {
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.xl,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    stepIndicator: {
        alignItems: 'center',
        width: 40,
    },
    stepDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.ghost,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.mist,
    },
    stepDotCompleted: {
        backgroundColor: Colors.primaryFaded,
        borderColor: Colors.primary,
    },
    stepDotCurrent: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    stepIcon: {
        fontSize: 16,
    },
    stepLine: {
        width: 3,
        height: 24,
        backgroundColor: Colors.mist,
        marginVertical: 2,
    },
    stepLineCompleted: {
        backgroundColor: Colors.primary,
    },
    stepLabel: {
        ...Typography.body,
        color: Colors.slate,
        marginLeft: Spacing.md,
        marginTop: Spacing.sm,
    },
    stepLabelCompleted: {
        color: Colors.charcoal,
    },
    stepLabelCurrent: {
        color: Colors.primary,
        fontWeight: '700',
    },
    mapPlaceholder: {
        marginHorizontal: Spacing.xl,
        height: 120,
        backgroundColor: Colors.ghost,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.mist,
        borderStyle: 'dashed',
    },
    mapIcon: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    mapText: {
        ...Typography.bodySmall,
        color: Colors.slate,
    },
    riderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: Spacing.xl,
        padding: Spacing.base,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    riderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    riderAvatar: {
        fontSize: 32,
    },
    riderName: {
        ...Typography.label,
        color: Colors.dark,
    },
    riderRating: {
        ...Typography.caption,
        color: Colors.warm,
        marginTop: 2,
    },
    riderActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primaryFaded,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.accentFaded,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontSize: 20,
    },
    anonBadge: {
        marginHorizontal: Spacing.xl,
        padding: Spacing.md,
        backgroundColor: Colors.anonymous,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.anonymousBorder,
        alignItems: 'center',
    },
    anonText: {
        ...Typography.label,
        color: Colors.charcoal,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.xl,
        paddingBottom: Spacing.xxl,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.ghost,
    },
    footerShop: {
        ...Typography.label,
        color: Colors.charcoal,
    },
    footerTotal: {
        ...Typography.price,
        color: Colors.primary,
    },
});
