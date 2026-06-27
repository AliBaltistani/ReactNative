import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { Shop } from '../types';

interface ShopCardProps {
    shop: Shop;
    onPress: () => void;
}

export default function ShopCard({ shop, onPress }: ShopCardProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <Image source={{ uri: shop.image }} style={styles.image} />
            {!shop.isOpen && (
                <View style={styles.closedOverlay}>
                    <Text style={styles.closedText}>Closed</Text>
                </View>
            )}
            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>{shop.name}</Text>
                <Text style={styles.nameUr} numberOfLines={1}>{shop.nameUr}</Text>
                <View style={styles.meta}>
                    <Text style={styles.rating}>⭐ {shop.rating}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaText}>📍 {shop.distance}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaText}>🕐 {shop.deliveryTime} min</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 140,
        backgroundColor: Colors.ghost,
    },
    closedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closedText: {
        ...Typography.button,
        color: Colors.white,
        backgroundColor: Colors.danger,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.sm,
        overflow: 'hidden',
    },
    body: {
        padding: Spacing.md,
    },
    name: {
        ...Typography.h3,
        color: Colors.dark,
    },
    nameUr: {
        ...Typography.bodySmall,
        color: Colors.gray,
        marginTop: 2,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    rating: {
        ...Typography.labelSmall,
        color: Colors.warm,
    },
    dot: {
        marginHorizontal: 6,
        color: Colors.silver,
    },
    metaText: {
        ...Typography.caption,
        color: Colors.gray,
    },
});
