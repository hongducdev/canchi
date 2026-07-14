import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AppSettings, ThemeMode } from '../lib/types';

const DEFAULTS: AppSettings = {
  themeMode: 'system',
  weekStartsOn: 1,
  showLunarInGrid: true,
  showFestivals: true,
  haptics: true,
};

type SettingsState = AppSettings & {
  hydrated: boolean;
  monthlyPrayerReminders: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setWeekStartsOn: (v: 0 | 1) => void;
  setShowLunarInGrid: (v: boolean) => void;
  setShowFestivals: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setMonthlyPrayerReminders: (v: boolean) => void;
  setHydrated: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      hydrated: false,
      monthlyPrayerReminders: false,
      setThemeMode: (themeMode) => set({ themeMode }),
      setWeekStartsOn: (weekStartsOn) => set({ weekStartsOn }),
      setShowLunarInGrid: (showLunarInGrid) => set({ showLunarInGrid }),
      setShowFestivals: (showFestivals) => set({ showFestivals }),
      setHaptics: (haptics) => set({ haptics }),
      setMonthlyPrayerReminders: (monthlyPrayerReminders) =>
        set({ monthlyPrayerReminders }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'licham-settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({
        themeMode: s.themeMode,
        weekStartsOn: s.weekStartsOn,
        showLunarInGrid: s.showLunarInGrid,
        showFestivals: s.showFestivals,
        haptics: s.haptics,
        monthlyPrayerReminders: s.monthlyPrayerReminders,
      }),
    }
  )
);
