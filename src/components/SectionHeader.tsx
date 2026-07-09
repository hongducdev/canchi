import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, space } from '../theme/spacing';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function SectionHeader({ title, subtitle, right }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <View style={[styles.rule, { backgroundColor: colors.accent }]} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        {subtitle ? (
          <Text style={[styles.sub, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: space.md,
    marginTop: space.xl,
  },
  left: { flex: 1, paddingRight: space.md },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  rule: {
    width: 3,
    height: 16,
    borderRadius: 1,
  },
  title: {
    fontSize: font.lg,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: font.sm,
    marginTop: 4,
    marginLeft: 11,
  },
});
