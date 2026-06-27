import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { t } from '../../i18n';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        emoji: '🏔️',
        title: 'RasaanGo',
        subtitle: "Skardu ki apni delivery app",
        subtitleUr: "سکردو کی اپنی ڈلیوری ایپ",
        color: Colors.primary,
    },
    {
        id: '2',
        emoji: '🔒',
        title: 'Your Privacy Matters',
        subtitle: 'Anonymous ordering — nobody sees your number',
        subtitleUr: "گمنام آرڈرنگ — کوئی آپ کا نمبر نہیں دیکھے گا",
        color: '#3B82F6',
    },
    {
        id: '3',
        emoji: '🏍️',
        title: 'Earn With Your Bike',
        subtitle: 'Become a rider and earn daily',
        subtitleUr: "رائیڈر بنیں اور روزانہ کمائیں",
        color: '#F59E0B',
    },
];

interface OnboardingScreenProps {
    navigation: any;
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems?.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }, []);

    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

    const handleGetStarted = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width }]}>
                        <LinearGradient
                            colors={[item.color, item.color + 'CC']}
                            style={styles.slideGradient}
                        >
                            <Text style={styles.emoji}>{item.emoji}</Text>
                            <Text style={styles.slideTitle}>{item.title}</Text>
                            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                            <Text style={styles.slideSubtitleUr}>{item.subtitleUr}</Text>
                        </LinearGradient>
                    </View>
                )}
            />

            {/* Dot indicators */}
            <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            i === activeIndex && styles.dotActive,
                        ]}
                    />
                ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleGetStarted}>
                    <Text style={styles.primaryBtnText}>🚀  {t('auth.getStarted')}</Text>
                </TouchableOpacity>

                <View style={styles.languageRow}>
                    <Text style={styles.langLabel}>{t('auth.selectLanguage')}:</Text>
                    <TouchableOpacity style={[styles.langBtn, styles.langBtnActive]}>
                        <Text style={[styles.langBtnText, styles.langBtnTextActive]}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.langBtn}>
                        <Text style={styles.langBtnText}>اردو</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    slide: {
        flex: 1,
    },
    slideGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxl,
    },
    emoji: {
        fontSize: 80,
        marginBottom: Spacing.xl,
    },
    slideTitle: {
        ...Typography.h1,
        color: Colors.white,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    slideSubtitle: {
        ...Typography.bodyLarge,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    slideSubtitleUr: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.silver,
        marginHorizontal: 4,
    },
    dotActive: {
        width: 24,
        backgroundColor: Colors.primary,
    },
    actions: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxxl,
    },
    primaryBtn: {
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
    primaryBtnText: {
        ...Typography.button,
        color: Colors.white,
        fontSize: 18,
    },
    languageRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.lg,
        gap: Spacing.sm,
    },
    langLabel: {
        ...Typography.bodySmall,
        color: Colors.gray,
    },
    langBtn: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        borderWidth: 1.5,
        borderColor: Colors.mist,
    },
    langBtnActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryFaded,
    },
    langBtnText: {
        ...Typography.label,
        color: Colors.gray,
    },
    langBtnTextActive: {
        color: Colors.primary,
    },
});
