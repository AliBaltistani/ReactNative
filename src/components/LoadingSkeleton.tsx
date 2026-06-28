import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';

interface LoadingSkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: any;
}

export default function LoadingSkeleton({
    width = '100%',
    height = 20,
    borderRadius = Radius.md,
    style,
}: LoadingSkeletonProps) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height,
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );
}

/** Common skeleton patterns */
export function ShopCardSkeleton() {
    return (
        <View style={skeletonStyles.shopCard}>
            <LoadingSkeleton width={80} height={80} borderRadius={Radius.lg} />
            <View style={skeletonStyles.shopInfo}>
                <LoadingSkeleton width="70%" height={18} />
                <LoadingSkeleton width="50%" height={14} style={{ marginTop: 8 }} />
                <LoadingSkeleton width="40%" height={14} style={{ marginTop: 6 }} />
            </View>
        </View>
    );
}

export function CategoryCardSkeleton() {
    return (
        <LoadingSkeleton
            width="47%"
            height={90}
            borderRadius={Radius.lg}
            style={{ marginBottom: Spacing.md }}
        />
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: Colors.mist,
    },
});

const skeletonStyles = StyleSheet.create({
    shopCard: {
        flexDirection: 'row',
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
    },
    shopInfo: {
        flex: 1,
        marginLeft: Spacing.md,
        justifyContent: 'center',
    },
});
