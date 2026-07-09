/**
 * Zodiac (12 con giáp) helpers for icons and labels.
 */

import { animalOfYear, CHI, CHI_ANIMALS } from './canChi';

export type ZodiacKey =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'cat'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

export const ZODIAC_ORDER: ZodiacKey[] = [
  'rat',
  'ox',
  'tiger',
  'cat',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
];

export const ZODIAC_LABEL_VI: Record<ZodiacKey, string> = {
  rat: 'Chuột',
  ox: 'Trâu',
  tiger: 'Hổ',
  cat: 'Mèo',
  dragon: 'Rồng',
  snake: 'Rắn',
  horse: 'Ngựa',
  goat: 'Dê',
  monkey: 'Khỉ',
  rooster: 'Gà',
  dog: 'Chó',
  pig: 'Heo',
};

/** Soft accent per animal (works on light/dark card surfaces). */
export const ZODIAC_ACCENT: Record<ZodiacKey, string> = {
  rat: '#6B7A8C',
  ox: '#8B7355',
  tiger: '#C23B22',
  cat: '#A88B2E',
  dragon: '#9E2F1C',
  snake: '#2F6B5A',
  horse: '#B45309',
  goat: '#7C6A4A',
  monkey: '#A16207',
  rooster: '#C2410C',
  dog: '#57534E',
  pig: '#BE185D',
};

const ANIMAL_ALIASES: Record<string, ZodiacKey> = {
  chuột: 'rat',
  chuot: 'rat',
  trâu: 'ox',
  trau: 'ox',
  hổ: 'tiger',
  ho: 'tiger',
  dần: 'tiger',
  dan: 'tiger',
  mèo: 'cat',
  meo: 'cat',
  thỏ: 'cat',
  tho: 'cat',
  rồng: 'dragon',
  rong: 'dragon',
  rắn: 'snake',
  ran: 'snake',
  ngựa: 'horse',
  ngua: 'horse',
  dê: 'goat',
  de: 'goat',
  khỉ: 'monkey',
  khi: 'monkey',
  gà: 'rooster',
  ga: 'rooster',
  chó: 'dog',
  cho: 'dog',
  heo: 'pig',
  lợn: 'pig',
  lon: 'pig',
};

const CHI_ALIASES: Record<string, ZodiacKey> = {
  tý: 'rat',
  ty: 'rat',
  sửu: 'ox',
  suu: 'ox',
  dần: 'tiger',
  dan: 'tiger',
  mão: 'cat',
  mao: 'cat',
  thìn: 'dragon',
  thin: 'dragon',
  tỵ: 'snake',
  ngựa: 'horse',
  ngọ: 'horse',
  ngo: 'horse',
  mùi: 'goat',
  mui: 'goat',
  thân: 'monkey',
  than: 'monkey',
  dậu: 'rooster',
  dau: 'rooster',
  tuất: 'dog',
  tuat: 'dog',
  hợi: 'pig',
  hoi: 'pig',
};

function foldDiacritics(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

export function zodiacKeyFromChi(chi: string): ZodiacKey | null {
  const exact = (CHI as readonly string[]).indexOf(chi);
  if (exact >= 0) return ZODIAC_ORDER[exact];
  const lower = chi.trim().toLowerCase();
  if (CHI_ALIASES[lower]) return CHI_ALIASES[lower];
  // Tý vs Tỵ both fold to "ty" — prefer rat only when original has no underdot
  if (foldDiacritics(chi) === 'ty') {
    return /tỵ/i.test(chi) ? 'snake' : 'rat';
  }
  return CHI_ALIASES[foldDiacritics(chi)] ?? null;
}

export function zodiacKeyFromAnimalName(name: string): ZodiacKey | null {
  const lower = name.trim().toLowerCase();
  if (ANIMAL_ALIASES[lower]) return ANIMAL_ALIASES[lower];
  const folded = foldDiacritics(name);
  if (ANIMAL_ALIASES[folded]) return ANIMAL_ALIASES[folded];
  const idx = (CHI_ANIMALS as readonly string[]).findIndex(
    (a) => a.toLowerCase() === lower || foldDiacritics(a) === folded
  );
  if (idx >= 0) return ZODIAC_ORDER[idx];
  return zodiacKeyFromChi(name);
}

export function zodiacKeyFromYear(year: number): ZodiacKey {
  return ZODIAC_ORDER[(year + 8) % 12];
}

export function resolveZodiacKey(input: {
  year?: number;
  animal?: string;
  chi?: string;
}): ZodiacKey | null {
  if (input.year != null && Number.isFinite(input.year)) {
    return zodiacKeyFromYear(input.year);
  }
  if (input.chi) {
    const fromChi = zodiacKeyFromChi(input.chi);
    if (fromChi) return fromChi;
  }
  if (input.animal) {
    return zodiacKeyFromAnimalName(input.animal);
  }
  return null;
}

export function zodiacLabelForYear(year: number): string {
  const key = zodiacKeyFromYear(year);
  const animal = animalOfYear(year);
  const pretty = ZODIAC_LABEL_VI[key];
  // Prefer friendly label (Hổ) when CHI_ANIMALS still says "Dần"
  return animal === 'Dần' ? pretty : animal;
}
