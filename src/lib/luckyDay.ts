/**
 * Lucky day finder — scores upcoming days for life activities + person age.
 */

import { scoreDayForPerson } from './dayPersonScore';
import { buildDayInfo } from './dayInfo';
import { addDays, todaySolar } from './lunar';
import { weddingTabooIssuesForYear } from './marriageAge';
import type { DayInfo, SolarDate } from './types';
import type { FillContext } from './vanKhan';
import type { SessionPerson } from '../store/sessionPerson';
import { sessionPersonToFillContext } from '../store/sessionPerson';

export type LuckyActivity =
  | 'general'
  | 'wedding'
  | 'dam-ngo'
  | 'groundbreaking'
  | 'travel'
  | 'house-moving'
  | 'buy-house'
  | 'car-purchase'
  | 'exam-interview'
  | 'paperwork'
  | 'grand-opening'
  | 'contract'
  | 'sang-cat'
  | 'move-altar'
  | 'setup-altar'
  | 'sao-giai-han'
  | 'tran-trach'
  | 'cau-an'
  | 'new-job';

export type LuckyActivityMeta = {
  label: string;
  subtitle: string;
  couple: boolean;
  /** Empty = no activity-specific Trực preference (Ngày tốt xấu). */
  preferredTruc: string[];
};

export const LUCKY_ACTIVITY_META: Record<LuckyActivity, LuckyActivityMeta> = {
  general: {
    label: 'Ngày tốt xấu',
    subtitle: 'Xem ngày thuận / kém theo tuổi',
    couple: false,
    preferredTruc: [],
  },
  wedding: {
    label: 'Kết hôn',
    subtitle: 'Cần thông tin cô dâu và chú rể',
    couple: true,
    preferredTruc: ['Thành', 'Định', 'Khai'],
  },
  'dam-ngo': {
    label: 'Dặm ngõ',
    subtitle: 'Cần thông tin cô dâu và chú rể',
    couple: true,
    preferredTruc: ['Thành', 'Định', 'Khai'],
  },
  groundbreaking: {
    label: 'Động thổ',
    subtitle: 'Khởi công, đào móng',
    couple: false,
    preferredTruc: ['Kiến', 'Thành', 'Định'],
  },
  travel: {
    label: 'Xuất hành',
    subtitle: 'Đi xa, khởi hành',
    couple: false,
    preferredTruc: ['Kiến', 'Khai', 'Thành'],
  },
  'house-moving': {
    label: 'Nhập trạch',
    subtitle: 'Vào nhà mới',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Khai'],
  },
  'buy-house': {
    label: 'Mua nhà',
    subtitle: 'Mua đất, mua nhà',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Khai'],
  },
  'car-purchase': {
    label: 'Mua xe',
    subtitle: 'Mua xe, nhận xe',
    couple: false,
    preferredTruc: ['Thành', 'Định', 'Khai'],
  },
  'exam-interview': {
    label: 'Thi cử - Phỏng vấn',
    subtitle: 'Thi, phỏng vấn, xét tuyển',
    couple: false,
    preferredTruc: ['Thành', 'Khai', 'Định'],
  },
  paperwork: {
    label: 'Làm giấy tờ',
    subtitle: 'Hành chính, thủ tục',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Chấp'],
  },
  'grand-opening': {
    label: 'Khai trương',
    subtitle: 'Mở cửa hàng, khai trương',
    couple: false,
    preferredTruc: ['Khai', 'Thành', 'Định'],
  },
  contract: {
    label: 'Ký hợp đồng',
    subtitle: 'Ký kết, giao dịch',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Chấp'],
  },
  'sang-cat': {
    label: 'Sang cát',
    subtitle: 'Cải táng, sang cát',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Bình'],
  },
  'move-altar': {
    label: 'Dời ban thờ',
    subtitle: 'Di chuyển bàn thờ',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Khai'],
  },
  'setup-altar': {
    label: 'Lập bàn thờ',
    subtitle: 'Dựng bàn thờ mới',
    couple: false,
    preferredTruc: ['Thành', 'Định', 'Khai'],
  },
  'sao-giai-han': {
    label: 'Cúng sao giải hạn',
    subtitle: 'Cúng sao, giải hạn năm',
    couple: false,
    preferredTruc: ['Trừ', 'Bình', 'Định'],
  },
  'tran-trach': {
    label: 'Trấn trạch',
    subtitle: 'Trấn nhà, yểm trạch',
    couple: false,
    preferredTruc: ['Định', 'Thành', 'Kiến'],
  },
  'cau-an': {
    label: 'Cầu an - Làm phúc',
    subtitle: 'Cầu an, phóng sinh, làm phúc',
    couple: false,
    preferredTruc: ['Thành', 'Khai', 'Định'],
  },
  'new-job': {
    label: 'Nhận công việc mới',
    subtitle: 'Nhận việc, nhận chức',
    couple: false,
    preferredTruc: ['Khai', 'Thành', 'Định'],
  },
};

