import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import Toast from '../../components/Toast';

import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { UserRole } from '../../types';

interface ProfileScreenProps {
    navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
    const { user, isGuest, logout, switchRole, currentRole } = useAuthStore();
    const { language, setLanguage, defaultAnonymous, toggleDefaultAnonymous, notificationsEnabled, setNotificationsEnabled } = useSettingsStore();

    const [toastMsg, setToastMsg] = useState('');

    const handleLogout = () => {
        logout();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const handleRoleSwitch = (role: UserRole) => {
        switchRole(role);

        // Navigation relies on RootNavigator dynamically resolving initialRoute, 
        // but for mid-session switch we force navigation to the correct stack.
        let target = 'CustomerTabs';
        if (role === 'rider') target = 'RiderTabs';
        if (role === 'seller') target = 'SellerTabs';

        navigation.reset({ index: 0, routes: [{ name: target }] });
    };

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'ur' : 'en');
        setToastMsg(`Language set to ${language === 'en' ? 'Urdu' : 'English'}`);
    };

    // If guest, show a truncated profile offering login
    if (isGuest || !user) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>👤 {t('profile.title', 'Profile')}</Text>
                </View>
                <View style={styles.guestState}>
                    <Text style={styles.guestIcon}>👻</Text>
                    <Text style={styles.guestTitle}>Guest Mode</Text>
                    <Text style={styles.guestDesc}>Log in to save addresses, earn rewards, and track past orders.</Text>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogout}>
                        <Text style={styles.loginBtnText}>Log In / Register</Text>
                    </TouchableOpacity>

                    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Settings</Text></View>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLanguageToggle}>
                        <View style={styles.menuItemLeft}>
                            <Text style={styles.menuIcon}>🌐</Text>
                            <Text style={styles.menuLabel}>{t('profile.language', 'Language')} ({language === 'en' ? 'English' : 'Urdu'})</Text>
                        </View>
                        <Text style={styles.chevron}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toast visible={!!toastMsg} message={toastMsg} type="success" onHide={() => setToastMsg('')} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>👤 {t('profile.title', 'Profile')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {/* User Info Card */}
                <View style={styles.userCard}>
                    <View style={styles.avatarWrap}>
                        <Text style={styles.avatarEmoji}>🙋</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userPhone}>{user.phone}</Text>
                        {user.isFamilyAccount && <Text style={styles.familyBadge}>👪 Family Account</Text>}
                    </View>
                </View>

                {/* Role Switcher (Hidden in production depending on permissions) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>App Mode (Dev Tool)</Text>
                </View>
                <View style={styles.roleTabs}>
                    {(['customer', 'rider', 'seller'] as const).map((role) => (
                        <TouchableOpacity
                            key={role}
                            style={[styles.roleTab, currentRole === role && styles.roleTabActive]}
                            onPress={() => handleRoleSwitch(role)}
                        >
                            <Text style={[styles.roleTabText, currentRole === role && styles.roleTabTextActive]}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Settings */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                </View>
                <View style={styles.menuGroup}>
                    {/* Default Anonymous */}
                    <View style={styles.menuRow}>
                        <View style={styles.menuItemLeft}>
                            <Text style={styles.menuIcon}>🔒</Text>
                            <View>
                                <Text style={styles.menuLabel}>Default to Anonymous</Text>
                                <Text style={styles.menuHint}>Always hide number for orders</Text>
                            </View>
                        </View>
                        <Switch
                            value={defaultAnonymous}
                            onValueChange={toggleDefaultAnonymous}
                            trackColor={{ false: Colors.mist, true: Colors.primary + '60' }}
                            thumbColor={defaultAnonymous ? Colors.primary : Colors.silver}
                        />
                    </View>

                    {/* Notifications */}
                    <View style={styles.menuRow}>
                        <View style={styles.menuItemLeft}>
                            <Text style={styles.menuIcon}>🔔</Text>
                            <Text style={styles.menuLabel}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: Colors.mist, true: Colors.primary + '60' }}
                            thumbColor={notificationsEnabled ? Colors.primary : Colors.silver}
                        />
                    </View>

                    {/* Language */}
                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLanguageToggle}>
                        <View style={styles.menuItemLeft}>
                            <Text style={styles.menuIcon}>🌐</Text>
                            <Text style={styles.menuLabel}>{t('profile.language', 'Language')} ({language === 'en' ? 'English' : 'Urdu'})</Text>
                        </View>
                        <Text style={styles.chevron}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
                    <Text style={styles.sectionTitle}>Account</Text>
                </View>
                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={styles.menuItemLeft}>
                            <Text style={styles.menuIcon}>🚪</Text>
                            <Text style={[styles.menuLabel, { color: Colors.danger }]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: {
        backgroundColor: Colors.white,
        paddingTop: 60,
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    headerTitle: { ...Typography.h1, color: Colors.dark },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    guestState: { padding: Spacing.xl, alignItems: 'center', marginTop: 40 },
    guestIcon: { fontSize: 64, marginBottom: Spacing.lg },
    guestTitle: { ...Typography.h2, color: Colors.dark, marginBottom: Spacing.xs },
    guestDesc: { ...Typography.body, color: Colors.gray, textAlign: 'center', marginBottom: Spacing.xl },
    loginBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: Radius.lg, width: '100%', alignItems: 'center' },
    loginBtnText: { ...Typography.button, color: Colors.white },
    userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radius.lg, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.mist },
    avatarWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentFaded, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
    avatarEmoji: { fontSize: 32 },
    userInfo: { flex: 1 },
    userName: { ...Typography.h3, color: Colors.dark },
    userPhone: { ...Typography.body, color: Colors.gray, marginTop: 2 },
    familyBadge: { ...Typography.caption, color: Colors.primary, backgroundColor: Colors.primaryFaded, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 6, alignSelf: 'flex-start' },
    sectionHeader: { marginBottom: Spacing.sm },
    sectionTitle: { ...Typography.label, color: Colors.charcoal },
    roleTabs: { flexDirection: 'row', backgroundColor: Colors.ghost, borderRadius: Radius.md, padding: 4, marginBottom: Spacing.xxl },
    roleTab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.sm },
    roleTabActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    roleTabText: { ...Typography.labelSmall, color: Colors.gray },
    roleTabTextActive: { color: Colors.dark },
    menuGroup: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.mist, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.ghost },
    menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.ghost },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: Spacing.sm },
    menuIcon: { fontSize: 22 },
    menuLabel: { ...Typography.body, color: Colors.dark },
    menuHint: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
    chevron: { color: Colors.silver, fontSize: 18 },
});
