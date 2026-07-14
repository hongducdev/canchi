/**
 * Vietnamese traditional, national, and international observances (offline static data).
 */

import { addDays, solarToLunar, todaySolar } from '../lib/lunar';
import type { Festival, LunarDate, SolarDate } from '../lib/types';

/** Curated fixed-date observances from the international calendar. */
const INTERNATIONAL_OBSERVANCES: Festival[] = [
  { id: 'quoc-te-giao-duc', name: 'Ngày Quốc tế Giáo dục', solarDay: 24, solarMonth: 1, category: 'khac' },
  { id: 'tieng-me-de', name: 'Ngày Tiếng mẹ đẻ Quốc tế', solarDay: 21, solarMonth: 2, category: 'khac' },
  { id: 'quoc-te-hanh-phuc', name: 'Ngày Quốc tế Hạnh phúc', solarDay: 20, solarMonth: 3, category: 'khac' },
  { id: 'nuoc-the-gioi', name: 'Ngày Nước Thế giới', solarDay: 22, solarMonth: 3, category: 'khac' },
  { id: 'nhan-thuc-tu-ky', name: 'Ngày Thế giới Nhận thức Tự kỷ', solarDay: 2, solarMonth: 4, category: 'khac' },
  { id: 'suc-khoe-the-gioi', name: 'Ngày Sức khỏe Thế giới', solarDay: 7, solarMonth: 4, category: 'khac' },
  { id: 'me-trai-dat', name: 'Ngày Quốc tế Mẹ Trái Đất', solarDay: 22, solarMonth: 4, category: 'khac' },
  { id: 'sach-ban-quyen', name: 'Ngày Sách và Bản quyền Thế giới', solarDay: 23, solarMonth: 4, category: 'khac' },
  { id: 'tu-do-bao-chi', name: 'Ngày Tự do Báo chí Thế giới', solarDay: 3, solarMonth: 5, category: 'khac' },
  { id: 'da-dang-sinh-hoc', name: 'Ngày Quốc tế Đa dạng Sinh học', solarDay: 22, solarMonth: 5, category: 'khac' },
  { id: 'khong-thuoc-la', name: 'Ngày Thế giới Không Thuốc lá', solarDay: 31, solarMonth: 5, category: 'khac' },
  { id: 'dai-duong-the-gioi', name: 'Ngày Đại dương Thế giới', solarDay: 8, solarMonth: 6, category: 'khac' },
  { id: 'hien-mau-the-gioi', name: 'Ngày Hiến máu Thế giới', solarDay: 14, solarMonth: 6, category: 'khac' },
  { id: 'quoc-te-yoga', name: 'Ngày Quốc tế Yoga', solarDay: 21, solarMonth: 6, category: 'khac' },
  { id: 'dan-so-the-gioi', name: 'Ngày Dân số Thế giới', solarDay: 11, solarMonth: 7, category: 'khac' },
  { id: 'huu-nghi-quoc-te', name: 'Ngày Hữu nghị Quốc tế', solarDay: 30, solarMonth: 7, category: 'khac' },
  { id: 'thanh-thieu-nien-quoc-te', name: 'Ngày Quốc tế Thanh Thiếu niên', solarDay: 12, solarMonth: 8, category: 'khac' },
  { id: 'quoc-te-biet-chu', name: 'Ngày Quốc tế Biết chữ', solarDay: 8, solarMonth: 9, category: 'khac' },
  { id: 'du-lich-the-gioi', name: 'Ngày Du lịch Thế giới', solarDay: 27, solarMonth: 9, category: 'khac' },
  { id: 'nha-giao-the-gioi', name: 'Ngày Nhà giáo Thế giới', solarDay: 5, solarMonth: 10, category: 'khac' },
  { id: 'luong-thuc-the-gioi', name: 'Ngày Lương thực Thế giới', solarDay: 16, solarMonth: 10, category: 'khac' },
  { id: 'lien-hop-quoc', name: 'Ngày Liên Hợp Quốc', solarDay: 24, solarMonth: 10, category: 'khac' },
  { id: 'dai-thao-duong-the-gioi', name: 'Ngày Thế giới Phòng chống Đái tháo đường', solarDay: 14, solarMonth: 11, category: 'khac' },
  { id: 'quoc-te-nam-gioi', name: 'Ngày Quốc tế Nam giới', solarDay: 19, solarMonth: 11, category: 'khac' },
  { id: 'thieu-nhi-the-gioi', name: 'Ngày Thiếu nhi Thế giới', solarDay: 20, solarMonth: 11, category: 'khac' },
  { id: 'phong-chong-aids', name: 'Ngày Thế giới Phòng chống AIDS', solarDay: 1, solarMonth: 12, category: 'khac' },
  { id: 'nguoi-khuyet-tat', name: 'Ngày Quốc tế Người khuyết tật', solarDay: 3, solarMonth: 12, category: 'khac' },
  { id: 'tinh-nguyen-quoc-te', name: 'Ngày Tình nguyện Quốc tế', solarDay: 5, solarMonth: 12, category: 'khac' },
  { id: 'nhan-quyen-quoc-te', name: 'Ngày Nhân quyền Quốc tế', solarDay: 10, solarMonth: 12, category: 'khac' },
];

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
    name: 'Ngày Quốc tế Phụ nữ',
    solarDay: 8,
    solarMonth: 3,
    category: 'khac',
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
    name: 'Ngày Quốc tế Thiếu nhi',
    solarDay: 1,
    solarMonth: 6,
    category: 'khac',
  },
  {
    id: 'quoc-te-gia-dinh',
    name: 'Ngày Quốc tế Gia đình',
    description: 'Ngày nâng cao nhận thức về các vấn đề liên quan đến gia đình',
    solarDay: 15,
    solarMonth: 5,
    category: 'khac',
  },
  {
    id: 'moi-truong-the-gioi',
    name: 'Ngày Môi trường Thế giới',
    description: 'Ngày hành động vì môi trường trên toàn cầu',
    solarDay: 5,
    solarMonth: 6,
    category: 'khac',
  },
  {
    id: 'quoc-te-hoa-binh',
    name: 'Ngày Quốc tế Hòa bình',
    description: 'Ngày thúc đẩy hòa bình và chấm dứt bạo lực',
    solarDay: 21,
    solarMonth: 9,
    category: 'khac',
  },
  {
    id: 'quoc-te-nguoi-cao-tuoi',
    name: 'Ngày Quốc tế Người cao tuổi',
    description: 'Ngày ghi nhận đóng góp và quyền của người cao tuổi',
    solarDay: 1,
    solarMonth: 10,
    category: 'khac',
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
  ...INTERNATIONAL_OBSERVANCES,
];

