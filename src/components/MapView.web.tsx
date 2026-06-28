import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Marker = () => null;
export const Polyline = () => null;

const MapView = (props: any) => (
    <View style={[props.style, styles.fallback]}>
        <Text style={styles.text}>🗺️ Map tracking is disabled on Web</Text>
        <Text style={styles.subtext}>Test on a mobile device via Expo Go to view the live GPS route.</Text>
    </View>
);

const styles = StyleSheet.create({
    fallback: {
        backgroundColor: '#E5E7EB', // mist fallback
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
    },
    subtext: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    }
});

export default MapView;
