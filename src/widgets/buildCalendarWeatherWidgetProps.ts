import { buildDayInfo, formatLunarShort } from '../lib/dayInfo';
import { dateKey } from '../lib/lunar';
import type { SolarDate } from '../lib/types';
import { getWeatherPresentation, getWidgetWeather } from '../lib/weather';
import type { CalendarWeatherWidgetProps } from './types';

export async function buildCalendarWeatherWidgetProps(
  now = new Date(),
): Promise<CalendarWeatherWidgetProps> {
  const today: SolarDate = {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
  const info = buildDayInfo(today, now);
  const calendar = {
    monthLabel: `Tháng ${today.month}, ${today.year}`,
    day: today.day,
    weekdayName: info.weekdayName,
    lunarShort: `${formatLunarShort(info)} ÂL`,
    dateKey: dateKey(today),
  };

  try {
    const result = await getWidgetWeather();
    const current = result.forecast.current;
    const presentation = getWeatherPresentation(current.symbolCode);
    return {
      ...calendar,
      temperatureC: current.temperatureC,
      humidityPercent: current.humidityPercent ?? null,
      weatherLabel: presentation.label,
      weatherKind: presentation.kind,
      locationLabel: result.locationLabel,
    };
  } catch {
    return {
      ...calendar,
      temperatureC: null,
      humidityPercent: null,
      weatherLabel: 'Chưa có dữ liệu',
      weatherKind: 'unknown',
      locationLabel: 'Hà Nội, Việt Nam',
    };
  }
}
