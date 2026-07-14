import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateDateDuration,
  formatCount,
  formatSolarDate,
} from '../lib/dateDuration';
import { dateKey, parseDateKey } from '../lib/lunar';

const STORAGE_KEY = 'anniversary-widget-configs-v1';

export type AnniversaryDisplayMode = 'days' | 'ymd';

export type AnniversaryWidgetConfig = {
  widgetId: number;
  title: string;
  startDateKey: string;
  displayMode: AnniversaryDisplayMode;
};

export type AnniversaryWidgetProps = {
  title: string;
  displayMode: AnniversaryDisplayMode;
  primaryValue: string;
  primaryUnit: string;
  secondaryValue: string;
  ymdValue: string;
  startLabel: string;
  openUri: string;
};

function defaultStart(now: Date): Date {
  const date = new Date(now);
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

export function createDefaultAnniversaryConfig(
  widgetId: number,
  now = new Date(),
): AnniversaryWidgetConfig {
  const start = defaultStart(now);
  return {
    widgetId,
    title: 'Ngày kỷ niệm',
    startDateKey: dateKey({
      day: start.getDate(),
      month: start.getMonth() + 1,
      year: start.getFullYear(),
    }),
    displayMode: 'days',
  };
}

async function readConfigs(): Promise<Record<string, AnniversaryWidgetConfig>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AnniversaryWidgetConfig>) : {};
  } catch {
    return {};
  }
}

export async function getAnniversaryWidgetConfig(
  widgetId: number,
): Promise<AnniversaryWidgetConfig | null> {
  const configs = await readConfigs();
  return configs[String(widgetId)] ?? null;
}

export async function saveAnniversaryWidgetConfig(
  config: AnniversaryWidgetConfig,
): Promise<void> {
  const configs = await readConfigs();
  configs[String(config.widgetId)] = config;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export async function deleteAnniversaryWidgetConfig(widgetId: number): Promise<void> {
  const configs = await readConfigs();
  delete configs[String(widgetId)];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function buildAnniversaryWidgetProps(
  config: AnniversaryWidgetConfig,
  now = new Date(),
): AnniversaryWidgetProps {
  const start = parseDateKey(config.startDateKey);
  const end = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
  const duration = calculateDateDuration(start, end);
  if (config.displayMode === 'ymd') {
    return {
      title: config.title,
      displayMode: config.displayMode,
      primaryValue: `${duration.years}`,
      primaryUnit: 'NĂM',
      secondaryValue: `${duration.remainingYearsMonths} tháng ${duration.remainingYearsDays} ngày`,
      ymdValue: `${duration.years} năm ${duration.remainingYearsMonths} tháng ${duration.remainingYearsDays} ngày`,
      startLabel: `Từ ${formatSolarDate(start)}`,
      openUri: `canchi://date-since?start=${config.startDateKey}`,
    };
  }
  return {
    title: config.title,
    displayMode: config.displayMode,
    primaryValue: formatCount(duration.totalDays),
    primaryUnit: 'NGÀY',
    secondaryValue: `${formatCount(duration.weeks)} tuần`,
    ymdValue: `${duration.years} năm ${duration.remainingYearsMonths} tháng ${duration.remainingYearsDays} ngày`,
    startLabel: `Từ ${formatSolarDate(start)}`,
    openUri: `canchi://date-since?start=${config.startDateKey}`,
  };
}
