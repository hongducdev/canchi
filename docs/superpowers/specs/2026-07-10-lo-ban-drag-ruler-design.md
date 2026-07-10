# Thước Lỗ Ban — ba thước kéo đồng bộ

**Date:** 2026-07-10  
**Status:** Implemented
**Screen:** `/lo-ban`

## Goal

Build a complete offline Lo Ban lookup tool inspired by the interaction at
`https://phanhoanggia.com/thuoc-lo-ban/`: one draggable measurement axis, three
synchronized rulers, nested large/small cung, and detailed results. The app
uses independently structured data and concise original explanations rather
than copying the reference site's prose.

## Locked decisions

- Show all three rulers at once.
- Use one horizontal `ScrollView` and one fixed center needle.
- Support both millimeters and centimeters with an explicit unit toggle.
- Normalize calculations internally to centimeters.
- Drag range: 0–1,000 cm.
- Typed values may exceed 1,000 cm and are evaluated by repeating cycles.
- Use the traditional convention: good cung are red, bad cung are black.
- The needle is gold so it remains visible over both colors.
- Include both large and small cung plus a result card for each ruler.

## Correct ruler definitions

The existing data is assigned to the wrong ruler types and must be replaced:

1. **52.2 cm — thông thủy**
   - 8 large cung × 5 small cung.
   - Large cung: Quý Nhân, Hiểm Họa, Thiên Tai, Thiên Tài, Nhân Lộc,
     Cô Độc, Thiên Tặc, Tể Tướng.
2. **42.9 cm — khối đặc / dương trạch**
   - 8 large cung × 4 small cung.
   - Large cung: Tài, Bệnh, Ly, Nghĩa, Quan, Kiếp, Hại, Bản.
   - “Kiếp/Bản” are normalized display names for sources that use “Nạn/Mạng”.
3. **38.8 cm — âm phần / đồ thờ**
   - 10 large cung × 4 small cung.
   - Large cung: Đinh, Hại, Vượng, Khổ, Nghĩa, Quan, Tử, Hưng, Thất, Tài.

Published sources differ between rounded physical-ruler lengths (for example
39 cm) and nominal online cycles (38.8 cm). This app uses the selected nominal
cycle lengths exactly and divides each large/small cung evenly, avoiding mixed
constants at boundaries.

## UI layout

1. Header and short usage description.
2. Large numeric input with `mm | cm` segmented unit control.
3. Secondary converted value, so the active value is always clear in both units.
4. Shared draggable ruler:
   - measurement ticks on top;
   - rows for 52.2, 42.9, and 38.8 cm;
   - each row shows a large-cung band and a small-cung band;
   - fixed gold center needle;
   - red good segments and charcoal/black bad segments;
   - dark mode uses a lighter charcoal outline so bad segments do not disappear.
5. Three result cards:
   - ruler name and intended use;
   - measured value;
   - large cung and small cung;
   - good/bad status and concise explanation;
   - nearest following good measurement.
6. Cultural-reference and construction-safety disclaimer.

## Interaction and data flow

- Dragging computes `sizeCm = scrollX / pixelsPerCm`, rounded to 0.1 mm.
- All three ruler rows and result cards update from the same `sizeCm`.
- Typing a valid value updates results immediately and scrolls to that location
  when it is within 0–1,000 cm.
- For typed values above 1,000 cm, the UI evaluates the actual value and shifts
  the visual ruler to a labeled 1,000 cm window containing that value.
- Switching units preserves the physical measurement and only changes input
  representation.
- Empty, negative, or malformed input shows a validation hint and retains the
  last valid ruler position.

## Architecture

### `src/lib/loBan.ts`

- Define `LoBanSmallCung`, `LoBanLargeCung`, `LoBanRuler`, and `LoBanResult`.
- Store the complete nested data for all three rulers.
- `measureLoBan(rulerId, sizeCm)` returns large and small cung indices,
  objects, offsets, and exact segment widths.
- `measureAllLoBan(sizeCm)` returns all three results.
- `suggestGoodSize` searches boundaries using the large-cung good flag.
- Calculation code has no UI or platform dependency.

### `src/components/LoBanMultiRuler.tsx`

- Own the single horizontal `ScrollView`.
- Render ticks and all three rows on one coordinate axis.
- Draw the fixed needle outside the scroll content.
- Emit one normalized measurement through `onChangeCm`.
- Do not create three synchronized scroll views.

### `app/lo-ban.tsx`

- Own input text, unit, and last valid centimeter value.
- Render converted value, `LoBanMultiRuler`, and three result cards.
- Keep explanatory copy and layout out of the calculation module.

## Accuracy and testing

Add focused tests for:

- known points within every large cung for all three rulers;
- every large/small boundary, including values immediately before and after;
- exact cycle rollover;
- negative and non-finite input;
- mm/cm conversion;
- values above the visual range;
- nearest-good suggestions.

Use epsilon-aware boundary handling to prevent floating-point values such as
`42.9 % 42.9` from selecting the wrong segment.

## Source references

- `https://phanhoanggia.com/thuoc-lo-ban/`
- `https://govi.vn/thuoc-lo-ban-la-gi-nguon-goc-va-cach-su-dung/`
- `https://vietnamarch.com.vn/thuoc-lo-ban-429-cm-cach-ung-dung-va-y-nghia-cua-cac-cung-tren-thuoc/`
- `https://onhome.asia/thuoc-lo-ban/`

## Success criteria

- One drag updates all three rulers without visible desynchronization.
- Input and ruler stay synchronized in both mm and cm.
- Every result includes the correct large and small cung.
- Boundary calculations are covered by automated tests.
- Red/black bands remain readable in light and dark themes.
- Native and web typecheck/lint pass.