function festivalDateKey(day: number, month: number): string {
  return `${month}-${day}`;
}

function indexFestivals(
  dayField: 'solarDay' | 'lunarDay',
  monthField: 'solarMonth' | 'lunarMonth',
): Map<string, Festival[]> {
  const index = new Map<string, Festival[]>();
  for (const festival of FESTIVALS) {
    const day = festival[dayField];
    const month = festival[monthField];
    if (day == null || month == null) continue;
    const key = festivalDateKey(day, month);
    const current = index.get(key);
    if (current) current.push(festival);
    else index.set(key, [festival]);
  }
  return index;
}

const SOLAR_FESTIVAL_INDEX = indexFestivals('solarDay', 'solarMonth');
const LUNAR_FESTIVAL_INDEX = indexFestivals('lunarDay', 'lunarMonth');
const TAT_NIEN_FESTIVAL = FESTIVALS.find((festival) => festival.id === 'tat-nien');
const FESTIVAL_ORDER = new Map(
  FESTIVALS.map((festival, index) => [festival.id, index]),
);

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

  const addFestival = (festival: Festival) => {
    if (seen.has(festival.id)) return;
    seen.add(festival.id);
    result.push(festival);
  };

  for (const festival of SOLAR_FESTIVAL_INDEX.get(
    festivalDateKey(solar.day, solar.month),
  ) ?? []) {
    if (matchesSolar(festival, solar)) addFestival(festival);
  }
  for (const festival of LUNAR_FESTIVAL_INDEX.get(
    festivalDateKey(lunar.day, lunar.month),
  ) ?? []) {
    if (matchesLunar(festival, lunar)) addFestival(festival);
  }

  if (
    TAT_NIEN_FESTIVAL &&
    !seen.has(TAT_NIEN_FESTIVAL.id) &&
    lunar.month === 12 &&
    !lunar.leap &&
    (lunar.day === 29 || lunar.day === 30) &&
    isLastDayOfLunarMonth(lunar, solar)
  ) {
    addFestival(TAT_NIEN_FESTIVAL);
  }

  result.sort(
    (a, b) => (FESTIVAL_ORDER.get(a.id) ?? 0) - (FESTIVAL_ORDER.get(b.id) ?? 0),
  );

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
    const list = getFestivalsForDay(solar, lunar).filter((f) => f.category !== 'ram');
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
