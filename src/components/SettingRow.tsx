import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, space } from '../theme/spacing';

type Props = {
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  onPress?: () => void;
  rightLabel?: string;
  isLast?: boolean;
};

export function SettingRow({
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  rightLabel,
  isLast,
}: Props) {
  const { colors } = useTheme();

  const content = (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {onValueChange != null && value != null ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.bgMuted, true: colors.accent }}
          thumbColor="#fff"
        />
      ) : rightLabel ? (
        <Text style={[styles.right, { color: colors.textSecondary }]}>{rightLabel}</Text>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.lg,
    gap: space.md,
  },
  left: { flex: 1 },
  title: {
    fontSize: font.md,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  sub: {
    fontSize: font.sm,
    marginTop: 2,
    lineHeight: 18,
  },
  right: {
    fontSize: font.sm,
    fontWeight: '600',
  },
});
