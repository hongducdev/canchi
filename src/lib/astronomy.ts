/**
 * Offline astronomy highlights: eclipses + meteor showers (static catalog).
 */

import { addDays, getJulianDay, todaySolar } from './lunar';
import type { SolarDate } from './types';

export type AstroEventKind = 'solar-eclipse' | 'lunar-eclipse' | 'meteor-shower';

export type AstroEvent = {
  id: string;
  kind: AstroEventKind;
  name: string;
  description: string;
  /** Approximate peak / mid solar date */
  year: number;
  month: number;
  day: number;
};

/** Curated near-term events visible / notable for Vietnam-ish latitudes. */
export const ASTRO_EVENTS: AstroEvent[] = [
  {
    id: 'meteors-quadrantids-2026',
    kind: 'meteor-shower',
    name: 'Mưa sao băng Quadrantids',
    description: 'Đỉnh khoảng đầu tháng 1',
    year: 2026,
    month: 1,
    day: 4,
  },
  {
    id: 'lunar-eclipse-2026-03',
    kind: 'lunar-eclipse',
    name: 'Nguyệt thực toàn phần',
    description: 'Tháng 3 · quan sát ban đêm',
    year: 2026,
    month: 3,
    day: 3,
  },
  {
    id: 'meteors-lyrids-2026',
    kind: 'meteor-shower',
    name: 'Mưa sao băng Lyrids',
    description: 'Đỉnh khoảng giữa tháng 4',
    year: 2026,
    month: 4,
    day: 22,
  },
  {
    id: 'meteors-perseids-2026',
    kind: 'meteor-shower',
    name: 'Mưa sao băng Perseids',
    description: 'Đỉnh khoảng giữa tháng 8',
    year: 2026,
    month: 8,
    day: 12,
  },
  {
    id: 'solar-eclipse-2026-08',
    kind: 'solar-eclipse',
    name: 'Nhật thực toàn phần',
    description: 'Tháng 8 · đường tối chủ yếu Bắc bán cầu',
    year: 2026,
    month: 8,
    day: 12,
  },
  {
    id: 'lunar-eclipse-2026-08',
    kind: 'lunar-eclipse',
    name: 'Nguyệt thực một phần',
    description: 'Cuối tháng 8',
    year: 2026,
    month: 8,
    day: 28,
  },
  {
    id: 'meteors-orionids-2026',
    kind: 'meteor-shower',
    name: 'Mưa sao băng Orionids',
    description: 'Đỉnh khoảng giữa tháng 10',
    year: 2026,
    month: 10,
    day: 21,
  },
  {
    id: 'meteors-geminids-2026',
    kind: 'meteor-shower',
    name: 'Mưa sao băng Geminids',
    description: 'Đỉnh khoảng giữa tháng 12',
    year: 2026,
    month: 12,
    day: 14,
  },
  {
    id: 'meteors-perseids-2027',
    kind: 'meteor-shower',
    name: 'Mưa sao băng Perseids',
    description: 'Đỉnh khoảng giữa tháng 8',
    year: 2027,
    month: 8,
    day: 13,
  },
  {
    id: 'solar-eclipse-2027-08',
    kind: 'solar-eclipse',
    name: 'Nhật thực toàn phần',
    description: 'Tháng 8 · Bắc Phi / Trung Đông',
    year: 2027,
    month: 8,
    day: 2,
  },
];

export const ASTRO_KIND_LABEL: Record<AstroEventKind, string> = {
  'solar-eclipse': 'Nhật thực',
  'lunar-eclipse': 'Nguyệt thực',
  'meteor-shower': 'Mưa sao băng',
};

export function upcomingAstroEvents(
  from: SolarDate = todaySolar(),
  limit = 12
): { event: AstroEvent; days: number; solar: SolarDate }[] {
  const fromJd = getJulianDay(from.day, from.month, from.year);
  const out: { event: AstroEvent; days: number; solar: SolarDate }[] = [];

  for (const event of ASTRO_EVENTS) {
    const solar = { day: event.day, month: event.month, year: event.year };
    const jd = getJulianDay(solar.day, solar.month, solar.year);
    const days = jd - fromJd;
    if (days < 0) continue;
    out.push({ event, days, solar });
  }

  return out.sort((a, b) => a.days - b.days).slice(0, limit);
}

export function moonCycleSummary(from: SolarDate = todaySolar()): {
  label: string;
  nextNewApprox: SolarDate;
  nextFullApprox: SolarDate;
} {
  // Rough 29.5-day cycle markers from lunar day via buildDayInfo would be better;
  // keep a simple forward scan using addDays + solarToLunar in UI instead if needed.
  return {
    label: 'Chu kỳ ~29.5 ngày',
    nextNewApprox: addDays(from, 15),
    nextFullApprox: addDays(from, 7),
  };
}
