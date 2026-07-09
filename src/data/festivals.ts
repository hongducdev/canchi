/**
 * Vietnamese traditional & national festivals (offline static data).
 */

import { addDays, solarToLunar, todaySolar } from '../lib/lunar';
import type { Festival, LunarDate, SolarDate } from '../lib/types';

export const FESTIVALS: Festival[] = [
  {
    id: 'tet',
    name: 'Tết Nguyên Đán',
    description: 'Mùng 1 Tết - đón năm mới Âm lịch',
    lunarDay: 1,
    lunarMonth: 1,
    ignoreLeap: true,
    category: 'tet',
  },
  {
    id: 'mung2-tet',
    name: 'Mùng 2 Tết',
    lunarDay: 2,
    lunarMonth: 1,
    ignoreLeap: true,
    category: 'tet',
  },
  {
    id: 'mung3-tet',
    name: 'Mùng 3 Tết',
    lunarDay: 3,
    lunarMonth: 1,
    ignoreLeap: true,
    category: 'tet',
  },
  {
    id: 'ram-thang-gieng',
    name: 'Rằm tháng Giêng',
    description: 'Tết Nguyên Tiêu / Lễ Thượng Nguyên',
    lunarDay: 15,
    lunarMonth: 1,
    ignoreLeap: true,
    category: 'ram',
  },
  {
    id: 'han-thuc',
    name: 'Tết Hàn Thực',
    description: 'Mùng 3 tháng 3 - bánh trôi, bánh chay',
    lunarDay: 3,
    lunarMonth: 3,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'gio-to-hung-vuong',
    name: 'Giỗ Tổ Hùng Vương',
    description: 'Mùng 10 tháng 3 Âm lịch',
    lunarDay: 10,
    lunarMonth: 3,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'phat-dan',
    name: 'Lễ Phật Đản',
    description: 'Rằm tháng 4 - Đức Phật ra đời',
    lunarDay: 15,
    lunarMonth: 4,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'doan-ngo',
    name: 'Tết Đoan Ngọ',
    description: 'Mùng 5 tháng 5 - diệt sâu bọ',
    lunarDay: 5,
    lunarMonth: 5,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'vu-lan',
    name: 'Lễ Vu Lan',
    description: 'Rằm tháng 7 - báo hiếu cha mẹ',
    lunarDay: 15,
    lunarMonth: 7,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'trung-thu',
    name: 'Tết Trung Thu',
    description: 'Rằm tháng 8 - tết thiếu nhi',
    lunarDay: 15,
    lunarMonth: 8,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'trung-cuu',
    name: 'Tết Trùng Cửu',
    description: 'Mùng 9 tháng 9',
    lunarDay: 9,
    lunarMonth: 9,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'ha-nguyen',
    name: 'Tết Hạ Nguyên',
    description: 'Rằm tháng 10',
    lunarDay: 15,
    lunarMonth: 10,
    ignoreLeap: true,
    category: 'ram',
  },
  {
    id: 'ong-tao',
    name: 'Ông Táo về trời',
    description: '23 tháng Chạp - cúng ông Công ông Táo',
    lunarDay: 23,
    lunarMonth: 12,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'tat-nien',
    name: 'Giao thừa / Tất niên',
    description: '30 tháng Chạp - đêm giao thừa',
    lunarDay: 30,
    lunarMonth: 12,
    ignoreLeap: true,
    category: 'tet',
  },
  {
    id: 'tet-duong-lich',
    name: 'Tết Dương lịch',
    solarDay: 1,
    solarMonth: 1,
    category: 'quoc-gia',
  },
  {
    id: 'valentine',
    name: 'Valentine',
    solarDay: 14,
    solarMonth: 2,
    category: 'khac',
  },
  {
    id: 'quoc-te-phu-nu',
    name: 'Quốc tế Phụ nữ',
    solarDay: 8,
    solarMonth: 3,
    category: 'quoc-gia',
  },
  {
    id: 'giai-phong',
    name: 'Ngày Giải phóng miền Nam',
    solarDay: 30,
    solarMonth: 4,
    category: 'quoc-gia',
  },
  {
    id: 'quoc-te-lao-dong',
    name: 'Quốc tế Lao động',
    solarDay: 1,
    solarMonth: 5,
    category: 'quoc-gia',
  },
  {
    id: 'quoc-te-thieu-nhi',
    name: 'Quốc tế Thiếu nhi',
    solarDay: 1,
    solarMonth: 6,
    category: 'quoc-gia',
  },
  {
    id: 'quoc-khanh',
    name: 'Quốc khánh',
    solarDay: 2,
    solarMonth: 9,
    category: 'quoc-gia',
  },
  {
    id: 'ngay-phu-nu-vn',
    name: 'Ngày Phụ nữ Việt Nam',
    solarDay: 20,
    solarMonth: 10,
    category: 'quoc-gia',
  },
  {
    id: 'ngay-nha-giao',
    name: 'Ngày Nhà giáo Việt Nam',
    solarDay: 20,
    solarMonth: 11,
    category: 'quoc-gia',
  },
  {
    id: 'giang-sinh',
    name: 'Giáng sinh',
    solarDay: 25,
    solarMonth: 12,
    category: 'khac',
  },
  {
    id: 'le-phat-thanh-dao',
    name: 'Lễ Phật Thành Đạo',
    description: 'Mùng 8 tháng Chạp - Đức Phật thành đạo',
    lunarDay: 8,
    lunarMonth: 12,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'via-quan-am',
    name: 'Vía Quan Âm',
    description: 'Rằm tháng 2 - vía Bồ Tát Quan Thế Âm',
    lunarDay: 19,
    lunarMonth: 2,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'le-phat-nhap-niet-ban',
    name: 'Lễ Phật nhập Niết Bàn',
    description: 'Rằm tháng 2',
    lunarDay: 15,
    lunarMonth: 2,
    ignoreLeap: true,
    category: 'le',
  },
  {
    id: 'halloween',
    name: 'Halloween',
    solarDay: 31,
    solarMonth: 10,
    category: 'khac',
  },
  {
    id: 'le-tinh-nhan-vn',
    name: 'Ngày Valentine trắng',
    solarDay: 14,
    solarMonth: 3,
    category: 'khac',
  },
  {
    id: 'ngay-gia-dinh-vn',
    name: 'Ngày Gia đình Việt Nam',
    solarDay: 28,
    solarMonth: 6,
    category: 'quoc-gia',
  },
  {
    id: 'ngay-thuong-binh',
    name: 'Ngày Thương binh Liệt sĩ',
    solarDay: 27,
    solarMonth: 7,
    category: 'quoc-gia',
  },
  {
    id: 'ngay-thanh-lap-qdnd',
    name: 'Ngày thành lập QĐND Việt Nam',
    solarDay: 22,
    solarMonth: 12,
    category: 'quoc-gia',
  },
];

