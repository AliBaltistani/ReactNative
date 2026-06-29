import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';
import { MOCK_DELIVERY_REQUEST } from '../../data/mockData';

const { width } = Dimensions.get('window');

interface Props { navigation: any; }

export default function RiderOrderAlertScreen({ navigation }: Props) {
    const req = MOCK_DELIVERY_REQUEST;
    const [timeLeft, setTimeLeft] = useState(req.timeLeft);
    const progressAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();

        const interval = setInterval(() => {
            setTimeLeft((p) => {
                if (p <= 1) { clearInterval(interval); navigation.goBack(); return 0; }
                return p - 1;
            });
        }, 1000);

        Animated.timing(progressAnim, {
            toValue: 0, duration: req.timeLeft * 1000, useNativeDriver: false,
        }).start();

        return () => clearInterval(interval);
    }, []);

    const handleAccept = () => navigation.replace('RiderDelivery', { deliveryId: req.id });
    const handleSkip = () => navigation.goBack();

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1], outputRange: ['0%', '100%'],
    });

    return (
        <LinearGradient colors={Colors.gradientDark} style={s.container}>
            <Animated.View style={[s.content, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
                <View style={s.alertHeader}>
                    <Text style={s.bellIcon}>🔔</Text>
                    <Text style={s.alertTitle}>{t('rider.newOrder')}</Text>
                </View>

                <View style={s.orderCard}>
                    <View style={s.locRow}>
                        <View style={s.locDot}><Text style={s.locDotTxt}>🏪</Text></View>
                        <View style={s.locInfo}>
                            <Text style={s.locLabel}>{t('rider.pickup')}</Text>
                            <Text style={s.locName}>{req.shopName}</Text>
                            <Text style={s.locAddr}>{req.shopAddress}</Text>
                        </View>
                    </View>

                    <View style={s.conn}>
                        <View style={s.connLine} />
                        <View style={s.distBadge}>
                            <Text style={s.distTxt}>📍 {req.distance}</Text>
                        </View>
                    </View>

                    <View style={s.locRow}>
                        <View style={[s.locDot, s.locDotDel]}><Text style={s.locDotTxt}>📍</Text></View>
                        <View style={s.locInfo}>
                            <Text style={s.locLabel}>{t('rider.deliverTo')}</Text>
                            <Text style={s.locName}>{req.deliveryAddress}</Text>
                            <Text style={s.locAddr}>{req.deliveryLandmark}</Text>
                        </View>
                    </View>

                    <View style={s.statsRow}>
                        <View style={s.stat}>
                            <Text style={s.statIcon}>📦</Text>
                            <Text style={s.statVal}>{req.itemCount}</Text>
                            <Text style={s.statLbl}>Items</Text>
                        </View>
                        <View style={[s.stat, s.statHi]}>
                            <Text style={s.statIcon}>💰</Text>
                            <Text style={[s.statVal, s.statValHi]}>PKR {req.earnings}</Text>
                            <Text style={s.statLbl}>{t('rider.earn')}</Text>
                        </View>
                        <View style={s.stat}>
                            <Text style={s.statIcon}>📏</Text>
                            <Text style={s.statVal}>{req.distance}</Text>
                            <Text style={s.statLbl}>Distance</Text>
                        </View>
                    </View>
                </View>

                <View style={s.timerSec}>
                    <Text style={s.timerTxt}>⏰ {t('rider.acceptIn')} {timeLeft}s</Text>
                    <View style={s.progTrack}>
                        <Animated.View style={[s.progFill, { width: progressWidth }]} />
                    </View>
                </View>

                <View style={s.actions}>
                    <TouchableOpacity style={s.acceptBtn} onPress={handleAccept}>
                        <LinearGradient colors={['#10B981', '#059669']} style={s.acceptGrad}>
                            <Text style={s.acceptTxt}>🟢 {t('rider.accept')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.skipBtn} onPress={handleSkip}>
                        <Text style={s.skipTxt}>🔴 {t('rider.skip')}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    content: { width: '100%' },
    alertHeader: { alignItems: 'center', marginBottom: Spacing.xl },
    bellIcon: { fontSize: 48, marginBottom: Spacing.md },
    alertTitle: { ...Typography.h1, color: Colors.white, textAlign: 'center' },
    orderCard: {
        backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl,
        marginBottom: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, shadowRadius: 24, elevation: 12,
    },
    locRow: { flexDirection: 'row', alignItems: 'flex-start' },
    locDot: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
    locDotDel: { backgroundColor: Colors.accentFaded },
    locDotTxt: { fontSize: 20 },
    locInfo: { flex: 1 },
    locLabel: { ...Typography.caption, color: Colors.slate, textTransform: 'uppercase', letterSpacing: 1 },
    locName: { ...Typography.h3, color: Colors.dark, marginTop: 2 },
    locAddr: { ...Typography.bodySmall, color: Colors.gray, marginTop: 2 },
    conn: { flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginVertical: Spacing.sm },
    connLine: { width: 2, height: 24, backgroundColor: Colors.mist, marginRight: Spacing.md },
    distBadge: { backgroundColor: Colors.ghost, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
    distTxt: { ...Typography.caption, color: Colors.gray },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.ghost },
    stat: { alignItems: 'center', flex: 1 },
    statHi: { backgroundColor: Colors.primaryFaded, paddingVertical: Spacing.sm, borderRadius: Radius.md, marginHorizontal: Spacing.sm },
    statIcon: { fontSize: 20, marginBottom: 4 },
    statVal: { ...Typography.label, color: Colors.dark },
    statValHi: { color: Colors.primary },
    statLbl: { ...Typography.caption, color: Colors.slate, marginTop: 2 },
    timerSec: { marginBottom: Spacing.xl },
    timerTxt: { ...Typography.label, color: Colors.white, textAlign: 'center', marginBottom: Spacing.sm },
    progTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
    progFill: { height: '100%', backgroundColor: Colors.warm, borderRadius: 4 },
    actions: { flexDirection: 'row', gap: Spacing.md },
    acceptBtn: { flex: 2, borderRadius: Radius.xl, overflow: 'hidden' },
    acceptGrad: { paddingVertical: Spacing.base, alignItems: 'center' },
    acceptTxt: { ...Typography.button, color: Colors.white, fontSize: 18 },
    skipBtn: { flex: 1, paddingVertical: Spacing.base, alignItems: 'center', borderRadius: Radius.xl, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    skipTxt: { ...Typography.button, color: Colors.white },
});
