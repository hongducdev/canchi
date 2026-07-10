/**
 * Marriage-age taboos: Kim Lâu, Hoàng Ốc, Tam Tai (cultural reference).
 */

import { canChiYear, CHI, parseCanChi } from './canChi';
import { solarToLunar, todaySolar } from './lunar';
import type { SolarDate } from './types';
import type { SessionPerson } from '../store/sessionPerson';
import { sessionPersonLabel } from '../store/sessionPerson';

export type KimLauKind = 'than' | 'the' | 'tu' | 'suc';

export type KimLauResult = {
  hit: boolean;
  remainder: number;
  kind?: KimLauKind;
  label: string;
  detail: string;
};

export type HoangOcResult = {
  hit: boolean;
  palace: string;
  label: string;
  detail: string;
};

export type TamTaiResult = {
  hit: boolean;
  birthChi: string;
  yearChi: string;
  label: string;
  detail: string;
};

export type PersonMarriageAgeReport = {
  role: string;
  personLabel: string;
  tuoiAm: number;
  yearCanChi: string;
  kimLau: KimLauResult;
  hoangOc: HoangOcResult;
  tamTai: TamTaiResult;
  anyHit: boolean;
};

export type WeddingAgeReport = {
  yearLabel: string;
  lunarYear: number;
  groom: PersonMarriageAgeReport;
  bride: PersonMarriageAgeReport;
  anyHit: boolean;
};

const KIM_LAU_BY_REM: Partial<
  Record<number, { kind: KimLauKind; name: string; meaning: string }>
> = {
  1: { kind: 'than', name: 'Kim Lâu Thân', meaning: 'Ảnh hưởng bản thân' },
  3: { kind: 'the', name: 'Kim Lâu Thê', meaning: 'Ảnh hưởng vợ/chồng' },
  6: { kind: 'tu', name: 'Kim Lâu Tử', meaning: 'Ảnh hưởng con cái' },
  8: { kind: 'suc', name: 'Kim Lâu Lục Súc', meaning: 'Ảnh hưởng tài sản / kinh tế' },
};

const HOANG_OC_PALACES = [
  { name: 'Nhất Cát', bad: false, meaning: 'An lành, cát lợi' },
  { name: 'Nhì Nghi', bad: false, meaning: 'Hòa hợp, thuận' },
  { name: 'Tam Địa Sát', bad: true, meaning: 'Địa sát — nên tránh việc lớn' },
  { name: 'Tứ Tấn Tài', bad: false, meaning: 'Tấn tài, hanh thông' },
  { name: 'Ngũ Thọ Tử', bad: true, meaning: 'Thọ tử — đại kỵ' },
  { name: 'Lục Hoang Ốc', bad: true, meaning: 'Hoang ốc — đại kỵ' },
] as const;

/** Birth chi → year chi that are Tam Tai. */
const TAM_TAI_YEARS: Record<(typeof CHI)[number], readonly (typeof CHI)[number][]> = {
  Tý: ['Dần', 'Mão', 'Thìn'],
  Thìn: ['Dần', 'Mão', 'Thìn'],
  Thân: ['Dần', 'Mão', 'Thìn'],
  Mão: ['Tỵ', 'Ngọ', 'Mùi'],
  Mùi: ['Tỵ', 'Ngọ', 'Mùi'],
  Hợi: ['Tỵ', 'Ngọ', 'Mùi'],
  Dần: ['Thân', 'Dậu', 'Tuất'],
  Ngọ: ['Thân', 'Dậu', 'Tuất'],
  Tuất: ['Thân', 'Dậu', 'Tuất'],
  Tỵ: ['Hợi', 'Tý', 'Sửu'],
  Dậu: ['Hợi', 'Tý', 'Sửu'],
  Sửu: ['Hợi', 'Tý', 'Sửu'],
};

export function lunarAgeForLunarYear(
  person: SessionPerson,
  targetLunarYear: number
): number | null {
  if (person.birthDay == null || person.birthMonth == null) return null;
  const birthLunar = solarToLunar(
    person.birthDay,
    person.birthMonth,
    person.birthYear
  );
  return Math.max(1, targetLunarYear - birthLunar.year + 1);
}

