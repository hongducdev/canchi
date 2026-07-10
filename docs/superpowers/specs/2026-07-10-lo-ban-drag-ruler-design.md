# Thước Lỗ Ban — kéo tương tác (phase 1)

**Date:** 2026-07-10  
**Status:** Approved — write plan after user reviews this spec  
**Screen:** `/lo-ban`

## Goal

Replace the static cycle bar with a **horizontal draggable ruler** (fixed center needle), matching the interaction pattern of common Lo Ban apps, while keeping Can Chi theme and current flat cung data.

## Locked decisions

| Topic | Choice |
|-------|--------|
| Interaction | Horizontal `ScrollView` + fixed center needle |
| Input | Drag primary + text field for precise cm (two-way sync) |
| Visual | Can Chi theme (light/dark tokens); borrow layout pattern only, not dark red/black chrome |
| Data depth | Flat cung only (phase 1); nested khoảng + tiểu cung = phase 2 |
| Rulers | Unchanged: 52.2 / 42.9 / 38.8 cm |
| Drag range | ~0–300 cm (enough for doors / furniture) |
| Precision | 0.1 cm |

## Out of scope (phase 2+)

- Nested cung (e.g. Quý Nhân → Phát Đạt)
- Expanding cung names/meanings beyond `loBan.ts`
- Magnetometer / camera measure

## UI layout (top → bottom)

1. Title + short subtitle  
2. Ruler type chips (existing three)  
3. Large cm readout (bubble / prominent number)  
4. Text input (cm) — syncs with scroll position  
5. **Ruler track**
   - Horizontally scrollable strip of repeating cycles (or one long strip 0…maxCm)
   - Segments colored good (jade) / bad (accent), labeled with cung name
   - Tick marks at 1 cm (minor) and labeled majors as needed
   - **Fixed needle** centered over the viewport (`pointerEvents="none"`)
6. Result card: tốt/xấu · tên cung · nghĩa · optional nearest good size  
7. Disclaimer

## Behavior

- Dragging updates `sizeCm` (0.1 cm) → `measureLoBan` → result card  
- Typing a valid size scrolls the ruler to that offset  
- Changing ruler type keeps `sizeCm`, recomputes cung  
- Invalid / empty input: no crash; show gentle empty/invalid hint; needle may stay at last valid or 0  
- Suggest good size: keep existing `suggestGoodSize` when current cung is bad  

## Technical

- Keep `src/lib/loBan.ts` API (`measureLoBan`, `suggestGoodSize`, `LO_BAN_RULERS`)  
- New UI component (e.g. `src/components/LoBanRulerTrack.tsx`) owned by `app/lo-ban.tsx`  
- Mapping: `pixelsPerCm` constant; `sizeCm = scrollX / pixelsPerCm` (with side padding so 0 and maxCm can sit under the needle)  
- Prefer RN `ScrollView` + `onScroll` (throttled); avoid Reanimated unless scroll jank appears  
- Works on native + web  

## Success criteria

- User can discover size by dragging without typing  
- Typed value and dragged value stay in sync  
- Active cung under the needle matches `measureLoBan`  
- Theme tokens only — no hard-coded reference-app chrome  
- Typecheck passes  
