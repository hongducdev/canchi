import { NativeModules, Platform } from 'react-native';
import { solarToLunar } from './lunar';

type LauncherIconNative = {
  setDayIcon: (day: number) => Promise<void>;
};

const native = NativeModules.LauncherIcon as LauncherIconNative | undefined;

/** Switch Android launcher activity-alias to today's lunar day (1–30). */
export async function syncLauncherIconToLunarDay(
  date: Date = new Date(),
): Promise<void> {
  if (Platform.OS !== 'android' || !native?.setDayIcon) return;
  const lunar = solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
  const day = Math.min(30, Math.max(1, lunar.day));
  try {
    await native.setDayIcon(day);
  } catch {
    // Never block app launch on icon failures.
  }
}
