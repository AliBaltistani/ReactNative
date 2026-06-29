import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';

interface ProfileScreenProps {
    navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
    const menuItems = [
        { icon: '👤', label: t('profile.editProfile'), screen: 'Settings' },
        { icon: '👨‍👩‍👧', label: t('auth.familyAccount'), screen: 'FamilyAccount' },
        { icon: '🌐', label: t('profile.language'), screen: 'Settings' },
        { icon: '🔒', label: t('profile.privacySettings'), screen: 'Settings' },
        { icon: '🔔', label: t('profile.notifications'), screen: 'Settings' },
        { icon: '❓', label: t('profile.help'), screen: null },
        { icon: 'ℹ️', label: t('profile.about'), screen: null },
    ];

    const roleItems = [
        { icon: '🛒', label: t('profile.customer'), color: Colors.primary, role: 'customer' },
        { icon: '🏍️', label: t('profile.rider'), color: Colors.accent, role: 'rider' },
        { icon: '🏪', label: t('profile.seller'), color: Colors.warm, role: 'seller' },
    ];

    const navigateToRole = (role: string) => {
        if (role === 'customer') {
            navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        } else if (role === 'rider') {
            navigation.reset({ index: 0, routes: [{ name: 'RiderTabs' }] });
        } else if (role === 'seller') {
            navigation.reset({ index: 0, routes: [{ name: 'SellerTabs' }] });
        }
    };

    return (
        <View style={styles.container}>
            {/* Profile Header */}
            <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👤</Text>
                </View>
                <Text style={styles.userName}>Guest User</Text>
                <Text style={styles.userDetail}>Family Account • Skardu</Text>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {/* Switch Role */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔄 {t('profile.switchRole')}</Text>
                    <View style={styles.roleRow}>
                        {roleItems.map((item) => (
                            <TouchableOpacity
                                key={item.role}
                                style={[styles.roleCard, { borderColor: item.color + '40' }]}
                                onPress={() => navigateToRole(item.role)}
                            >
                                <Text style={styles.roleIcon}>{item.icon}</Text>
                                <Text style={[styles.roleLabel, { color: item.color }]}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={() => item.screen && navigation.navigate(item.screen)}
                        >
                            <Text style={styles.menuIcon}>{item.icon}</Text>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuArrow}>→</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() =>
                        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] })
                    }
                >
                    <Text style={styles.logoutText}>🚪 {t('profile.logout')}</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.version}>
                    RasaanGo v1.0.0 • Made with ❤️ in Skardu
                </Text>
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
        paddingTop: 60,
        paddingBottom: Spacing.xxl,
        alignItems: 'center',
        borderBottomLeftRadius: Radius.xxl,
        borderBottomRightRadius: Radius.xxl,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    avatarText: {
        fontSize: 36,
    },
    userName: {
        ...Typography.h2,
        color: Colors.white,
    },
    userDetail: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 4,
    },
    body: {
        padding: Spacing.xl,
        paddingBottom: 100,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.label,
        color: Colors.charcoal,
        marginBottom: Spacing.md,
    },
    roleRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    roleCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        borderWidth: 2,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    roleIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    roleLabel: {
        ...Typography.labelSmall,
    },
    menuSection: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.xl,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ghost,
    },
    menuIcon: {
        fontSize: 22,
        marginRight: Spacing.md,
        width: 30,
        textAlign: 'center',
    },
    menuLabel: {
        ...Typography.body,
        color: Colors.dark,
        flex: 1,
    },
    menuArrow: {
        ...Typography.body,
        color: Colors.silver,
    },
    logoutBtn: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
        backgroundColor: Colors.dangerFaded,
        borderRadius: Radius.lg,
        marginBottom: Spacing.xl,
    },
    logoutText: {
        ...Typography.label,
        color: Colors.danger,
    },
    version: {
        ...Typography.caption,
        color: Colors.slate,
        textAlign: 'center',
    },
});
