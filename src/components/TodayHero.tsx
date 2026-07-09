import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { resolveQuote } from '../data/quotes';
import type { DayInfo } from '../lib/types';
import { formatLunarLong } from '../lib/dayInfo';
import { dateKey } from '../lib/lunar';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { Chip } from './Chip';
import { ZodiacIcon } from './ZodiacIcon';
import { AppText } from './AppText';

type Props = {
  info: DayInfo;
};

export function TodayHero({ info }: Props) {
  const { colors, isDark } = useTheme();
  const key = dateKey(info.solar);
  const quote = resolveQuote(info);

  const brand = isDark ? 'rgba(244,241,236,0.55)' : colors.textMuted;
  const live = isDark ? 'rgba(244,241,236,0.45)' : colors.textMuted;
  const weekday = isDark ? 'rgba(244,241,236,0.75)' : colors.textSecondary;
  const primary = isDark ? '#FAF8F5' : colors.text;
  const secondary = isDark ? 'rgba(244,241,236,0.65)' : colors.textSecondary;
  const divider = isDark ? 'rgba(255,255,255,0.10)' : colors.border;
  const festival = isDark ? '#C9A227' : colors.gold;
  const quoteColor = isDark ? 'rgba(244,241,236,0.78)' : colors.textSecondary;

  return (
    <Pressable
      onPress={() => router.push(`/day/${key}`)}
      style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
    >
      <LinearGradient
        colors={colors.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.flatten([
          styles.hero,
          !isDark && {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.borderStrong,
          },
        ])}
      >
        <View style={styles.topRow}>
          <AppText style={[styles.brand, { color: brand }]}>Lịch Âm</AppText>
          <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
          <AppText style={[styles.live, { color: live }]}>Hôm nay</AppText>
          <View style={styles.topSpacer} />
          <ZodiacIcon chi={info.lore.diaChi} size={40} />
        </View>

        <AppText style={[styles.weekday, { color: weekday }]}>{info.weekdayName}</AppText>
        <AppText style={[styles.solarDay, { color: primary }]}>{info.solar.day}</AppText>
        <AppText style={[styles.solarMonth, { color: secondary }]}>
          Tháng {info.solar.month}, {info.solar.year}
        </AppText>

        <View style={[styles.divider, { backgroundColor: divider }]} />

        <AppText style={[styles.lunar, { color: primary }]}>{formatLunarLong(info)}</AppText>
        <View style={styles.chips}>
          <Chip label={`Ngày ${info.canChiDay}`} tone="accent" />
          <Chip label={`Con giáp ngày · ${info.lore.zodiacDay}`} tone="jade" />
          <Chip label={info.tietKhi} tone="gold" />
        </View>

        <AppText style={[styles.quote, { color: quoteColor }]} numberOfLines={3}>
          “{quote.text}”
        </AppText>

        {info.festivals.length > 0 ? (
          <AppText style={[styles.festival, { color: festival }]} numberOfLines={2}>
            {info.festivals.map((f) => f.name).join(' · ')}
          </AppText>
        ) : null}

        <AppText style={[styles.cta, { color: colors.accent }]}>Xem chi tiết →</AppText>
      </LinearGradient>
    </Pressable>
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
  quote: {
    fontSize: font.sm,
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 20,
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
