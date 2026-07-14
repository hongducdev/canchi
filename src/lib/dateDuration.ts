import { getJulianDay } from './lunar';
import type { SolarDate } from './types';

const WEEKDAY_NAMES = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
] as const;

export type DateDuration = {
  totalDays: number;
  weeks: number;
  remainingWeekDays: number;
  totalMonths: number;
  remainingMonthDays: number;
  years: number;
  remainingYearsMonths: number;
  remainingYearsDays: number;
  totalHours: number;
  totalMinutes: number;
  startWeekday: string;
};

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function addMonthsClamped(date: SolarDate, months: number): SolarDate {
  const monthIndex = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

export function compareSolarDates(a: SolarDate, b: SolarDate): number {
  return getJulianDay(a.day, a.month, a.year) - getJulianDay(b.day, b.month, b.year);
}

export function calculateDateDuration(start: SolarDate, end: SolarDate): DateDuration {
  const totalDays = compareSolarDates(end, start);
  if (totalDays < 0) {
    throw new Error('Ngày bắt đầu phải trước hoặc trùng ngày kết thúc.');
  }

  let totalMonths = (end.year - start.year) * 12 + end.month - start.month;
  let monthAnchor = addMonthsClamped(start, totalMonths);
  if (compareSolarDates(monthAnchor, end) > 0) {
    totalMonths -= 1;
    monthAnchor = addMonthsClamped(start, totalMonths);
  }
  const remainingMonthDays = compareSolarDates(end, monthAnchor);

  const years = Math.floor(totalMonths / 12);
  const remainingYearsMonths = totalMonths % 12;

  return {
    totalDays,
    weeks: Math.floor(totalDays / 7),
    remainingWeekDays: totalDays % 7,
    totalMonths,
    remainingMonthDays,
    years,
    remainingYearsMonths,
    remainingYearsDays: remainingMonthDays,
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 24 * 60,
    startWeekday: WEEKDAY_NAMES[new Date(start.year, start.month - 1, start.day).getDay()],
  };
}

export function formatSolarDate(date: SolarDate): string {
  return `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
