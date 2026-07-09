import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CATEGORY_LABEL } from '../data/festivals';
import { dateKey, getJulianDay, todaySolar } from '../lib/lunar';
import type { Festival, LunarDate, SolarDate } from '../lib/types';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { AppText } from './AppText';

type Props = {
  festival: Festival;
  solar: SolarDate;
  lunar?: LunarDate;
};

export function FestivalRow({ festival, solar, lunar }: Props) {
  const { colors } = useTheme();
  const key = dateKey(solar);

  const daysLeft = useMemo(() => {
    const today = todaySolar();
    return (
      getJulianDay(solar.day, solar.month, solar.year) -
      getJulianDay(today.day, today.month, today.year)
    );
  }, [solar.day, solar.month, solar.year]);

  const isToday = daysLeft <= 0;

  return (
    <Pressable
      onPress={() => router.push(`/day/${key}`)}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.row,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.borderStrong,
            opacity: pressed ? 0.92 : 1,
          },
        ])
      }
    >
      <View style={[styles.accent, { backgroundColor: colors.accent }]} />

      <View style={styles.content}>
        <View style={styles.topLine}>
          <AppText style={[styles.dateLine, { color: colors.text }]}>
            {solar.day}
            <AppText style={[styles.monthInline, { color: colors.textMuted }]}>
              {'  '}THÁNG {solar.month}
            </AppText>
          </AppText>

          {isToday ? (
            <AppText style={[styles.todayLabel, { color: colors.accentText }]}>Hôm nay</AppText>
          ) : (
            <AppText style={[styles.countdownLine, { color: colors.text }]}>
              {daysLeft}
              <AppText style={[styles.countdownUnit, { color: colors.textMuted }]}> ngày</AppText>
            </AppText>
          )}
        </View>

        <View style={[styles.rule, { backgroundColor: colors.border }]} />

        <AppText style={[styles.category, { color: colors.accentText }]}>
          {CATEGORY_LABEL[festival.category]}
        </AppText>
        <AppText style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {festival.name}
        </AppText>
        <AppText style={[styles.meta, { color: colors.textMuted }]} numberOfLines={1}>
          {lunar ? `Âm ${lunar.day}/${lunar.month}` : ''}
          {lunar ? ' · ' : ''}
          {solar.day}/{solar.month}/{solar.year}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.xl,
    overflow: 'hidden',
  },
  accent: {
    width: 3,
  },
  content: {
    flex: 1,
    paddingVertical: space.lg,
    paddingHorizontal: space.lg,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space.md,
  },
  dateLine: {
    fontSize: font.xxl,
    fontWeight: '200',
    letterSpacing: -1,
    lineHeight: 32,
  },
  monthInline: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  countdownLine: {
    fontSize: font.xxl,
    fontWeight: '200',
    letterSpacing: -1,
    lineHeight: 32,
  },
  countdownUnit: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  todayLabel: {
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginTop: space.md,
    marginBottom: space.md,
  },
  category: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: font.lg,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  meta: {
    fontSize: font.xs,
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
