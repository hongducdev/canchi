/**
 * Moon phase helpers from lunar day-of-month (offline approximation).
 */

import type { LunarDate } from './types';

export type MoonPhaseId =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export type MoonInfo = {
  phaseId: MoonPhaseId;
  phaseName: string;
  illumination: number; // 0–1
  lunarDay: number;
  isNewMoon: boolean;
  isFullMoon: boolean;
  cycleLabel: string;
  daysToNewMoon: number;
  daysToFullMoon: number;
};

const PHASE_NAMES: Record<MoonPhaseId, string> = {
  new: 'Trăng mới',
  'waxing-crescent': 'Trăng lưỡi liềm đầu',
  'first-quarter': 'Thượng huyền',
  'waxing-gibbous': 'Trăng khuyết đầu',
  full: 'Trăng tròn',
  'waning-gibbous': 'Trăng khuyết cuối',
  'last-quarter': 'Hạ huyền',
  'waning-crescent': 'Trăng lưỡi liềm cuối',
};

function phaseFromDay(day: number): MoonPhaseId {
  if (day <= 1) return 'new';
  if (day <= 6) return 'waxing-crescent';
  if (day <= 8) return 'first-quarter';
  if (day <= 13) return 'waxing-gibbous';
  if (day <= 16) return 'full';
  if (day <= 21) return 'waning-gibbous';
  if (day <= 23) return 'last-quarter';
  return 'waning-crescent';
}

/** Approximate illumination from lunar day (1–30). */
function illuminationFromDay(day: number): number {
  if (day <= 15) return Math.min(1, (day - 1) / 14);
  return Math.max(0, (30 - day) / 14);
}

export function getMoonInfo(lunar: LunarDate, monthLength = 30): MoonInfo {
  const day = Math.max(1, Math.min(lunar.day, monthLength));
  const phaseId = phaseFromDay(day);
  const daysToFullMoon = day <= 15 ? 15 - day : monthLength - day + 15;
  const daysToNewMoon = day === 1 ? 0 : monthLength - day + 1;

  return {
    phaseId,
    phaseName: PHASE_NAMES[phaseId],
    illumination: Math.round(illuminationFromDay(day) * 100) / 100,
    lunarDay: day,
    isNewMoon: day === 1,
    isFullMoon: day === 15 || day === 16,
    cycleLabel: `Ngày ${day}/${monthLength} chu kỳ trăng`,
    daysToNewMoon,
    daysToFullMoon,
  };
}
