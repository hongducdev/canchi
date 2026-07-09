/**
 * Daily quotes for home widgets and TodayHero.
 * Festival-tagged quotes win on matching days; otherwise festival name or a general quote.
 */

import { dateKey } from '../lib/lunar';
import type { DayInfo } from '../lib/types';

export type Quote = {
  id: string;
  text: string;
  /** Festival ids from `src/data/festivals.ts` this quote may attach to */
  festivalIds?: string[];
};

export type ResolvedQuote =
  | { kind: 'quote'; text: string; quoteId: string }
  | { kind: 'festival'; text: string; festivalId: string };

export const QUOTES: Quote[] = [
  {
    id: 'general-01',
    text: 'Một ngày tốt lành bắt đầu từ suy nghĩ tích cực và hành động đúng đắn.',
  },
  {
    id: 'general-02',
    text: 'Bình an trong tâm là khởi đầu của mọi điều tốt đẹp.',
  },
  {
    id: 'general-03',
    text: 'Mỗi ngày là một trang mới — hãy viết bằng lòng biết ơn.',
  },
  {
    id: 'general-04',
    text: 'Kiên nhẫn hôm nay là quả ngọt ngày mai.',
  },
  {
    id: 'general-05',
    text: 'Sống chậm lại một nhịp để nghe trái tim mình.',
  },
  {
    id: 'general-06',
    text: 'Điều nhỏ bé làm bằng cả tấm lòng cũng đủ làm ngày đẹp hơn.',
  },
  {
    id: 'general-07',
    text: 'Hãy chọn sự tử tế — với người khác và với chính mình.',
  },
  {
    id: 'general-08',
    text: 'Ánh sáng không cần ồn ào; chỉ cần hiện diện.',
  },
  {
    id: 'tet-01',
    text: 'Xuân về nhà ấm, Tết đến lòng vui — chúc một năm mới an khang thịnh vượng.',
    festivalIds: ['tet', 'mung2-tet', 'mung3-tet'],
  },
  {
    id: 'tet-duong-01',
    text: 'Năm mới bình an, vạn sự như ý.',
    festivalIds: ['tet-duong-lich'],
  },
  {
    id: 'hung-vuong-01',
    text: 'Uống nước nhớ nguồn — tưởng nhớ công đức Tổ Hùng.',
    festivalIds: ['gio-to-hung-vuong'],
  },
  {
    id: 'phat-dan-01',
    text: 'Từ bi mở lối, trí tuệ soi đường — kính mừng Đức Phật đản sinh.',
    festivalIds: ['phat-dan'],
  },
  {
    id: 'vu-lan-01',
    text: 'Vu Lan báo hiếu — nhớ ơn mẹ cha, đền đáp công dưỡng dục.',
    festivalIds: ['vu-lan'],
  },
  {
    id: 'trung-thu-01',
    text: 'Trăng rằm đoàn viên — chúc gia đình sum họp, trẻ thơ vui vẻ.',
    festivalIds: ['trung-thu'],
  },
  {
    id: 'quoc-khanh-01',
    text: 'Độc lập – Tự do – Hạnh phúc. Chúc mừng Quốc khánh.',
    festivalIds: ['quoc-khanh'],
  },
  {
    id: 'giang-sinh-01',
    text: 'Giáng Sinh an lành — sẻ chia yêu thương và hy vọng.',
    festivalIds: ['giang-sinh'],
  },
];

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickStable<T>(items: T[], key: string): T {
  return items[hashKey(key) % items.length]!;
}

export function resolveQuote(info: DayInfo): ResolvedQuote {
  const key = dateKey(info.solar);
  const festivalIds = new Set(info.festivals.map((f) => f.id));

  if (festivalIds.size > 0) {
    const tagged = QUOTES.filter((q) =>
      (q.festivalIds ?? []).some((id) => festivalIds.has(id))
    );
    if (tagged.length > 0) {
      const q = pickStable(tagged, key);
      return { kind: 'quote', text: q.text, quoteId: q.id };
    }
    const f = info.festivals[0]!;
    return { kind: 'festival', text: f.name, festivalId: f.id };
  }

  const general = QUOTES.filter((q) => !q.festivalIds || q.festivalIds.length === 0);
  const q = pickStable(general, key);
  return { kind: 'quote', text: q.text, quoteId: q.id };
}
