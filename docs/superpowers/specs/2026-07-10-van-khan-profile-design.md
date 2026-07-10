# Văn khấn + Hồ sơ + Điểm hợp ngày

**Date:** 2026-07-10  
**Status:** Approved for planning  
**Approach:** Lightweight split — static prayer catalog + user profile store + day↔person score on day detail  
**Out of scope (v1):** User-authored prayers, AI generation, cloud sync, web profile/Family forms, share/copy actions, score UI as primary surface inside Văn khấn

## Goal

Add **Văn khấn** under Settings → Công cụ: offline prayer templates with “Phù hợp hôm nay” ranking and profile-based placeholder fill. Add a **Hồ sơ của tôi** form (native) so the app can personalize prayer text and show a **day↔person compatibility score on the day detail screen**.

## Decisions locked

| Topic | Choice |
| --- | --- |
| Content model | Catalog + “Phù hợp hôm nay” (both) |
| Prayer source | Fixed offline templates (~10–15); no user edit in v1 |
| Profile fields | Full: name, gender, solar birth Y/M/D (min: name + year), optional lunar birth, birth hour (chi), hometown |
| Score meaning | Day↔person **and** prayer↔occasion ranking |
| Score placement | **Day↔person score lives on day detail** (`/day/[date]`), not as the main Văn khấn UI |
| Profile subjects | Primary self profile + optional Family member when filling prayers |
| Architecture | Approach 1 — `userProfile` store separate from Family; map Family → partial profile when selected |

## Data

### Prayer catalog — `src/data/vanKhan.ts`

```ts
type VanKhanCategory = 'tet' | 'gio' | 'cung' | 'ram' | 'le' | 'khac';

type VanKhan = {
  id: string;
  title: string;
  category: VanKhanCategory;
  tags: string[]; // e.g. 'ong-tao', 'ram', 'mung-1', festival ids
  body: string;   // may include {{placeholders}}
  summary?: string;
};
```

**Placeholders (replace when value exists):**  
`{{hoTen}}`, `{{gioiTinh}}`, `{{namSinh}}`, `{{ngaySinh}}`, `{{canChiNam}}`, `{{gioSinh}}`, `{{queQuan}}`  
Missing values → leave a clear ellipsis `……` (do not leave raw `{{…}}` in the filled view).

**v1 catalog themes (illustrative):** Giao thừa / ba ngày Tết, Giỗ gia tiên, Rằm / mùng 1, Ông Táo, Thổ Công / gia tiên, khai trương / nhập trạch — short–medium Vietnamese prose, culturally generic (disclaimer: tham khảo).

### User profile — `src/store/userProfile.ts`

Persist via Zustand + AsyncStorage (`licham-user-profile`).

```ts
type UserGender = 'male' | 'female' | 'other';

type UserProfile = {
  fullName: string;
  gender?: UserGender;
  birthYear?: number;          // solar — required for score
  birthMonth?: number;         // solar 1–12
  birthDay?: number;           // solar 1–31
  lunarBirthDay?: number;
  lunarBirthMonth?: number;
  birthHourChi?: string;       // e.g. 'Tý' … 'Hợi'
  hometown?: string;
  updatedAt: number;
};
```

- Native only for edit UI (web: hide HỒ SƠ row / redirect like Family).  
- Backup: current `AppBackup` is `version: 1` (notes + personalEvents + settings only). **v1 of this feature does not bump backup schema**; profile stays in its own AsyncStorage key. Optional follow-up: `version: 2` + `userProfile` field.

### Subject for fill / score

```ts
type ProfileSubject =
  | { kind: 'self' }
  | { kind: 'family'; memberId: string };
```

Resolve to a **fill context** (name + available birth fields). Family members may lack gender/hour/hometown → those placeholders become `……`.

## Scoring

### Day ↔ person — `src/lib/dayPersonScore.ts`

- **Shown on:** `app/day/[date].tsx` (section near lore / giờ hoàng đạo).  
- **Inputs:** `DayInfo` for that date + resolved profile (self by default in v1).  
- **Requires:** `birthYear` at minimum; otherwise hide score and show muted CTA → `/profile`.  
- **Output:** `{ score: 0–100, reasons: string[] }` with short cultural disclaimer.  
- **Heuristic (transparent, not astrology-grade):** start mid baseline; adjust for year-chi conflict with day chi, auspicious/inauspicious day flags, bad trực, major festival context, etc. Reuse existing `DayInfo` / lore / can chi helpers — do not invent a parallel calendar engine.

### Prayer ↔ occasion — inside `src/lib/vanKhan.ts`

- Rank catalog for “today” (or optional date later) by festival tags, lunar 1/15, Ông Táo window, category weights.  
- Powers **Phù hợp hôm nay** on `/van-khan` only — not the day-detail score card.

## UI / navigation

### Settings (`app/(tabs)/settings.tsx`)

- **CÔNG CỤ:** `ToolTile` **Văn khấn** — icon `book-outline`, subtitle “Mẫu khấn theo dịp · điền hồ sơ” → `/van-khan`.  
- **HỒ SƠ** (native): `SettingRow` **Hồ sơ của tôi** → `/profile`; subtitle = name or “Chưa thiết lập”.

### `/profile` — `app/profile.tsx`

Form for full profile fields; save / clear. Web → redirect Settings.

### `/van-khan` — `app/van-khan.tsx`

1. Header + one-line disclaimer.  
2. Subject chips: **Tôi** | Family members (if any).  
3. **Phù hợp hôm nay** list (2–4 items) from occasion ranking.  
4. Search + category chips + full catalog list → `/van-khan/[id]`.  
5. If no self profile: CTA to `/profile`; catalog still readable.

**Do not** put the day↔person score card here as the primary score UI (optional deep-link “Xem điểm ngày hôm nay” → today’s day route is fine).

### `/van-khan/[id]` — `app/van-khan/[id].tsx`

Title, category, filled body for selected subject; toggle **Bản gốc / Đã điền** when profile/subject has any fillable fields.

### Day detail — `app/day/[date].tsx`

New section **Điểm hợp** (or similar): score + reasons when `birthYear` present; else CTA to profile. Uses self profile in v1 (Family picker on day detail is out of scope unless trivial).

### Stack registration — `app/_layout.tsx`

Register `van-khan`, `van-khan/[id]`, `profile` with Vietnamese titles.

### Visual language

Match existing tools: `Screen`, `SectionHeader`, `Card`, filter chips, `AppText` / `AppTextInput`, theme tokens. No decorative card clutter.

## Files

| Create | Modify |
| --- | --- |
| `src/data/vanKhan.ts` | `app/(tabs)/settings.tsx` |
| `src/store/userProfile.ts` | `app/_layout.tsx` |
| `src/lib/vanKhan.ts` (search, fill, occasion rank) | `app/day/[date].tsx` |
| `src/lib/dayPersonScore.ts` | `src/lib/backup.ts` (if applicable) |
| `app/van-khan.tsx` | `README.md` |
| `app/van-khan/[id].tsx` | |
| `app/profile.tsx` | |

## Web

- Văn khấn list/detail: **available** (read-only catalog; fill only if profile somehow present — typically empty → ellipsis).  
- Profile form + Family subject chips that depend on native stores: follow existing web gates (hide / redirect).

## Success criteria

1. User can open Văn khấn from Công cụ, browse by category, open a prayer, see filled text after setting profile.  
2. “Phù hợp hôm nay” surfaces occasion-relevant prayers.  
3. Day detail shows day↔person score when birth year is set.  
4. Family member can be selected as fill subject on Văn khấn screens.  
5. No new network dependency; data stays on device.
