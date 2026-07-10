# Complete Lo Ban Ruler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single flat Lo Ban ruler with three synchronized red/black rulers containing accurate large/small cung data, mm/cm input, and detailed results.

**Architecture:** Pure functions in `src/lib/loBan.ts` own nested ruler data and boundary-safe calculations. `LoBanMultiRuler.tsx` renders one shared horizontal ScrollView with three rows and a fixed needle; `app/lo-ban.tsx` owns unit/input state and result presentation.

**Tech Stack:** TypeScript, React Native ScrollView, Expo, Vitest for pure calculation tests.

---

### Task 1: Add executable calculation tests

**Files:**
- Modify: `package.json`
- Create: `src/lib/loBan.test.ts`

- [ ] Add Vitest as a development dependency using `npm install --save-dev vitest`.
- [ ] Add `"test": "vitest run"` to `package.json`.
- [ ] Write tests importing `LO_BAN_RULERS`, `measureLoBan`, `measureAllLoBan`, and `suggestGoodSize`.
- [ ] Assert the three ruler structures are `8×5`, `8×4`, and `10×4`.
- [ ] Assert representative points: `1 cm → Quý Nhân/Quyền Lộc`, `7 cm → Hiểm Họa/Án Thành`, `1 cm on 42.9 → Tài/Tài Đức`, and `1 cm on 38.8 → Đinh/Đỗ Đạt`.
- [ ] Assert exact cycle rollover maps to the first cung and values immediately before a boundary remain in the prior cung.
- [ ] Assert `measureAllLoBan(90)` returns three results and `suggestGoodSize` never returns a bad large cung.
- [ ] Run `npm test`; expect failure because nested APIs do not exist yet.

### Task 2: Replace and validate ruler data

**Files:**
- Modify: `src/lib/loBan.ts`
- Test: `src/lib/loBan.test.ts`

- [ ] Define `LoBanSmallCung`, `LoBanLargeCung`, `LoBanRuler`, and `LoBanResult`.
- [ ] Replace the currently misassigned ruler data with:
  - 52.2 cm: 8 large cung, each with the documented 5 small cung.
  - 42.9 cm: 8 large cung, each with the documented 4 small cung.
  - 38.8 cm: 10 large cung, each with the documented 4 small cung.
- [ ] Implement epsilon-safe normalized cycle offset:

```ts
const rawOffset = ((sizeCm % cycleCm) + cycleCm) % cycleCm;
const offsetCm = rawOffset < EPSILON || cycleCm - rawOffset < EPSILON
  ? 0
  : rawOffset;
```

- [ ] Implement `measureLoBan` returning both `largeCung` and `smallCung`.
- [ ] Implement `measureAllLoBan(sizeCm)` by mapping all three ruler definitions.
- [ ] Update `suggestGoodSize` to target centers of good large cung.
- [ ] Run `npm test`; expect all calculation tests to pass.

### Task 3: Build one synchronized multi-ruler

**Files:**
- Create: `src/components/LoBanMultiRuler.tsx`
- Delete after replacement: `src/components/LoBanRulerTrack.tsx`

- [ ] Expose props:

```ts
type Props = {
  valueCm: number;
  onChangeCm: (valueCm: number) => void;
  maxCm?: number;
};
```

- [ ] Render one horizontal `ScrollView` with half-viewport side padding.
- [ ] Render major/minor metric ticks and three ruler rows on the same pixel-per-centimeter axis.
- [ ] For every row, render a large-cung band and small-cung band by repeating its cycle to `maxCm`.
- [ ] Color good segments vermillion red and bad segments charcoal black; use off-white text and visible dark-mode borders.
- [ ] Overlay one fixed gold needle outside scroll content.
- [ ] Convert `contentOffset.x` to centimeters at 0.01 cm precision.
- [ ] Programmatic value changes scroll to the correct position without callback loops.

### Task 4: Rebuild the Lo Ban screen

**Files:**
- Modify: `app/lo-ban.tsx`

- [ ] Remove ruler-selection chips.
- [ ] Add `mm | cm` unit control while retaining one physical `sizeCm` state.
- [ ] Parse localized decimal input and show the converted secondary unit.
- [ ] Permit typed positive finite values above 1,000 cm; clamp only the visual ruler.
- [ ] Render `LoBanMultiRuler` and three result cards from `measureAllLoBan`.
- [ ] Show ruler purpose, large/small cung, good/bad status, original concise meaning, and nearest good measurement.
- [ ] Show an equivalent-cycle notice when typed size exceeds the visual range.
- [ ] Preserve the cultural and construction-safety disclaimer.

### Task 5: Verification

**Files:**
- Check: `src/lib/loBan.ts`
- Check: `src/components/LoBanMultiRuler.tsx`
- Check: `app/lo-ban.tsx`

- [ ] Run `npm test`; expect all tests to pass.
- [ ] Run `npm run typecheck`; expect exit code 0.
- [ ] Run `npm run lint`; fix only newly introduced diagnostics.
- [ ] Manually verify: drag updates all rows/results, mm/cm toggle preserves size, typed values scroll correctly, and a value over 1,000 cm still evaluates.
