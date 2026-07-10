/**
 * Thước Lỗ Ban — nested cycle lookup for three common Vietnamese rulers.
 * Meanings are concise cultural references, not construction guidance.
 */

const EPSILON = 1e-9;

export type LoBanUnit = 'mm' | 'cm';

export function convertLoBanUnit(
  value: number,
  from: LoBanUnit,
  to: LoBanUnit
): number {
  if (from === to) return value;
  return from === 'mm' ? value / 10 : value * 10;
}

export type LoBanSmallCung = {
  name: string;
  meaning: string;
};

export type LoBanLargeCung = {
  name: string;
  good: boolean;
  meaning: string;
  smallCung: LoBanSmallCung[];
};

export type LoBanRulerId = 'duong-522' | 'duong-429' | 'am-388';

export type LoBanRuler = {
  id: LoBanRulerId;
  label: string;
  subtitle: string;
  cycleCm: number;
  cung: LoBanLargeCung[];
};

const CUNG_522: LoBanLargeCung[] = [
  {
    name: 'Quý Nhân',
    good: true,
    meaning: 'Được nâng đỡ, gia đạo và công việc thuận lợi.',
    smallCung: [
      { name: 'Quyền Lộc', meaning: 'Quyền thế và tài lộc.' },
      { name: 'Trung Tín', meaning: 'Quan hệ bền vững, đáng tin.' },
      { name: 'Tác Quan', meaning: 'Thuận đường công danh.' },
      { name: 'Phát Đạt', meaning: 'Làm ăn tiến triển.' },
      { name: 'Thông Minh', meaning: 'Học hành và trí tuệ tốt.' },
    ],
  },
  {
    name: 'Hiểm Họa',
    good: false,
    meaning: 'Cảnh báo hao tổn, bất an và trở ngại.',
    smallCung: [
      { name: 'Án Thành', meaning: 'Dễ vướng rắc rối, tranh chấp.' },
      { name: 'Hỗn Nhân', meaning: 'Gia đạo thiếu hòa thuận.' },
      { name: 'Thất Hiếu', meaning: 'Quan hệ gia đình bất ổn.' },
      { name: 'Tai Họa', meaning: 'Đề phòng việc bất ngờ.' },
      { name: 'Thường Bệnh', meaning: 'Sức khỏe dễ suy giảm.' },
    ],
  },
  {
    name: 'Thiên Tai',
    good: false,
    meaning: 'Dễ gặp mất mát, bệnh tật hoặc biến động.',
    smallCung: [
      { name: 'Hoàn Tử', meaning: 'Điềm bất lợi cho gia đạo.' },
      { name: 'Quan Tài', meaning: 'Cảnh báo tang sự, tổn thất.' },
      { name: 'Thân Tàn', meaning: 'Sức khỏe và thể trạng bất lợi.' },
      { name: 'Thất Tài', meaning: 'Hao hụt tiền của.' },
      { name: 'Hệ Quả', meaning: 'Hậu quả kéo dài từ việc xấu.' },
    ],
  },
  {
    name: 'Thiên Tài',
    good: true,
    meaning: 'May mắn, tài năng và phúc lộc phát triển.',
    smallCung: [
      { name: 'Thi Thơ', meaning: 'Thuận lợi văn chương, nghệ thuật.' },
      { name: 'Văn Học', meaning: 'Tốt cho học tập, tri thức.' },
      { name: 'Thanh Quý', meaning: 'Danh tiếng thanh cao.' },
      { name: 'Tác Lộc', meaning: 'Công việc sinh tài lộc.' },
      { name: 'Thiên Lộc', meaning: 'Được hưởng lộc trời.' },
    ],
  },
  {
    name: 'Nhân Lộc',
    good: true,
    meaning: 'Gia đình sung túc, nghề nghiệp bền vững.',
    smallCung: [
      { name: 'Trí Tồn', meaning: 'Trí tuệ và nền tảng lâu bền.' },
      { name: 'Phú Quý', meaning: 'Giàu sang và vị thế.' },
      { name: 'Tiến Bửu', meaning: 'Của cải tăng tiến.' },
      { name: 'Thập Thiện', meaning: 'Phúc lành nhờ việc thiện.' },
      { name: 'Văn Chương', meaning: 'Thuận lợi học hành, thi cử.' },
    ],
  },
  {
    name: 'Cô Độc',
    good: false,
    meaning: 'Cảnh báo chia lìa, cô quạnh và bất hòa.',
    smallCung: [
      { name: 'Bạc Nghịch', meaning: 'Quan hệ dễ phản trắc.' },
      { name: 'Vô Vọng', meaning: 'Khó đạt điều mong cầu.' },
      { name: 'Ly Tán', meaning: 'Gia đình hoặc cộng sự chia lìa.' },
      { name: 'Tửu Thực', meaning: 'Dễ sa đà, hao tổn.' },
      { name: 'Dâm Dục', meaning: 'Cảnh báo mất cân bằng tình cảm.' },
    ],
  },
  {
    name: 'Thiên Tặc',
    good: false,
    meaning: 'Dễ gặp trộm cắp, kiện tụng hoặc tai bay.',
    smallCung: [
      { name: 'Phong Bệnh', meaning: 'Sức khỏe bất ổn.' },
      { name: 'Chiêu Ôn', meaning: 'Dễ gặp bệnh dịch.' },
      { name: 'Ôn Tài', meaning: 'Bệnh tật gây hao tài.' },
      { name: 'Ngục Tù', meaning: 'Cảnh báo pháp lý, giam hãm.' },
      { name: 'Quang Tài', meaning: 'Hao tổn lớn, tang sự.' },
    ],
  },
  {
    name: 'Tể Tướng',
    good: true,
    meaning: 'Công danh, địa vị và gia đạo hanh thông.',
    smallCung: [
      { name: 'Đại Tài', meaning: 'Tài năng lớn được phát huy.' },
      { name: 'Thi Thơ', meaning: 'Danh tiếng về học vấn.' },
      { name: 'Hoạch Tài', meaning: 'Thu được tài lộc.' },
      { name: 'Hiếu Tử', meaning: 'Con cháu hiếu thuận.' },
      { name: 'Quý Nhân', meaning: 'Được người tốt hỗ trợ.' },
    ],
  },
];

