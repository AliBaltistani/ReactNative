import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t, setLanguage, getLanguage } from '../../i18n';

interface Props { navigation: any; }

export default function SettingsScreen({ navigation }: Props) {
    const [lang, setLang] = useState(getLanguage());
    const [anonDefault, setAnonDefault] = useState(true);
    const [leaveAtDoor, setLeaveAtDoor] = useState(false);
    const [maskedCalls, setMaskedCalls] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promos, setPromos] = useState(false);
    const [sounds, setSounds] = useState(true);

    const changeLang = (l: string) => {
        setLang(l);
        setLanguage(l);
    };

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={s.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle}>⚙️ Settings</Text>
            </View>

            <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
                {/* Language */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>🌐 {t('profile.language')}</Text>
                    <View style={s.langRow}>
                        {[{ key: 'en', label: 'English' }, { key: 'ur', label: 'اردو' }].map(l => (
                            <TouchableOpacity
                                key={l.key}
                                style={[s.langBtn, lang === l.key && s.langBtnActive]}
                                onPress={() => changeLang(l.key)}
                            >
                                <Text style={[s.langTxt, lang === l.key && s.langTxtActive]}>{l.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Privacy */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>🔒 {t('profile.privacySettings')}</Text>
                    <View style={s.card}>
                        <ToggleRow label="Anonymous mode by default" sublabel="New orders auto-enable Parda Mode" value={anonDefault} onChange={setAnonDefault} />
                        <View style={s.divider} />
                        <ToggleRow label="Leave at door" sublabel="Default delivery preference" value={leaveAtDoor} onChange={setLeaveAtDoor} />
                        <View style={s.divider} />
                        <ToggleRow label="Masked calling" sublabel="Always hide your number from rider" value={maskedCalls} onChange={setMaskedCalls} />
                    </View>
                </View>

                {/* Notifications */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>🔔 {t('profile.notifications')}</Text>
                    <View style={s.card}>
                        <ToggleRow label="Order updates" sublabel="Status changes, delivery alerts" value={orderUpdates} onChange={setOrderUpdates} />
                        <View style={s.divider} />
                        <ToggleRow label="Promotions" sublabel="Deals and offers" value={promos} onChange={setPromos} />
                        <View style={s.divider} />
                        <ToggleRow label="Sounds" sublabel="Notification sounds" value={sounds} onChange={setSounds} />
                    </View>
                </View>

                {/* About */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>ℹ️ {t('profile.about')}</Text>
                    <View style={s.card}>
                        <View style={s.aboutRow}>
                            <Text style={s.aboutLabel}>Version</Text>
                            <Text style={s.aboutVal}>1.0.0</Text>
                        </View>
                        <View style={s.divider} />
                        <View style={s.aboutRow}>
                            <Text style={s.aboutLabel}>Made with</Text>
                            <Text style={s.aboutVal}>❤️ in Skardu</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function ToggleRow({ label, sublabel, value, onChange }: {
    label: string; sublabel: string; value: boolean; onChange: (v: boolean) => void;
}) {
    return (
        <View style={s.toggleRow}>
            <View style={s.toggleInfo}>
                <Text style={s.toggleLabel}>{label}</Text>
                <Text style={s.toggleSub}>{sublabel}</Text>
            </View>
            <Switch value={value} onValueChange={onChange}
                trackColor={{ false: Colors.silver, true: Colors.primaryLight }}
                thumbColor={Colors.white} />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.snow },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 54, paddingBottom: Spacing.md, paddingHorizontal: Spacing.xl, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.ghost },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.ghost, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
    backIcon: { fontSize: 20, color: Colors.dark },
    headerTitle: { ...Typography.h2, color: Colors.dark },
    body: { padding: Spacing.xl, paddingBottom: 100 },
    section: { marginBottom: Spacing.xl },
    sectionTitle: { ...Typography.label, color: Colors.charcoal, marginBottom: Spacing.md },
    langRow: { flexDirection: 'row', gap: Spacing.md },
    langBtn: { flex: 1, paddingVertical: Spacing.base, alignItems: 'center', borderRadius: Radius.lg, backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.mist },
    langBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryFaded },
    langTxt: { ...Typography.label, color: Colors.gray },
    langTxtActive: { color: Colors.primary },
    card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 },
    divider: { height: 1, backgroundColor: Colors.ghost, marginVertical: Spacing.md },
    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    toggleInfo: { flex: 1, marginRight: Spacing.md },
    toggleLabel: { ...Typography.body, color: Colors.dark },
    toggleSub: { ...Typography.caption, color: Colors.slate, marginTop: 2 },
    aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    aboutLabel: { ...Typography.body, color: Colors.gray },
    aboutVal: { ...Typography.label, color: Colors.dark },
});
