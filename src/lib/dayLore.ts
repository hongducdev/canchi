/**
 * Traditional day lore: Trực, 28 Tú, stars, directions, activities.
 * Offline heuristics aligned with common Vietnamese almanac tables.
 */

import {
  CAN,
  CHI,
  CHI_ANIMALS,
  nguHanhOfCan,
  parseCanChi,
} from './canChi';

export const THAP_NHI_KIEN_TRU = [
  'Kiến',
  'Trừ',
  'Mãn',
  'Bình',
  'Định',
  'Chấp',
  'Phá',
  'Nguy',
  'Thành',
  'Thu',
  'Khai',
  'Bế',
] as const;

export const TRUC_MEANING: Record<(typeof THAP_NHI_KIEN_TRU)[number], string> = {
  Kiến: 'Tốt cho khởi sự, xuất hành',
  Trừ: 'Tốt trừ bệnh, phá bỏ',
  Mãn: 'Tốt cầu tài, tế tự',
  Bình: 'Ngày bình thường, việc nhỏ',
  Định: 'Tốt an cư, mở hàng',
  Chấp: 'Tốt thu hoạch, bắt đầu học',
  Phá: 'Nên tránh khởi công lớn',
  Nguy: 'Cẩn trọng, tránh rủi ro',
  Thành: 'Tốt thành hôn, khai trương',
  Thu: 'Tốt thu hoạch, nhập kho',
  Khai: 'Tốt khai trương, xuất hành',
  Bế: 'Nên đóng, tránh khởi sự',
};

export const NHI_THAP_BAT_TU = [
  'Giác',
  'Cang',
  'Đê',
  'Phòng',
  'Tâm',
  'Vĩ',
  'Cơ',
  'Đẩu',
  'Ngưu',
  'Nữ',
  'Hư',
  'Nguy',
  'Thất',
  'Bích',
  'Khuê',
  'Lâu',
  'Vị',
  'Mão',
  'Tất',
  'Chủy',
  'Sâm',
  'Tỉnh',
  'Quỷ',
  'Liễu',
  'Tinh',
  'Trương',
  'Dực',
  'Chẩn',
] as const;

/** Simplified auspicious / inauspicious mansion sets used in folk almanacs. */
const TU_TOT = new Set([
  'Giác',
  'Đê',
  'Phòng',
  'Tâm',
  'Cơ',
  'Đẩu',
  'Nữ',
  'Hư',
  'Thất',
  'Bích',
  'Khuê',
  'Vị',
  'Tất',
  'Sâm',
  'Tỉnh',
  'Liễu',
  'Trương',
  'Dực',
  'Chẩn',
]);

export const DIRECTIONS = [
  'Bắc',
  'Đông Bắc',
  'Đông',
  'Đông Nam',
  'Nam',
  'Tây Nam',
  'Tây',
  'Tây Bắc',
] as const;

/** Thần Tài direction by day Can index. */
const THAN_TAI_BY_CAN = [
  'Đông Nam', // Giáp
  'Đông Nam', // Ất
  'Đông', // Bính
  'Đông', // Đinh
  'Bắc', // Mậu
  'Bắc', // Kỷ
  'Tây Nam', // Canh
  'Tây Nam', // Tân
  'Nam', // Nhâm
  'Nam', // Quý
] as const;

/** Hỷ Thần direction by day Can index. */
const HY_THAN_BY_CAN = [
  'Đông Bắc', // Giáp
  'Tây Bắc', // Ất
  'Tây Nam', // Bính
  'Đông Nam', // Đinh
  'Đông Nam', // Mậu
  'Đông Bắc', // Kỷ
  'Tây Bắc', // Canh
  'Tây Nam', // Tân
  'Đông Nam', // Nhâm
  'Đông Bắc', // Quý
] as const;

const GOOD_STARS = [
  'Thiên Đức',
  'Nguyệt Đức',
  'Thiên Hỷ',
  'Thiên Quý',
  'Sinh Khí',
  'Thiên Phú',
] as const;

const BAD_STARS = [
  'Tam Nương',
  'Nguyệt Kỵ',
  'Thiên Cương',
  'Thụ Tử',
  'Hoang Vu',
  'Sát Chủ',
] as const;

const ACTIVITIES_BY_TRUC: Record<
  (typeof THAP_NHI_KIEN_TRU)[number],
  { good: string[]; bad: string[] }
