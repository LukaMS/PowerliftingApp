import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';
import WorkoutProvider from '@/providers/WorkoutProvider';
import { initDB } from '@/db';
import AuthProvider from '@/providers/AuthProvider';

export { ErrorBoundary } from 'expo-router';

// Prevent the splash screen from auto‑hiding before we’re ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('@assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [dbReady, setDbReady] = useState(false);

  // 1) If fonts error out, crash early so you can catch it.
  useEffect(() => {
    if (!fontsLoaded) return;
  
    initDB()
      .then(() => setDbReady(true))
      .catch(e => {
        console.error('DB init failed:', e);
        // you could surface an error screen here
      });
  }, [fontsLoaded]);
  

  // 3) When _both_ fonts AND DB are ready, hide the splash.
  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  // 4) Don’t render your nav tree until everything’s in place.
  if (!fontsLoaded || !dbReady) {
    return null; // still on splash
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <WorkoutProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(user)" />
            </Stack>
          </WorkoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
