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
    ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

interface LoginScreenProps {
    navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [mode, setMode] = useState<'personal' | 'family' | 'guest'>('personal');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [familyPin, setFamilyPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, setGuest } = useAuthStore();

    const handleContinue = async () => {
        setError('');

        if (mode === 'guest') {
            setGuest();
            navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
            return;
        }

        if (!phone.trim()) {
            setError('Phone number is required');
            return;
        }

        if (mode === 'family' && familyPin.length < 4) {
            setError('Family PIN must be 4 digits');
            return;
        }

        setIsLoading(true);
        try {
            if (mode === 'family') {
                const result = await authService.loginWithPhone(phone, familyPin);
                login({ ...result.user, isFamilyAccount: true, familyPin }, result.token);
            } else {
                const result = await authService.register({
                    name: name || 'User',
                    phone,
                });
                login(result.user, result.token);
            }
            navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        } catch {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🏔️</Text>
                    <Text style={styles.headerTitle}>RasaanGo</Text>
                    <Text style={styles.headerSubtitle}>{t('auth.enterDetails')}</Text>
                </View>

                {/* Mode Selector */}
                <View style={styles.modeRow}>
                    {(['personal', 'family', 'guest'] as const).map((m) => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                            onPress={() => { setMode(m); setError(''); }}
                        >
                            <Text style={styles.modeIcon}>
                                {m === 'personal' ? '👤' : m === 'family' ? '👨‍👩‍👧' : '👻'}
                            </Text>
                            <Text style={[styles.modeLabel, mode === m && styles.modeLabelActive]}>
                                {m === 'personal'
                                    ? t('auth.personal')
                                    : m === 'family'
                                        ? t('auth.family')
                                        : t('auth.guest')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Form */}
                {mode !== 'guest' && (
                    <View style={styles.form}>
                        {mode === 'personal' && (
                            <View style={styles.inputWrap}>
                                <Text style={styles.inputLabel}>👤 {t('auth.name')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your name"
                                    placeholderTextColor={Colors.slate}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        )}

                        <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>📞 {t('auth.phone')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="03XX XXXXXXX"
                                placeholderTextColor={Colors.slate}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {mode === 'family' && (
                            <View style={styles.inputWrap}>
                                <Text style={styles.inputLabel}>🔢 {t('auth.familyPin')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="4-digit PIN"
                                    placeholderTextColor={Colors.slate}
                                    value={familyPin}
                                    onChangeText={setFamilyPin}
                                    maxLength={4}
                                    keyboardType="number-pad"
                                    secureTextEntry
                                />
                                <Text style={styles.inputHint}>{t('auth.familyPinHint')}</Text>
                            </View>
                        )}
                    </View>
                )}

                {mode === 'guest' && (
                    <View style={styles.guestInfo}>
                        <Text style={styles.guestIcon}>👻</Text>
                        <Text style={styles.guestTitle}>{t('auth.guestMode')}</Text>
                        <Text style={styles.guestText}>{t('auth.guestHint')}</Text>
                    </View>
                )}

                {/* Error */}
                {error !== '' && (
                    <View style={styles.errorWrap}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Continue Button */}
                <TouchableOpacity
                    style={[styles.continueBtn, isLoading && styles.continueBtnDisabled]}
                    onPress={handleContinue}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.continueText}>
                            {mode === 'guest' ? `👻 ${t('auth.continueGuest')}` : `→ ${t('auth.continue')}`}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.snow,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.xl,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    headerEmoji: {
        fontSize: 52,
        marginBottom: Spacing.sm,
    },
    headerTitle: {
        ...Typography.h1,
        color: Colors.primary,
    },
    headerSubtitle: {
        ...Typography.body,
        color: Colors.gray,
        marginTop: Spacing.xs,
    },
    modeRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.xxl,
    },
    modeBtn: {
        flex: 1,
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.lg,
        borderWidth: 2,
        borderColor: Colors.mist,
        backgroundColor: Colors.white,
    },
    modeBtnActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryFaded,
    },
    modeIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    modeLabel: {
        ...Typography.labelSmall,
        color: Colors.gray,
    },
    modeLabelActive: {
        color: Colors.primary,
    },
    form: {
        gap: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    inputWrap: {
        // gap applied by parent
    },
    inputLabel: {
        ...Typography.label,
        color: Colors.charcoal,
        marginBottom: Spacing.sm,
    },
    input: {
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.mist,
        ...Typography.body,
        color: Colors.dark,
    },
    inputHint: {
        ...Typography.caption,
        color: Colors.gray,
        marginTop: Spacing.xs,
    },
    guestInfo: {
        alignItems: 'center',
        backgroundColor: Colors.ghost,
        padding: Spacing.xxl,
        borderRadius: Radius.xl,
        marginBottom: Spacing.xl,
    },
    guestIcon: {
        fontSize: 48,
        marginBottom: Spacing.md,
    },
    guestTitle: {
        ...Typography.h3,
        color: Colors.dark,
        marginBottom: Spacing.sm,
    },
    guestText: {
        ...Typography.body,
        color: Colors.gray,
        textAlign: 'center',
    },
    errorWrap: {
        backgroundColor: '#FEF2F2',
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },
    errorText: {
        ...Typography.bodySmall,
        color: Colors.danger,
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
    continueBtnDisabled: {
        opacity: 0.7,
    },
    continueText: {
        ...Typography.button,
        color: Colors.white,
        fontSize: 17,
    },
});
