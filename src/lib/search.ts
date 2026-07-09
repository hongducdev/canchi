/**
 * Offline search across festivals, solar terms, and dates.
 */

import { FESTIVALS, CATEGORY_LABEL } from '../data/festivals';
import { TIET_KHI } from './tietKhi';
import { addDays, parseDateKey, solarToLunar, todaySolar } from './lunar';
import { buildDayInfo } from './dayInfo';
import type { Festival, SolarDate } from './types';

export type SearchHit =
  | { kind: 'festival'; festival: Festival; label: string; detail: string }
  | { kind: 'tiet-khi'; name: string; label: string; detail: string }
  | { kind: 'date'; solar: SolarDate; label: string; detail: string };

function normalize(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function searchCatalog(query: string, limit = 30): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];

  const hits: SearchHit[] = [];

  const dateMatch =
    q.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/) ||
    q.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (dateMatch) {
    let day: number;
    let month: number;
    let year: number;
    if (dateMatch[1].length === 4) {
      year = Number(dateMatch[1]);
      month = Number(dateMatch[2]);
      day = Number(dateMatch[3]);
    } else {
      day = Number(dateMatch[1]);
      month = Number(dateMatch[2]);
      year = Number(dateMatch[3]);
    }
    try {
      const solar = parseDateKey(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      );
      const info = buildDayInfo(solar);
      hits.push({
        kind: 'date',
        solar,
        label: `${day}/${month}/${year}`,
        detail: `${info.canChiDay} · ${info.tietKhi} · ${info.moon.phaseName}`,
      });
    } catch {
      // ignore invalid
    }
  }

  for (const f of FESTIVALS) {
    const hay = normalize(`${f.name} ${f.description ?? ''} ${CATEGORY_LABEL[f.category]}`);
    if (hay.includes(q)) {
      hits.push({
        kind: 'festival',
        festival: f,
        label: f.name,
        detail: CATEGORY_LABEL[f.category],
      });
    }
  }

  for (const name of TIET_KHI) {
    if (normalize(name).includes(q)) {
      hits.push({
        kind: 'tiet-khi',
        name,
        label: name,
        detail: 'Tiết khí',
      });
    }
  }

  const seen = new Set<string>();
  return hits
    .filter((h) => {
      const key = `${h.kind}-${h.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

export function nextTietKhiDate(name: string, from: SolarDate = todaySolar()): SolarDate | null {
  for (let i = 0; i < 370; i++) {
    const solar = addDays(from, i);
    const info = buildDayInfo(solar);
    if (info.tietKhi === name) return solar;
  }
  return null;
}

export function nextFestivalSolar(f: Festival, from: SolarDate = todaySolar()): SolarDate | null {
  for (let i = 0; i < 400; i++) {
    const solar = addDays(from, i);
    const lunar = solarToLunar(solar.day, solar.month, solar.year);
    const solarHit =
      f.solarDay != null &&
      f.solarMonth != null &&
      f.solarDay === solar.day &&
      f.solarMonth === solar.month;
    const lunarHit =
      f.lunarDay != null &&
      f.lunarMonth != null &&
      f.lunarDay === lunar.day &&
      f.lunarMonth === lunar.month &&
      !(f.ignoreLeap && lunar.leap);
    if (solarHit || lunarHit) return solar;
  }
  return null;
}
