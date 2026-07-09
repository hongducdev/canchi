/**
 * Giờ Hoàng Đạo / Hắc Đạo (auspicious & inauspicious double-hours).
 * Depends on day Chi.
 */

import { canChiHour, CHI } from './canChi';
import type { HourSlot } from './types';

const HOUR_RANGES: { name: string; startHour: number; endHour: number }[] = [
  { name: 'Tý', startHour: 23, endHour: 1 },
  { name: 'Sửu', startHour: 1, endHour: 3 },
  { name: 'Dần', startHour: 3, endHour: 5 },
  { name: 'Mão', startHour: 5, endHour: 7 },
  { name: 'Thìn', startHour: 7, endHour: 9 },
  { name: 'Tỵ', startHour: 9, endHour: 11 },
  { name: 'Ngọ', startHour: 11, endHour: 13 },
  { name: 'Mùi', startHour: 13, endHour: 15 },
  { name: 'Thân', startHour: 15, endHour: 17 },
  { name: 'Dậu', startHour: 17, endHour: 19 },
  { name: 'Tuất', startHour: 19, endHour: 21 },
  { name: 'Hợi', startHour: 21, endHour: 23 },
];

/**
 * Hoàng đạo hours by day Chi index (Tý=0 … Hợi=11).
 * Each entry lists Chi names that are Hoàng đạo that day.
 */
const HOANG_DAO_BY_DAY_CHI: string[][] = [
  // Tý: Dần, Mão, Tỵ, Thân, Tuất, Hợi
  ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
  // Sửu: Dần, Mão, Ngọ, Mùi, Dậu, Tuất
  ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tuất'],
  // Dần: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
  ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  // Mão: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Thân', 'Dậu'],
  // Thìn: Dần, Mão, Ngọ, Mùi, Dậu, Tuất
  ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tuất'],
  // Tỵ: Dần, Mão, Ngọ, Mùi, Dậu, Tuất
  ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tuất'],
  // Ngọ: Dần, Mão, Tỵ, Thân, Tuất, Hợi
  ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
  // Mùi: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Thân', 'Dậu'],
  // Thân: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
  ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  // Dậu: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Thân', 'Dậu'],
  // Tuất: Dần, Mão, Ngọ, Mùi, Dậu, Tuất
  ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tuất'],
  // Hợi: Dần, Mão, Ngọ, Mùi, Dậu, Tuất
  ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tuất'],
];

function dayChiIndex(jd: number): number {
  // day chi = (jd + 1) % 12
  return (jd + 1) % 12;
}

export function getGioHoangDao(jd: number): { hoangDao: HourSlot[]; hacDao: HourSlot[] } {
  const chiIdx = dayChiIndex(jd);
  const hoangNames = new Set(HOANG_DAO_BY_DAY_CHI[chiIdx]);
  const hoangDao: HourSlot[] = [];
  const hacDao: HourSlot[] = [];

  HOUR_RANGES.forEach((range, i) => {
    const slot: HourSlot = {
      name: range.name,
      startHour: range.startHour,
      endHour: range.endHour,
      canChi: canChiHour(jd, i),
    };
    if (hoangNames.has(CHI[i])) {
      hoangDao.push(slot);
    } else {
      hacDao.push(slot);
    }
  });

  return { hoangDao, hacDao };
}

export function formatHourRange(start: number, end: number): string {
  const fmt = (h: number) => `${String(h).padStart(2, '0')}:00`;
  return `${fmt(start)} - ${fmt(end)}`;
}

/** Lục Diệu cycle starting at Thanh Long for Chi Tý in lunar months 1 & 7. */
const LUC_DIEU = [
  'Thanh Long',
  'Minh Đường',
  'Thiên Hình',
  'Chu Tước',
  'Kim Quỹ',
  'Kim Đường',
  'Bạch Hổ',
  'Ngọc Đường',
  'Thiên Lao',
  'Nguyên Vũ',
  'Tư Mệnh',
  'Câu Trần',
] as const;

const HOANG_DAO_STARS = new Set<string>([
  'Thanh Long',
  'Minh Đường',
  'Kim Quỹ',
  'Kim Đường',
  'Ngọc Đường',
  'Tư Mệnh',
]);

/**
 * Day Lục Diệu star from lunar month + day Chi.
 * Months 1/7 → Tý = Thanh Long; 2/8 → Dần; 3/9 → Thìn; …
 */
export function getNgayHoangDaoStar(
  jd: number,
  lunarMonth: number
): { name: string; isHoangDao: boolean } {
  const chiIdx = dayChiIndex(jd);
  const monthGroup = ((Math.max(1, Math.min(12, lunarMonth)) - 1) % 6) * 2;
  const starIdx = (chiIdx - monthGroup + 12) % 12;
  const name = LUC_DIEU[starIdx];
  return { name, isHoangDao: HOANG_DAO_STARS.has(name) };
}
