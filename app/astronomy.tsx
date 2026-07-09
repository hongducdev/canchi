import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { useTheme } from '../src/hooks/useTheme';
import { buildDayInfo } from '../src/lib/dayInfo';
import {
  ASTRO_KIND_LABEL,
  upcomingAstroEvents,
} from '../src/lib/astronomy';
import { dateKey, todaySolar } from '../src/lib/lunar';
import { font, radius, space } from '../src/theme/spacing';

export default function AstronomyScreen() {
  const { colors } = useTheme();
  const today = todaySolar();
  const moon = useMemo(() => buildDayInfo(today).moon, [today.day, today.month, today.year]);
  const upcoming = useMemo(() => upcomingAstroEvents(today), [today.day, today.month, today.year]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Thiên văn</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Trăng · nhật thực · nguyệt thực · mưa sao băng
        </Text>
      </View>

      <SectionHeader title="Mặt trăng hôm nay" />
      <Card>
        <Row label="Pha" value={moon.phaseName} colors={colors} />
        <Row label="Độ sáng" value={`${Math.round(moon.illumination * 100)}%`} colors={colors} />
        <Row
          label="Trăng mới"
          value={moon.isNewMoon ? 'Hôm nay' : `Còn ${moon.daysToNewMoon} ngày`}
          colors={colors}
        />
        <Row
          label="Trăng tròn"
          value={moon.isFullMoon ? 'Hôm nay' : `Còn ${moon.daysToFullMoon} ngày`}
          colors={colors}
          last
        />
      </Card>

      <SectionHeader title="Sắp tới" subtitle="Dữ liệu tĩnh offline" />
      {upcoming.map(({ event, days, solar }) => (
        <Pressable
          key={event.id}
          onPress={() => router.push(`/day/${dateKey(solar)}`)}
          style={({ pressed }) => [
            styles.rowCard,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.borderStrong,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Text style={[styles.kind, { color: colors.accentText }]}>
            {ASTRO_KIND_LABEL[event.kind]}
            {days === 0 ? ' · Hôm nay' : ` · Còn ${days} ngày`}
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>{event.name}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {solar.day}/{solar.month}/{solar.year} · {event.description}
          </Text>
        </Pressable>
      ))}
    </Screen>
  );
}

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: { textMuted: string; text: string; border: string };
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: space.md,
    gap: space.md,
  },
  rowLabel: { fontSize: font.sm, maxWidth: '40%' },
  rowValue: { fontSize: font.md, fontWeight: '700', flex: 1, textAlign: 'right' },
  rowCard: {
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
  },
  kind: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: { fontSize: font.md, fontWeight: '700' },
  meta: { fontSize: font.xs, marginTop: 4 },
});
