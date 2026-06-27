import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { CATEGORIES, SHOPS } from '../../data/mockData';
import CategoryCard from '../../components/CategoryCard';
import ShopCard from '../../components/ShopCard';

interface HomeScreenProps {
    navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.location}>📍 Skardu</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerBtn}>
                            <Text style={styles.headerBtnIcon}>🔔</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.greeting}>
                    <Text style={styles.greetingText}>{t('greeting.hello')}</Text>
                    <Text style={styles.greetingSubtext}>{t('greeting.whatToOrder')}</Text>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => navigation.navigate('Search')}
                >
                    <Text style={styles.searchIcon}>🔍</Text>
                    <Text style={styles.searchPlaceholder}>{t('common.search')}</Text>
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView
                style={styles.body}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.bodyContent}
            >
                {/* Categories Grid */}
                <View style={styles.categoriesWrap}>
                    {CATEGORIES.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            onPress={() =>
                                navigation.navigate('ShopList', { categoryId: cat.id, categoryName: cat.name })
                            }
                        />
                    ))}
                </View>

                {/* Nearby Shops */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🏪 {t('home.nearbyShops')}</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>{t('home.viewAll')}</Text>
                        </TouchableOpacity>
                    </View>

                    {SHOPS.filter((s) => s.isOpen).map((shop) => (
                        <ShopCard
                            key={shop.id}
                            shop={shop}
                            onPress={() => navigation.navigate('Shop', { shopId: shop.id })}
                        />
                    ))}
                </View>

                {/* Become a Rider CTA */}
                <TouchableOpacity
                    style={styles.riderCta}
                    onPress={() => navigation.navigate('ProfileTab', { screen: 'Profile' })}
                >
                    <LinearGradient
                        colors={Colors.gradientWarm}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.riderCtaGradient}
                    >
                        <Text style={styles.riderCtaEmoji}>🏍️</Text>
                        <View style={styles.riderCtaBody}>
                            <Text style={styles.riderCtaTitle}>{t('rider.becomeRider')}</Text>
                            <Text style={styles.riderCtaSubtitle}>{t('rider.riderApply')}</Text>
                        </View>
                        <Text style={styles.riderCtaArrow}>→</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        paddingTop: 50,
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.xl,
        borderBottomLeftRadius: Radius.xxl,
        borderBottomRightRadius: Radius.xxl,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    location: {
        ...Typography.label,
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBtnIcon: {
        fontSize: 18,
    },
    greeting: {
        marginBottom: Spacing.lg,
    },
    greetingText: {
        ...Typography.h2,
        color: Colors.white,
    },
    greetingSubtext: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: Spacing.sm,
    },
    searchPlaceholder: {
        ...Typography.body,
        color: Colors.slate,
    },
    body: {
        flex: 1,
    },
    bodyContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: 100,
    },
    categoriesWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.dark,
    },
    viewAll: {
        ...Typography.label,
        color: Colors.accent,
    },
    riderCta: {
        marginBottom: Spacing.xl,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        shadowColor: Colors.warm,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    riderCtaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    riderCtaEmoji: {
        fontSize: 36,
        marginRight: Spacing.md,
    },
    riderCtaBody: {
        flex: 1,
    },
    riderCtaTitle: {
        ...Typography.h3,
        color: Colors.white,
    },
    riderCtaSubtitle: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
    riderCtaArrow: {
        fontSize: 24,
        color: Colors.white,
    },
});