export function checkKimLau(tuoiAm: number): KimLauResult {
  const remainder = ((tuoiAm % 9) + 9) % 9;
  const hit = KIM_LAU_BY_REM[remainder];
  if (!hit) {
    return {
      hit: false,
      remainder,
      label: 'Kim Lâu',
      detail: `Tuổi ${tuoiAm} ÷ 9 dư ${remainder} — không phạm`,
    };
  }
  return {
    hit: true,
    remainder,
    kind: hit.kind,
    label: 'Kim Lâu',
    detail: `Tuổi ${tuoiAm} ÷ 9 dư ${remainder} — phạm ${hit.name} (${hit.meaning})`,
  };
}

/** (tuổi − 1) mod 6 → cung Hoàng Ốc. */
export function checkHoangOc(tuoiAm: number): HoangOcResult {
  const idx = ((tuoiAm - 1) % 6 + 6) % 6;
  const palace = HOANG_OC_PALACES[idx];
  return {
    hit: palace.bad,
    palace: palace.name,
    label: 'Hoàng Ốc',
    detail: palace.bad
      ? `Tuổi ${tuoiAm} vào cung ${palace.name} — ${palace.meaning}`
      : `Tuổi ${tuoiAm} vào cung ${palace.name} — ${palace.meaning}`,
  };
}

export function checkTamTai(
  birthYearLunar: number,
  targetLunarYear: number
): TamTaiResult {
  const birthChi = parseCanChi(canChiYear(birthYearLunar)).chi as
    | (typeof CHI)[number]
    | '';
  const yearChi = parseCanChi(canChiYear(targetLunarYear)).chi as
    | (typeof CHI)[number]
    | '';
  const years = birthChi ? TAM_TAI_YEARS[birthChi] : undefined;
  const hit = Boolean(years && yearChi && years.includes(yearChi));
  return {
    hit,
    birthChi: birthChi || '—',
    yearChi: yearChi || '—',
    label: 'Tam Tai',
    detail: hit
      ? `Tuổi ${birthChi} phạm Tam Tai năm ${yearChi} (${canChiYear(targetLunarYear)})`
      : `Tuổi ${birthChi} năm ${yearChi} — không phạm Tam Tai`,
  };
}

function analyzePerson(
  person: SessionPerson,
  role: string,
  targetLunarYear: number
): PersonMarriageAgeReport | null {
  if (person.birthDay == null || person.birthMonth == null) return null;
  const birthLunar = solarToLunar(
    person.birthDay,
    person.birthMonth,
    person.birthYear
  );
  const tuoiAm = lunarAgeForLunarYear(person, targetLunarYear);
  if (tuoiAm == null) return null;

  const kimLau = checkKimLau(tuoiAm);
  const hoangOc = checkHoangOc(tuoiAm);
  const tamTai = checkTamTai(birthLunar.year, targetLunarYear);

  return {
    role,
    personLabel: sessionPersonLabel(person),
    tuoiAm,
    yearCanChi: canChiYear(targetLunarYear),
    kimLau,
    hoangOc,
    tamTai,
    anyHit: kimLau.hit || hoangOc.hit || tamTai.hit,
  };
}

export function analyzeWeddingAges(
  groom: SessionPerson,
  bride: SessionPerson,
  asOf: SolarDate = todaySolar()
): WeddingAgeReport | null {
  const lunar = solarToLunar(asOf.day, asOf.month, asOf.year);
  const g = analyzePerson(groom, 'Chú rể', lunar.year);
  const b = analyzePerson(bride, 'Cô dâu', lunar.year);
  if (!g || !b) return null;
  return {
    yearLabel: `Năm ${canChiYear(lunar.year)} (${lunar.year})`,
    lunarYear: lunar.year,
    groom: g,
    bride: b,
    anyHit: g.anyHit || b.anyHit,
  };
}

/** Short issue lines for a wedding day in a given lunar year. */
export function weddingTabooIssuesForYear(
  groom: SessionPerson,
  bride: SessionPerson,
  targetLunarYear: number
): string[] {
  const issues: string[] = [];
  const g = analyzePerson(groom, 'Chú rể', targetLunarYear);
  const b = analyzePerson(bride, 'Cô dâu', targetLunarYear);
  for (const p of [g, b]) {
    if (!p) continue;
    if (p.kimLau.hit) issues.push(`${p.role}: ${p.kimLau.detail}`);
    if (p.hoangOc.hit) issues.push(`${p.role}: ${p.hoangOc.detail}`);
    if (p.tamTai.hit) issues.push(`${p.role}: ${p.tamTai.detail}`);
  }
  return issues;
}
