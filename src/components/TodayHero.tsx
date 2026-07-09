import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DayInfo } from '../lib/types';
import { formatLunarLong } from '../lib/dayInfo';
import { dateKey } from '../lib/lunar';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { Chip } from './Chip';
import { ZodiacIcon } from './ZodiacIcon';

type Props = {
  info: DayInfo;
};

export function TodayHero({ info }: Props) {
  const { colors, isDark } = useTheme();
  const key = dateKey(info.solar);

  const brand = isDark ? 'rgba(244,241,236,0.55)' : colors.textMuted;
  const live = isDark ? 'rgba(244,241,236,0.45)' : colors.textMuted;
  const weekday = isDark ? 'rgba(244,241,236,0.75)' : colors.textSecondary;
  const primary = isDark ? '#FAF8F5' : colors.text;
  const secondary = isDark ? 'rgba(244,241,236,0.65)' : colors.textSecondary;
  const divider = isDark ? 'rgba(255,255,255,0.10)' : colors.border;
  const festival = isDark ? '#C9A227' : colors.gold;

  return (
    <Link href={`/day/${key}`} asChild>
      <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
        <LinearGradient
          colors={colors.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.hero,
            !isDark && {
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.borderStrong,
            },
          ]}
        >
          <View style={styles.topRow}>
            <Text style={[styles.brand, { color: brand }]}>Lịch Âm</Text>
            <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.live, { color: live }]}>Hôm nay</Text>
            <View style={styles.topSpacer} />
            <ZodiacIcon chi={info.lore.diaChi} size={40} />
          </View>

          <Text style={[styles.weekday, { color: weekday }]}>{info.weekdayName}</Text>
          <Text style={[styles.solarDay, { color: primary }]}>{info.solar.day}</Text>
          <Text style={[styles.solarMonth, { color: secondary }]}>
            Tháng {info.solar.month}, {info.solar.year}
          </Text>

          <View style={[styles.divider, { backgroundColor: divider }]} />

          <Text style={[styles.lunar, { color: primary }]}>{formatLunarLong(info)}</Text>
          <View style={styles.chips}>
            <Chip label={`Ngày ${info.canChiDay}`} tone="accent" />
            <Chip label={`Con giáp ngày · ${info.lore.zodiacDay}`} tone="jade" />
            <Chip label={info.tietKhi} tone="gold" />
          </View>

          {info.festivals.length > 0 ? (
            <Text style={[styles.festival, { color: festival }]} numberOfLines={2}>
              {info.festivals.map((f) => f.name).join(' · ')}
            </Text>
          ) : null}

          <Text style={[styles.cta, { color: colors.accent }]}>Xem chi tiết →</Text>
        </LinearGradient>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: space.xxl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  topSpacer: {
    flex: 1,
  },
  brand: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginRight: space.sm,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  live: {
    fontSize: font.xs,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  weekday: {
    fontSize: font.md,
    fontWeight: '500',
  },
  solarDay: {
    fontSize: font.display,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 72,
  },
  solarMonth: {
    fontSize: font.lg,
    marginTop: -4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.lg,
  },
  lunar: {
    fontSize: font.md,
    fontWeight: '600',
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.md,
  },
  festival: {
    fontSize: font.sm,
    fontWeight: '600',
    marginTop: space.md,
  },
  cta: {
    marginTop: space.lg,
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
