/**
 * Traditional Vietnamese memorial / life-ceremony date calculators.
 * Offsets are solar days from a death or birth solar date.
 */

import { addDays, dateKey, solarToLunar } from './lunar';
import type { LunarDate, SolarDate } from './types';

export type MemorialKind =
  | 'full-month' // Đầy tháng (1 month after birth)
  | 'first-birthday' // Thôi nôi (~1 year)
  | 'day-49' // 49 ngày
  | 'day-100' // 100 ngày
  | 'first-death-anniversary' // Giỗ đầu
  | 'final-mourning' // Tiểu tường / hết tang (~2 years folk approx)
  | 'annual-death-anniversary'; // Giỗ hàng năm

export const MEMORIAL_LABEL: Record<MemorialKind, string> = {
  'full-month': 'Đầy tháng',
  'first-birthday': 'Thôi nôi',
  'day-49': '49 ngày',
  'day-100': '100 ngày',
  'first-death-anniversary': 'Giỗ đầu',
  'final-mourning': 'Hết tang (≈2 năm)',
  'annual-death-anniversary': 'Giỗ hàng năm',
};

const OFFSETS: Record<MemorialKind, number> = {
  'full-month': 30,
  'first-birthday': 365,
  'day-49': 49,
  'day-100': 100,
  'first-death-anniversary': 365,
  'final-mourning': 730,
  'annual-death-anniversary': 365,
};

export type MemorialResult = {
  kind: MemorialKind;
  label: string;
  solar: SolarDate;
  lunar: LunarDate;
  dateKey: string;
  offsetDays: number;
};

export function calculateMemorial(
  kind: MemorialKind,
  from: SolarDate
): MemorialResult {
  const offsetDays = OFFSETS[kind];
  const solar = addDays(from, offsetDays);
  const lunar = solarToLunar(solar.day, solar.month, solar.year);
  return {
    kind,
    label: MEMORIAL_LABEL[kind],
    solar,
    lunar,
    dateKey: dateKey(solar),
    offsetDays,
  };
}

export function calculateAllMemorials(
  from: SolarDate,
  kinds: MemorialKind[]
): MemorialResult[] {
  return kinds.map((k) => calculateMemorial(k, from));
}

export const BIRTH_MEMORIALS: MemorialKind[] = ['full-month', 'first-birthday'];
export const DEATH_MEMORIALS: MemorialKind[] = [
  'day-49',
  'day-100',
  'first-death-anniversary',
  'final-mourning',
  'annual-death-anniversary',
];
