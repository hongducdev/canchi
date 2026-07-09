import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../src/hooks/useTheme';
import { useNotesStore } from '../src/store/notes';
import { usePersonalEventsStore } from '../src/store/personalEvents';
import { useSettingsStore } from '../src/store/settings';

function RootNav() {
  const { colors, isDark } = useTheme();
  const setSettingsHydrated = useSettingsStore((s) => s.setHydrated);
  const setNotesHydrated = useNotesStore((s) => s.setHydrated);
  const setPersonalHydrated = usePersonalEventsStore((s) => s.setHydrated);

  useEffect(() => {
    // Fallback if rehydrate callback already fired before mount
    const t = setTimeout(() => {
      setSettingsHydrated(true);
      setNotesHydrated(true);
      setPersonalHydrated(true);
    }, 50);
    return () => clearTimeout(t);
  }, [setNotesHydrated, setPersonalHydrated, setSettingsHydrated]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="day/[date]"
          options={{
            title: 'Chi tiết ngày',
            presentation: 'card',
          }}
        />
        <Stack.Screen name="search" options={{ title: 'Tìm kiếm' }} />
        <Stack.Screen name="lucky" options={{ title: 'Ngày tốt' }} />
        <Stack.Screen name="personal" options={{ title: 'Sự kiện cá nhân' }} />
        <Stack.Screen name="fengshui" options={{ title: 'Phong thủy' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNav />
    </GestureHandlerRootView>
  );
}