export const LUCKY_ACTIVITY_LABEL: Record<LuckyActivity, string> = Object.fromEntries(
  (Object.keys(LUCKY_ACTIVITY_META) as LuckyActivity[]).map((k) => [
    k,
    LUCKY_ACTIVITY_META[k].label,
  ])
) as Record<LuckyActivity, string>;

export const LUCKY_ACTIVITY_ORDER: LuckyActivity[] = [
  'general',
  'wedding',
  'dam-ngo',
  'groundbreaking',
  'travel',
  'house-moving',
  'buy-house',
  'car-purchase',
  'exam-interview',
  'paperwork',
  'grand-opening',
  'contract',
  'sang-cat',
  'move-altar',
  'setup-altar',
  'sao-giai-han',
  'tran-trach',
  'cau-an',
  'new-job',
];

const AVOID_TRUC = new Set(['Phá', 'Nguy', 'Bế']);

export type LuckyDayResult = {
  solar: SolarDate;
  score: number;
  info: DayInfo;
  reasons: string[];
  /** What the day violates / should avoid (shown for bad / low scores). */
  issues: string[];
  verdict: 'good' | 'mixed' | 'bad';
};

export function isLuckyActivity(value: string): value is LuckyActivity {
  return value in LUCKY_ACTIVITY_META;
}

function verdictFromScore(score: number, issueCount: number): LuckyDayResult['verdict'] {
  if (score >= 70 && issueCount === 0) return 'good';
  if (score < 55 || issueCount >= 2) return 'bad';
  return 'mixed';
}

export function calendarScoreForActivity(
  info: DayInfo,
  activity: LuckyActivity
): { score: number; reasons: string[]; issues: string[] } {
  let score = 50;
  const reasons: string[] = [];
  const issues: string[] = [];
  const preferred = LUCKY_ACTIVITY_META[activity].preferredTruc;
  const label = LUCKY_ACTIVITY_META[activity].label;

  if (preferred.length > 0) {
    if (preferred.includes(info.lore.truc)) {
      score += 25;
      reasons.push(`Trực ${info.lore.truc} hợp ${label}`);
    } else if (AVOID_TRUC.has(info.lore.truc)) {
      score -= 30;
      issues.push(
        `Phạm Trực ${info.lore.truc} — ${info.lore.trucMeaning || 'không hợp việc này'}`
      );
    } else if (!preferred.includes(info.lore.truc)) {
      issues.push(
        `Trực ${info.lore.truc} không thuộc nhóm thuận cho ${label} (${preferred.join(', ')})`
      );
      score -= 5;
    }
  } else if (AVOID_TRUC.has(info.lore.truc)) {
    score -= 20;
    issues.push(
      `Phạm Trực ${info.lore.truc} — ${info.lore.trucMeaning || 'nên tránh'}`
    );
  }

  if (info.lore.isAuspiciousDay) {
    score += 15;
    reasons.push('Ngày Hoàng Đạo / trực tốt');
  }
  if (info.lore.isInauspiciousDay) {
    score -= 15;
    issues.push(
      `Ngày xấu — Trực ${info.lore.truc}, tú ${info.lore.nhiThapBatTu}`
    );
  }

  if (info.lore.badStars.length > 0) {
    issues.push(`Sao xấu: ${info.lore.badStars.join(', ')}`);
    score -= 4;
  }

  if (info.lore.activitiesToAvoid.length > 0 && preferred.length > 0) {
    const avoidHit = info.lore.activitiesToAvoid.some((a) =>
      label.toLowerCase().includes(a.toLowerCase().slice(0, 4))
    );
    if (avoidHit) {
      issues.push(`Việc nên tránh trong ngày: ${info.lore.activitiesToAvoid.join(', ')}`);
      score -= 6;
    }
  }

  score += Math.min(10, info.gioHoangDao.length);
  if (info.gioHoangDao.length >= 4) {
    reasons.push(`${info.gioHoangDao.length} giờ hoàng đạo`);
  } else if (info.gioHoangDao.length <= 1) {
    issues.push('Ít giờ Hoàng Đạo trong ngày');
    score -= 3;
  }

  if (info.moon.isNewMoon || info.moon.isFullMoon) {
    score += 5;
    reasons.push(info.moon.phaseName);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
    issues,
  };
}

