import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { SHOPS, PRODUCTS } from '../../data/mockData';
import ProductCard from '../../components/ProductCard';
import type { CartItem } from '../../types';

interface ShopScreenProps {
    navigation: any;
    route: any;
}

export default function ShopScreen({ navigation, route }: ShopScreenProps) {
    const shopId = route.params?.shopId || 's1';
    const shop = SHOPS.find((s) => s.id === shopId) || SHOPS[0];
    const shopProducts = PRODUCTS.filter((p) => p.shopId === shopId);

    const [cart, setCart] = useState<Record<string, number>>({});
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(shopProducts.map((p) => p.category))];
        return cats;
    }, [shopProducts]);

    const filtered = useMemo(() => {
        if (activeCategory === 'All') return shopProducts;
        return shopProducts.filter((p) => p.category === activeCategory);
    }, [activeCategory, shopProducts]);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = PRODUCTS.find((pr) => pr.id === id);
        return sum + (p ? p.price * qty : 0);
    }, 0);

    const addToCart = (productId: string) => {
        setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    };
    const increment = (productId: string) => {
        setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    };
    const decrement = (productId: string) => {
        setCart((prev) => {
            const newQty = (prev[productId] || 0) - 1;
            if (newQty <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: newQty };
        });
    };

    const goToCart = () => {
        const items: CartItem[] = Object.entries(cart).map(([id, quantity]) => ({
            product: PRODUCTS.find((p) => p.id === id)!,
            quantity,
        }));
        navigation.navigate('Cart', { items, shop });
    };

    return (
        <View style={styles.container}>
            {/* Shop Header */}
            <Image source={{ uri: shop.image }} style={styles.banner} />
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopNameUr}>{shop.nameUr}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.metaItem}>⭐ {shop.rating} ({shop.totalRatings})</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaItem}>📍 {shop.distance}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaItem}>🕐 {shop.deliveryTime} min</Text>
                </View>
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.catTabs}
                contentContainerStyle={styles.catTabsContent}
            >
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
                        onPress={() => setActiveCategory(cat)}
                    >
                        <Text
                            style={[
                                styles.catTabText,
                                activeCategory === cat && styles.catTabTextActive,
                            ]}
                        >
                            {cat === 'All' ? t('shop.allItems') : cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Products */}
            <ScrollView
                style={styles.products}
                contentContainerStyle={styles.productsContent}
                showsVerticalScrollIndicator={false}
            >
                {filtered.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart[product.id] || 0}
                        onAdd={() => addToCart(product.id)}
                        onIncrement={() => increment(product.id)}
                        onDecrement={() => decrement(product.id)}
                    />
                ))}

                {/* Voice Order */}
                <TouchableOpacity style={styles.voiceOrder}>
                    <Text style={styles.voiceIcon}>🎙️</Text>
                    <View>
                        <Text style={styles.voiceTitle}>{t('shop.voiceOrder')}</Text>
                        <Text style={styles.voiceHint}>{t('shop.voiceOrderHint')}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* Cart Bottom Bar */}
            {cartCount > 0 && (
                <TouchableOpacity style={styles.cartBar} onPress={goToCart}>
                    <View style={styles.cartBarLeft}>
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartCount}</Text>
                        </View>
                        <Text style={styles.cartBarText}>View Cart</Text>
                    </View>
                    <Text style={styles.cartBarPrice}>PKR {cartTotal.toLocaleString()}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.snow,
    },
    banner: {
        width: '100%',
        height: 200,
        backgroundColor: Colors.ghost,
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: Spacing.base,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    backIcon: {
        fontSize: 20,
        color: Colors.dark,
    },
    shopInfo: {
        padding: Spacing.xl,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    shopName: {
        ...Typography.h2,
        color: Colors.dark,
    },
    shopNameUr: {
        ...Typography.body,
        color: Colors.gray,
        marginTop: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    metaItem: {
        ...Typography.bodySmall,
        color: Colors.gray,
    },
    metaDot: {
        marginHorizontal: 8,
        color: Colors.silver,
    },
    catTabs: {
        backgroundColor: Colors.white,
        maxHeight: 52,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    catTabsContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    catTab: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        backgroundColor: Colors.ghost,
        marginVertical: Spacing.sm,
    },
    catTabActive: {
        backgroundColor: Colors.primary,
    },
    catTabText: {
        ...Typography.label,
        color: Colors.gray,
    },
    catTabTextActive: {
        color: Colors.white,
    },
    products: {
        flex: 1,
    },
    productsContent: {
        padding: Spacing.base,
        paddingBottom: 100,
    },
    voiceOrder: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.accentFaded,
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        borderWidth: 1.5,
        borderColor: Colors.accent + '30',
        borderStyle: 'dashed',
        marginTop: Spacing.sm,
    },
    voiceIcon: {
        fontSize: 36,
        marginRight: Spacing.md,
    },
    voiceTitle: {
        ...Typography.label,
        color: Colors.accent,
    },
    voiceHint: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: 2,
    },
    cartBar: {
        position: 'absolute',
        bottom: 24,
        left: Spacing.base,
        right: Spacing.base,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    cartBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    cartBadge: {
        backgroundColor: Colors.white,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        ...Typography.label,
        color: Colors.primary,
    },
    cartBarText: {
        ...Typography.button,
        color: Colors.white,
    },
    cartBarPrice: {
        ...Typography.button,
        color: Colors.white,
    },
});
