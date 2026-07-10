/**
 * Personal Feng Shui helpers from birth year.
 * “Mệnh” uses nạp âm (e.g. 2002 Nhâm Ngọ → Dương Liễu Mộc), not Can-only ngũ hành.
 */

import { animalOfYear, canChiYear, napAmOfYear } from './canChi';

export type FengShuiProfile = {
  birthYear: number;
  canChi: string;
  animal: string;
  /** Ngũ hành from nạp âm (Kim/Mộc/Thủy/Hỏa/Thổ). */
  element: string;
  /** Full nạp âm name, e.g. Dương Liễu Mộc. */
  napAm: string;
  /** Display: "Mộc (Dương Liễu Mộc)". */
  menhLabel: string;
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
  houseOrientation: string;
  officeOrientation: string;
};

const ELEMENT_COLORS: Record<string, string[]> = {
  Kim: ['Trắng', 'Bạc', 'Vàng nhạt'],
  Mộc: ['Xanh lá', 'Xanh lục'],
  Thủy: ['Đen', 'Xanh dương'],
  Hỏa: ['Đỏ', 'Cam', 'Hồng'],
  Thổ: ['Vàng', 'Nâu', 'Be'],
};

const ELEMENT_NUMBERS: Record<string, number[]> = {
  Kim: [4, 9],
  Mộc: [3, 8],
  Thủy: [1, 6],
  Hỏa: [2, 7],
  Thổ: [5, 0],
};

const ELEMENT_DIRECTIONS: Record<string, string[]> = {
  Kim: ['Tây', 'Tây Bắc'],
  Mộc: ['Đông', 'Đông Nam'],
  Thủy: ['Bắc'],
  Hỏa: ['Nam'],
  Thổ: ['Tây Nam', 'Đông Bắc'],
};

export function buildFengShuiProfile(birthYear: number): FengShuiProfile {
  const canChi = canChiYear(birthYear);
  const napAm = napAmOfYear(birthYear);
  const element = napAm.element;
  const dirs = ELEMENT_DIRECTIONS[element] ?? ['Đông'];

  return {
    birthYear,
    canChi,
    animal: animalOfYear(birthYear),
    element,
    napAm: napAm.name,
    menhLabel: `${element} (${napAm.name})`,
    luckyColors: ELEMENT_COLORS[element] ?? [],
    luckyNumbers: ELEMENT_NUMBERS[element] ?? [],
    luckyDirections: dirs,
    houseOrientation: dirs[0] ?? 'Đông',
    officeOrientation: dirs[1] ?? dirs[0] ?? 'Đông',
  };
}
