/**
 * Văn khấn helpers: fill placeholders, search, occasion ranking.
 */

import {
  getVanKhanById,
  VAN_KHAN,
  type VanKhan,
  type VanKhanCategory,
} from '../data/vanKhan';
import { GENDER_LABEL, type UserGender, type UserProfile } from '../store/userProfile';
import { canChiYear } from './canChi';
import type { DayInfo, FamilyMember } from './types';

export type ProfileSubject =
  | { kind: 'self' }
  | { kind: 'family'; memberId: string };

/** Normalized fields used for {{placeholders}} and scoring */
export type FillContext = {
  fullName?: string;
  gender?: UserGender;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  birthHourChi?: string;
  hometown?: string;
  /** Residence / home address — {{diaChi}} */
  address?: string;
  /** Shop / construction site — {{diaChiCongViec}} */
  workAddress?: string;
  /** Memorial name — {{huongLinh}} */
  memorialName?: string;
  /** Preformatted lunar date line — {{ngayAm}} */
  lunarDateLabel?: string;
  /** Preformatted solar date — {{ngayDuong}} */
  solarDateLabel?: string;
};

const ELLIPSIS = '……';

export function profileToFillContext(profile: UserProfile | null): FillContext {
  if (!profile) return {};
  const hometown = profile.hometown?.trim() || undefined;
  return {
    fullName: profile.fullName.trim() || undefined,
    gender: profile.gender,
    birthYear: profile.birthYear,
    birthMonth: profile.birthMonth,
    birthDay: profile.birthDay,
    birthHourChi: profile.birthHourChi,
    hometown,
    address: hometown,
    workAddress: hometown,
  };
}

export function familyMemberToFillContext(member: FamilyMember): FillContext {
  return {
    fullName: member.name.trim() || undefined,
    birthYear: member.birthYear,
    birthMonth: member.solarBirthdayMonth,
    birthDay: member.solarBirthdayDay,
  };
}

export function resolveFillContext(
  subject: ProfileSubject,
  self: UserProfile | null,
  members: FamilyMember[]
): FillContext {
  if (subject.kind === 'self') return profileToFillContext(self);
  const m = members.find((x) => x.id === subject.memberId);
  return m ? familyMemberToFillContext(m) : {};
}

function formatNgaySinh(ctx: FillContext): string | undefined {
  if (ctx.birthDay && ctx.birthMonth && ctx.birthYear) {
    return `${ctx.birthDay}/${ctx.birthMonth}/${ctx.birthYear}`;
  }
  if (ctx.birthDay && ctx.birthMonth) {
    return `${ctx.birthDay}/${ctx.birthMonth}`;
  }
  return undefined;
}

/** Attach today's (or selected day's) date labels for prayer fill. */
export function withDayLabels(ctx: FillContext, info: DayInfo): FillContext {
  const { lunar, solar } = info;
  const leap = lunar.leap ? ' (nhuận)' : '';
  return {
    ...ctx,
    lunarDateLabel: `${lunar.day} tháng ${lunar.month}${leap} năm ${lunar.year} (${canChiYear(lunar.year)})`,
    solarDateLabel: `${solar.day}/${solar.month}/${solar.year}`,
  };
}

export function fillVanKhan(body: string, ctx: FillContext): string {
  const diaChi = ctx.address?.trim() || ctx.hometown?.trim() || ELLIPSIS;
  const map: Record<string, string> = {
    hoTen: ctx.fullName?.trim() || ELLIPSIS,
    gioiTinh: ctx.gender ? GENDER_LABEL[ctx.gender] : ELLIPSIS,
    namSinh: ctx.birthYear != null ? String(ctx.birthYear) : ELLIPSIS,
    ngaySinh: formatNgaySinh(ctx) || ELLIPSIS,
    canChiNam: ctx.birthYear != null ? canChiYear(ctx.birthYear) : ELLIPSIS,
    gioSinh: ctx.birthHourChi?.trim() || ELLIPSIS,
    queQuan: ctx.hometown?.trim() || ELLIPSIS,
    diaChi,
    diaChiCongViec: ctx.workAddress?.trim() || diaChi,
    huongLinh: ctx.memorialName?.trim() || ELLIPSIS,
    ngayAm: ctx.lunarDateLabel?.trim() || ELLIPSIS,
    ngayDuong: ctx.solarDateLabel?.trim() || ELLIPSIS,
  };

  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => map[key] ?? ELLIPSIS);
}

export function searchVanKhan(
  query: string,
  category?: VanKhanCategory | 'all'
): VanKhan[] {
  const q = query.trim().toLowerCase();
  return VAN_KHAN.filter((v) => {
    if (category && category !== 'all' && v.category.id !== category) return false;
    if (!q) return true;
    return (
      v.title.toLowerCase().includes(q) ||
      v.shortTitle.toLowerCase().includes(q) ||
      v.occasion.toLowerCase().includes(q) ||
      (v.summary?.toLowerCase().includes(q) ?? false) ||
      v.meaning.toLowerCase().includes(q) ||
      v.keywords.some((k) => k.toLowerCase().includes(q)) ||
      v.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

function occasionScore(v: VanKhan, info: DayInfo): number {
  let score = 0;
  const festIds = new Set(info.festivals.map((f) => f.id));
  const cat = v.category.id;
  const { day, month } = info.lunar;

  for (const tag of v.tags) {
    if (festIds.has(tag)) score += 40;
    if (tag.startsWith('mung1-') || tag === 'mung-1') {
      if (day === 1) score += 35;
      if ([...festIds].some((id) => id.startsWith('mung1-'))) score += 20;
    }
    if (tag.startsWith('ram-') || tag === 'ram') {
      if (day === 15) score += 35;
      if ([...festIds].some((id) => id.startsWith('ram-'))) score += 20;
    }
    if (tag === 'daily') score += 3;
    if (tag === 'giao-thua' && festIds.has('tat-nien')) score += 25;
    if (tag === 'than-tai' && day === 10 && month === 1) score += 50;
    if (tag === 'ong-tao' && festIds.has('ong-tao')) score += 45;
  }

  if (cat === 'tet' && (festIds.has('tet') || festIds.has('tat-nien') || festIds.has('ong-tao'))) {
    score += 30;
  }
  if (cat === 'dinh-ky' && (day === 1 || day === 15)) score += 25;
  if (cat === 'le-tiet') {
    for (const tag of v.tags) {
      if (festIds.has(tag)) score += 15;
    }
  }
  if (cat === 'tai-loc' && v.type === 'daily') score += 4;

  // Exact lunarDate match e.g. "15-07", "23-12", "01-01"
  if (v.lunarDate && /^\d{2}-\d{2}$/.test(v.lunarDate)) {
    const [d, m] = v.lunarDate.split('-').map(Number);
    if (d === day && m === month) score += 50;
  }
  if (v.lunarDate === '1, 15' && (day === 1 || day === 15)) score += 40;

  return score;
}

/** Top prayers for a given day (occasion ranking). */
export function rankVanKhanForDay(info: DayInfo, limit = 4): VanKhan[] {
  return [...VAN_KHAN]
    .map((v) => ({ v, score: occasionScore(v, info) }))
    .sort((a, b) => b.score - a.score || a.v.title.localeCompare(b.v.title, 'vi'))
    .filter((x) => x.score > 0)
    .slice(0, limit)
    .map((x) => x.v);
}

export { getVanKhanById, VAN_KHAN };
