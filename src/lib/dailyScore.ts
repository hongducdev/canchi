/**
 * Daily activity scores (0–100) derived from day lore + hours + moon.
 */

import type { DayInfo } from './types';
import type { LuckyActivity } from './luckyDay';
import { LUCKY_ACTIVITY_LABEL } from './luckyDay';

export type ActivityScore = {
  activity: LuckyActivity;
  label: string;
  score: number;
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

const AVOID = new Set(['Phá', 'Nguy', 'Bế']);

function scoreOne(info: DayInfo, activity: LuckyActivity): number {
  let score = 50;
  const preferred = PREFERRED_TRUC[activity];
  if (preferred.includes(info.lore.truc)) score += 25;
  else if (AVOID.has(info.lore.truc)) score -= 30;
  if (info.lore.isAuspiciousDay) score += 15;
  if (info.lore.isInauspiciousDay) score -= 15;
  score += Math.min(10, info.gioHoangDao.length);
  if (info.moon.isNewMoon || info.moon.isFullMoon) score += 5;
  return Math.max(0, Math.min(100, score));
}

export function dailyActivityScores(info: DayInfo): ActivityScore[] {
  return (Object.keys(LUCKY_ACTIVITY_LABEL) as LuckyActivity[])
    .map((activity) => ({
      activity,
      label: LUCKY_ACTIVITY_LABEL[activity],
      score: scoreOne(info, activity),
    }))
    .sort((a, b) => b.score - a.score);
}

export function overallDayScore(info: DayInfo): number {
  const scores = dailyActivityScores(info);
  if (scores.length === 0) return 50;
  const sum = scores.reduce((acc, s) => acc + s.score, 0);
  return Math.round(sum / scores.length);
}
