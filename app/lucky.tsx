import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { useTheme } from '../src/hooks/useTheme';
import { dateKey } from '../src/lib/lunar';
import {
  findLuckyDays,
  LUCKY_ACTIVITY_LABEL,
  type LuckyActivity,
} from '../src/lib/luckyDay';
import { font, radius, space } from '../src/theme/spacing';

const ACTIVITIES = Object.keys(LUCKY_ACTIVITY_LABEL) as LuckyActivity[];

export default function LuckyDayScreen() {
  const { colors } = useTheme();
  const [activity, setActivity] = useState<LuckyActivity>('wedding');
  const results = useMemo(() => findLuckyDays(activity), [activity]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ngày tốt</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Chọn việc · xem ngày phù hợp (60 ngày tới)
        </Text>
      </View>

      <View style={styles.chips}>
        {ACTIVITIES.map((a) => {
          const active = activity === a;
          return (
            <Pressable
              key={a}
              onPress={() => setActivity(a)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? colors.accentText : colors.textSecondary },
                ]}
              >
                {LUCKY_ACTIVITY_LABEL[a]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader
        title={LUCKY_ACTIVITY_LABEL[activity]}
        subtitle={`${results.length} ngày gợi ý`}
      />

      {results.map((r) => (
        <Pressable
          key={dateKey(r.solar)}
          onPress={() => router.push(`/day/${dateKey(r.solar)}`)}
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.borderStrong,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <View style={styles.scoreCol}>
            <Text style={[styles.score, { color: colors.text }]}>{r.score}</Text>
            <Text style={[styles.scoreUnit, { color: colors.textMuted }]}>điểm</Text>
          </View>
          <View style={styles.body}>
            <Text style={[styles.date, { color: colors.text }]}>
              {r.solar.day}/{r.solar.month}/{r.solar.year}
            </Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {r.info.canChiDay} · Trực {r.info.lore.truc} · {r.info.moon.phaseName}
            </Text>
            <Text style={[styles.reasons, { color: colors.textSecondary }]} numberOfLines={2}>
              {r.reasons.join(' · ')}
            </Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginBottom: space.md,
  },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: font.xs, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
    gap: space.lg,
  },
  scoreCol: { alignItems: 'center', minWidth: 48 },
  score: {
    fontSize: font.xxl,
    fontWeight: '200',
    letterSpacing: -1,
    lineHeight: 32,
  },
  scoreUnit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  body: { flex: 1 },
  date: { fontSize: font.lg, fontWeight: '700', letterSpacing: -0.3 },
  meta: { fontSize: font.xs, marginTop: 4 },
  reasons: { fontSize: font.sm, marginTop: 6, lineHeight: 18 },
});