const CUNG_429: LoBanLargeCung[] = [
  {
    name: 'Tài',
    good: true,
    meaning: 'Tài vận và phúc khí thuận lợi.',
    smallCung: [
      { name: 'Tài Đức', meaning: 'Có tài và có đức.' },
      { name: 'Bảo Khố', meaning: 'Tích lũy của cải.' },
      { name: 'Lục Hợp', meaning: 'Nhiều mặt cùng thuận.' },
      { name: 'Nghênh Phúc', meaning: 'Đón nhận điều lành.' },
    ],
  },
  {
    name: 'Bệnh',
    good: false,
    meaning: 'Cảnh báo sức khỏe, kiện tụng và hao tài.',
    smallCung: [
      { name: 'Thoát Tài', meaning: 'Tiền của thất thoát.' },
      { name: 'Công Sự', meaning: 'Dễ vướng tranh chấp.' },
      { name: 'Lao Chấp', meaning: 'Bị ràng buộc, tù túng.' },
      { name: 'Cô Quả', meaning: 'Cô đơn, thiếu người trợ giúp.' },
    ],
  },
  {
    name: 'Ly',
    good: false,
    meaning: 'Dễ chia lìa và mất mát.',
    smallCung: [
      { name: 'Trưởng Khố', meaning: 'Túng thiếu, phải cầm cố.' },
      { name: 'Kiếp Tài', meaning: 'Của cải bị chiếm đoạt.' },
      { name: 'Quan Quỷ', meaning: 'Công việc và pháp lý bất lợi.' },
      { name: 'Thất Thoát', meaning: 'Mất mát tiền của.' },
    ],
  },
  {
    name: 'Nghĩa',
    good: true,
    meaning: 'Gia đạo thuận hòa, gặp điều hay.',
    smallCung: [
      { name: 'Thêm Đinh', meaning: 'Gia đình thêm người.' },
      { name: 'Ích Lợi', meaning: 'Nhận được lợi ích.' },
      { name: 'Quý Tử', meaning: 'Con cái tốt lành.' },
      { name: 'Đại Cát', meaning: 'Nhiều việc may mắn.' },
    ],
  },
  {
    name: 'Quan',
    good: true,
    meaning: 'Công danh, tài lộc và vị thế tăng.',
    smallCung: [
      { name: 'Thuận Khoa', meaning: 'Học hành, thi cử thuận lợi.' },
      { name: 'Hoành Tài', meaning: 'Có thêm nguồn tài lộc.' },
      { name: 'Tiến Ích', meaning: 'Lợi ích ngày càng tăng.' },
      { name: 'Phú Quý', meaning: 'Giàu sang, danh vị.' },
    ],
  },
  {
    name: 'Kiếp',
    good: false,
    meaning: 'Cảnh báo tai nạn, ly biệt và tổn thất.',
    smallCung: [
      { name: 'Tử Biệt', meaning: 'Điềm chia lìa lớn.' },
      { name: 'Thoái Khẩu', meaning: 'Gia đạo hao người.' },
      { name: 'Ly Hương', meaning: 'Phải rời quê quán.' },
      { name: 'Tài Thất', meaning: 'Mất mát tiền của.' },
    ],
  },
  {
    name: 'Hại',
    good: false,
    meaning: 'Dễ gặp tai họa, bệnh tật và khẩu thiệt.',
    smallCung: [
      { name: 'Tai Chí', meaning: 'Tai họa bất ngờ.' },
      { name: 'Tử Tuyệt', meaning: 'Điềm suy kiệt, đoạn tuyệt.' },
      { name: 'Bệnh Lâm', meaning: 'Bệnh tật tìm đến.' },
      { name: 'Khẩu Thiệt', meaning: 'Tranh cãi vì lời nói.' },
    ],
  },
  {
    name: 'Bản',
    good: true,
    meaning: 'Nền tảng vững, công việc phát triển.',
    smallCung: [
      { name: 'Tài Chí', meaning: 'Tài lộc và chí hướng.' },
      { name: 'Đăng Khoa', meaning: 'Thi cử, học hành thành công.' },
      { name: 'Tiến Bảo', meaning: 'Của cải tăng thêm.' },
      { name: 'Hưng Vượng', meaning: 'Phát triển thịnh vượng.' },
    ],
  },
];

