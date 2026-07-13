import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { WEEKDAYS_SHORT } from '../lib/canChi';
import { buildDayInfo, formatLunarShort } from '../lib/dayInfo';
import {
  dateKey,
  daysInSolarMonth,
  firstWeekdayOfMonth,
  sameSolar,
  solarToLunar,
  todaySolar,
} from '../lib/lunar';
import type { SolarDate } from '../lib/types';
import { useHaptics } from '../hooks/useHaptics';
import { useTheme } from '../hooks/useTheme';
import { isWeb } from '../lib/platform';
import { useSettingsStore } from '../store/settings';
import { font, radius, space } from '../theme/spacing';
import { AppText } from './AppText';

type Props = {
  year: number;
  month: number;
  selected?: SolarDate;
  onSelect?: (d: SolarDate) => void;
  /** When false, cells navigate to day detail via Link */
  navigateOnPress?: boolean;
};

type Cell = {
  solar: SolarDate | null;
};

export function MonthGrid({
  year,
  month,
  selected,
  onSelect,
  navigateOnPress = true,
}: Props) {
  const { colors } = useTheme();
  const weekStartsOn = useSettingsStore((s) => s.weekStartsOn);
  const showLunar = useSettingsStore((s) => s.showLunarInGrid);
  const showFestivals = useSettingsStore((s) => s.showFestivals);
  const { selection } = useHaptics();
  const today = todaySolar();

  const weekdayLabels = useMemo(() => {
    if (weekStartsOn === 0) return [...WEEKDAYS_SHORT];
    return [...WEEKDAYS_SHORT.slice(1), WEEKDAYS_SHORT[0]];
  }, [weekStartsOn]);

  const cells = useMemo(() => {
    const dim = daysInSolarMonth(year, month);
    let first = firstWeekdayOfMonth(year, month);
    if (weekStartsOn === 1) {
      first = (first + 6) % 7;
    }
    const list: Cell[] = [];
    for (let i = 0; i < first; i++) list.push({ solar: null });
    for (let d = 1; d <= dim; d++) {
      list.push({ solar: { day: d, month, year } });
    }
    while (list.length % 7 !== 0) list.push({ solar: null });
    return list;
  }, [year, month, weekStartsOn]);

  return (
    <View>
      <View style={styles.weekRow}>
        {weekdayLabels.map((w) => (
          <View key={w} style={styles.weekCell}>
            <AppText
              style={[
                styles.weekLabel,
                isWeb && styles.weekLabelWeb,
                { color: colors.textMuted },
              ]}
            >
              {w}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, idx) => {
          if (!cell.solar) {
            return (
              <View
                key={`e-${idx}`}
                style={[styles.dayCell, isWeb && styles.dayCellWeb]}
              />
            );
          }
          const d = cell.solar;
          const isToday = sameSolar(d, today);
          const isSelected = selected ? sameSolar(d, selected) : false;
          const lunar = solarToLunar(d.day, d.month, d.year);
          const info = buildDayInfo(d);
          const hasFest =
            showFestivals &&
            info.festivals.some(
              (f) =>
                f.category === 'tet' ||
                f.category === 'le' ||
                f.category === 'quoc-gia' ||
                f.category === 'khac'
            );
          const isRam = lunar.day === 1 || lunar.day === 15;
          const isSunday = new Date(d.year, d.month - 1, d.day).getDay() === 0;
          const key = dateKey(d);

          let solarColor = colors.text;
          if (isToday) solarColor = colors.todayText;
          else if (isSunday) solarColor = colors.accent;

          const inner = (
            <Pressable
              onPress={() => {
                selection();
                if (onSelect) {
                  onSelect(d);
                } else if (navigateOnPress) {
                  router.push(`/day/${key}`);
                }
              }}
              style={StyleSheet.flatten([
                styles.dayInner,
                isToday && { backgroundColor: colors.today },
                isSelected &&
                  !isToday && {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: colors.text,
                  },
              ])}
            >
              <AppText
                style={[styles.solarNum, isWeb && styles.solarNumWeb, { color: solarColor }]}
              >
                {d.day}
              </AppText>
              {showLunar ? (
                <AppText
                  style={[
                    styles.lunarNum,
                    isWeb && styles.lunarNumWeb,
                    {
                      color: isToday
                        ? 'rgba(255,255,255,0.85)'
                        : isRam
                          ? colors.gold
                          : colors.textMuted,
                    },
                  ]}
                >
                  {formatLunarShort(info)}
                </AppText>
              ) : null}
              {hasFest ? (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: isToday ? '#fff' : colors.festival },
                  ]}
                />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
            </Pressable>
          );

          return (
            <View key={key} style={[styles.dayCell, isWeb && styles.dayCellWeb]}>
              {inner}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    marginBottom: space.sm,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  weekLabelWeb: {
    fontSize: font.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    aspectRatio: 0.85,
    padding: 2,
  },
  dayCellWeb: {
    aspectRatio: 1,
    padding: 4,
  },
  dayInner: {
    flex: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  solarNum: {
    fontSize: font.md,
    fontWeight: '600',
  },
  solarNumWeb: {
    fontSize: font.xl,
    fontWeight: '700',
  },
  lunarNum: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '500',
  },
  lunarNumWeb: {
    fontSize: font.sm,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  dotPlaceholder: {
    width: 4,
    height: 4,
    marginTop: 3,
  },
});
