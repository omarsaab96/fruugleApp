import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n';
import AppSplash from "./splash";

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Avenir': require('../assets/fonts/Avenir.ttf'),
          'Avenir-Bold': require('../assets/fonts/Avenir-Bold.ttf'),
        });

        await SplashScreen.hideAsync();

        // Simulate API call / network delay
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds

      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }

    prepareApp();
  }, []);

  if (loading) {
    return <AppSplash />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
