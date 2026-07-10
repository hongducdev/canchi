/**
 * Viewer summary for Ngày & Việc result screens.
 */

import { animalOfYear, canChiYear } from './canChi';
import { buildFengShuiProfile } from './fengShui';
import { solarToLunar, todaySolar } from './lunar';
import type { SessionPerson } from '../store/sessionPerson';
import { sessionPersonLabel } from '../store/sessionPerson';

export type ViewerSummary = {
  label: string;
  solarBirth: string;
  lunarBirth: string;
  canChi: string;
  animal: string;
  menh: string;
  tuoiAm: number;
};

/** Traditional VN lunar age: lunar year now − lunar birth year + 1. */
export function lunarAge(
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  asOf = todaySolar()
): number {
  const birthLunar = solarToLunar(birthDay, birthMonth, birthYear);
  const nowLunar = solarToLunar(asOf.day, asOf.month, asOf.year);
  return Math.max(1, nowLunar.year - birthLunar.year + 1);
}

export function buildViewerSummary(person: SessionPerson): ViewerSummary | null {
  if (person.birthDay == null || person.birthMonth == null) return null;

  const lunar = solarToLunar(person.birthDay, person.birthMonth, person.birthYear);
  const canChi = canChiYear(lunar.year);
  const fs = buildFengShuiProfile(lunar.year);
  const leap = lunar.leap ? ' (nhuận)' : '';

  return {
    label: sessionPersonLabel(person),
    solarBirth: `${person.birthDay}/${person.birthMonth}/${person.birthYear}`,
    lunarBirth: `${lunar.day}/${lunar.month}${leap}/${lunar.year}`,
    canChi,
    animal: animalOfYear(lunar.year),
    menh: fs.menhLabel,
    tuoiAm: lunarAge(person.birthDay, person.birthMonth, person.birthYear),
  };
}