const CUNG_388: LoBanLargeCung[] = [
  {
    name: 'Đinh',
    good: true,
    meaning: 'Con cháu, học hành và tài lộc thuận.',
    smallCung: [
      { name: 'Phúc Tinh', meaning: 'Được sao phúc che chở.' },
      { name: 'Đỗ Đạt', meaning: 'Thi cử thành công.' },
      { name: 'Tài Vượng', meaning: 'Tiền của tăng tiến.' },
      { name: 'Đăng Khoa', meaning: 'Học hành thành danh.' },
    ],
  },
  {
    name: 'Hại',
    good: false,
    meaning: 'Dễ gặp bệnh tật và bất hòa.',
    smallCung: [
      { name: 'Họa Chí', meaning: 'Tai họa bất ngờ.' },
      { name: 'Khẩu Thiệt', meaning: 'Mang họa vì lời nói.' },
      { name: 'Tử Tuyệt', meaning: 'Điềm đoạn tuyệt.' },
      { name: 'Lâm Bệnh', meaning: 'Dễ mắc bệnh.' },
    ],
  },
  {
    name: 'Vượng',
    good: true,
    meaning: 'Vượng khí, hỷ sự và phúc lộc.',
    smallCung: [
      { name: 'Hỷ Sự', meaning: 'Có chuyện vui.' },
      { name: 'Tiến Bảo', meaning: 'Của cải tăng thêm.' },
      { name: 'Thiên Đức', meaning: 'Được phúc đức trời ban.' },
      { name: 'Thêm Phúc', meaning: 'Phúc lộc dồi dào.' },
    ],
  },
  {
    name: 'Khổ',
    good: false,
    meaning: 'Cảnh báo mất mát, tranh chấp và khó khăn.',
    smallCung: [
      { name: 'Thất Thoát', meaning: 'Mất mát của cải.' },
      { name: 'Kiếp Tài', meaning: 'Tài sản bị chiếm đoạt.' },
      { name: 'Quan Quỷ', meaning: 'Dễ vướng kiện tụng.' },
      { name: 'Vô Tự', meaning: 'Đường con cái bất lợi.' },
    ],
  },
  {
    name: 'Nghĩa',
    good: true,
    meaning: 'Gặp điều tốt, nhận lợi ích và tài lộc.',
    smallCung: [
      { name: 'Đại Cát', meaning: 'Nhiều việc tốt lành.' },
      { name: 'Tài Vượng', meaning: 'Tiền của dồi dào.' },
      { name: 'Ích Lợi', meaning: 'Nhận được lợi ích.' },
      { name: 'Thiên Khố', meaning: 'Kho báu trời cho.' },
    ],
  },
  {
    name: 'Quan',
    good: true,
    meaning: 'Giàu có, thi cử và công danh thuận.',
    smallCung: [
      { name: 'Phú Quý', meaning: 'Giàu sang, danh vị.' },
      { name: 'Tiến Bảo', meaning: 'Của cải tăng thêm.' },
      { name: 'Tài Lộc', meaning: 'Nhiều tiền của.' },
      { name: 'Thuận Khoa', meaning: 'Thi cử thuận lợi.' },
    ],
  },
  {
    name: 'Tử',
    good: false,
    meaning: 'Cảnh báo chia lìa và hao tổn.',
    smallCung: [
      { name: 'Ly Hương', meaning: 'Phải xa quê.' },
      { name: 'Tử Biệt', meaning: 'Điềm mất mát lớn.' },
      { name: 'Thất Tài', meaning: 'Mất tiền của.' },
      { name: 'Thoát Đinh', meaning: 'Gia đạo hao người.' },
    ],
  },
  {
    name: 'Hưng',
    good: true,
    meaning: 'Gia đạo và sự nghiệp hưng thịnh.',
    smallCung: [
      { name: 'Đăng Khoa', meaning: 'Thi cử đỗ đạt.' },
      { name: 'Quý Tử', meaning: 'Con cái ngoan giỏi.' },
      { name: 'Thêm Đinh', meaning: 'Gia đình thêm người.' },
      { name: 'Hưng Vượng', meaning: 'Làm ăn phát đạt.' },
    ],
  },
  {
    name: 'Thất',
    good: false,
    meaning: 'Dễ cô độc, hao tài và vướng công sự.',
    smallCung: [
      { name: 'Cô Quả', meaning: 'Cô đơn, thiếu trợ giúp.' },
      { name: 'Lao Chấp', meaning: 'Bị ràng buộc, tù túng.' },
      { name: 'Công Sự', meaning: 'Vướng việc cửa quan.' },
      { name: 'Thoát Tài', meaning: 'Tiền của thất thoát.' },
    ],
  },
  {
    name: 'Tài',
    good: true,
    meaning: 'Đón phúc, tài đức và của cải.',
    smallCung: [
      { name: 'Nghinh Phúc', meaning: 'Đón nhận phúc lành.' },
      { name: 'Tiến Bảo', meaning: 'Của cải tăng thêm.' },
      { name: 'Lục Hợp', meaning: 'Nhiều hướng cùng thuận.' },
      { name: 'Tài Đức', meaning: 'Có tiền tài và đức độ.' },
    ],
  },
];

