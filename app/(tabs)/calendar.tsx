import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { MonthGrid } from '../../src/components/MonthGrid';
import { Screen } from '../../src/components/Screen';
import { buildDayInfo, formatLunarLong } from '../../src/lib/dayInfo';
import { dateKey, todaySolar } from '../../src/lib/lunar';
import type { SolarDate } from '../../src/lib/types';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useTheme } from '../../src/hooks/useTheme';
import { font, radius, space } from '../../src/theme/spacing';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { light } = useHaptics();
  const today = todaySolar();
  const [cursor, setCursor] = useState({ year: today.year, month: today.month });
  const [selected, setSelected] = useState<SolarDate>(today);

  const info = useMemo(() => buildDayInfo(selected), [selected]);

  const shiftMonth = (delta: number) => {
    light();
    setCursor((c) => {
      let m = c.month + delta;
      let y = c.year;
      if (m < 1) {
        m = 12;
        y -= 1;
      } else if (m > 12) {
        m = 1;
        y += 1;
      }
      return { year: y, month: m };
    });
  };

  const goToday = () => {
    light();
    const t = todaySolar();
    setCursor({ year: t.year, month: t.month });
    setSelected(t);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Lịch tháng</Text>
        <Pressable
          onPress={goToday}
          style={[styles.todayBtn, { backgroundColor: colors.accentSoft }]}
        >
          <Text style={[styles.todayBtnText, { color: colors.accentText }]}>Hôm nay</Text>
        </Pressable>
      </View>

      <Card>
        <View style={styles.nav}>
          <Pressable
            onPress={() => shiftMonth(-1)}
            hitSlop={12}
            style={[styles.navBtn, { backgroundColor: colors.bgMuted }]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            Tháng {cursor.month}/{cursor.year}
          </Text>
          <Pressable
            onPress={() => shiftMonth(1)}
            hitSlop={12}
            style={[styles.navBtn, { backgroundColor: colors.bgMuted }]}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </Pressable>
        </View>

        <MonthGrid
          year={cursor.year}
          month={cursor.month}
          selected={selected}
          navigateOnPress={false}
          onSelect={(d) => setSelected(d)}
        />
      </Card>

      <Pressable
        onPress={() => router.push(`/day/${dateKey(selected)}`)}
        style={({ pressed }) => [
          styles.preview,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <Text style={[styles.previewTitle, { color: colors.text }]}>
          {info.weekdayName}, {selected.day}/{selected.month}/{selected.year}
        </Text>
        <Text style={[styles.previewLunar, { color: colors.textSecondary }]}>
          {formatLunarLong(info)}
        </Text>
        <View style={styles.chips}>
          <Chip label={info.canChiDay} tone="accent" />
          <Chip label={info.tietKhi} tone="gold" />
        </View>
        {info.festivals.length > 0 ? (
          <Text style={[styles.fests, { color: colors.gold }]} numberOfLines={2}>
            {info.festivals.map((f) => f.name).join(' · ')}
          </Text>
        ) : null}
        <Text style={[styles.link, { color: colors.accent }]}>Mở chi tiết ngày →</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.sm,
    marginBottom: space.xl,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  todayBtn: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
  },
  todayBtnText: {
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.lg,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: font.lg,
    fontWeight: '700',
  },
  preview: {
    marginTop: space.xl,
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  previewTitle: {
    fontSize: font.lg,
    fontWeight: '700',
  },
  previewLunar: {
    fontSize: font.sm,
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.md,
  },
  fests: {
    marginTop: space.md,
    fontSize: font.sm,
    fontWeight: '600',
  },
  link: {
    marginTop: space.md,
    fontSize: font.sm,
    fontWeight: '700',
  },
});
