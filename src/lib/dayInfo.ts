/**
 * Aggregate full day information for UI (offline).
 */

import {
  animalOfYear,
  canChiDay,
  canChiHour,
  canChiMonth,
  canChiYear,
  hourToSlot,
  MONTH_NAMES_VI,
  WEEKDAYS_VI,
  weekdayOf,
} from './canChi';
import { getFestivalsForDay } from '../data/festivals';
import { buildDayLore } from './dayLore';
import { getGioHoangDao } from './gioHoangDao';
import {
  dateKey,
  getJulianDay,
  sameSolar,
  solarToLunar,
  todaySolar,
} from './lunar';
import { getMoonInfo } from './moon';
import { getTietKhi } from './tietKhi';
import type { DayInfo, SolarDate } from './types';

export function buildDayInfo(solar: SolarDate, now = new Date()): DayInfo {
  const lunar = solarToLunar(solar.day, solar.month, solar.year);
  const jd = getJulianDay(solar.day, solar.month, solar.year);
  const weekday = weekdayOf(solar);
  const { hoangDao, hacDao } = getGioHoangDao(jd);
  const hourSlot = hourToSlot(now.getHours());
  const yearCC = canChiYear(lunar.year);
  const dayCC = canChiDay(jd);

  return {
    solar,
    lunar,
    weekday,
    weekdayName: WEEKDAYS_VI[weekday],
    canChiYear: yearCC,
    canChiMonth: canChiMonth(lunar.month, lunar.year),
    canChiDay: dayCC,
    canChiHour: canChiHour(jd, hourSlot),
    tietKhi: getTietKhi(solar.day, solar.month, solar.year),
    gioHoangDao: hoangDao,
    gioHacDao: hacDao,
    festivals: getFestivalsForDay(solar, lunar),
    isToday: sameSolar(solar, todaySolar()),
    jd,
    lore: buildDayLore(
      jd,
      dayCC,
      yearCC,
      lunar.month,
      hoangDao.map((h) => h.name)
    ),
    moon: getMoonInfo(lunar),
  };
}

export function formatSolarLong(d: SolarDate): string {
  return `Ngày ${d.day} tháng ${d.month} năm ${d.year}`;
}

export function formatLunarLong(info: DayInfo): string {
  const leap = info.lunar.leap ? ' (nhuận)' : '';
  return `Ngày ${info.lunar.day} tháng ${info.lunar.month}${leap} năm ${info.lunar.year}`;
}

export function formatLunarShort(info: DayInfo): string {
  const leap = info.lunar.leap ? 'N' : '';
  return `${info.lunar.day}/${info.lunar.month}${leap}`;
}

export function yearAnimalLabel(lunarYear: number): string {
  return `Năm ${canChiYear(lunarYear)} (${animalOfYear(lunarYear)})`;
}

export function solarMonthTitle(year: number, month: number): string {
  return `Tháng ${month}/${year}`;
}

export { dateKey };