export const LO_BAN_RULERS: LoBanRuler[] = [
  {
    id: 'duong-522',
    label: '52,2 cm',
    subtitle: 'Thông thủy · cửa, cửa sổ, ô thoáng',
    cycleCm: 52.2,
    cung: CUNG_522,
  },
  {
    id: 'duong-429',
    label: '42,9 cm',
    subtitle: 'Khối đặc · bếp, bệ, bậc, nội thất',
    cycleCm: 42.9,
    cung: CUNG_429,
  },
  {
    id: 'am-388',
    label: '38,8 cm',
    subtitle: 'Âm phần · bàn thờ, tủ thờ, mộ phần',
    cycleCm: 38.8,
    cung: CUNG_388,
  },
];

export function getLoBanRuler(id: LoBanRulerId): LoBanRuler {
  return LO_BAN_RULERS.find((ruler) => ruler.id === id) ?? LO_BAN_RULERS[0]!;
}

export type LoBanResult = {
  ruler: LoBanRuler;
  sizeCm: number;
  offsetCm: number;
  largeCungIndex: number;
  smallCungIndex: number;
  largeCung: LoBanLargeCung;
  smallCung: LoBanSmallCung;
  largeSegmentCm: number;
  smallSegmentCm: number;
};

function normalizedOffset(sizeCm: number, cycleCm: number): number {
  const rawOffset = ((sizeCm % cycleCm) + cycleCm) % cycleCm;
  return rawOffset < EPSILON || cycleCm - rawOffset < EPSILON ? 0 : rawOffset;
}

