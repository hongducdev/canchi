# Home Screen Widgets (Android-first)

**Date:** 2026-07-09  
**Status:** Approved for planning  
**Direction:** Approach A (revised) — `react-native-android-widget` on Android (`expo-widgets` Android is a name-only stub in SDK 56)  
**Scope:** Five Android home-screen widgets + shared quote module used by widgets and `TodayHero`
**Out of scope:** Weather, Date Hero (A), large month grid (F), iOS QA/ship, Settings-driven widget prefs, editable widgets, Expo Go

## Goal

Ship four dark/light home-screen widgets that mirror the reference layouts (minus weather), powered by the existing offline lunar/`DayInfo` stack, plus a daily quote surface shared with the home hero.

## Design read

Reading this as: **glanceable Vietnamese lunar calendar on the Android home screen**, brand tokens **ink + vermillion + gold** adapting to system light/dark, layouts taken from the reference sheet (quote / small month / minimal date / combo), not a weather dashboard.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Platform | Android first; iOS may share code later, not required in phase 1 |
| Stack | `react-native-android-widget` (Android); development build required |
| Layouts | B Day Lore+Quote, C Month small, D Date Minimal, E Combo, G Day Detail (full today) |
| Theme | Follow system color scheme (light/dark) via widget environment |
| Quote body (B) | Prefer quote; festival-tagged quote when possible; else festival name |
| Quote reuse | Same `resolveQuote` in `TodayHero` |
| Week start (widgets) | Monday (T2) fixed in phase 1 — ignore app Settings |
| Tap | B/D → day detail; C/E → calendar tab |

## Layouts

### B — Day Lore + Quote (medium)

- **Header:** weekday + solar date · moon glyph · short lunar (`d/m ÂL`)
- **Body (primary):** resolved quote or festival name, centered, 2–3 lines max
- **Footer (secondary, muted):** optional can chi day · tiết khí; if festival shown as body, footer may show can chi instead of repeating the name
- No weather column

### C — Month small (small square)

- Header: `Tháng {m} {yyyy}` in accent
- 7-column grid: T2…CN; weekend columns red
- Today: filled accent/red circle
- Optional tiny lunar day under solar number when space allows

### D — Date Minimal (small square)

- Thin accent border
- Top: `THÁNG {m}` accent
- Center: large solar day
- Bottom: `Âm lịch` + short lunar (`d/m ÂL`)

### E — Combo (medium)

- Left: month label, large day, weekday, moon + short lunar
- Right: compact month grid (same rules as C)

### G — Day Detail (large)

Full today card (tap → day detail):

- Header bar: `Tháng {m} năm {yyyy}`
- Large solar day + weekday
- Left: can chi năm / tháng / ngày
- Right: large lunar day + `Âm lịch` + lunar month name (`MONTH_NAMES_VI`)
- `Hoàng Đạo` / `Hắc Đạo` + Lục Diệu star (`getNgayHoangDaoStar`)
- `Giờ Hoàng Đạo` list from `info.gioHoangDao`
- Footer CTA label `Xem chi tiết` (whole card opens `licham://day/{dateKey}`)

## Quote module

**File:** `src/data/quotes.ts`

```ts
type Quote = {
  id: string;
  text: string;
  /** Festival ids from `src/data/festivals.ts` this quote may attach to */
  festivalIds?: string[];
};

type ResolvedQuote =
  | { kind: 'quote'; text: string; quoteId: string }
  | { kind: 'festival'; text: string; festivalId: string };
```

### `resolveQuote(info: DayInfo): ResolvedQuote`

1. If `info.festivals.length > 0`:
   - Collect quotes whose `festivalIds` intersects any festival `id` for that day. If one match, use it; if several, pick by hashing `dateKey` among that list (stable for the day).
   - If none match → `{ kind: 'festival', text: festivals[0].name, festivalId: festivals[0].id }`.
2. Else: pick a general quote (`festivalIds` missing or empty) by hashing `dateKey` so the same day always shows the same quote.
3. Truncate display to ~2–3 lines at UI layer; keep full string in data.

Initial catalog: a modest set of general Vietnamese day quotes plus tagged entries for major festivals (`tet`, `gio-to-hung-vuong`, `phat-dan`, `vu-lan`, `trung-thu`, `quoc-khanh`, `tet-duong-lich`, etc.). Missing tags fall back to festival name — that is intentional, not an error.

### `TodayHero`

Add a quote line (or short block) under the lunar/chips area using `resolveQuote(info)`. Same truncation rules. Do not replace existing can chi / tiết khí chips.

## Architecture

```
App (TodayHero) ──┐
                  ├── src/data/quotes.ts (resolveQuote)
Widget bundle ────┤
                  ├── src/lib/dayInfo, lunar, festivals
                  └── src/widgets/{DayLore,MonthSmall,DateMinimal,Combo}
```

- Widgets compute `todaySolar()` → `buildDayInfo` on each render (offline).
- No network. Phase 1 does not read AsyncStorage settings for week-start / lunar-in-grid.
- Theme: map widget color scheme to existing `lightColors` / `darkColors` (or a slim widget token subset).
- Config: register four widgets in `app.json` / expo-widgets plugin with `enableAndroid: true`.
- Deep links: `licham://day/{dateKey}` and calendar route already used by the app.

## Refresh

- Widget timeline / midnight update so the solar day rolls over.
- On app foreground, request widget reload when the API allows.
- No push dependency.

## Edge cases

| Case | Behavior |
|------|----------|
| Multiple festivals | Prefer quote matching any; else first festival name |
| Long quote | Truncate 2–3 lines with ellipsis |
| Leap lunar month | Use existing `formatLunarShort` / leap marker |
| Light theme | Mist background, ink text, vermillion/gold accents — not a copy of the dark reference |
| Android experimental bugs | Stay on Approach A; document known `expo-widgets` Android caveats; patch/upgrade if resource linking fails |

## Testing

- Unit: `resolveQuote` — ordinary day; festival+tagged quote; festival+no tag; multi-festival; stable same-day pick.
- Smoke: four widget components render with mocked `DayInfo`.
- Manual (dev build Android): add each widget, toggle system light/dark, open via tap, verify day change after midnight (or simulated date if tooling allows).

## Non-goals (phase 1)

- Weather
- Layouts A and F from the reference sheet
- Shipping / QA iOS widgets (shared code OK)
- Widget configuration UI in Settings
- User-authored quotes
- Expo Go support
