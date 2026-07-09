/**
 * Silence Expo Go SDK 53 noise from expo-notifications.
 * Remote push was removed from Expo Go; we only schedule local reminders.
 * Must be imported before any `expo-notifications` import.
 */

import { LogBox } from 'react-native';

const PATTERNS = [
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  'expo-notifications functionality is not fully supported in Expo Go',
  'We recommend you instead use a development build',
  'Use a development build instead of Expo Go',
];

LogBox.ignoreLogs(PATTERNS);

function shouldIgnoreExpoNotificationsNoise(args: unknown[]): boolean {
  const msg = args.map(String).join(' ');
  if (!msg.includes('expo-notifications')) return false;
  return (
    msg.includes('Push notifications') ||
    msg.includes('not fully supported in Expo Go') ||
    msg.includes('development build') ||
    msg.includes('development-builds/introduction')
  );
}

if (__DEV__) {
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  console.warn = (...args: unknown[]) => {
    if (shouldIgnoreExpoNotificationsNoise(args)) return;
    originalWarn(...args);
  };

  // Android SDK 53 emits the push-removed notice via console.error
  console.error = (...args: unknown[]) => {
    if (shouldIgnoreExpoNotificationsNoise(args)) return;
    originalError(...args);
  };
}
