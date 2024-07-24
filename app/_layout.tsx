import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { dbService } from '@/hooks/db-service';
import { install } from 'react-native-quick-crypto';
import { storage } from '@/hooks/MMKV';
import { MMKVConstants } from '@/constants/MMKVConstants';
import { uuidv4 } from '@/hooks/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config.ts';

install();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!storage.getString(MMKVConstants.USER_ID)) {
      storage.set(MMKVConstants.USER_ID, uuidv4());
    }

    dbService.initDB();

    return () => {
      dbService.closeDatabase();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <TamaguiProvider config={config}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="add"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="category-edit"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
