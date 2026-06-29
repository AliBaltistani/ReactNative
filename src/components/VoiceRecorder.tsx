import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface VoiceRecorderProps {
    onRecordComplete?: (uri: string) => void;
    hint?: string;
}

export default function VoiceRecorder({ onRecordComplete, hint }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isRecording) {
            // Pulse animation
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.3,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();

            // Timer
            timerRef.current = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);

            return () => {
                pulse.stop();
                if (timerRef.current) clearInterval(timerRef.current);
            };
        } else {
            pulseAnim.setValue(1);
            setSeconds(0);
        }
    }, [isRecording]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            // Mock: simulate recording complete
            onRecordComplete?.('mock://voice-recording.m4a');
        } else {
            setIsRecording(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.micLabel}>🎤</Text>
                <Text style={styles.hint}>
                    {isRecording ? formatTime(seconds) : (hint || 'Apni farmaish bolein')}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
                onPress={toggleRecording}
                activeOpacity={0.7}
            >
                <Animated.View
                    style={[
                        styles.recordInner,
                        isRecording && styles.recordInnerActive,
                        { transform: [{ scale: pulseAnim }] },
                    ]}
                >
                    <Text style={styles.recordIcon}>
                        {isRecording ? '⏹️' : '🎙️'}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.ghost,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.mist,
        borderStyle: 'dashed',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    micLabel: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    hint: {
        ...Typography.body,
        color: Colors.slate,
        flex: 1,
    },
    recordBtn: {
        marginLeft: Spacing.md,
    },
    recordBtnActive: {},
    recordInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primaryFaded,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordInnerActive: {
        backgroundColor: Colors.dangerFaded,
    },
    recordIcon: {
        fontSize: 24,
    },
});
