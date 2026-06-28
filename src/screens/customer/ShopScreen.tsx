import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import ProductCard from '../../components/ProductCard';

import { useCartStore } from '../../store/cartStore';
import { shopService } from '../../services/shopService';
import type { Shop, Product } from '../../types';

interface ShopScreenProps {
    navigation: any;
    route: any;
}

export default function ShopScreen({ navigation, route }: ShopScreenProps) {
    const shopId = route.params?.shopId || 's1';

    // Global Cart State
    const cartItems = useCartStore((s) => s.items);
    const cartShopId = useCartStore((s) => s.shopId);
    const addToCart = useCartStore((s) => s.addItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const cartTotalItems = useCartStore((s) => s.totalItems());
    const cartSubtotal = useCartStore((s) => s.subtotal());

    // Local State
    const [shop, setShop] = useState<Shop | null>(null);
    const [shopProducts, setShopProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadShopData();
    }, [shopId]);

    const loadShopData = async () => {
        setIsLoading(true);
        try {
            const [shopData, productsData] = await Promise.all([
                shopService.getShopById(shopId),
                shopService.getShopProducts(shopId)
            ]);
            setShop(shopData);
            setShopProducts(productsData);
        } finally {
            setIsLoading(false);
        }
    };

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(shopProducts.map((p) => p.category))];
        return cats;
    }, [shopProducts]);

    const filtered = useMemo(() => {
        if (activeCategory === 'All') return shopProducts;
        return shopProducts.filter((p) => p.category === activeCategory);
    }, [activeCategory, shopProducts]);

    const handleAdd = (product: Product) => {
        const success = addToCart(product, shop!.id, shop!.name);
        if (!success) {
            // Cart conflict (different shop) - handled by store, we just need to alert
            alert("You have items from another shop in your cart. Please clear them first.");
        }
    };

    const getProductQty = (productId: string) => {
        const item = cartItems.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
    };

    const handleIncrement = (productId: string) => {
        const qty = getProductQty(productId);
        updateQuantity(productId, qty + 1);
    };

    const handleDecrement = (productId: string) => {
        const qty = getProductQty(productId);
        updateQuantity(productId, qty - 1);
    };

    if (isLoading || !shop) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

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
            <View style={styles.catTabsWrap}>
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
            </View>

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
                        quantity={getProductQty(product.id)}
                        onAdd={() => handleAdd(product)}
                        onIncrement={() => handleIncrement(product.id)}
                        onDecrement={() => handleDecrement(product.id)}
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
            {cartTotalItems > 0 && cartShopId === shopId && (
                <TouchableOpacity style={styles.cartBar} onPress={() => navigation.navigate('Cart')}>
                    <View style={styles.cartBarLeft}>
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartTotalItems}</Text>
                        </View>
                        <Text style={styles.cartBarText}>View Cart</Text>
                    </View>
                    <Text style={styles.cartBarPrice}>PKR {cartSubtotal.toLocaleString()}</Text>
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
    catTabsWrap: {
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    catTabs: {
        maxHeight: 60,
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
