import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
    Platform,
    TextInput,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import Toast from '../../components/Toast';

import { useCartStore } from '../../store/cartStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useOrderStore } from '../../store/orderStore';
import { orderService } from '../../services/orderService';

interface CartScreenProps {
    navigation: any;
}

export default function CartScreen({ navigation }: CartScreenProps) {
    // Stores
    const cartStore = useCartStore();
    const defaultAnonymous = useSettingsStore((s) => s.defaultAnonymous);
    const placeOrder = useOrderStore((s) => s.placeOrder);

    // Derived cart state
    const items = cartStore.items;
    const shopName = cartStore.shopName;
    const itemsTotal = cartStore.subtotal();
    const deliveryFee = cartStore.deliveryFee();
    const total = cartStore.grandTotal();

    // Local state for UI loading
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Form inputs (synced with cart store for persistence)
    const [address, setAddress] = useState(cartStore.deliveryAddress);
    const [landmark, setLandmark] = useState(cartStore.landmark);
    const [isAnonymous, setIsAnonymous] = useState(defaultAnonymous || cartStore.isAnonymous);
    const [leaveAtDoor, setLeaveAtDoor] = useState(cartStore.leaveAtDoor);

    const handlePlaceOrder = async () => {
        if (!address.trim()) {
            Alert.alert('Location Required', 'Please enter a delivery location');
            return;
        }

        // Sync local form state to store right before order
        cartStore.setDeliveryAddress(address);
        cartStore.setLandmark(landmark);
        cartStore.setAnonymous(isAnonymous);
        cartStore.setLeaveAtDoor(leaveAtDoor);

        setIsLoading(true);
        try {
            // Place real order via service
            const newOrder = await orderService.placeOrder({
                items: cartStore.items,
                shop: { id: cartStore.shopId!, name: cartStore.shopName } as any, // Only need ID/Name for payload
                deliveryAddress: address,
                landmark,
                isAnonymous,
                leaveAtDoor,
                deliveryFee,
                total,
                paymentMethod: 'cash'
            });

            // Add to zustand order store (simulates tracking)
            placeOrder(newOrder);

            // Clear cart & navigate to tracking
            cartStore.clearCart();
            navigation.navigate('Tracking', {
                orderId: newOrder.id,
                shopName: newOrder.shop.name,
                total: newOrder.total,
                isAnonymous: newOrder.isAnonymous,
            });
        } catch (err) {
            setToastMessage('Failed to place order. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 60, left: 20 }}>
                    <Text style={styles.backBtn}>← {t('common.back')}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 60, marginBottom: 20 }}>🛒</Text>
                <Text style={styles.headerTitle}>Your cart is empty</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toast
                visible={!!toastMessage}
                message={toastMessage}
                type="error"
                onHide={() => setToastMessage('')}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← {t('common.back')}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🛒 {t('cart.title')}</Text>
                <TouchableOpacity onPress={() => cartStore.clearCart()}>
                    <Text style={styles.clearBtn}>Clear</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Shop Name */}
                <Text style={styles.shopName}>🏪 {shopName}</Text>

                {/* Cart Items */}
                {items.map((item) => (
                    <View key={item.product.id} style={styles.cartItem}>
                        <View style={styles.cartItemInfo}>
                            <Text style={styles.cartItemName}>{item.product.name}</Text>
                            <Text style={styles.cartItemNameUr}>{item.product.nameUr}</Text>
                        </View>
                        <View style={styles.cartItemRight}>
                            <View style={styles.qtyControls}>
                                <TouchableOpacity onPress={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}>
                                    <Text style={styles.qtyBtn}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.cartItemQty}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}>
                                    <Text style={styles.qtyBtn}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cartItemPrice}>
                                PKR {(item.product.price * item.quantity).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* Delivery Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 {t('cart.deliveryLocation')}</Text>
                    <TextInput
                        style={styles.addressInput}
                        placeholder={t('cart.locationPlaceholder')}
                        placeholderTextColor={Colors.slate}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                    />
                </View>

                {/* Anonymous Toggle */}
                <View style={[styles.toggleRow, isAnonymous && styles.toggleRowActive]}>
                    <View style={styles.toggleInfo}>
                        <Text style={styles.toggleIcon}>🔒</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.toggleLabel}>{t('cart.anonymousDelivery')}</Text>
                            <Text style={styles.toggleHint}>{t('cart.anonymousHint')}</Text>
                        </View>
                    </View>
                    <Switch
                        value={isAnonymous}
                        onValueChange={setIsAnonymous}
                        trackColor={{ false: Colors.mist, true: Colors.primary + '60' }}
                        thumbColor={isAnonymous ? Colors.primary : Colors.silver}
                    />
                </View>

                {/* Leave at Door */}
                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <Text style={styles.toggleIcon}>🚪</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.toggleLabel}>{t('cart.leaveAtDoor')}</Text>
                        </View>
                    </View>
                    <Switch
                        value={leaveAtDoor}
                        onValueChange={setLeaveAtDoor}
                        trackColor={{ false: Colors.mist, true: Colors.primary + '60' }}
                        thumbColor={leaveAtDoor ? Colors.primary : Colors.silver}
                    />
                </View>

                {/* Summary */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('cart.itemsTotal')}</Text>
                        <Text style={styles.summaryValue}>PKR {itemsTotal.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('cart.deliveryFee')}</Text>
                        <Text style={styles.summaryValue}>PKR {deliveryFee}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>{t('cart.total')}</Text>
                        <Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.paymentSection}>
                    <Text style={styles.sectionTitle}>💵 {t('cart.paymentMethod')}</Text>
                    <View style={styles.paymentCard}>
                        <Text style={styles.paymentIcon}>💵</Text>
                        <Text style={styles.paymentText}>{t('cart.cashOnDelivery')}</Text>
                        <View style={styles.paymentCheck}>
                            <Text>✅</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Place Order */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.orderBtn, isLoading && { opacity: 0.7 }]}
                    onPress={handlePlaceOrder}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <>
                            <Text style={styles.orderBtnText}>🟢 {t('cart.placeOrder')}</Text>
                            <Text style={styles.orderBtnPrice}>PKR {total.toLocaleString()}</Text>
                        </>
                    )}
                </TouchableOpacity>
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
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    clearBtn: {
        ...Typography.label,
        color: Colors.danger,
    },
    headerTitle: {
        ...Typography.h3,
        color: Colors.dark,
    },
    body: {
        flex: 1,
    },
    bodyContent: {
        padding: Spacing.xl,
        paddingBottom: 150,
    },
    shopName: {
        ...Typography.h3,
        color: Colors.charcoal,
        marginBottom: Spacing.lg,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    cartItemInfo: {
        flex: 1,
    },
    cartItemName: {
        ...Typography.body,
        color: Colors.dark,
    },
    cartItemNameUr: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: 2,
    },
    cartItemRight: {
        alignItems: 'flex-end',
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.ghost,
        borderRadius: Radius.sm,
        marginBottom: Spacing.xs,
        paddingHorizontal: 4,
    },
    qtyBtn: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        ...Typography.h3,
        color: Colors.primary,
    },
    cartItemQty: {
        ...Typography.label,
        color: Colors.dark,
        marginHorizontal: 8,
    },
    cartItemPrice: {
        ...Typography.label,
        color: Colors.primary,
    },
    section: {
        marginTop: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.label,
        color: Colors.charcoal,
        marginBottom: Spacing.sm,
    },
    addressInput: {
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.mist,
        ...Typography.body,
        color: Colors.dark,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: Radius.md,
        marginTop: Spacing.md,
        borderWidth: 1.5,
        borderColor: Colors.mist,
    },
    toggleRowActive: {
        backgroundColor: Colors.anonymous,
        borderColor: Colors.anonymousBorder,
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.sm,
    },
    toggleIcon: {
        fontSize: 24,
    },
    toggleLabel: {
        ...Typography.label,
        color: Colors.dark,
    },
    toggleHint: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: 2,
    },
    summary: {
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        marginTop: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.mist,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        ...Typography.body,
        color: Colors.gray,
    },
    summaryValue: {
        ...Typography.label,
        color: Colors.charcoal,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: Colors.ghost,
        paddingTop: Spacing.md,
        marginBottom: 0,
        marginTop: Spacing.sm,
    },
    totalLabel: {
        ...Typography.h3,
        color: Colors.dark,
    },
    totalValue: {
        ...Typography.h3,
        color: Colors.primary,
    },
    paymentSection: {
        marginTop: Spacing.xl,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.primaryFaded,
    },
    paymentIcon: {
        fontSize: 24,
        marginRight: Spacing.md,
    },
    paymentText: {
        ...Typography.body,
        color: Colors.dark,
        flex: 1,
    },
    paymentCheck: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.xl,
        paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.ghost,
    },
    orderBtn: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.base,
        borderRadius: Radius.xl,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    orderBtnText: {
        ...Typography.button,
        color: Colors.white,
        fontSize: 17,
    },
    orderBtnPrice: {
        ...Typography.button,
        color: Colors.white,
        fontSize: 17,
    },
});
