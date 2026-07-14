import '../src/lib/suppressExpoNotificationsWarnings';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebShell } from '../src/components/WebShell';
import { useTheme } from '../src/hooks/useTheme';
import { useFamilyStore } from '../src/store/family';
import { useNotesStore } from '../src/store/notes';
import { usePersonalEventsStore } from '../src/store/personalEvents';
import { useSettingsStore } from '../src/store/settings';
import { useUserProfileStore } from '../src/store/userProfile';
import {
  enableGoogleSansFlexWeb,
  googleSansFlexFaces,
  typeface,
} from '../src/theme/fonts';
import { syncWidgets } from '../src/widgets/syncWidgets';
import { maybeAutoCheckUpdate } from '../src/lib/appUpdate';
import { syncLauncherIconToLunarDay } from '../src/lib/launcherIcon';
import {
  scheduleMonthlyPrayerReminders,
  subscribeMonthlyPrayerNotificationResponses,
} from '../src/lib/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden in some environments (e.g. web).
});

function RootNav() {
  const { colors, isDark } = useTheme();
  const setSettingsHydrated = useSettingsStore((s) => s.setHydrated);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);
  const monthlyPrayerReminders = useSettingsStore((s) => s.monthlyPrayerReminders);
  const setMonthlyPrayerReminders = useSettingsStore(
    (s) => s.setMonthlyPrayerReminders,
  );
  const setNotesHydrated = useNotesStore((s) => s.setHydrated);
  const setPersonalHydrated = usePersonalEventsStore((s) => s.setHydrated);
  const setFamilyHydrated = useFamilyStore((s) => s.setHydrated);
  const setProfileHydrated = useUserProfileStore((s) => s.setHydrated);
  const refreshedMonthlyPrayerReminders = useRef(false);

  useEffect(() => {
    // Fallback if rehydrate callback already fired before mount
    const t = setTimeout(() => {
      setSettingsHydrated(true);
      setNotesHydrated(true);
      setPersonalHydrated(true);
      setFamilyHydrated(true);
      setProfileHydrated(true);
    }, 50);
    return () => clearTimeout(t);
  }, [
    setFamilyHydrated,
    setNotesHydrated,
    setPersonalHydrated,
    setProfileHydrated,
    setSettingsHydrated,
  ]);

  useEffect(() => {
    syncWidgets();
    void syncLauncherIconToLunarDay();
    void maybeAutoCheckUpdate();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;
    void subscribeMonthlyPrayerNotificationResponses((prayerId) => {
      router.push({
        pathname: '/van-khan/[id]',
        params: { id: prayerId },
      });
    })
      .then((cleanup) => {
        if (active) unsubscribe = cleanup;
        else cleanup();
      })
      .catch(() => {});
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!settingsHydrated || refreshedMonthlyPrayerReminders.current) return;
    if (monthlyPrayerReminders) {
      refreshedMonthlyPrayerReminders.current = true;
      void scheduleMonthlyPrayerReminders(false)
        .then((count) => {
          if (count === null) setMonthlyPrayerReminders(false);
        })
        .catch(() => {});
    }
  }, [monthlyPrayerReminders, setMonthlyPrayerReminders, settingsHydrated]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <WebShell>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerTitleStyle: typeface('700'),
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
          <Stack.Screen name="lucky/[activity]" options={{ title: 'Ngày tốt' }} />
          <Stack.Screen name="person-gate" options={{ title: 'Chọn hồ sơ' }} />
          <Stack.Screen name="personal" options={{ title: 'Sự kiện cá nhân' }} />
          <Stack.Screen name="fengshui" options={{ title: 'Phong thủy' }} />
          <Stack.Screen name="compass" options={{ title: 'La bàn' }} />
          <Stack.Screen name="lo-ban" options={{ title: 'Thước Lỗ Ban' }} />
          <Stack.Screen name="memorial" options={{ title: 'Tính ngày lễ' }} />
          <Stack.Screen name="family" options={{ title: 'Gia đình' }} />
          <Stack.Screen name="astronomy" options={{ title: 'Thiên văn' }} />
          <Stack.Screen name="date-since" options={{ title: 'Đếm ngày từ mốc' }} />
          <Stack.Screen name="van-khan" options={{ title: 'Văn khấn' }} />
          <Stack.Screen name="van-khan/[id]" options={{ title: 'Chi tiết văn khấn' }} />
          <Stack.Screen name="profile" options={{ title: 'Hồ sơ của tôi' }} />
        </Stack>
      </WebShell>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
    ...googleSansFlexFaces,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (fontsLoaded) {
        enableGoogleSansFlexWeb();
      }
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNav />
    </GestureHandlerRootView>
  );
}
