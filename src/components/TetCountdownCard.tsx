import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { AppText } from './AppText';

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
        <AppText style={[styles.eyebrow, { color: colors.accentText }]}>Đếm ngược Tết</AppText>
        <View style={styles.row}>
          <AppText style={[styles.days, { color: colors.text }]}>
            {days === 0 ? 'Hôm nay' : days}
          </AppText>
          {days > 0 ? (
            <AppText style={[styles.unit, { color: colors.textMuted }]}>ngày</AppText>
          ) : null}
        </View>
        <AppText style={[styles.sub, { color: colors.textSecondary }]}>
          Tết Nguyên Đán · {dateLabel}
        </AppText>
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
