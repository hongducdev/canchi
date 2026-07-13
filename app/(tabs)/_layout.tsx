import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWebDesktop } from '../../src/hooks/useWebDesktop';
import { useTheme } from '../../src/hooks/useTheme';
import { typeface } from '../../src/theme/fonts';

/** Icon + label row; bottom padding comes from system nav / home-indicator inset. */
const TAB_BAR_CONTENT_HEIGHT = 52;

export default function TabsLayout() {
  const { colors } = useTheme();
  const desktopWeb = useWebDesktop();
  const insets = useSafeAreaInsets();
  const tabPaddingBottom = Math.max(insets.bottom, 8);
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + tabPaddingBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: desktopWeb
          ? { display: 'none' }
          : {
              backgroundColor: colors.bgElevated,
              borderTopColor: colors.border,
              borderTopWidth: StyleSheet.hairlineWidth,
              height: tabBarHeight,
              paddingTop: 6,
              paddingBottom: tabPaddingBottom,
            },
        tabBarLabelStyle: {
          ...typeface('600'),
          fontSize: 11,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hôm nay',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'today' : 'today-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Lịch',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="utilities"
        options={{
          title: 'Tiện ích',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'apps' : 'apps-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Lễ hội',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
