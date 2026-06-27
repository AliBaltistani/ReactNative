import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';

interface LoginScreenProps {
    navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [mode, setMode] = useState<'select' | 'personal' | 'family' | 'guest'>('select');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');

    const handleContinue = () => {
        // For MVP: just navigate to main app
        navigation.reset({
            index: 0,
            routes: [{ name: 'CustomerTabs' }],
        });
    };

    if (mode === 'select') {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.logo}>🏔️ RasaanGo</Text>
                    <Text style={styles.subtitle}>{t('common.tagline')}</Text>
                </View>

                <View style={styles.options}>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => setMode('personal')}
                    >
                        <Text style={styles.optionIcon}>👤</Text>
                        <View style={styles.optionBody}>
                            <Text style={styles.optionTitle}>{t('auth.personalAccount')}</Text>
                            <Text style={styles.optionDesc}>{t('auth.loginSubtitle')}</Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionCard, styles.familyCard]}
                        onPress={() => setMode('family')}
                    >
                        <Text style={styles.optionIcon}>👨‍👩‍👧</Text>
                        <View style={styles.optionBody}>
                            <Text style={styles.optionTitle}>{t('auth.familyAccount')}</Text>
                            <Text style={styles.optionDesc}>{t('auth.familySubtitle')}</Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionCard, styles.guestCard]}
                        onPress={handleContinue}
                    >
                        <Text style={styles.optionIcon}>👻</Text>
                        <View style={styles.optionBody}>
                            <Text style={styles.optionTitle}>{t('auth.guestMode')}</Text>
                            <Text style={styles.optionDesc}>{t('auth.guestSubtitle')}</Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.formContainer}>
                <TouchableOpacity onPress={() => setMode('select')} style={styles.backBtn}>
                    <Text style={styles.backText}>← {t('common.back')}</Text>
                </TouchableOpacity>

                <Text style={styles.formTitle}>
                    {mode === 'family' ? '👨‍👩‍👧' : '👤'}{' '}
                    {mode === 'family' ? t('auth.familyAccount') : t('auth.personalAccount')}
                </Text>

                {/* Phone Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('auth.enterPhone')}</Text>
                    <View style={styles.phoneRow}>
                        <View style={styles.countryCode}>
                            <Text style={styles.countryCodeText}>🇵🇰 +92</Text>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="3XX XXXXXXX"
                            placeholderTextColor={Colors.silver}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Family PIN */}
                {mode === 'family' && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{t('auth.createPin')}</Text>
                        <TextInput
                            style={styles.pinInput}
                            placeholder="● ● ● ●"
                            placeholderTextColor={Colors.silver}
                            value={pin}
                            onChangeText={setPin}
                            keyboardType="number-pad"
                            maxLength={4}
                            secureTextEntry
                        />
                        <Text style={styles.pinHint}>
                            🔒 Family members will use this PIN to access
                        </Text>
                    </View>
                )}

                {/* Privacy Notice */}
                <View style={styles.privacyNotice}>
                    <Text style={styles.privacyIcon}>🛡️</Text>
                    <Text style={styles.privacyText}>
                        Your number is only used for verification. Riders and shops will never see your personal number.
                    </Text>
                </View>

                <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                    <Text style={styles.continueBtnText}>{t('common.next')} →</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: Spacing.xxl,
    },
    logo: {
        fontSize: 36,
        fontWeight: '800',
        color: Colors.primary,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.gray,
    },
    options: {
        paddingHorizontal: Spacing.xl,
        gap: Spacing.md,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.snow,
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        borderWidth: 1.5,
        borderColor: Colors.mist,
    },
    familyCard: {
        borderColor: Colors.primary + '40',
        backgroundColor: Colors.primaryFaded,
    },
    guestCard: {
        borderColor: Colors.warm + '40',
        backgroundColor: Colors.warmFaded,
    },
    optionIcon: {
        fontSize: 32,
        marginRight: Spacing.md,
    },
    optionBody: {
        flex: 1,
    },
    optionTitle: {
        ...Typography.h3,
        color: Colors.dark,
        marginBottom: 2,
    },
    optionDesc: {
        ...Typography.bodySmall,
        color: Colors.gray,
    },
    arrow: {
        fontSize: 20,
        color: Colors.slate,
    },
    formContainer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: Spacing.xxxl,
    },
    backBtn: {
        marginBottom: Spacing.xl,
    },
    backText: {
        ...Typography.label,
        color: Colors.accent,
    },
    formTitle: {
        ...Typography.h2,
        color: Colors.dark,
        marginBottom: Spacing.xxl,
    },
    inputGroup: {
        marginBottom: Spacing.xl,
    },
    inputLabel: {
        ...Typography.label,
        color: Colors.charcoal,
        marginBottom: Spacing.sm,
    },
    phoneRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    countryCode: {
        backgroundColor: Colors.ghost,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.mist,
    },
    countryCodeText: {
        ...Typography.label,
        color: Colors.charcoal,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: Colors.snow,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.mist,
        ...Typography.bodyLarge,
        color: Colors.dark,
        letterSpacing: 1,
    },
    pinInput: {
        backgroundColor: Colors.snow,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.base,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.mist,
        ...Typography.h2,
        textAlign: 'center',
        letterSpacing: 12,
        color: Colors.dark,
    },
    pinHint: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    privacyNotice: {
        flexDirection: 'row',
        backgroundColor: Colors.successFaded,
        padding: Spacing.base,
        borderRadius: Radius.md,
        marginBottom: Spacing.xl,
        alignItems: 'flex-start',
    },
    privacyIcon: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    privacyText: {
        ...Typography.bodySmall,
        color: Colors.charcoal,
        flex: 1,
    },
    continueBtn: {
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
    continueBtnText: {
        ...Typography.button,
        color: Colors.white,
        fontSize: 17,
    },
});
