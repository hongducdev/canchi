import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { Card } from './Card';
import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export function ToolTile({ title, subtitle, icon, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.pressable,
          { opacity: pressed ? 0.82 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
        ])
      }
    >
      <Card style={styles.card}>
        <View
          style={[styles.iconChip, { backgroundColor: colors.bgMuted }]}
        >
          <Ionicons name={icon} size={20} color={colors.accentText} />
        </View>
        <AppText style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </AppText>
        <AppText
          style={[styles.subtitle, { color: colors.textMuted }]}
          numberOfLines={2}
        >
          {subtitle}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '48%',
    minHeight: 120,
  },
  card: {
    flex: 1,
    padding: space.lg,
    gap: space.sm,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: font.md,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: font.sm,
    lineHeight: 18,
  },
});
