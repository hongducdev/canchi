/**
 * Lucky day finder — scores upcoming days for common life activities.
 */

import { buildDayInfo } from './dayInfo';
import { addDays, todaySolar } from './lunar';
import type { DayInfo, SolarDate } from './types';

export type LuckyActivity =
  | 'wedding'
  | 'grand-opening'
  | 'house-moving'
  | 'groundbreaking'
  | 'business-opening'
  | 'travel'
  | 'car-purchase'
  | 'contract'
  | 'surgery'
  | 'haircut';

export const LUCKY_ACTIVITY_LABEL: Record<LuckyActivity, string> = {
  wedding: 'Cưới hỏi',
  'grand-opening': 'Khai trương',
  'house-moving': 'Nhập trạch',
  groundbreaking: 'Động thổ',
  'business-opening': 'Mở hàng',
  travel: 'Xuất hành',
  'car-purchase': 'Mua xe',
  contract: 'Ký kết',
  surgery: 'Phẫu thuật',
  haircut: 'Cắt tóc',
};

const PREFERRED_TRUC: Record<LuckyActivity, string[]> = {
  wedding: ['Thành', 'Định', 'Khai'],
  'grand-opening': ['Khai', 'Thành', 'Định'],
  'house-moving': ['Định', 'Thành', 'Khai'],
  groundbreaking: ['Kiến', 'Thành', 'Định'],
  'business-opening': ['Khai', 'Mãn', 'Định'],
  travel: ['Kiến', 'Khai', 'Thành'],
  'car-purchase': ['Thành', 'Định', 'Khai'],
  contract: ['Định', 'Thành', 'Chấp'],
  surgery: ['Trừ', 'Bình', 'Định'],
  haircut: ['Trừ', 'Bình', 'Mãn'],
};

const AVOID_TRUC = new Set(['Phá', 'Nguy', 'Bế']);

export type LuckyDayResult = {
  solar: SolarDate;
  score: number;
  info: DayInfo;
  reasons: string[];
};

function scoreDay(info: DayInfo, activity: LuckyActivity): { score: number; reasons: string[] } {
  let score = 50;
  const reasons: string[] = [];
  const preferred = PREFERRED_TRUC[activity];

  if (preferred.includes(info.lore.truc)) {
    score += 25;
    reasons.push(`Trực ${info.lore.truc}`);
  } else if (AVOID_TRUC.has(info.lore.truc)) {
    score -= 30;
    reasons.push(`Tránh Trực ${info.lore.truc}`);
  }

  if (info.lore.isAuspiciousDay) {
    score += 15;
    reasons.push('Ngày tốt');
  }
  if (info.lore.isInauspiciousDay) {
    score -= 15;
    reasons.push('Ngày xấu');
  }

  score += Math.min(10, info.gioHoangDao.length);
  if (info.gioHoangDao.length >= 4) reasons.push(`${info.gioHoangDao.length} giờ hoàng đạo`);

  if (info.moon.isNewMoon || info.moon.isFullMoon) {
    score += 5;
    reasons.push(info.moon.phaseName);
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

export function findLuckyDays(
  activity: LuckyActivity,
  from: SolarDate = todaySolar(),
  horizon = 60,
  limit = 10
): LuckyDayResult[] {
  const results: LuckyDayResult[] = [];

  for (let i = 1; i <= horizon; i++) {
    const solar = addDays(from, i);
    const info = buildDayInfo(solar);
    const { score, reasons } = scoreDay(info, activity);
    if (score < 55) continue;
    results.push({ solar, score, info, reasons });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