> = {
  Kiến: {
    good: ['Khởi công', 'Xuất hành', 'Cầu tài'],
    bad: ['Động thổ lớn', 'An táng'],
  },
  Trừ: {
    good: ['Trừ bệnh', 'Phá dỡ', 'Thanh lọc'],
    bad: ['Khai trương', 'Cưới hỏi'],
  },
  Mãn: {
    good: ['Tế tự', 'Cầu phúc', 'Nhập học'],
    bad: ['Kiện tụng', 'Xuất quân'],
  },
  Bình: {
    good: ['Việc thường ngày', 'Gặp gỡ'],
    bad: ['Khởi sự lớn'],
  },
  Định: {
    good: ['An cư', 'Mở hàng', 'Ký kết'],
    bad: ['Di chuyển lớn'],
  },
  Chấp: {
    good: ['Thu hoạch', 'Bắt đầu học', 'Nhập kho'],
    bad: ['Xuất hành xa'],
  },
  Phá: {
    good: ['Phá dỡ', 'Sửa chữa'],
    bad: ['Cưới hỏi', 'Khai trương', 'Động thổ'],
  },
  Nguy: {
    good: ['Cầu an', 'Tu tập'],
    bad: ['Xuất hành', 'Phẫu thuật', 'Kiện tụng'],
  },
  Thành: {
    good: ['Thành hôn', 'Khai trương', 'Ký hợp đồng'],
    bad: ['Phá dỡ', 'Khiếu kiện'],
  },
  Thu: {
    good: ['Thu hoạch', 'Nhập kho', 'Thanh toán'],
    bad: ['Cho vay lớn'],
  },
  Khai: {
    good: ['Khai trương', 'Xuất hành', 'Mở cửa hàng'],
    bad: ['An táng', 'Đóng cửa'],
  },
  Bế: {
    good: ['Đóng cửa', 'Tu sửa nội thất'],
    bad: ['Khởi công', 'Khai trương', 'Xuất hành'],
  },
};

export type DayLore = {
  thienCan: string;
  diaChi: string;
  zodiacYear: string;
  nguHanh: string;
  truc: (typeof THAP_NHI_KIEN_TRU)[number];
  trucMeaning: string;
  nhiThapBatTu: (typeof NHI_THAP_BAT_TU)[number];
  isAuspiciousDay: boolean;
  isInauspiciousDay: boolean;
  goodStars: string[];
  badStars: string[];
  conflictingAges: string[];
  luckyDirections: string[];
  wealthGodDirection: string;
  happinessGodDirection: string;
  departureHours: string[];
  activitiesRecommended: string[];
  activitiesToAvoid: string[];
};

function dayCanIndex(jd: number): number {
  return (jd + 9) % 10;
}

function dayChiIndex(jd: number): number {
  return (jd + 1) % 12;
}

/** Thập Nhị Kiến Trừ from lunar month + day Chi. */
export function getTruc(
  lunarMonth: number,
  jd: number
): (typeof THAP_NHI_KIEN_TRU)[number] {
  const monthChi = (lunarMonth + 1) % 12; // Giêng → Dần (2)
  const chi = dayChiIndex(jd);
  const idx = (chi - monthChi + 12) % 12;
  return THAP_NHI_KIEN_TRU[idx];
}

/** 28 lunar mansions; offset calibrated to common VN almanac tables. */
export function getNhiThapBatTu(jd: number): (typeof NHI_THAP_BAT_TU)[number] {
  return NHI_THAP_BAT_TU[(jd + 12) % 28];
}

export function buildDayLore(
  jd: number,
  canChiDay: string,
  canChiYear: string,
  lunarMonth: number,
  hoangDaoNames: string[]
): DayLore {
  const { can, chi } = parseCanChi(canChiDay);
  const canIdx = dayCanIndex(jd);
  const chiIdx = dayChiIndex(jd);
  const truc = getTruc(lunarMonth, jd);
  const tu = getNhiThapBatTu(jd);
  const acts = ACTIVITIES_BY_TRUC[truc];
  const yearChi = parseCanChi(canChiYear).chi;
  const yearAnimal = CHI_ANIMALS[CHI.indexOf(yearChi as (typeof CHI)[number])] ?? yearChi;

  const conflictChi = CHI[(chiIdx + 6) % 12];
  const conflictAnimal = CHI_ANIMALS[(chiIdx + 6) % 12];

  const goodStars = GOOD_STARS.filter((_, i) => (canIdx + i) % 3 !== 0).slice(0, 3);
  const badStars = BAD_STARS.filter((_, i) => (chiIdx + i) % 4 === 0).slice(0, 2);

  const isAuspiciousDay =
    (truc === 'Thành' || truc === 'Khai' || truc === 'Định' || truc === 'Kiến') &&
    TU_TOT.has(tu);
  const isInauspiciousDay =
    truc === 'Phá' || truc === 'Nguy' || truc === 'Bế' || !TU_TOT.has(tu);

  const wealth = THAN_TAI_BY_CAN[canIdx];
  const happiness = HY_THAN_BY_CAN[canIdx];
  const luckyDirections = Array.from(new Set([wealth, happiness, DIRECTIONS[canIdx % 8]]));

  return {
    thienCan: can || CAN[canIdx],
    diaChi: chi || CHI[chiIdx],
    zodiacYear: yearAnimal,
    nguHanh: nguHanhOfCan(can) || '',
    truc,
    trucMeaning: TRUC_MEANING[truc],
    nhiThapBatTu: tu,
    isAuspiciousDay,
    isInauspiciousDay: isInauspiciousDay && !isAuspiciousDay,
    goodStars,
    badStars,
    conflictingAges: [`Tuổi ${conflictAnimal} (${conflictChi})`],
    luckyDirections,
    wealthGodDirection: wealth,
    happinessGodDirection: happiness,
    departureHours: hoangDaoNames.slice(0, 4),
    activitiesRecommended: acts.good,
    activitiesToAvoid: acts.bad,
  };
}
