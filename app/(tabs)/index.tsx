import React, { useMemo } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { Card } from '../../src/components/Card';
import { FestivalRow } from '../../src/components/FestivalRow';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { TetCountdownCard } from '../../src/components/TetCountdownCard';
import { TodayHero } from '../../src/components/TodayHero';
import { ZodiacIcon } from '../../src/components/ZodiacIcon';
import { tetCountdown, upcomingFestivals } from '../../src/data/festivals';
import { buildDayInfo } from '../../src/lib/dayInfo';
import { todaySolar } from '../../src/lib/lunar';
import { useTheme } from '../../src/hooks/useTheme';
import { font, space } from '../../src/theme/spacing';
import { HourStrip } from '../../src/components/HourStrip';
import { AppText } from '../../src/components/AppText';

export default function HomeScreen() {
  const { colors } = useTheme();
  const today = todaySolar();
  const info = useMemo(() => buildDayInfo(today), [today.day, today.month, today.year]);
  const upcoming = useMemo(() => upcomingFestivals(today, 5), [today.day, today.month, today.year]);
  const tet = useMemo(() => tetCountdown(today), [today.day, today.month, today.year]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.greeting, { color: colors.textMuted }]}>
          Lịch Việt · Offline
        </AppText>
        <AppText style={[styles.title, { color: colors.text }]}>Hôm nay</AppText>
      </View>

      <TodayHero info={info} />
      <View style={{ height: space.md }} />
      <TetCountdownCard
        days={tet.days}
        dateLabel={`${tet.solar.day}/${tet.solar.month}/${tet.solar.year}`}
      />

      <SectionHeader title="Can Chi" subtitle="Năm · Tháng · Ngày · Giờ" />
      <Card>
        <View style={styles.yearRow}>
          <ZodiacIcon chi={info.lore.diaChi} size={44} />
          <View style={styles.yearCopy}>
            <AppText style={[styles.yearLabel, { color: colors.textMuted }]}>Địa Chi ngày</AppText>
            <AppText style={[styles.yearValue, { color: colors.text }]}>
              {info.lore.diaChi} · {info.canChiDay}
            </AppText>
            <AppText style={[styles.yearHint, { color: colors.textMuted }]}>
              Năm {info.canChiYear}
            </AppText>
          </View>
        </View>
        <View style={[styles.sep, { backgroundColor: colors.border }]} />
        <View style={styles.metaGrid}>
          <Meta label="Năm" value={info.canChiYear} colors={colors} />
          <Meta label="Tháng" value={info.canChiMonth} colors={colors} />
          <Meta label="Ngày" value={info.canChiDay} colors={colors} />
          <Meta label="Giờ" value={info.canChiHour} colors={colors} />
        </View>
        <View style={[styles.sep, { backgroundColor: colors.border }]} />
        <AppText style={[styles.tiet, { color: colors.textSecondary }]}>
          Tiết khí: <AppText style={{ color: colors.gold, fontWeight: '700' }}>{info.tietKhi}</AppText>
          {' · '}
          Trăng: <AppText style={{ color: colors.text, fontWeight: '700' }}>{info.moon.phaseName}</AppText>
        </AppText>
      </Card>

      <SectionHeader title="Giờ Hoàng Đạo" subtitle="Giờ tốt trong ngày" />
      <HourStrip hours={info.gioHoangDao} tone="hoang" />

      <SectionHeader title="Sắp tới" subtitle="Lễ hội & ngày lễ" />
      {upcoming.map(({ festival, solar, lunar }) => (
        <FestivalRow
          key={`${festival.id}-${solar.year}-${solar.month}-${solar.day}`}
          festival={festival}
          solar={solar}
          lunar={lunar}
        />
      ))}
    </Screen>
  );
}

function Meta({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: { textMuted: string; text: string };
}) {
  return (
    <View style={styles.metaItem}>
      <AppText style={[styles.metaLabel, { color: colors.textMuted }]}>{label}</AppText>
      <AppText style={[styles.metaValue, { color: colors.text }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: space.sm,
    marginBottom: space.xl,
  },
  greeting: {
    fontSize: font.sm,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.sm,
  },
  yearCopy: {
    flex: 1,
  },
  yearLabel: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  yearValue: {
    fontSize: font.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  yearHint: {
    fontSize: font.sm,
    marginTop: 2,
  },
  metaItem: {
    width: '50%',
    paddingVertical: space.sm,
  },
  metaLabel: {
    fontSize: font.xs,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: font.md,
    fontWeight: '700',
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.md,
  },
  tiet: {
    fontSize: font.sm,
  },
});
