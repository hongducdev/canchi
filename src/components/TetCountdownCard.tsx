import React from 'react';
import { StyleSheet, View } from 'react-native';
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
          backgroundColor: colors.accentSoft,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.valueBlock}>
        <AppText style={[styles.days, { color: colors.accentText }]}>
          {days === 0 ? 'Nay' : days}
        </AppText>
        {days > 0 ? (
          <AppText style={[styles.unit, { color: colors.accentText }]}>ngày</AppText>
        ) : null}
      </View>
      <View style={styles.body}>
        <AppText style={[styles.title, { color: colors.text }]}>Tết Nguyên Đán</AppText>
        <AppText style={[styles.sub, { color: colors.textSecondary }]}>Còn lại đến {dateLabel}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.lg,
  },
  valueBlock: {
    minWidth: 62,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    marginLeft: space.lg,
  },
  title: {
    fontSize: font.md,
    fontWeight: '700',
  },
  days: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 30,
  },
  unit: {
    fontSize: font.sm,
    fontWeight: '600',
  },
  sub: {
    fontSize: font.sm,
    marginTop: space.xs,
    lineHeight: 19,
  },
});
