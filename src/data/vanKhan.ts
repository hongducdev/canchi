/**
 * Offline Văn khấn catalog — loaded from `./vankhan.json`, normalized for fill + ranking.
 */

import rawCatalog from './vankhan.json';

export type VanKhanCategoryId =
  | 'dinh-ky'
  | 'tai-loc'
  | 'tet'
  | 'su-kien'
  | 'le-tiet'
  | 'hang-ngay'
  | 'khac';

/** @deprecated Prefer category.id */
export type VanKhanCategory = VanKhanCategoryId;

export type VanKhanType =
  | 'daily'
  | 'lunar-monthly'
  | 'lunar-yearly'
  | 'yearly'
  | 'special';

export type VanKhanOffering = {
  name: string;
  required: boolean;
};

export type VanKhanCategoryRef = {
  id: VanKhanCategoryId;
  name: string;
};

export type VanKhanPrayer = {
  title: string;
  content: string[];
};

export type VanKhan = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: VanKhanCategoryRef;
  occasion: string;
  type: VanKhanType;
  language: 'vi';
  region: string;
  keywords: string[];
  recommendedTime: string[];
  lunarDate: string | null;
  solarDate: string | null;
  offerings: VanKhanOffering[];
  preparation: string[];
  ritualSteps: string[];
  prayer: VanKhanPrayer;
  meaning: string;
  notes: string[];
  relatedPrayers: string[];
  version: number;
  /** Festival / occasion tags for “Phù hợp hôm nay” */
  tags: string[];
  /** Joined prayer text with {{placeholders}} */
  body: string;
  summary?: string;
};

type RawVanKhan = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: { id: string; name: string };
  occasion: string;
  type: string;
  language: string;
  region: string;
  keywords: string[];
  recommendedTime: string[];
  lunarDate: string | null;
  solarDate: string | null;
  offerings: VanKhanOffering[];
  preparation: string[];
  ritualSteps: string[];
  prayer: { title: string; content: string[] };
  meaning: string;
  notes: string[];
  relatedPrayers: string[];
  version: number;
};

export const VAN_KHAN_CATEGORY_LABEL: Record<VanKhanCategoryId, string> = {
  'dinh-ky': 'Định kỳ tháng',
  'tai-loc': 'Tài lộc',
  tet: 'Tết',
  'su-kien': 'Sự kiện',
  'le-tiet': 'Lễ tiết',
  'hang-ngay': 'Hằng ngày',
  khac: 'Khác',
};

/** Fix known typos / aliases in relatedPrayers from the JSON source */
const RELATED_ALIAS: Record<string, string> = {
  'mung-one-tet': 'mung-1-tet',
};

const PLACEHOLDER_PATTERNS: [RegExp, string][] = [
  [
    /Tín chủ con là: \[\.\.\.\] Ngụ tại: \[\.\.\.\]/g,
    'Tín chủ con là: {{hoTen}} Ngụ tại: {{diaChi}}',
  ],
  [
    /Tín chủ con là: \[\.\.\.\] Kinh doanh tại địa chỉ: \[\.\.\.\]/g,
    'Tín chủ con là: {{hoTen}} Kinh doanh tại địa chỉ: {{diaChiCongViec}}',
  ],
  [
    /Tín chủ con là: \[\.\.\.\] Địa chỉ xây dựng: \[\.\.\.\]/g,
    'Tín chủ con là: {{hoTen}} Địa chỉ xây dựng: {{diaChiCongViec}}',
  ],
  [
    /Tín chủ con là: \[\.\.\.\] Cửa hàng tại: \[\.\.\.\]/g,
    'Tín chủ con là: {{hoTen}} Cửa hàng tại: {{diaChiCongViec}}',
  ],
  [
    /kính lạy Hương linh: \[\.\.\.\]\./g,
    'kính lạy Hương linh: {{huongLinh}}.',
  ],
  [/Tín chủ con là: \[\.\.\.\]/g, 'Tín chủ con là: {{hoTen}}'],
  [/Hôm nay là ngày: \[\.\.\.\]/g, 'Hôm nay là ngày: {{ngayAm}}'],
  [/Hôm nay ngày: \[\.\.\.\]/g, 'Hôm nay ngày: {{ngayAm}}'],
  [/tại địa chỉ: \[\.\.\.\]/g, 'tại địa chỉ: {{diaChi}}'],
];

