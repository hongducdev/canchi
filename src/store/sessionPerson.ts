import { create } from 'zustand';
import type { FillContext } from '../lib/vanKhan';
import type { UserGender } from './userProfile';

export type SessionPerson = {
  /** Optional — temp entry may omit name. */
  fullName?: string;
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  gender?: UserGender;
  source: 'profile' | 'temp';
};

type SessionPersonState = {
  primary: SessionPerson | null;
  secondary: SessionPerson | null;
  /** How many upcoming days to list on result screens. */
  horizonDays: number;
  setSession: (
    primary: SessionPerson,
    secondary?: SessionPerson | null,
    horizonDays?: number
  ) => void;
  clearSession: () => void;
};

export const DEFAULT_HORIZON_DAYS = 30;
export const HORIZON_DAY_OPTIONS = [7, 14, 30, 60, 90] as const;

export const useSessionPersonStore = create<SessionPersonState>((set) => ({
  primary: null,
  secondary: null,
  horizonDays: DEFAULT_HORIZON_DAYS,
  setSession: (primary, secondary = null, horizonDays = DEFAULT_HORIZON_DAYS) =>
    set({ primary, secondary, horizonDays }),
  clearSession: () =>
    set({
      primary: null,
      secondary: null,
      horizonDays: DEFAULT_HORIZON_DAYS,
    }),
}));

export function sessionPersonToFillContext(
  person: SessionPerson | null | undefined
): FillContext {
  if (!person) return {};
  return {
    fullName: person.fullName?.trim() || undefined,
    birthYear: person.birthYear,
    birthMonth: person.birthMonth,
    birthDay: person.birthDay,
    gender: person.gender,
  };
}

export function hasSessionPrimary(
  primary: SessionPerson | null | undefined
): boolean {
  return Boolean(
    primary &&
      primary.birthYear >= 1800 &&
      primary.birthYear <= 2199 &&
      primary.birthMonth != null &&
      primary.birthDay != null
  );
}

export function sessionPersonLabel(person: SessionPerson): string {
  const name = person.fullName?.trim();
  if (name) return name;
  if (person.birthDay != null && person.birthMonth != null) {
    return `${person.birthDay}/${person.birthMonth}/${person.birthYear}`;
  }
  return `Năm ${person.birthYear}`;
}
