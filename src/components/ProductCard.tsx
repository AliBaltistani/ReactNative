import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAdd: () => void;
    quantity?: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

export default function ProductCard({
    product,
    onAdd,
    quantity = 0,
    onIncrement,
    onDecrement,
}: ProductCardProps) {
    return (
        <View style={[styles.card, !product.inStock && styles.outOfStock]}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.nameUr} numberOfLines={1}>{product.nameUr}</Text>
                {product.unit && (
                    <Text style={styles.unit}>{product.unit}</Text>
                )}
                <View style={styles.footer}>
                    <Text style={styles.price}>PKR {product.price.toLocaleString()}</Text>
                    {product.inStock ? (
                        quantity > 0 ? (
                            <View style={styles.quantityControl}>
                                <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement}>
                                    <Text style={styles.qtyBtnText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{quantity}</Text>
                                <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={onIncrement}>
                                    <Text style={[styles.qtyBtnText, { color: Colors.white }]}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
                                <Text style={styles.addBtnText}>+ Add</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <View style={styles.oosTag}>
                            <Text style={styles.oosText}>Out of Stock</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        padding: Spacing.md,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    outOfStock: {
        opacity: 0.5,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: Radius.md,
        backgroundColor: Colors.ghost,
    },
    body: {
        flex: 1,
        marginLeft: Spacing.md,
        justifyContent: 'center',
    },
    name: {
        ...Typography.label,
        color: Colors.dark,
    },
    nameUr: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: 2,
    },
    unit: {
        ...Typography.caption,
        color: Colors.slate,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Spacing.sm,
    },
    price: {
        ...Typography.price,
        color: Colors.primary,
    },
    addBtn: {
        backgroundColor: Colors.primaryFaded,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.sm,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    addBtnText: {
        ...Typography.label,
        color: Colors.primary,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: Radius.sm,
        backgroundColor: Colors.ghost,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyBtnAdd: {
        backgroundColor: Colors.primary,
    },
    qtyBtnText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.dark,
    },
    qtyText: {
        ...Typography.label,
        color: Colors.dark,
        minWidth: 28,
        textAlign: 'center',
    },
    oosTag: {
        backgroundColor: Colors.dangerFaded,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.sm,
    },
    oosText: {
        ...Typography.labelSmall,
        color: Colors.danger,
    },
});
