import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashEmoji}>🏔️</Text>
        <Text style={styles.splashTitle}>RasaanGo</Text>
        <ActivityIndicator size="large" color={Colors.white} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
  },
});
