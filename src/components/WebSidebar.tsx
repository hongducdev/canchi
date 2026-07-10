import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, space } from '../theme/spacing';
import { AppText } from './AppText';

type NavItem = {
  href:
    | '/(tabs)'
    | '/(tabs)/calendar'
    | '/(tabs)/utilities'
    | '/(tabs)/events'
    | '/(tabs)/settings';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  match: (pathname: string) => boolean;
};

const NAV: NavItem[] = [
  {
    href: '/(tabs)',
    label: 'Hôm nay',
    icon: 'today-outline',
    match: (p) => p === '/' || p.endsWith('/index') || p === '/(tabs)' || p.endsWith('/(tabs)'),
  },
  {
    href: '/(tabs)/calendar',
    label: 'Lịch',
    icon: 'calendar-outline',
    match: (p) => p.includes('calendar'),
  },
  {
    href: '/(tabs)/utilities',
    label: 'Tiện ích',
    icon: 'apps-outline',
    match: (p) => p.includes('utilities'),
  },
  {
    href: '/(tabs)/events',
    label: 'Lễ hội',
    icon: 'sparkles-outline',
    match: (p) => p.includes('events'),
  },
  {
    href: '/(tabs)/settings',
    label: 'Cài đặt',
    icon: 'settings-outline',
    match: (p) => p.includes('settings'),
  },
];

export function WebSidebar() {
  const { colors } = useTheme();
  const pathname = usePathname();

  return (
    <View
      style={[
        styles.sidebar,
        {
          backgroundColor: colors.bgCard,
          borderRightColor: colors.border,
        },
      ]}
    >
      <AppText style={[styles.brand, { color: colors.textMuted }]}>Can Chi</AppText>
      <View style={styles.nav}>
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href)}
              style={({ pressed }) =>
                StyleSheet.flatten([
                  styles.item,
                  {
                    borderLeftColor: active ? colors.accent : 'transparent',
                    backgroundColor:
                      active || pressed ? colors.bgMuted : 'transparent',
                  },
                ])
              }
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? colors.accent : colors.textSecondary}
              />
              <AppText
                style={[
                  styles.label,
                  { color: active ? colors.text : colors.textSecondary },
                  active && styles.labelActive,
                ]}
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText style={[styles.foot, { color: colors.textMuted }]}>
        Offline · trên trình duyệt
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingTop: space.xxl,
    paddingBottom: space.xl,
    paddingHorizontal: space.md,
    justifyContent: 'flex-start',
  },
  brand: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: space.xl,
    paddingHorizontal: space.sm,
  },
  nav: {
    gap: space.xs,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderLeftWidth: 3,
    borderRadius: 8,
  },
  label: {
    fontSize: font.md,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
  foot: {
    fontSize: font.xs,
    lineHeight: 16,
    paddingHorizontal: space.sm,
    marginTop: space.xl,
  },
});
