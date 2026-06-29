import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_FAMILY_ACCOUNT } from '../../data/mockData';
import type { FamilyMember } from '../../types';

interface FamilyAccountScreenProps {
    navigation: any;
}

const ROLE_OPTIONS: { key: FamilyMember['role']; label: string; icon: string }[] = [
    { key: 'order', label: 'Orders Only', icon: '🛒' },
    { key: 'order_sell', label: 'Orders + Sell', icon: '🏪' },
    { key: 'ride', label: 'Orders + Ride', icon: '🏍️' },
];

export default function FamilyAccountScreen({ navigation }: FamilyAccountScreenProps) {
    const [headName, setHeadName] = useState(MOCK_FAMILY_ACCOUNT.headName);
    const [headPhone, setHeadPhone] = useState(MOCK_FAMILY_ACCOUNT.headPhone);
    const [members, setMembers] = useState<FamilyMember[]>(MOCK_FAMILY_ACCOUNT.members);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPin, setNewMemberPin] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<FamilyMember['role']>('order');

    const handleAddMember = () => {
        if (!newMemberName.trim() || newMemberPin.length !== 4) {
            Alert.alert('Error', 'Please enter name and 4-digit PIN');
            return;
        }
        const newMember: FamilyMember = {
            id: `fm${Date.now()}`,
            name: newMemberName.trim(),
            pin: newMemberPin,
            role: newMemberRole,
            icon: newMemberRole === 'ride' ? '👦' : '🧕',
        };
        setMembers([...members, newMember]);
        setNewMemberName('');
        setNewMemberPin('');
        setNewMemberRole('order');
        setShowAddForm(false);
    };

    const handleRemoveMember = (id: string) => {
        Alert.alert('Remove Member', 'Are you sure?', [
            { text: 'Cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => setMembers(members.filter(m => m.id !== id)) },
        ]);
    };

    const handleSave = () => {
        Alert.alert('✅ Saved!', 'Family account updated successfully.', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>👨‍👩‍👧 {t('auth.familyAccount')}</Text>
                <Text style={styles.headerSubtitle}>{t('auth.familySubtitle')}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* Family Head */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👨 Family Head</Text>
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('auth.fullName')}</Text>
                            <TextInput
                                style={styles.input}
                                value={headName}
                                onChangeText={setHeadName}
                                placeholder="Enter name"
                                placeholderTextColor={Colors.slate}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('auth.enterPhone')}</Text>
                            <TextInput
                                style={styles.input}
                                value={headPhone}
                                onChangeText={setHeadPhone}
                                placeholder="+92 3XX XXXXXXX"
                                placeholderTextColor={Colors.slate}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Family Members */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>👥 Family Members</Text>
                        <Text style={styles.memberCount}>{members.length}</Text>
                    </View>

                    {members.map((member) => (
                        <View key={member.id} style={styles.memberCard}>
                            <View style={styles.memberIcon}>
                                <Text style={styles.memberEmoji}>{member.icon}</Text>
                            </View>
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <View style={styles.memberMeta}>
                                    <Text style={styles.memberPin}>PIN: ••••</Text>
                                    <View style={styles.roleBadge}>
                                        <Text style={styles.roleBadgeText}>
                                            {ROLE_OPTIONS.find(r => r.key === member.role)?.icon}{' '}
                                            {ROLE_OPTIONS.find(r => r.key === member.role)?.label}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => handleRemoveMember(member.id)}
                            >
                                <Text style={styles.removeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Member Form */}
                    {showAddForm ? (
                        <View style={styles.addForm}>
                            <Text style={styles.addFormTitle}>➕ Add Member</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Member name"
                                placeholderTextColor={Colors.slate}
                                value={newMemberName}
                                onChangeText={setNewMemberName}
                            />
                            <TextInput
                                style={[styles.input, styles.pinInput]}
                                placeholder="4-digit PIN"
                                placeholderTextColor={Colors.slate}
                                value={newMemberPin}
                                onChangeText={setNewMemberPin}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                            />
                            <Text style={styles.roleTitle}>Access Level:</Text>
                            <View style={styles.roleOptions}>
                                {ROLE_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.key}
                                        style={[
                                            styles.roleOption,
                                            newMemberRole === option.key && styles.roleOptionActive,
                                        ]}
                                        onPress={() => setNewMemberRole(option.key)}
                                    >
                                        <Text style={styles.roleOptionIcon}>{option.icon}</Text>
                                        <Text
                                            style={[
                                                styles.roleOptionLabel,
                                                newMemberRole === option.key && styles.roleOptionLabelActive,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.addFormActions}>
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => setShowAddForm(false)}
                                >
                                    <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addBtn} onPress={handleAddMember}>
                                    <Text style={styles.addBtnText}>Add Member</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addMemberBtn}
                            onPress={() => setShowAddForm(true)}
                        >
                            <Text style={styles.addMemberBtnText}>➕ Add Family Member</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Info Note */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                    <Text style={styles.infoText}>
                        Each member uses their own 4-digit PIN to access the app.
                        All delivery notifications go to the family head's WhatsApp.
                    </Text>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>💾 {t('common.save')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: {
        paddingTop: 54,
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.xl,
        borderBottomLeftRadius: Radius.xxl,
        borderBottomRightRadius: Radius.xxl,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    backIcon: { fontSize: 20, color: Colors.white },
    headerTitle: { ...Typography.h2, color: Colors.white },
    headerSubtitle: { ...Typography.body, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    section: { marginBottom: Spacing.xl },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    sectionTitle: { ...Typography.h3, color: Colors.dark, marginBottom: Spacing.md },
    memberCount: {
        ...Typography.label,
        color: Colors.primary,
        backgroundColor: Colors.primaryFaded,
        paddingHorizontal: Spacing.md,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    inputGroup: { marginBottom: Spacing.md },
    inputLabel: { ...Typography.label, color: Colors.charcoal, marginBottom: Spacing.xs },
    input: {
        ...Typography.body,
        backgroundColor: Colors.ghost,
        borderRadius: Radius.md,
        padding: Spacing.md,
        color: Colors.dark,
        borderWidth: 1,
        borderColor: Colors.mist,
    },
    pinInput: { marginTop: Spacing.md },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    memberIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primaryFaded,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    memberEmoji: { fontSize: 24 },
    memberInfo: { flex: 1 },
    memberName: { ...Typography.label, color: Colors.dark },
    memberMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
    memberPin: { ...Typography.caption, color: Colors.slate },
    roleBadge: {
        backgroundColor: Colors.primaryFaded,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    roleBadgeText: { ...Typography.caption, color: Colors.primary, fontSize: 10 },
    removeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.dangerFaded,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeIcon: { color: Colors.danger, fontSize: 14, fontWeight: '700' },
    addForm: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
    },
    addFormTitle: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.md },
    roleTitle: { ...Typography.label, color: Colors.charcoal, marginTop: Spacing.md, marginBottom: Spacing.sm },
    roleOptions: { flexDirection: 'row', gap: Spacing.sm },
    roleOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        backgroundColor: Colors.ghost,
        borderRadius: Radius.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    roleOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryFaded },
    roleOptionIcon: { fontSize: 20, marginBottom: 4 },
    roleOptionLabel: { ...Typography.caption, color: Colors.gray },
    roleOptionLabelActive: { color: Colors.primary, fontWeight: '700' },
    addFormActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
    cancelBtn: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: Radius.md,
        backgroundColor: Colors.ghost,
    },
    cancelBtnText: { ...Typography.label, color: Colors.gray },
    addBtn: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: Radius.md,
        backgroundColor: Colors.primary,
    },
    addBtnText: { ...Typography.label, color: Colors.white },
    addMemberBtn: {
        paddingVertical: Spacing.base,
        alignItems: 'center',
        borderRadius: Radius.lg,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        backgroundColor: Colors.primaryFaded,
    },
    addMemberBtnText: { ...Typography.label, color: Colors.primary },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.accentFaded,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.xl,
        alignItems: 'flex-start',
    },
    infoIcon: { fontSize: 18, marginRight: Spacing.sm, marginTop: 2 },
    infoText: { ...Typography.bodySmall, color: Colors.dark, flex: 1, lineHeight: 20 },
    saveBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.base,
        borderRadius: Radius.xl,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    saveBtnText: { ...Typography.button, color: Colors.white, fontSize: 18 },
});
