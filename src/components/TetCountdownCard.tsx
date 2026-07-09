import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';

type Props = {
  days: number;
  dateLabel: string;
};

export function TetCountdownCard({ days, dateLabel }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.borderStrong,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: colors.accent }]} />
      <View style={styles.body}>
        <Text style={[styles.eyebrow, { color: colors.accentText }]}>Đếm ngược Tết</Text>
        <View style={styles.row}>
          <Text style={[styles.days, { color: colors.text }]}>
            {days === 0 ? 'Hôm nay' : days}
          </Text>
          {days > 0 ? (
            <Text style={[styles.unit, { color: colors.textMuted }]}>ngày</Text>
          ) : null}
        </View>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Tết Nguyên Đán · {dateLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: space.xl,
  },
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    paddingVertical: space.lg,
    paddingHorizontal: space.lg,
  },
  eyebrow: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.sm,
  },
  days: {
    fontSize: font.display,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 64,
  },
  unit: {
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sub: {
    fontSize: font.sm,
    marginTop: space.xs,
  },
});
