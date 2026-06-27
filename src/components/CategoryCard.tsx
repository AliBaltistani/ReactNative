import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { Category } from '../types';

interface CategoryCardProps {
    category: Category;
    onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: category.bgColor }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={[styles.iconWrap, { backgroundColor: category.color + '20' }]}>
                <Text style={styles.icon}>{category.icon}</Text>
            </View>
            <Text style={[styles.name, { color: category.color }]} numberOfLines={1}>
                {category.name}
            </Text>
            <Text style={[styles.nameUr, { color: category.color }]} numberOfLines={1}>
                {category.nameUr}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '47%',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.lg,
        alignItems: 'center',
        marginBottom: Spacing.md,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: Radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    icon: {
        fontSize: 36,
    },
    name: {
        ...Typography.label,
        marginTop: 2,
    },
    nameUr: {
        ...Typography.caption,
        marginTop: 1,
        opacity: 0.8,
    },
});
