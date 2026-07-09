/**
 * Can Chi (Heavenly Stems & Earthly Branches) and related metadata.
 */

import { getJulianDay } from './lunar';
import type { SolarDate } from './types';

export const CAN = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
] as const;

export const CHI = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
] as const;

export const CHI_ANIMALS = [
  'Chuột',
  'Trâu',
  'Hổ',
  'Mèo',
  'Rồng',
  'Rắn',
  'Ngựa',
  'Dê',
  'Khỉ',
  'Gà',
  'Chó',
  'Heo',
] as const;

export const NGU_HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'] as const;

export const WEEKDAYS_VI = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
] as const;

export const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

export const MONTH_NAMES_VI = [
  '',
  'Tháng Giêng',
  'Tháng Hai',
  'Tháng Ba',
  'Tháng Tư',
  'Tháng Năm',
  'Tháng Sáu',
  'Tháng Bảy',
  'Tháng Tám',
  'Tháng Chín',
  'Tháng Mười',
  'Tháng Mười Một',
  'Tháng Chạp',
] as const;

/** Can Chi of lunar year (or solar year for display of that year's stem-branch). */
export function canChiYear(year: number): string {
  // Year Can: (year + 6) % 10, Chi: (year + 8) % 12 for lunar year numbering
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

export function animalOfYear(year: number): string {
  return CHI_ANIMALS[(year + 8) % 12];
}

/** Day Can Chi from Julian day number. */
export function canChiDay(jd: number): string {
  return `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}`;
}

/**
 * Month Can Chi depends on year Can and lunar month.
 * Index: yearCanIndex * 12 + lunarMonth mapping.
 */
export function canChiMonth(lunarMonth: number, lunarYear: number): string {
  // Standard formula: month stem from year stem
  const yearCanIndex = (lunarYear + 6) % 10;
  // First month (tháng Giêng) can for year can:
  // Giáp/Kỷ → Bính, Ất/Canh → Mậu, Bính/Tân → Canh, Đinh/Nhâm → Nhâm, Mậu/Quý → Giáp
  const monthCanBase = [2, 4, 6, 8, 0][yearCanIndex % 5];
  const canIndex = (monthCanBase + lunarMonth - 1) % 10;
  // Tháng 1 = Dần (2), tháng 2 = Mão (3), ...
  const chiIndex = (lunarMonth + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

/**
 * Hour Can Chi for a given double-hour (0=Tý 23-1, 1=Sửu 1-3, ...).
 * Day can determines hour can start.
 */
export function canChiHour(jd: number, hourSlot: number): string {
  const dayCan = (jd + 9) % 10;
  // Tý hour can for day can: Giáp/Kỷ→Giáp, Ất/Canh→Bính, Bính/Tân→Mậu, Đinh/Nhâm→Canh, Mậu/Quý→Nhâm
  const hourCanBase = [0, 2, 4, 6, 8][dayCan % 5];
  const canIndex = (hourCanBase + hourSlot) % 10;
  return `${CAN[canIndex]} ${CHI[hourSlot % 12]}`;
}

/** Double-hour slot from clock hour (0-23). Tý: 23-1 → 0 */
export function hourToSlot(hour: number): number {
  if (hour === 23) return 0;
  return Math.floor((hour + 1) / 2) % 12;
}

export function weekdayOf(solar: SolarDate): number {
  const jd = getJulianDay(solar.day, solar.month, solar.year);
  // JD 0 was Monday in some systems; standard: (jd + 1) % 7 with 0=Sun often
  // JavaScript Date is reliable for modern dates:
  return new Date(solar.year, solar.month - 1, solar.day).getDay();
}

/** Ngũ hành of a Can Chi pair (simplified by Can). */
export function nguHanhOfCan(can: string): string {
  const map: Record<string, string> = {
    Giáp: 'Mộc',
    Ất: 'Mộc',
    Bính: 'Hỏa',
    Đinh: 'Hỏa',
    Mậu: 'Thổ',
    Kỷ: 'Thổ',
    Canh: 'Kim',
    Tân: 'Kim',
    Nhâm: 'Thủy',
    Quý: 'Thủy',
  };
  return map[can] ?? '';
}

export function parseCanChi(canChi: string): { can: string; chi: string } {
  const parts = canChi.split(' ');
  return { can: parts[0] ?? '', chi: parts[1] ?? '' };
}
