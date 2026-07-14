import { describe, expect, it } from 'vitest';
import { calculateDateDuration, formatSolarDate } from './dateDuration';

describe('calculateDateDuration', () => {
  it('matches the requested 10/08/2021 to 14/07/2026 example', () => {
    const result = calculateDateDuration(
      { day: 10, month: 8, year: 2021 },
      { day: 14, month: 7, year: 2026 },
    );

    expect(result.totalDays).toBe(1799);
    expect(result.weeks).toBe(257);
    expect(result.totalMonths).toBe(59);
    expect(result.remainingMonthDays).toBe(4);
    expect(result.years).toBe(4);
    expect(result.remainingYearsMonths).toBe(11);
    expect(result.remainingYearsDays).toBe(4);
    expect(result.totalHours).toBe(43176);
    expect(result.totalMinutes).toBe(2590560);
    expect(result.startWeekday).toBe('Thứ ba');
  });

  it('clamps month-end anchors and rejects reversed ranges', () => {
    const result = calculateDateDuration(
      { day: 31, month: 1, year: 2024 },
      { day: 29, month: 2, year: 2024 },
    );
    expect(result.totalMonths).toBe(1);
    expect(result.remainingMonthDays).toBe(0);
    expect(() =>
      calculateDateDuration(
        { day: 1, month: 1, year: 2025 },
        { day: 31, month: 12, year: 2024 },
      ),
    ).toThrow();
  });

  it('formats dates as DD/MM/YYYY', () => {
    expect(formatSolarDate({ day: 4, month: 2, year: 2026 })).toBe('04/02/2026');
  });
});
