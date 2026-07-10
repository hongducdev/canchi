/**
 * Day ↔ person compatibility score (heuristic, cultural reference only).
 */

import { canChiYear, CHI, parseCanChi } from './canChi';
import type { DayInfo } from './types';
import type { FillContext } from './vanKhan';

export type DayPersonScore = {
  score: number;
  reasons: string[];
};

const BAD_TRUC = new Set(['Phá', 'Nguy', 'Bế']);

function chiIndex(chi: string): number {
  return CHI.indexOf(chi as (typeof CHI)[number]);
}

/** True when year animal conflicts with day branch (six conflicts). */
function isChiConflict(yearChi: string, dayChi: string): boolean {
  const a = chiIndex(yearChi);
  const b = chiIndex(dayChi);
  if (a < 0 || b < 0) return false;
  return (a + 6) % 12 === b;
}

/**
 * Score how well a person's birth year aligns with a calendar day.
 * Requires `ctx.birthYear`. Returns null if missing.
 */
export function scoreDayForPerson(
  info: DayInfo,
  ctx: FillContext
): DayPersonScore | null {
  if (ctx.birthYear == null || ctx.birthYear < 1800 || ctx.birthYear > 2199) {
    return null;
  }

  let score = 55;
  const reasons: string[] = [];

  const yearCanChi = canChiYear(ctx.birthYear);
  const { chi: yearChi } = parseCanChi(yearCanChi);
  const { chi: dayChi } = parseCanChi(info.canChiDay);

  if (yearChi && dayChi && isChiConflict(yearChi, dayChi)) {
    score -= 22;
    reasons.push(`Tuổi ${yearChi} xung với ngày ${dayChi}`);
  } else if (yearChi && dayChi) {
    score += 8;
    reasons.push(`Tuổi ${yearChi} không xung ngày ${dayChi}`);
  }

  if (info.lore.isAuspiciousDay) {
    score += 12;
    reasons.push('Ngày Hoàng Đạo / trực tốt');
  } else if (info.lore.isInauspiciousDay) {
    score -= 12;
    reasons.push('Ngày kém thuận (trực / tú xấu)');
  }

  if (BAD_TRUC.has(info.lore.truc)) {
    score -= 10;
    reasons.push(`Trực ${info.lore.truc} nên thận trọng`);
  } else if (['Thành', 'Khai', 'Định', 'Kiến'].includes(info.lore.truc)) {
    score += 8;
    reasons.push(`Trực ${info.lore.truc} thuận`);
  }

  if (info.gioHoangDao.length >= 5) {
    score += 5;
    reasons.push(`${info.gioHoangDao.length} giờ Hoàng Đạo`);
  }

  if (info.festivals.some((f) => f.category === 'tet' || f.category === 'le')) {
    score += 4;
    reasons.push('Có lễ truyền thống trong ngày');
  }

  // Soft mention of lore conflict list if year animal appears
  const conflictHit = info.lore.conflictingAges.some((line) =>
    yearChi ? line.includes(yearChi) : false
  );
  if (conflictHit) {
    score -= 8;
    reasons.push('Trùng tuổi xung theo lịch ngày');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  if (reasons.length === 0) {
    reasons.push('Điểm tham khảo theo can chi và lịch ngày');
  }

  return { score, reasons: reasons.slice(0, 4) };
}