function personContexts(
  primary: SessionPerson,
  secondary?: SessionPerson | null
): FillContext[] {
  const list = [sessionPersonToFillContext(primary)];
  if (secondary) list.push(sessionPersonToFillContext(secondary));
  return list;
}

function combinePersonScore(
  info: DayInfo,
  contexts: FillContext[]
): { score: number; reasons: string[]; issues: string[] } | null {
  const parts = contexts
    .map((ctx) => scoreDayForPerson(info, ctx))
    .filter((x): x is NonNullable<typeof x> => x != null);
  if (parts.length === 0) return null;
  const score = Math.round(
    parts.reduce((sum, p) => sum + p.score, 0) / parts.length
  );
  const reasons = parts.flatMap((p) => p.reasons).slice(0, 6);
  const issues = parts.flatMap((p) => p.issues).slice(0, 8);
  return { score, reasons, issues };
}

export function scoreDayForActivity(
  info: DayInfo,
  activity: LuckyActivity,
  primary: SessionPerson,
  secondary?: SessionPerson | null
): { score: number; reasons: string[]; issues: string[] } {
  const calendar = calendarScoreForActivity(info, activity);
  const person = combinePersonScore(info, personContexts(primary, secondary));

  if (!person) {
    return calendar;
  }

  const isGeneral = activity === 'general';
  const calWeight = isGeneral ? 0.35 : 0.55;
  const personWeight = 1 - calWeight;
  let score = Math.round(
    calendar.score * calWeight + person.score * personWeight
  );

  const reasons = [...calendar.reasons, ...person.reasons].slice(0, 6);
  let issues = [...calendar.issues, ...person.issues];

  if (
    (activity === 'wedding' || activity === 'dam-ngo') &&
    secondary &&
    primary.birthDay != null &&
    secondary.birthDay != null
  ) {
    const taboo = weddingTabooIssuesForYear(
      primary,
      secondary,
      info.lunar.year
    );
    if (taboo.length > 0) {
      issues = [...issues, ...taboo];
      score -= Math.min(20, taboo.length * 5);
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons: reasons.length > 0 ? reasons : ['Điểm tham khảo'],
    issues: issues.slice(0, 12),
  };
}

/** All days in horizon (chronological), including bad / low scores. */
export function findActivityDays(
  activity: LuckyActivity,
  primary: SessionPerson,
  secondary?: SessionPerson | null,
  from: SolarDate = todaySolar(),
  horizon = 30
): LuckyDayResult[] {
  const results: LuckyDayResult[] = [];

  for (let i = 1; i <= horizon; i++) {
    const solar = addDays(from, i);
    const info = buildDayInfo(solar);
    const { score, reasons, issues } = scoreDayForActivity(
      info,
      activity,
      primary,
      secondary
    );
    results.push({
      solar,
      score,
      info,
      reasons,
      issues,
      verdict: verdictFromScore(score, issues.length),
    });
  }

  return results;
}

/** @deprecated Prefer findActivityDays — kept for callers wanting top good days only. */
export function findLuckyDays(
  activity: LuckyActivity,
  primary: SessionPerson,
  secondary?: SessionPerson | null,
  from: SolarDate = todaySolar(),
  horizon = 60,
  limit = 10
): LuckyDayResult[] {
  return findActivityDays(activity, primary, secondary, from, horizon)
    .filter((r) => r.score >= 55)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
