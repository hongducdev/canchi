/**
 * Daily activity scores (0–100) derived from day lore + hours + moon.
 */

import type { DayInfo } from './types';
import {
  calendarScoreForActivity,
  LUCKY_ACTIVITY_LABEL,
  LUCKY_ACTIVITY_ORDER,
  type LuckyActivity,
} from './luckyDay';

export type ActivityScore = {
  activity: LuckyActivity;
  label: string;
  score: number;
};

/** Activities shown on day detail (skip generic “Ngày tốt xấu”). */
const DAY_PAGE_ACTIVITIES: LuckyActivity[] = LUCKY_ACTIVITY_ORDER.filter(
  (a) => a !== 'general'
);

export function dailyActivityScores(info: DayInfo): ActivityScore[] {
  return DAY_PAGE_ACTIVITIES.map((activity) => ({
    activity,
    label: LUCKY_ACTIVITY_LABEL[activity],
    score: calendarScoreForActivity(info, activity).score,
  })).sort((a, b) => b.score - a.score);
}

export function overallDayScore(info: DayInfo): number {
  const scores = dailyActivityScores(info);
  if (scores.length === 0) return 50;
  const sum = scores.reduce((acc, s) => acc + s.score, 0);
  return Math.round(sum / scores.length);
}
