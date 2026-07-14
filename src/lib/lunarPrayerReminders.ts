import { solarToLunar } from './lunar';

export const MONTHLY_PRAYER_ID = 'tho-cong-gia-tien-mung-mot-ram';
export const MONTHLY_PRAYER_NOTIFICATION_KIND = 'monthly-prayer';

export type LunarPrayerReminder = {
  when: Date;
  title: string;
  body: string;
  data: {
    kind: typeof MONTHLY_PRAYER_NOTIFICATION_KIND;
    prayerId: typeof MONTHLY_PRAYER_ID;
  };
};

function atLocalTime(date: Date, hour: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    0,
    0,
    0,
  );
}

function reminderContent(
  lunarDay: 1 | 15,
  lunarMonth: number,
  isAdvance: boolean,
): Pick<LunarPrayerReminder, 'title' | 'body'> {
  const dayLabel = lunarDay === 1 ? 'Mùng 1' : 'Rằm';
  return isAdvance
    ? {
        title: `Ngày mai là ${dayLabel} tháng ${lunarMonth} Âm lịch`,
        body: 'Chuẩn bị hương lễ. Chạm để mở Văn khấn Thổ Công, Gia Tiên.',
      }
    : {
        title: `Hôm nay là ${dayLabel} tháng ${lunarMonth} Âm lịch`,
        body: 'Chạm để mở Văn khấn Thổ Công, Gia Tiên (Mùng 1, Rằm).',
      };
}

/** Build local reminders without a server. Six months keeps scheduled alarms bounded. */
export function buildLunarPrayerReminderPlan(
  now = new Date(),
  horizonDays = 190,
): LunarPrayerReminder[] {
  const reminders: LunarPrayerReminder[] = [];
  const cursor = atLocalTime(now, 12);
  const minTime = now.getTime() + 60_000;

  for (let offset = 0; offset <= horizonDays; offset += 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() + offset);
    const lunar = solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
    if (lunar.day !== 1 && lunar.day !== 15) continue;

    const prayerDay = lunar.day as 1 | 15;
    const dayOf = atLocalTime(date, 7);
    const dayBefore = new Date(atLocalTime(date, 18));
    dayBefore.setDate(dayBefore.getDate() - 1);

    for (const [when, isAdvance] of [
      [dayBefore, true],
      [dayOf, false],
    ] as const) {
      if (when.getTime() <= minTime) continue;
      reminders.push({
        when,
        ...reminderContent(prayerDay, lunar.month, isAdvance),
        data: {
          kind: MONTHLY_PRAYER_NOTIFICATION_KIND,
          prayerId: MONTHLY_PRAYER_ID,
        },
      });
    }
  }

  return reminders.sort((a, b) => a.when.getTime() - b.when.getTime());
}
