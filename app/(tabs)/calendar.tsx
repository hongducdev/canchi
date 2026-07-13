import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { MonthGrid } from '../../src/components/MonthGrid';
import { PageHeader } from '../../src/components/PageHeader';
import { Screen } from '../../src/components/Screen';
import { ZodiacIcon } from '../../src/components/ZodiacIcon';
import { buildDayInfo, formatLunarLong } from '../../src/lib/dayInfo';
import { dateKey, todaySolar } from '../../src/lib/lunar';
import type { SolarDate } from '../../src/lib/types';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useTheme } from '../../src/hooks/useTheme';
import { font, radius, space } from '../../src/theme/spacing';
import { AppText } from '../../src/components/AppText';

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
      <PageHeader
        title="Lịch tháng"
        subtitle="Xem ngày dương và âm lịch"
        right={
          <Pressable
            onPress={goToday}
            style={[styles.todayBtn, { backgroundColor: colors.accentSoft }]}
          >
            <AppText style={[styles.todayBtnText, { color: colors.accentText }]}>Hôm nay</AppText>
          </Pressable>
        }
      />

      <Card>
        <View style={styles.nav}>
          <Pressable
            onPress={() => shiftMonth(-1)}
            hitSlop={12}
            style={[styles.navBtn, { backgroundColor: colors.bgMuted }]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <AppText style={[styles.monthTitle, { color: colors.text }]}>
            Tháng {cursor.month}/{cursor.year}
          </AppText>
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
        style={({ pressed }) =>
          StyleSheet.flatten([
            styles.preview,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ])
        }
      >
        <View style={styles.previewHead}>
          <View style={styles.previewCopy}>
            <AppText style={[styles.previewTitle, { color: colors.text }]}>
              {info.weekdayName}, {selected.day}/{selected.month}/{selected.year}
            </AppText>
            <AppText style={[styles.previewLunar, { color: colors.textSecondary }]}>
              {formatLunarLong(info)}
            </AppText>
          </View>
          <ZodiacIcon chi={info.lore.diaChi} size={40} />
        </View>
        <View style={styles.chips}>
          <Chip label={info.canChiDay} tone="accent" />
          <Chip label={info.tietKhi} tone="gold" />
        </View>
        {info.festivals.length > 0 ? (
          <AppText style={[styles.fests, { color: colors.gold }]} numberOfLines={2}>
            {info.festivals.map((f) => f.name).join(' · ')}
          </AppText>
        ) : null}
        <AppText style={[styles.link, { color: colors.accent }]}>Mở chi tiết ngày →</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  previewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  previewCopy: {
    flex: 1,
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
