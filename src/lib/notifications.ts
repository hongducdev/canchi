import './suppressExpoNotificationsWarnings';

/**
 * Local-only notification helpers (no push server).
 *
 * Expo Go still warns about remote push limits; this app only schedules local reminders.
 * Prefer a development build for production notification testing.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { PERSONAL_KIND_LABEL } from '../store/personalEvents';
import { lunarToSolar, todaySolar } from './lunar';
import type { PersonalEvent } from './types';

const CHANNEL_ID = 'licham-reminders';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null = null;
let handlerReady = false;

async function getNotifications(): Promise<NotificationsModule> {
  if (!notificationsModule) {
    // Dynamic import: keep expo-notifications off the Settings route eval path.
    // A sync top-level import can fail in Expo Go and make the route module undefined
    // (expo-router then crashes with ErrorBoundary of undefined on Tabs).
    notificationsModule = await import('expo-notifications');
  }
  if (!handlerReady) {
    try {
      notificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      handlerReady = true;
    } catch {
      // Expo Go / unsupported environments may reject handler setup.
    }
  }
  return notificationsModule;
}

export function isRunningInExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Nhắc Can Chi',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

function atLocalHour(year: number, month: number, day: number, hour = 8, minute = 0): Date {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function nextSolarMonthDay(
  month: number,
  day: number,
  hour = 8,
  minute = 0
): Date | null {
  const now = new Date();
  const today = todaySolar();
  for (let y = today.year; y <= today.year + 2; y++) {
    const when = atLocalHour(y, month, day, hour, minute);
    if (when.getTime() > now.getTime() + 60_000) return when;
  }
  return null;
}

function nextLunarMonthDay(
  lunarDay: number,
  lunarMonth: number,
  lunarLeap: boolean,
  hour = 8,
  minute = 0
): Date | null {
  const now = new Date();
  const today = todaySolar();
  for (let y = today.year - 1; y <= today.year + 2; y++) {
    try {
      const solar = lunarToSolar(lunarDay, lunarMonth, y, lunarLeap);
      if (solar.day === 0) continue;
      const when = atLocalHour(solar.year, solar.month, solar.day, hour, minute);
      if (when.getTime() > now.getTime() + 60_000) return when;
    } catch {
      // skip invalid lunar year mapping
    }
  }
  return null;
}

function nextOccurrenceDate(event: PersonalEvent, hour = 8, minute = 0): Date | null {
  if (event.calendar === 'solar' && event.solarDay != null && event.solarMonth != null) {
    return nextSolarMonthDay(event.solarMonth, event.solarDay, hour, minute);
  }
  if (event.calendar === 'lunar' && event.lunarDay != null && event.lunarMonth != null) {
    return nextLunarMonthDay(
      event.lunarDay,
      event.lunarMonth,
      !!event.lunarLeap,
      hour,
      minute
    );
  }
  return null;
}

export async function schedulePersonalEventReminder(
  event: PersonalEvent
): Promise<string | null> {
  const Notifications = await getNotifications();
  const ok = await ensureNotificationPermissions();
  if (!ok) return null;

  const when = nextOccurrenceDate(event);
  if (!when) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: event.title,
      body: `${PERSONAL_KIND_LABEL[event.kind]} · ${when.getDate()}/${when.getMonth() + 1}`,
      data: { eventId: event.id },
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
  return id;
}

export async function cancelAllLichAmNotifications(): Promise<void> {
  const Notifications = await getNotifications();
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function rescheduleAllPersonalReminders(
  events: PersonalEvent[]
): Promise<number> {
  await cancelAllLichAmNotifications();
  let count = 0;
  for (const e of events) {
    if (e.kind === 'note') continue;
    const id = await schedulePersonalEventReminder(e);
    if (id) count += 1;
  }
  return count;
}

export async function scheduleTestNotification(): Promise<void> {
  const Notifications = await getNotifications();
  const ok = await ensureNotificationPermissions();
  if (!ok) throw new Error('Chưa được cấp quyền thông báo');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Can Chi',
      body: 'Thông báo cục bộ hoạt động.',
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      repeats: false,
    },
  });
}

export function expoGoNotificationHint(): string | null {
  if (!isRunningInExpoGo()) return null;
  return (
    'Bạn đang chạy trong Expo Go. Cảnh báo về push từ xa là bình thường. ' +
    'App chỉ dùng nhắc cục bộ; để ổn định hơn hãy dùng development build.'
  );
}
