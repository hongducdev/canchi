import { describe, expect, it } from 'vitest';
import { solarToLunar } from './lunar';
import {
  buildLunarPrayerReminderPlan,
  MONTHLY_PRAYER_ID,
} from './lunarPrayerReminders';

describe('buildLunarPrayerReminderPlan', () => {
  it('schedules the evening before and morning of lunar days 1 and 15', () => {
    const now = new Date(2026, 6, 14, 12, 0, 0);
    const plan = buildLunarPrayerReminderPlan(now, 70);

    expect(plan.length).toBeGreaterThanOrEqual(8);
    for (const reminder of plan) {
      const target = reminder.title.startsWith('Ngày mai')
        ? new Date(reminder.when.getFullYear(), reminder.when.getMonth(), reminder.when.getDate() + 1)
        : reminder.when;
      const lunar = solarToLunar(
        target.getDate(),
        target.getMonth() + 1,
        target.getFullYear(),
      );
      expect([1, 15]).toContain(lunar.day);
      expect(reminder.data.prayerId).toBe(MONTHLY_PRAYER_ID);
      expect(reminder.when.getHours()).toBe(
        reminder.title.startsWith('Ngày mai') ? 18 : 7,
      );
    }
  });

  it('does not include reminders already passed', () => {
    const now = new Date(2026, 6, 14, 23, 0, 0);
    const plan = buildLunarPrayerReminderPlan(now, 35);
    expect(plan.every((item) => item.when.getTime() > now.getTime())).toBe(true);
  });
});
