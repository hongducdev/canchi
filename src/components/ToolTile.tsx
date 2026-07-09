import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { Card } from './Card';

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function ToolTile({ title, subtitle, icon, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Card style={styles.card}>
        <View
          style={[styles.iconChip, { backgroundColor: colors.accentSoft }]}
        >
          <Ionicons name={icon} size={20} color={colors.accentText} />
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.textMuted }]}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '48%',
    minHeight: 112,
  },
  card: {
    flex: 1,
    padding: space.md,
    gap: space.sm,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: font.md,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: font.sm,
    lineHeight: 18,
  },
});
