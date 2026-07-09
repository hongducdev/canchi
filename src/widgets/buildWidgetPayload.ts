/**
 * Build serializable home-widget props from offline day/month data.
 * Week starts Monday (T2) — ignores app Settings in phase 1.
 */

import { resolveQuote } from '../data/quotes';
import { buildDayInfo, formatLunarShort } from '../lib/dayInfo';
import {
  dateKey,
  daysInSolarMonth,
  firstWeekdayOfMonth,
  sameSolar,
  solarToLunar,
} from '../lib/lunar';
import type { SolarDate } from '../lib/types';
import type {
  ComboWidgetProps,
  DateMinimalWidgetProps,
  DayLoreWidgetProps,
  MonthSmallWidgetProps,
  WidgetMonthCell,
  WidgetPayload,
} from './types';

const WEEKDAY_LABELS_MON = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

function nextLocalMidnight(from: Date): Date {
  const d = new Date(from);
  d.setHours(24, 0, 0, 0);
  return d;
}

function buildMonthCells(year: number, month: number, today: SolarDate): WidgetMonthCell[] {
  const dim = daysInSolarMonth(year, month);
  // firstWeekdayOfMonth: 0=Sun … 6=Sat → Monday-first index
  let first = firstWeekdayOfMonth(year, month);
  first = (first + 6) % 7;

  const empty: WidgetMonthCell = {
    day: null,
    lunarLabel: null,
    isToday: false,
    isWeekend: false,
  };
  const cells: WidgetMonthCell[] = [];
  for (let i = 0; i < first; i++) {
    cells.push({ ...empty });
  }
  for (let day = 1; day <= dim; day++) {
    const solar: SolarDate = { day, month, year };
    const lunar = solarToLunar(day, month, year);
    const col = cells.length % 7;
    const leap = lunar.leap ? 'N' : '';
    const lunarLabel =
      lunar.day === 1 || lunar.day === 15
        ? `${lunar.day}/${lunar.month}${leap}`
        : String(lunar.day);
    cells.push({
      day,
      lunarLabel,
      isToday: sameSolar(solar, today),
      isWeekend: col === 5 || col === 6,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ ...empty });
  }
  return cells;
}

export function buildWidgetPayload(now = new Date()): WidgetPayload {
  const today: SolarDate = {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
  const info = buildDayInfo(today, now);
  const quote = resolveQuote(info);
  const lunarShort = `${formatLunarShort(info)} ÂL`;
  const cells = buildMonthCells(today.year, today.month, today);
  const weekdayLabels = [...WEEKDAY_LABELS_MON];

  const dayLore: DayLoreWidgetProps = {
    headerDate: `${info.weekdayName}, ${info.solar.day}/${info.solar.month}/${info.solar.year}`,
    lunarShort,
    bodyText: quote.text,
    footerText:
      quote.kind === 'festival'
        ? `Ngày ${info.canChiDay} · ${info.tietKhi}`
        : info.festivals.length > 0
          ? info.festivals.map((f) => f.name).join(' · ')
          : `Ngày ${info.canChiDay} · ${info.tietKhi}`,
    dateKey: dateKey(today),
  };

  const monthSmall: MonthSmallWidgetProps = {
    title: `Tháng ${today.month} ${today.year}`,
    weekdayLabels,
    cells,
  };

  const dateMinimal: DateMinimalWidgetProps = {
    monthLabel: `THÁNG ${today.month}`,
    day: today.day,
    lunarShort,
    dateKey: dateKey(today),
  };

  const combo: ComboWidgetProps = {
    monthLabel: `Tháng ${today.month}`,
    day: today.day,
    weekdayName: info.weekdayName,
    lunarShort,
    weekdayLabels,
    cells,
  };

  return {
    dayLore,
    monthSmall,
    dateMinimal,
    combo,
    nextMidnight: nextLocalMidnight(now),
  };
}
