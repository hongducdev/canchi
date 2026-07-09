import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWebDesktop } from '../hooks/useWebDesktop';
import { useTheme } from '../hooks/useTheme';
import { WEB_CONTENT_MAX_WIDTH, isWeb } from '../lib/platform';
import { space } from '../theme/spacing';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
}: Props) {
  const { colors } = useTheme();
  const desktopWeb = useWebDesktop();
  const webPad = isWeb
    ? {
        maxWidth: desktopWeb ? undefined : WEB_CONTENT_MAX_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : null;

  if (scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={[styles.safe, { backgroundColor: colors.bg }, style]}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, webPad, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safe, { backgroundColor: colors.bg }, style]}
    >
      <View style={[styles.fill, webPad, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  scrollContent: {
    paddingHorizontal: space.lg,
    paddingBottom: 100,
  },
});
