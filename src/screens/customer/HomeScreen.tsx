import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import LoadingSkeleton, { ShopCardSkeleton, CategoryCardSkeleton } from '../../components/LoadingSkeleton';

import { useAuthStore } from '../../store/authStore';
import { shopService } from '../../services/shopService';
import type { Category, Shop } from '../../types';

interface HomeScreenProps {
    navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const user = useAuthStore((s) => s.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [shops, setShops] = useState<Shop[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [cats, shopsList] = await Promise.all([
                shopService.getCategories(),
                shopService.getShops()
            ]);
            setCategories(cats);
            setShops(shopsList);
        } catch (error) {
            console.error('Failed to load home data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadData();
            return;
        }
        setIsLoading(true);
        try {
            const results = await shopService.searchShops(searchQuery);
            setShops(results);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>
                            {t('home.greeting')} {user?.name.split(' ')[0] || 'Guest'} 👋
                        </Text>
                        <Text style={styles.location}>📍 Skardu, Pakistan</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
                        style={styles.avatar}
                    />
                </View>

                {/* Search */}
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('home.searchPlaceholder')}
                        placeholderTextColor={Colors.slate}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); loadData(); }}>
                            <Text style={styles.clearIcon}>✖️</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.categoriesGrid}>
                    {isLoading ? (
                        <>
                            <CategoryCardSkeleton />
                            <CategoryCardSkeleton />
                            <CategoryCardSkeleton />
                            <CategoryCardSkeleton />
                        </>
                    ) : (
                        categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryCard, { backgroundColor: cat.color + '15' }]}
                            >
                                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                <Text style={styles.categoryName} numberOfLines={1}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Nearby Shops */}
                <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
                    <Text style={styles.sectionTitle}>{t('home.nearbyShops')}</Text>
                </View>

                <View style={styles.shopsList}>
                    {isLoading ? (
                        <>
                            <ShopCardSkeleton />
                            <ShopCardSkeleton />
                            <ShopCardSkeleton />
                        </>
                    ) : shops.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No shops found</Text>
                            <Text style={styles.emptyDesc}>Try a different search term</Text>
                        </View>
                    ) : (
                        shops.map((shop) => (
                            <TouchableOpacity
                                key={shop.id}
                                style={styles.shopCard}
                                onPress={() => navigation.navigate('Shop', { shopId: shop.id })}
                            >
                                <Image source={{ uri: shop.image }} style={styles.shopImg} />
                                <View style={styles.shopInfo}>
                                    <View>
                                        <Text style={styles.shopName} numberOfLines={1}>
                                            {shop.name}
                                        </Text>
                                        <Text style={styles.shopNameUr}>{shop.nameUr}</Text>
                                    </View>
                                    <View style={styles.shopMeta}>
                                        <Text style={styles.metaText}>⭐ {shop.rating}</Text>
                                        <Text style={styles.metaDot}>•</Text>
                                        <Text style={styles.metaText}>📍 {shop.distance}</Text>
                                        <Text style={styles.metaDot}>•</Text>
                                        <Text style={styles.metaText}>🕐 {shop.deliveryTime}m</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
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
        backgroundColor: Colors.white,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    greeting: {
        ...Typography.caption,
        color: Colors.gray,
        marginBottom: 2,
    },
    location: {
        ...Typography.h3,
        color: Colors.dark,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.ghost,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.ghost,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        height: 48,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...Typography.body,
        color: Colors.dark,
        height: '100%',
    },
    clearIcon: {
        fontSize: 16,
        color: Colors.gray,
        padding: 4,
    },
    body: {
        flex: 1,
    },
    bodyContent: {
        padding: Spacing.xl,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.charcoal,
    },
    seeAll: {
        ...Typography.labelSmall,
        color: Colors.primary,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '47%',
        padding: Spacing.base,
        borderRadius: Radius.lg,
        alignItems: 'center',
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: Spacing.sm,
    },
    categoryName: {
        ...Typography.label,
        color: Colors.dark,
    },
    shopsList: {
        gap: Spacing.md,
    },
    shopCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    shopImg: {
        width: 80,
        height: 80,
        borderRadius: Radius.md,
        backgroundColor: Colors.mist,
    },
    shopInfo: {
        flex: 1,
        marginLeft: Spacing.md,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    shopName: {
        ...Typography.label,
        color: Colors.dark,
    },
    shopNameUr: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: 1,
    },
    shopMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        ...Typography.caption,
        color: Colors.slate,
    },
    metaDot: {
        color: Colors.silver,
        marginHorizontal: 4,
    },
    emptyState: {
        padding: Spacing.xxl,
        alignItems: 'center',
    },
    emptyTitle: {
        ...Typography.h3,
        color: Colors.dark,
        marginBottom: 4,
    },
    emptyDesc: {
        ...Typography.bodySmall,
        color: Colors.gray,
    }
});