function matchesLunar(f: Festival, lunar: LunarDate): boolean {
  if (f.lunarDay == null || f.lunarMonth == null) return false;
  if (f.ignoreLeap && lunar.leap) return false;
  return f.lunarDay === lunar.day && f.lunarMonth === lunar.month;
}

function matchesSolar(f: Festival, solar: SolarDate): boolean {
  if (f.solarDay == null || f.solarMonth == null) return false;
  return f.solarDay === solar.day && f.solarMonth === solar.month;
}

function isLastDayOfLunarMonth(lunar: LunarDate, solar: SolarDate): boolean {
  const next = addDays(solar, 1);
  const nextL = solarToLunar(next.day, next.month, next.year);
  return nextL.month !== lunar.month || nextL.year !== lunar.year || nextL.leap !== lunar.leap;
}

export function getFestivalsForDay(solar: SolarDate, lunar: LunarDate): Festival[] {
  const result: Festival[] = [];
  const seen = new Set<string>();

  for (const f of FESTIVALS) {
    let hit = matchesSolar(f, solar) || matchesLunar(f, lunar);
    if (
      !hit &&
      f.id === 'tat-nien' &&
      lunar.month === 12 &&
      !lunar.leap &&
      (lunar.day === 29 || lunar.day === 30) &&
      isLastDayOfLunarMonth(lunar, solar)
    ) {
      hit = true;
    }
    if (hit && !seen.has(f.id)) {
      seen.add(f.id);
      result.push(f);
    }
  }

  if (lunar.day === 1 && !result.some((f) => f.lunarDay === 1)) {
    result.push({
      id: `mung1-${lunar.month}`,
      name: `Mùng 1 tháng ${lunar.month}`,
      lunarDay: 1,
      lunarMonth: lunar.month,
      category: 'ram',
    });
  }
  if (
    lunar.day === 15 &&
    !result.some((f) => f.lunarDay === 15 && f.lunarMonth === lunar.month)
  ) {
    result.push({
      id: `ram-${lunar.month}`,
      name: `Rằm tháng ${lunar.month}`,
      lunarDay: 15,
      lunarMonth: lunar.month,
      category: 'ram',
    });
  }

  return result;
}

export function upcomingFestivals(
  from: SolarDate,
  limit = 12
): { festival: Festival; solar: SolarDate; lunar: LunarDate }[] {
  const out: { festival: Festival; solar: SolarDate; lunar: LunarDate }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < 400 && out.length < limit; i++) {
    const solar = addDays(from, i);
    const lunar = solarToLunar(solar.day, solar.month, solar.year);
    const list = getFestivalsForDay(solar, lunar).filter(
      (f) => f.category === 'tet' || f.category === 'le' || f.category === 'quoc-gia'
    );
    for (const f of list) {
      const key = `${f.id}-${solar.year}-${solar.month}-${solar.day}`;
      if (seen.has(key)) continue;
      if (f.id.startsWith('mung1-') || f.id.startsWith('ram-')) continue;
      seen.add(key);
      out.push({ festival: f, solar, lunar });
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Days until next Tết Nguyên Đán (lunar 1/1). */
export function tetCountdown(from: SolarDate = todaySolar()): {
  days: number;
  solar: SolarDate;
  lunar: LunarDate;
} {
  for (let i = 0; i < 400; i++) {
    const solar = addDays(from, i);
    const lunar = solarToLunar(solar.day, solar.month, solar.year);
    if (lunar.day === 1 && lunar.month === 1 && !lunar.leap) {
      return { days: i, solar, lunar };
    }
  }
  return {
    days: 0,
    solar: from,
    lunar: solarToLunar(from.day, from.month, from.year),
  };
}

export const CATEGORY_LABEL: Record<Festival['category'], string> = {
  tet: 'Tết',
  le: 'Lễ hội',
  ram: 'Rằm / Mùng 1',
  'quoc-gia': 'Quốc gia',
  khac: 'Quốc tế',
};