export function measureLoBan(rulerId: LoBanRulerId, sizeCm: number): LoBanResult | null {
  if (!Number.isFinite(sizeCm) || sizeCm <= 0) return null;

  const ruler = getLoBanRuler(rulerId);
  const offsetCm = normalizedOffset(sizeCm, ruler.cycleCm);
  const largeSegmentCm = ruler.cycleCm / ruler.cung.length;
  const largeCungIndex = Math.min(
    ruler.cung.length - 1,
    Math.floor((offsetCm + EPSILON) / largeSegmentCm)
  );
  const largeCung = ruler.cung[largeCungIndex]!;
  const offsetInLargeCung = Math.max(0, offsetCm - largeCungIndex * largeSegmentCm);
  const smallSegmentCm = largeSegmentCm / largeCung.smallCung.length;
  const smallCungIndex = Math.min(
    largeCung.smallCung.length - 1,
    Math.floor((offsetInLargeCung + EPSILON) / smallSegmentCm)
  );

  return {
    ruler,
    sizeCm,
    offsetCm,
    largeCungIndex,
    smallCungIndex,
    largeCung,
    smallCung: largeCung.smallCung[smallCungIndex]!,
    largeSegmentCm,
    smallSegmentCm,
  };
}

export function measureAllLoBan(sizeCm: number): LoBanResult[] {
  if (!Number.isFinite(sizeCm) || sizeCm <= 0) return [];
  return LO_BAN_RULERS.map((ruler) => measureLoBan(ruler.id, sizeCm)).filter(
    (result): result is LoBanResult => result !== null
  );
}

/** Nearest size at or above sizeCm that lands at the center of a good large cung. */
export function suggestGoodSize(
  rulerId: LoBanRulerId,
  sizeCm: number,
  maxAheadCm = 40
): number | null {
  if (!Number.isFinite(sizeCm) || sizeCm <= 0) return null;

  const ruler = getLoBanRuler(rulerId);
  const largeSegmentCm = ruler.cycleCm / ruler.cung.length;
  const baseCycle = Math.floor(sizeCm / ruler.cycleCm);
  let best: number | null = null;

  for (let cycle = baseCycle; cycle <= baseCycle + 3; cycle++) {
    for (let index = 0; index < ruler.cung.length; index++) {
      if (!ruler.cung[index]!.good) continue;
      const candidate =
        Math.round(
          (cycle * ruler.cycleCm + index * largeSegmentCm + largeSegmentCm / 2) * 100
        ) / 100;
      const distance = candidate - sizeCm;
      if (distance < -EPSILON || distance > maxAheadCm) continue;
      if (best === null || candidate < best) best = candidate;
    }
  }

  return best;
}
