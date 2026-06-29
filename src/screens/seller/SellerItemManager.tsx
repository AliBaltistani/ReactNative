import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Alert, Switch, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_SELLER_PRODUCTS } from '../../data/mockData';
import type { SellerProduct } from '../../types';

interface Props { navigation: any; }

export default function SellerItemManager({ navigation }: Props) {
    const [products, setProducts] = useState<SellerProduct[]>(MOCK_SELLER_PRODUCTS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editItem, setEditItem] = useState<SellerProduct | null>(null);
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [formUnit, setFormUnit] = useState('');
    const [formInStock, setFormInStock] = useState(true);

    const openAdd = () => {
        setEditItem(null);
        setFormName(''); setFormPrice(''); setFormCategory(''); setFormUnit(''); setFormInStock(true);
        setModalVisible(true);
    };

    const openEdit = (item: SellerProduct) => {
        setEditItem(item);
        setFormName(item.name); setFormPrice(String(item.price));
        setFormCategory(item.category); setFormUnit(item.unit || ''); setFormInStock(item.inStock);
        setModalVisible(true);
    };

    const handleSave = () => {
        if (!formName.trim() || !formPrice.trim()) {
            Alert.alert('Error', 'Name and price are required'); return;
        }
        if (editItem) {
            setProducts(products.map(p => p.id === editItem.id ? {
                ...p, name: formName, price: Number(formPrice),
                category: formCategory, unit: formUnit, inStock: formInStock,
            } : p));
        } else {
            const newProduct: SellerProduct = {
                id: `sp${Date.now()}`, name: formName, nameUr: formName, price: Number(formPrice),
                image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300',
                category: formCategory || 'General', inStock: formInStock, unit: formUnit,
            };
            setProducts([...products, newProduct]);
        }
        setModalVisible(false);
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Item', 'Are you sure?', [
            { text: 'Cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => setProducts(products.filter(p => p.id !== id)) },
        ]);
    };

    const toggleStock = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
    };

    return (
        <View style={s.container}>
            <LinearGradient colors={Colors.gradientWarm} style={s.header}>
                <Text style={s.headerTitle}>📋 {t('seller.items')}</Text>
                <Text style={s.headerSub}>{products.length} items listed</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
                {products.map((item) => (
                    <View key={item.id} style={[s.itemCard, !item.inStock && s.itemCardOOS]}>
                        <View style={s.itemImage}>
                            <Text style={s.itemEmoji}>📸</Text>
                        </View>
                        <View style={s.itemInfo}>
                            <Text style={s.itemName}>{item.name}</Text>
                            <Text style={s.itemMeta}>
                                {item.category}{item.unit ? ` • ${item.unit}` : ''}
                            </Text>
                            <Text style={s.itemPrice}>PKR {item.price}</Text>
                        </View>
                        <View style={s.itemActions}>
                            <View style={s.stockToggle}>
                                <Switch
                                    value={item.inStock}
                                    onValueChange={() => toggleStock(item.id)}
                                    trackColor={{ false: Colors.silver, true: Colors.successLight }}
                                    thumbColor={Colors.white}
                                />
                            </View>
                            <View style={s.btnRow}>
                                <TouchableOpacity style={s.editBtn} onPress={() => openEdit(item)}>
                                    <Text style={s.editTxt}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(item.id)}>
                                    <Text style={s.delTxt}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={s.fab} onPress={openAdd}>
                <LinearGradient colors={Colors.gradientWarm} style={s.fabGrad}>
                    <Text style={s.fabTxt}>➕</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={s.modalOverlay}>
                    <View style={s.modal}>
                        <Text style={s.modalTitle}>
                            {editItem ? `✏️ ${t('seller.editItem')}` : `➕ ${t('seller.addItem')}`}
                        </Text>
                        <TextInput style={s.input} placeholder={t('seller.itemName')} placeholderTextColor={Colors.slate}
                            value={formName} onChangeText={setFormName} />
                        <TextInput style={s.input} placeholder={t('seller.itemPrice')} placeholderTextColor={Colors.slate}
                            value={formPrice} onChangeText={setFormPrice} keyboardType="numeric" />
                        <TextInput style={s.input} placeholder="Category" placeholderTextColor={Colors.slate}
                            value={formCategory} onChangeText={setFormCategory} />
                        <TextInput style={s.input} placeholder="Unit (e.g. 1kg, 500ml)" placeholderTextColor={Colors.slate}
                            value={formUnit} onChangeText={setFormUnit} />
                        <View style={s.stockRow}>
                            <Text style={s.stockLabel}>In Stock</Text>
                            <Switch value={formInStock} onValueChange={setFormInStock}
                                trackColor={{ false: Colors.silver, true: Colors.successLight }} thumbColor={Colors.white} />
                        </View>
                        <TouchableOpacity style={s.photoBtn}>
                            <Text style={s.photoBtnTxt}>📸 {t('seller.itemPhoto')}</Text>
                        </TouchableOpacity>
                        <View style={s.modalActions}>
                            <TouchableOpacity style={s.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={s.cancelTxt}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                                <Text style={s.saveTxt}>💾 {t('common.save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: { paddingTop: 54, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.xl },
    headerTitle: { ...Typography.h2, color: Colors.white },
    headerSub: { ...Typography.body, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    itemCard: {
        flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.lg,
        padding: Spacing.md, marginBottom: Spacing.md, shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2,
    },
    itemCardOOS: { opacity: 0.6 },
    itemImage: { width: 56, height: 56, borderRadius: Radius.md, backgroundColor: Colors.ghost, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
    itemEmoji: { fontSize: 24 },
    itemInfo: { flex: 1, justifyContent: 'center' },
    itemName: { ...Typography.label, color: Colors.dark },
    itemMeta: { ...Typography.caption, color: Colors.slate, marginTop: 2 },
    itemPrice: { ...Typography.label, color: Colors.primary, marginTop: 4 },
    itemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
    stockToggle: { transform: [{ scale: 0.8 }] },
    btnRow: { flexDirection: 'row', gap: Spacing.xs },
    editBtn: { padding: 6 },
    editTxt: { fontSize: 16 },
    delBtn: { padding: 6 },
    delTxt: { fontSize: 16 },
    fab: { position: 'absolute', bottom: 90, right: Spacing.xl, borderRadius: 30, overflow: 'hidden', shadowColor: Colors.warm, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
    fabGrad: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
    fabTxt: { fontSize: 28 },
    modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
    modal: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, padding: Spacing.xl, paddingBottom: 40 },
    modalTitle: { ...Typography.h3, color: Colors.dark, marginBottom: Spacing.lg },
    input: { ...Typography.body, backgroundColor: Colors.ghost, borderRadius: Radius.md, padding: Spacing.md, color: Colors.dark, borderWidth: 1, borderColor: Colors.mist, marginBottom: Spacing.md },
    stockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    stockLabel: { ...Typography.body, color: Colors.dark },
    photoBtn: { padding: Spacing.md, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.mist, borderStyle: 'dashed', alignItems: 'center', marginBottom: Spacing.lg },
    photoBtnTxt: { ...Typography.body, color: Colors.slate },
    modalActions: { flexDirection: 'row', gap: Spacing.md },
    cancelBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Colors.ghost },
    cancelTxt: { ...Typography.label, color: Colors.gray },
    saveBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Colors.warm },
    saveTxt: { ...Typography.label, color: Colors.white },
});
