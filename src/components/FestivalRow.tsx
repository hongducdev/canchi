import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CATEGORY_LABEL } from '../data/festivals';
import { useTheme } from '../hooks/useTheme';
import { dateKey, getJulianDay, todaySolar } from '../lib/lunar';
import type { Festival, LunarDate, SolarDate } from '../lib/types';
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
      accessibilityRole="button"
      accessibilityLabel={`${festival.name}, ${solar.day} tháng ${solar.month}, ${isToday ? 'hôm nay' : `còn ${daysLeft} ngày`}`}
      onPress={() => router.push(`/day/${key}`)}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: colors.border,
          backgroundColor: pressed ? colors.bgMuted : 'transparent',
        },
      ]}
    >
      <View style={[styles.date, { backgroundColor: colors.bgMuted }]}>
        <AppText style={[styles.day, { color: colors.text }]}>{solar.day}</AppText>
        <AppText style={[styles.month, { color: colors.textMuted }]}>TH. {solar.month}</AppText>
      </View>

      <View style={styles.content}>
        <AppText style={[styles.category, { color: colors.accentText }]}>
          {CATEGORY_LABEL[festival.category]}
        </AppText>
        <AppText style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {festival.name}
        </AppText>
        <AppText style={[styles.meta, { color: colors.textMuted }]} numberOfLines={1}>
          {lunar ? `Âm ${lunar.day}/${lunar.month}, ` : ''}
          {solar.day}/{solar.month}/{solar.year}
        </AppText>
      </View>

      <View style={styles.trailing}>
        {isToday ? (
          <AppText style={[styles.today, { color: colors.accentText }]}>Hôm nay</AppText>
        ) : (
          <View style={styles.countdownBlock}>
            <AppText style={[styles.countdownValue, { color: colors.accentText }]}>
              {daysLeft}
            </AppText>
            <AppText style={[styles.countdownUnit, { color: colors.textMuted }]}>ngày</AppText>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
  },
  date: {
    width: 52,
    height: 60,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontSize: font.xxl,
    fontWeight: '600',
    letterSpacing: -0.8,
    lineHeight: 29,
  },
  month: {
    fontSize: font.xs,
    fontWeight: '700',
  },
  content: { flex: 1 },
  category: {
    fontSize: font.xs,
    fontWeight: '700',
    marginBottom: 3,
  },
  name: {
    fontSize: font.md,
    fontWeight: '700',
    lineHeight: 20,
  },
  meta: {
    fontSize: font.xs,
    marginTop: 4,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  countdownBlock: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  countdownValue: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 29,
  },
  countdownUnit: {
    fontSize: font.xs,
    fontWeight: '600',
  },
  today: {
    maxWidth: 44,
    fontSize: font.sm,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'right',
  },
});