function injectPlaceholders(line: string): string {
  let s = line;
  for (const [re, rep] of PLACEHOLDER_PATTERNS) {
    s = s.replace(re, rep);
  }
  return s.replace(/\[\.\.\.\]/g, '……');
}

function asCategoryId(id: string): VanKhanCategoryId {
  switch (id) {
    case 'dinh-ky':
    case 'tai-loc':
    case 'tet':
    case 'su-kien':
    case 'le-tiet':
    case 'hang-ngay':
    case 'khac':
      return id;
    default:
      return 'khac';
  }
}

function asType(type: string): VanKhanType {
  switch (type) {
    case 'daily':
    case 'lunar-monthly':
    case 'lunar-yearly':
    case 'yearly':
    case 'special':
      return type;
    default:
      return 'special';
  }
}

function deriveTags(raw: RawVanKhan): string[] {
  const tags = new Set<string>();
  tags.add(raw.category.id);
  tags.add(raw.type);
  tags.add(raw.id);
  tags.add(raw.slug);

  const ld = raw.lunarDate;
  if (ld === '1, 15') {
    tags.add('mung-1');
    tags.add('ram');
  }
  if (ld === '15-01') tags.add('ram-thang-gieng');
  if (ld === '15-07') {
    tags.add('vu-lan');
    tags.add('ha-nguyen');
    tags.add('ram');
  }
  if (ld === '15-08') {
    tags.add('trung-thu');
    tags.add('ram');
  }
  if (ld === '01-01') {
    tags.add('tet');
    tags.add('mung1-1');
    tags.add('mung-1');
  }
  if (ld === '03-01') {
    tags.add('tet');
    tags.add('mung2-tet');
    tags.add('mung3-tet');
  }
  if (ld === '23-12') tags.add('ong-tao');
  if (ld === '30-12') {
    tags.add('tat-nien');
    tags.add('tet');
    tags.add('giao-thua');
  }

  if (raw.id.includes('giao-thua')) tags.add('giao-thua');
  if (raw.id.includes('than-tai')) tags.add('than-tai');
  if (raw.id === 'cung-gio') tags.add('gio');
  if (raw.type === 'daily') tags.add('daily');

  for (const kw of raw.keywords) {
    const k = kw.toLowerCase();
    if (k.includes('rằm') || k.includes('ram')) tags.add('ram');
    if (k.includes('mùng 1') || k.includes('mung 1')) tags.add('mung-1');
  }

  return [...tags];
}

function normalizeRelated(ids: string[]): string[] {
  return ids.map((id) => RELATED_ALIAS[id] ?? id);
}

function normalizeEntry(raw: RawVanKhan): VanKhan {
  const content = raw.prayer.content.map(injectPlaceholders);
  const categoryId = asCategoryId(raw.category.id);
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    shortTitle: raw.shortTitle,
    category: { id: categoryId, name: raw.category.name },
    occasion: raw.occasion,
    type: asType(raw.type),
    language: 'vi',
    region: raw.region,
    keywords: raw.keywords,
    recommendedTime: raw.recommendedTime,
    lunarDate: raw.lunarDate,
    solarDate: raw.solarDate,
    offerings: raw.offerings,
    preparation: raw.preparation,
    ritualSteps: raw.ritualSteps,
    prayer: { title: raw.prayer.title, content },
    meaning: raw.meaning,
    notes: raw.notes,
    relatedPrayers: normalizeRelated(raw.relatedPrayers),
    version: raw.version,
    tags: deriveTags(raw),
    body: content.join('\n'),
    summary: raw.occasion,
  };
}

export const VAN_KHAN: VanKhan[] = (rawCatalog as RawVanKhan[]).map(normalizeEntry);

export function getVanKhanById(id: string): VanKhan | undefined {
  return VAN_KHAN.find((v) => v.id === id || v.slug === id);
}

export function getRelatedVanKhan(item: VanKhan): VanKhan[] {
  return item.relatedPrayers
    .map((rid) => getVanKhanById(rid))
    .filter((v): v is VanKhan => Boolean(v));
}
