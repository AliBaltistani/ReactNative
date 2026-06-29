import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface Step {
    key: string;
    icon: string;
    label: string;
}

interface StatusStepperProps {
    steps: Step[];
    currentStepIndex: number;
    accentColor?: string;
}

export default function StatusStepper({ steps, currentStepIndex, accentColor }: StatusStepperProps) {
    const color = accentColor || Colors.primary;

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                    <View key={step.key} style={styles.stepRow}>
                        {/* Connector line */}
                        {index > 0 && (
                            <View style={styles.connectorWrap}>
                                <View
                                    style={[
                                        styles.connector,
                                        isCompleted || isCurrent
                                            ? { backgroundColor: color }
                                            : styles.connectorPending,
                                    ]}
                                />
                            </View>
                        )}

                        {/* Step content */}
                        <View style={styles.stepContent}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    isCompleted && { backgroundColor: color },
                                    isCurrent && { backgroundColor: color, borderColor: color + '40', borderWidth: 3 },
                                    isPending && styles.iconCirclePending,
                                ]}
                            >
                                <Text style={[styles.stepIcon, isPending && styles.stepIconPending]}>
                                    {isCompleted ? '✓' : step.icon}
                                </Text>
                            </View>

                            <View style={styles.labelWrap}>
                                <Text
                                    style={[
                                        styles.stepLabel,
                                        isCompleted && styles.stepLabelCompleted,
                                        isCurrent && [styles.stepLabelCurrent, { color }],
                                        isPending && styles.stepLabelPending,
                                    ]}
                                >
                                    {step.label}
                                </Text>
                                {isCurrent && (
                                    <View style={[styles.currentBadge, { backgroundColor: color + '15' }]}>
                                        <Text style={[styles.currentBadgeText, { color }]}>Current</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.md,
    },
    stepRow: {},
    connectorWrap: {
        position: 'absolute',
        top: -16,
        left: 19,
        height: 16,
        width: 2,
    },
    connector: {
        flex: 1,
        width: 2,
        borderRadius: 1,
    },
    connectorPending: {
        backgroundColor: Colors.mist,
    },
    stepContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        marginRight: Spacing.md,
    },
    iconCirclePending: {
        backgroundColor: Colors.ghost,
        borderWidth: 2,
        borderColor: Colors.mist,
    },
    stepIcon: {
        fontSize: 16,
        color: Colors.white,
    },
    stepIconPending: {
        color: Colors.slate,
    },
    labelWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    stepLabel: {
        ...Typography.body,
        color: Colors.dark,
    },
    stepLabelCompleted: {
        color: Colors.gray,
    },
    stepLabelCurrent: {
        ...Typography.label,
    },
    stepLabelPending: {
        color: Colors.slate,
    },
    currentBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    currentBadgeText: {
        ...Typography.caption,
        fontSize: 10,
        fontWeight: '700',
    },
});
