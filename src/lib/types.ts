/**
 * Shared domain types for Lịch Âm.
 */

import type { DayLore } from './dayLore';
import type { MoonInfo } from './moon';

/** Solar (Gregorian) date parts */
export type SolarDate = {
  day: number;
  month: number;
  year: number;
};

/** Lunar date parts */
export type LunarDate = {
  day: number;
  month: number;
  year: number;
  leap: boolean;
};

/** Full day information for UI */
export type DayInfo = {
  solar: SolarDate;
  lunar: LunarDate;
  weekday: number; // 0 = Sunday
  weekdayName: string;
  canChiYear: string;
  canChiMonth: string;
  canChiDay: string;
  canChiHour: string;
  tietKhi: string;
  gioHoangDao: HourSlot[];
  gioHacDao: HourSlot[];
  festivals: Festival[];
  isToday: boolean;
  jd: number;
  lore: DayLore;
  moon: MoonInfo;
};

export type HourSlot = {
  name: string;
  startHour: number;
  endHour: number;
  canChi: string;
};

export type Festival = {
  id: string;
  name: string;
  description?: string;
  /** lunar day/month match; year optional */
  lunarDay?: number;
  lunarMonth?: number;
  /** solar day/month match */
  solarDay?: number;
  solarMonth?: number;
  /** if true, only non-leap lunar month */
  ignoreLeap?: boolean;
  category: 'tet' | 'le' | 'ram' | 'quoc-gia' | 'khac';
  color?: string;
};

export type DayNote = {
  id: string;
  dateKey: string; // YYYY-MM-DD solar
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type PersonalEventKind =
  | 'lunar-birthday'
  | 'solar-birthday'
  | 'wedding'
  | 'death-anniversary'
  | 'reminder'
  | 'note'
  | 'custom';

export type PersonalEvent = {
  id: string;
  title: string;
  note?: string;
  kind: PersonalEventKind;
  /** Solar anchor when calendar === 'solar' */
  solarDay?: number;
  solarMonth?: number;
  solarYear?: number;
  /** Lunar anchor when calendar === 'lunar' */
  lunarDay?: number;
  lunarMonth?: number;
  lunarLeap?: boolean;
  calendar: 'solar' | 'lunar';
  recurring: boolean;
  createdAt: number;
  updatedAt: number;
};

export type ThemeMode = 'system' | 'light' | 'dark';

export type AppSettings = {
  themeMode: ThemeMode;
  weekStartsOn: 0 | 1; // 0 Sunday, 1 Monday
  showLunarInGrid: boolean;
  showFestivals: boolean;
  haptics: boolean;
};

export type FamilyRelation =
  | 'self'
  | 'spouse'
  | 'parent'
  | 'child'
  | 'sibling'
  | 'grandparent'
  | 'other';

export type FamilyMember = {
  id: string;
  name: string;
  relation: FamilyRelation;
  /** Solar birth year for feng shui / zodiac (optional) */
  birthYear?: number;
  solarBirthdayDay?: number;
  solarBirthdayMonth?: number;
  lunarBirthdayDay?: number;
  lunarBirthdayMonth?: number;
  note?: string;
  createdAt: number;
  updatedAt: number;
};
