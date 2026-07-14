import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../src/components/AppText';
import { Card } from '../src/components/Card';
import { PageHeader } from '../src/components/PageHeader';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/hooks/useTheme';
import {
  calculateDateDuration,
  formatCount,
  formatSolarDate,
} from '../src/lib/dateDuration';
import { dateKey, solarToLunar, todaySolar } from '../src/lib/lunar';
import type { SolarDate } from '../src/lib/types';
import { font, radius, space } from '../src/theme/spacing';

const MIN_DATE = new Date(1800, 0, 1);

function toDate(value: SolarDate): Date {
  return new Date(value.year, value.month - 1, value.day, 12, 0, 0, 0);
}

function toSolarDate(value: Date): SolarDate {
  return {
    day: value.getDate(),
    month: value.getMonth() + 1,
    year: value.getFullYear(),
  };
}

export default function DateSinceScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ start?: string }>();
  const today = useMemo(() => todaySolar(), []);
  const defaultStart = useMemo(() => {
    if (typeof params.start === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(params.start)) {
      const [year, month, day] = params.start.split('-').map(Number);
      const candidate = { day, month, year };
      const parsed = toDate(candidate);
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() + 1 === month &&
        parsed.getDate() === day &&
        parsed <= toDate(today)
      ) {
        return candidate;
      }
    }
    const fallback = new Date(today.year - 1, today.month - 1, today.day, 12);
    return toSolarDate(fallback);
  }, [params.start, today]);
  const [start, setStart] = useState<SolarDate>(defaultStart);
  const [pickerOpen, setPickerOpen] = useState(false);

  const duration = useMemo(() => calculateDateDuration(start, today), [start, today]);
  const lunar = useMemo(
    () => solarToLunar(start.day, start.month, start.year),
    [start],
  );
  const startText = formatSolarDate(start);
  const todayText = formatSolarDate(today);

  const onDateChange = (_event: DateTimePickerChangeEvent, value?: Date) => {
    if (Platform.OS === 'android') setPickerOpen(false);
    if (value) setStart(toSolarDate(value));
  };

  const rows = [
    ['Số ngày đã qua', `${formatCount(duration.totalDays)} ngày`],
    [
      'Quy đổi theo tuần',
      `${formatCount(duration.weeks)} tuần${duration.remainingWeekDays ? ` ${duration.remainingWeekDays} ngày` : ''}`,
    ],
    [
      'Quy đổi theo tháng',
      `${formatCount(duration.totalMonths)} tháng ${duration.remainingMonthDays} ngày`,
    ],
    [
      'Quy đổi theo năm',
      `${duration.years} năm ${duration.remainingYearsMonths} tháng ${duration.remainingYearsDays} ngày`,
    ],
    ['Tổng số giờ', `${formatCount(duration.totalHours)} giờ`],
    ['Tổng số phút', `${formatCount(duration.totalMinutes)} phút`],
  ] as const;

  return (
    <Screen>
      <PageHeader
        title="Đếm ngày từ mốc"
        subtitle="Tính khoảng thời gian từ một ngày đến hôm nay"
      />

      <AppText style={[styles.label, { color: colors.textMuted }]}>NGÀY BẮT ĐẦU</AppText>
      <Pressable
        onPress={() => setPickerOpen(true)}
        style={[
          styles.dateButton,
          { backgroundColor: colors.bgCard, borderColor: colors.borderStrong },
        ]}
      >
        <View>
          <AppText style={[styles.dateValue, { color: colors.text }]}>{startText}</AppText>
          <AppText style={[styles.dateHint, { color: colors.textMuted }]}>Chạm để chọn ngày</AppText>
        </View>
        <Ionicons name="calendar-outline" size={22} color={colors.accentText} />
      </Pressable>

      {pickerOpen ? (
        <DateTimePicker
          value={toDate(start)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={MIN_DATE}
          maximumDate={toDate(today)}
          onValueChange={onDateChange}
          onDismiss={() => setPickerOpen(false)}
        />
      ) : null}
      {Platform.OS === 'ios' && pickerOpen ? (
        <Pressable onPress={() => setPickerOpen(false)} style={styles.iosDone}>
          <AppText style={{ color: colors.accentText, fontWeight: '700' }}>Xong</AppText>
        </Pressable>
      ) : null}

      <Card style={styles.heroCard}>
        <AppText style={[styles.heroEyebrow, { color: colors.accentText }]}>ĐÃ TRÔI QUA</AppText>
        <AppText style={[styles.heroNumber, { color: colors.text }]}>
          {formatCount(duration.totalDays)}
        </AppText>
        <AppText style={[styles.heroUnit, { color: colors.textSecondary }]}>ngày</AppText>
        <AppText style={[styles.heroBody, { color: colors.textSecondary }]}>
          {'Từ ngày '}{startText} đến hôm nay ({todayText}) đã trôi qua{' '}
          {formatCount(duration.totalDays)} ngày, tức {formatCount(duration.weeks)} tuần.
        </AppText>
      </Card>

      <AppText style={[styles.summary, { color: colors.textSecondary }]}>
        {'Mốc '}{startText} rơi vào {duration.startWeekday}. Tính đến hôm nay {todayText}, đã
        trôi qua {formatCount(duration.totalDays)} ngày ({formatCount(duration.weeks)} tuần),
        tương đương {formatCount(duration.totalMonths)} tháng {duration.remainingMonthDays} ngày
        hoặc {duration.years} năm {duration.remainingYearsMonths} tháng{' '}
        {duration.remainingYearsDays} ngày.
      </AppText>

      <Pressable
        onPress={() => router.push(`/day/${dateKey(start)}`)}
        style={[
          styles.lunarLink,
          { backgroundColor: colors.accentSoft, borderColor: colors.accent },
        ]}
      >
        <View style={styles.lunarText}>
          <AppText style={[styles.lunarTitle, { color: colors.accentText }]}>
            {'Xem thông tin ngày âm của '}{startText}
          </AppText>
          <AppText style={[styles.lunarMeta, { color: colors.textSecondary }]}>
            {'Âm lịch '}{lunar.day}/{lunar.month}{lunar.leap ? ' nhuận' : ''} · mở chi tiết ngày
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.accentText} />
      </Pressable>

      <AppText style={[styles.sectionTitle, { color: colors.text }]}>
        {'Khoảng thời gian từ '}{startText} đến {todayText}
      </AppText>
      <Card padded={false} style={styles.detailsCard}>
        {rows.map(([label, value], index) => (
          <View
            key={label}
            style={[
              styles.detailRow,
              index < rows.length - 1 && { borderBottomColor: colors.border },
            ]}
          >
            <AppText style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</AppText>
            <AppText style={[styles.detailValue, { color: colors.text }]}>{value}</AppText>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginBottom: space.sm,
  },
  dateButton: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  dateValue: { fontSize: font.lg, fontWeight: '700' },
  dateHint: { fontSize: font.xs, marginTop: 3 },
  iosDone: { alignSelf: 'flex-end', padding: space.md },
  heroCard: { alignItems: 'center', marginBottom: space.lg, paddingVertical: space.xl },
  heroEyebrow: { fontSize: font.xs, fontWeight: '700', letterSpacing: 1.2 },
  heroNumber: { fontSize: font.display, fontWeight: '300', letterSpacing: -2 },
  heroUnit: { fontSize: font.md, fontWeight: '600', marginTop: -6 },
  heroBody: { fontSize: font.sm, lineHeight: 20, textAlign: 'center', marginTop: space.md },
  summary: { fontSize: font.md, lineHeight: 24, marginBottom: space.lg },
  lunarLink: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.xl,
  },
  lunarText: { flex: 1 },
  lunarTitle: { fontSize: font.sm, fontWeight: '700' },
  lunarMeta: { fontSize: font.xs, marginTop: 4 },
  sectionTitle: { fontSize: font.lg, fontWeight: '700', marginBottom: space.md },
  detailsCard: { marginBottom: space.xl, overflow: 'hidden' },
  detailRow: {
    minHeight: 56,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: space.md,
  },
  detailLabel: { flex: 1, fontSize: font.sm },
  detailValue: { fontSize: font.sm, fontWeight: '700', textAlign: 'right' },
});
