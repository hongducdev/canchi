import { describe, expect, it } from 'vitest';
import { solarToLunar } from '../lib/lunar';
import { getFestivalsForDay, upcomingFestivals } from './festivals';

function festivalIds(day: number, month: number, year = 2026): string[] {
  const solar = { day, month, year };
  const lunar = solarToLunar(day, month, year);
  return getFestivalsForDay(solar, lunar).map((festival) => festival.id);
}

describe('international observances', () => {
  it.each([
    [15, 5, 'quoc-te-gia-dinh'],
    [5, 6, 'moi-truong-the-gioi'],
    [21, 9, 'quoc-te-hoa-binh'],
    [1, 10, 'quoc-te-nguoi-cao-tuoi'],
  ])('includes %s/%s in the offline calendar', (day, month, id) => {
    expect(festivalIds(day as number, month as number)).toContain(id);
  });

  it('includes international observances in the upcoming list', () => {
    const upcoming = upcomingFestivals({ day: 14, month: 5, year: 2026 }, 10);
    expect(upcoming.some(({ festival }) => festival.id === 'quoc-te-gia-dinh')).toBe(true);
  });

  it('covers familiar international observances throughout the year', () => {
    const upcoming = upcomingFestivals({ day: 1, month: 1, year: 2026 }, 120);
    const internationalIds = upcoming
      .filter(({ festival }) => festival.category === 'khac')
      .map(({ festival }) => festival.id);

    expect(internationalIds.length).toBeGreaterThanOrEqual(30);
    expect(internationalIds).toContain('quoc-te-giao-duc');
    expect(internationalIds).toContain('quoc-te-yoga');
    expect(internationalIds).toContain('du-lich-the-gioi');
    expect(internationalIds).toContain('nhan-quyen-quoc-te');
  });
});
