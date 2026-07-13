import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { resolveQuote } from '../data/quotes';
import type { DayInfo } from '../lib/types';
import { formatSolarLong } from '../lib/dayInfo';
import { dateKey } from '../lib/lunar';
import { getWeatherPresentation, MET_NORWAY_ATTRIBUTION } from '../lib/weather';
import type { DeviceWeatherResult, WeatherVisualKind } from '../lib/weather';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { Chip } from './Chip';
import { ZodiacIcon } from './ZodiacIcon';
import { AppText } from './AppText';

type Props = {
  info: DayInfo;
  weatherState:
    | { status: 'loading' }
    | { status: 'ready'; data: DeviceWeatherResult }
    | { status: 'error' };
};

export function TodayHero({ info, weatherState }: Props) {
  const { colors, isDark } = useTheme();
  const key = dateKey(info.solar);
  const quote = resolveQuote(info);

  const live = isDark ? 'rgba(244,241,236,0.45)' : colors.textMuted;
  const weekday = isDark ? 'rgba(244,241,236,0.75)' : colors.textSecondary;
  const primary = isDark ? '#FAF8F5' : colors.text;
  const secondary = isDark ? 'rgba(244,241,236,0.65)' : colors.textSecondary;
  const divider = isDark ? 'rgba(255,255,255,0.10)' : colors.border;
  const festival = isDark ? '#C9A227' : colors.gold;
  const quoteColor = isDark ? 'rgba(244,241,236,0.78)' : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem chi tiết ${info.weekdayName}, ngày ${info.solar.day} tháng ${info.solar.month}`}
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
          <AppText style={[styles.weekday, { color: weekday }]}>{info.weekdayName}</AppText>
          <View style={styles.topSpacer} />
          <ZodiacIcon chi={info.lore.diaChi} size={40} />
        </View>

        <AppText style={[styles.solarDay, { color: primary }]}>{info.lunar.day}</AppText>
        <AppText style={[styles.solarMonth, { color: secondary }]}>
          {info.canChiMonth}{info.lunar.leap ? ' (nhuận)' : ''}, {info.canChiYear}
        </AppText>

        <WeatherSummary
          state={weatherState}
          primary={primary}
          secondary={secondary}
          muted={live}
          accent={colors.accent}
          accentSoft={colors.accentSoft}
        />

        <View style={[styles.divider, { backgroundColor: divider }]} />

        <AppText style={[styles.lunar, { color: primary }]}>{formatSolarLong(info.solar)}</AppText>
        <View style={styles.chips}>
          <Chip label={`Ngày ${info.canChiDay}`} tone="accent" />
          <Chip label={info.tietKhi} tone="gold" />
        </View>

        <AppText style={[styles.quote, { color: quoteColor }]} numberOfLines={2}>
          “{quote.text}”
        </AppText>

        {info.festivals.length > 0 ? (
          <AppText style={[styles.festival, { color: festival }]} numberOfLines={2}>
            {info.festivals.map((f) => f.name).join(' · ')}
          </AppText>
        ) : null}

        <View style={styles.ctaRow}>
          <AppText style={[styles.cta, { color: colors.accent }]}>Xem chi tiết</AppText>
          <Ionicons name="arrow-forward" size={16} color={colors.accent} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function WeatherSummary({
  state,
  primary,
  secondary,
  muted,
  accent,
  accentSoft,
}: {
  state: Props['weatherState'];
  primary: string;
  secondary: string;
  muted: string;
  accent: string;
  accentSoft: string;
}) {
  if (state.status === 'loading') {
    return (
      <View style={styles.weatherRow} accessibilityLabel="Đang tải thời tiết">
        <View style={[styles.weatherIcon, { backgroundColor: accentSoft }]} />
        <View style={styles.weatherCopy}>
          <View style={[styles.weatherSkeletonWide, { backgroundColor: accentSoft }]} />
          <View style={[styles.weatherSkeletonShort, { backgroundColor: accentSoft }]} />
        </View>
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={styles.weatherRow} accessibilityLabel="Không thể tải thời tiết">
        <View style={[styles.weatherIcon, { backgroundColor: accentSoft }]}>
          <Ionicons name="cloud-offline-outline" size={20} color={accent} />
        </View>
        <View style={styles.weatherCopy}>
          <AppText style={[styles.weatherDescription, { color: secondary }]}>
            Không thể tải thời tiết
          </AppText>
          <AppText style={[styles.weatherMeta, { color: muted }]}>Kiểm tra kết nối mạng</AppText>
        </View>
      </View>
    );
  }

  const current = state.data.forecast.current;
  const presentation = getWeatherPresentation(current.symbolCode);
  const staleLabel = state.data.forecast.isStale ? ', dữ liệu đã lưu' : '';

  return (
    <View
      style={styles.weatherRow}
      accessibilityLabel={`${Math.round(current.temperatureC)} độ C, ${presentation.label}, ${state.data.locationLabel}`}
    >
      <View style={[styles.weatherIcon, { backgroundColor: accentSoft }]}>
        <Ionicons name={weatherIconName(presentation.kind)} size={21} color={accent} />
      </View>
      <AppText style={[styles.weatherTemperature, { color: primary }]}>
        {Math.round(current.temperatureC)}°
      </AppText>
      <View style={styles.weatherCopy}>
        <AppText style={[styles.weatherDescription, { color: secondary }]} numberOfLines={1}>
          {presentation.label}
        </AppText>
        <AppText style={[styles.weatherMeta, { color: muted }]} numberOfLines={1}>
          {state.data.locationLabel}{staleLabel}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Nguồn thời tiết MET Norway, giấy phép CC BY 4.0"
        hitSlop={8}
        onPress={(event) => {
          event.stopPropagation();
          void Linking.openURL(MET_NORWAY_ATTRIBUTION.licenseUrl);
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}
      >
        <AppText style={[styles.weatherSource, { color: muted }]}>MET Norway</AppText>
        <AppText style={[styles.weatherLicense, { color: muted }]}>CC BY 4.0</AppText>
      </Pressable>
    </View>
  );
}

type WeatherIconName = React.ComponentProps<typeof Ionicons>['name'];

function weatherIconName(kind: WeatherVisualKind): WeatherIconName {
  if (kind === 'thunder') return 'thunderstorm-outline';
  if (kind === 'sleet' || kind === 'snow') return 'snow-outline';
  if (kind === 'rain') return 'rainy-outline';
  if (kind === 'fog') return 'cloud-outline';
  if (kind === 'cloudy') return 'cloudy-outline';
  if (kind === 'clear') return 'sunny-outline';
  return 'partly-sunny-outline';
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: space.xl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
  },
  topSpacer: {
    flex: 1,
  },
  weekday: {
    fontSize: font.md,
    fontWeight: '600',
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
  weatherRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space.md,
  },
  weatherIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherTemperature: {
    fontSize: font.xl,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginLeft: space.sm,
    minWidth: 42,
  },
  weatherCopy: {
    flex: 1,
    marginLeft: space.sm,
  },
  weatherDescription: {
    fontSize: font.sm,
    fontWeight: '700',
  },
  weatherMeta: {
    fontSize: font.xs,
    marginTop: 1,
  },
  weatherSource: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  weatherLicense: {
    fontSize: 9,
    textAlign: 'right',
    marginTop: 1,
  },
  weatherSkeletonWide: {
    width: 108,
    height: 10,
    borderRadius: radius.sm,
    opacity: 0.75,
  },
  weatherSkeletonShort: {
    width: 72,
    height: 8,
    borderRadius: radius.sm,
    opacity: 0.45,
    marginTop: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.md,
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
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: space.lg,
  },
});
