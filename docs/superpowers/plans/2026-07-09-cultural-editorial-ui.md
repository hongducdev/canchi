# Cultural Editorial UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Lịch Âm across all tabs and day detail into a cultural-editorial look (warm paper, flat cards, vermillion accents) without changing behavior or adding dependencies.

**Architecture:** Token-first polish. Update `src/theme/*`, then shared primitives (`Card`, `SectionHeader`, `Chip`), then feature components, then screens/tab bar. No new packages, no store/engine changes. Light/dark continue via `getColors` + `useTheme`.

**Tech Stack:** Expo 53, React Native, Expo Router, TypeScript, existing `expo-linear-gradient`, Ionicons, Zustand (untouched).

**Spec:** `docs/superpowers/specs/2026-07-09-cultural-editorial-ui-design.md`

**Note on git:** This workspace may not be a git repository. If `git status` fails, skip all Commit steps and continue. If git exists, commit after each task as written.

**Note on tests:** There are no style unit tests. Each task verifies with `npm run typecheck`. Final task adds a manual visual checklist. Do not invent Jest snapshot tests for StyleSheets.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/theme/colors.ts` | Warmer paper bg, softer shadows, keep vermillion/gold/jade |
| `src/theme/spacing.ts` | Slightly tighter chip radius token if needed (`radius.sm` already 8) |
| `src/components/Card.tsx` | Flat editorial card (no elevation) |
| `src/components/SectionHeader.tsx` | Vermillion accent rule |
| `src/components/Chip.tsx` | Soft wash, `radius.md` instead of full pill |
| `src/components/TodayHero.tsx` | Calmer hero hierarchy |
| `src/components/HourStrip.tsx` | Quieter hour tiles |
| `src/components/FestivalRow.tsx` | Editorial date column + spacing |
| `src/components/MonthGrid.tsx` | Selected = ink outline; today fill unchanged |
| `src/components/SettingRow.tsx` | Minor type/spacing polish only |
| `app/(tabs)/index.tsx` | Header letter-spacing polish if needed |
| `app/(tabs)/calendar.tsx` | Quieter nav + today chip |
| `app/(tabs)/events.tsx` | Soft filter chips (no solid vermillion fill) |
| `app/(tabs)/settings.tsx` | Group label tracking; rely on flatter Card |
| `app/day/[date].tsx` | Hero hierarchy + paper inputs (token-driven) |
| `app/(tabs)/_layout.tsx` | Quieter tab label weight |

---

### Task 1: Theme tokens — warmer paper

**Files:**
- Modify: `src/theme/colors.ts`
- Modify: `src/theme/spacing.ts` (optional comment only; keep numeric tokens)

- [ ] **Step 1: Update light background and shadow tokens**

In `src/theme/colors.ts`, change the palette and light theme as follows (keep all other keys and dark theme structure):

```ts
const palette = {
  ink950: '#0B0F14',
  ink900: '#121820',
  ink800: '#1A2330',
  ink700: '#243041',
  ink600: '#3A4A5C',
  mist100: '#F1EDE6',
  mist50: '#F7F4EE',
  mist200: '#E5DFD4',
  mist300: '#D0C8BA',
  vermillion: '#C23B22',
  vermillionDeep: '#9E2F1C',
  vermillionSoft: '#E85A42',
  gold: '#C9A227',
  goldMuted: '#A88B2E',
  jade: '#2F6B5A',
  jadeSoft: '#3D8B74',
  slate: '#6B7A8C',
  danger: '#B91C1C',
  success: '#1B7A5A',
} as const;
```

In `lightColors`:

```ts
export const lightColors: ThemeColors = {
  bg: palette.mist50,
  bgElevated: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgMuted: palette.mist100,
  border: palette.mist200,
  borderStrong: palette.mist300,
  text: palette.ink900,
  textSecondary: palette.ink600,
  textMuted: palette.slate,
  textInverse: palette.mist50,
  accent: palette.vermillion,
  accentSoft: 'rgba(194, 59, 34, 0.10)',
  accentText: palette.vermillionDeep,
  gold: palette.goldMuted,
  jade: palette.jade,
  today: palette.vermillion,
  todayText: '#FFFFFF',
  festival: palette.goldMuted,
  tabBar: 'rgba(247, 244, 238, 0.94)',
  tabInactive: palette.slate,
  tabActive: palette.vermillionDeep,
  shadow: 'rgba(18, 24, 32, 0.04)',
  hoangDao: palette.jade,
  hacDao: palette.slate,
  heroGradient: [palette.ink900, palette.ink800],
  statusBar: 'dark',
};
```

Leave `darkColors` as-is except soften shadow if present:

```ts
  shadow: 'rgba(0,0,0,0.35)',
```

- [ ] **Step 2: Confirm spacing tokens support editorial chips**

In `src/theme/spacing.ts`, ensure `radius` includes (do not rename existing keys):

```ts
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;
```

No numeric changes required if already matching.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 4: Commit (if git available)**

```bash
git add src/theme/colors.ts src/theme/spacing.ts
git commit -m "style: warm paper theme tokens for editorial UI"
```

---

### Task 2: Flat Card + SectionHeader accent rule + Chip radius

**Files:**
- Modify: `src/components/Card.tsx`
- Modify: `src/components/SectionHeader.tsx`
- Modify: `src/components/Chip.tsx`

- [ ] **Step 1: Flatten Card**

Replace `Card` styles so elevation/shadow are effectively off:

```tsx
const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  padded: {
    padding: space.lg,
  },
});
```

Keep the `shadowColor: colors.shadow` prop wiring if present; opacity 0 makes it inert.

- [ ] **Step 2: Add vermillion rule to SectionHeader**

Replace `SectionHeader` component body and styles with:

```tsx
export function SectionHeader({ title, subtitle, right }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <View style={[styles.rule, { backgroundColor: colors.accent }]} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        {subtitle ? (
          <Text style={[styles.sub, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: space.md,
    marginTop: space.xl,
  },
  left: { flex: 1, paddingRight: space.md },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  rule: {
    width: 3,
    height: 16,
    borderRadius: 1,
  },
  title: {
    fontSize: font.lg,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: font.sm,
    marginTop: 4,
    marginLeft: 11,
  },
});
```

- [ ] **Step 3: Soften Chip corners**

In `Chip.tsx` styles, change `borderRadius: radius.full` to `borderRadius: radius.sm`:

```tsx
const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.xs + 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: font.sm,
    fontWeight: '600',
  },
});
```

Keep tone color logic unchanged.

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 5: Commit (if git available)**

```bash
git add src/components/Card.tsx src/components/SectionHeader.tsx src/components/Chip.tsx
git commit -m "style: flatten cards and add editorial section accents"
```

---

### Task 3: TodayHero + HourStrip + FestivalRow

**Files:**
- Modify: `src/components/TodayHero.tsx`
- Modify: `src/components/HourStrip.tsx`
- Modify: `src/components/FestivalRow.tsx`

- [ ] **Step 1: Calm TodayHero chrome**

In `TodayHero.tsx`, keep structure and `LinearGradient`. Update styles for quieter brand/live row and slightly tighter chip gap:

```tsx
const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: space.xxl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  brand: {
    color: 'rgba(244,241,236,0.55)',
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginRight: space.sm,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E85A42',
    marginRight: 6,
  },
  live: {
    color: 'rgba(244,241,236,0.45)',
    fontSize: font.xs,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  weekday: {
    color: 'rgba(244,241,236,0.75)',
    fontSize: font.md,
    fontWeight: '500',
  },
  solarDay: {
    color: '#FAF8F5',
    fontSize: font.display,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 72,
  },
  solarMonth: {
    color: 'rgba(244,241,236,0.65)',
    fontSize: font.lg,
    marginTop: -4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: space.lg,
  },
  lunar: {
    color: '#FAF8F5',
    fontSize: font.md,
    fontWeight: '600',
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.md,
  },
  festival: {
    color: '#C9A227',
    fontSize: font.sm,
    fontWeight: '600',
    marginTop: space.md,
  },
  cta: {
    marginTop: space.lg,
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
```

Keep JSX the same (still one accent chip + one gold chip).

- [ ] **Step 2: Quieter HourStrip tiles**

In `HourStrip.tsx`, keep logic. Update card style to use `colors.bgCard` instead of `bgMuted` for a paper tile:

```tsx
        <View
          key={h.name}
          style={[
            styles.card,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.border,
            },
          ]}
        >
```

And styles:

```tsx
const styles = StyleSheet.create({
  row: {
    gap: space.sm,
    paddingVertical: 2,
  },
  card: {
    minWidth: 96,
    padding: space.md,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  name: {
    fontSize: font.md,
    fontWeight: '700',
  },
  range: {
    fontSize: font.xs,
    marginTop: 4,
  },
  canChi: {
    fontSize: font.xs,
    marginTop: 6,
  },
});
```

- [ ] **Step 3: Editorial FestivalRow**

In `FestivalRow.tsx`, change `dateBox` to use hairline border + soft wash, and slightly larger padding:

```tsx
      <Pressable
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.dateBox,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.border,
            },
          ]}
        >
```

```tsx
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: space.sm,
    gap: space.md,
  },
  dateBox: {
    width: 52,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontSize: font.xl,
    fontWeight: '700',
    lineHeight: 24,
  },
  mon: {
    fontSize: font.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  body: { flex: 1 },
  name: {
    fontSize: font.md,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: font.xs,
    marginTop: 3,
  },
  desc: {
    fontSize: font.sm,
    marginTop: 4,
    lineHeight: 18,
  },
});
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 5: Commit (if git available)**

```bash
git add src/components/TodayHero.tsx src/components/HourStrip.tsx src/components/FestivalRow.tsx
git commit -m "style: editorial hero, hours, and festival rows"
```

---

### Task 4: MonthGrid selected state = ink outline

**Files:**
- Modify: `src/components/MonthGrid.tsx`

- [ ] **Step 1: Change selected (non-today) from soft fill to outline**

Replace the `dayInner` style array logic:

```tsx
              style={[
                styles.dayInner,
                isToday && { backgroundColor: colors.today },
                isSelected &&
                  !isToday && {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: colors.text,
                  },
              ]}
```

Ensure `dayInner` base style has a transparent border so layout does not jump:

```tsx
  dayInner: {
    flex: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
```

Keep today fill, Sunday accent text, gold festival dots, and lunar numbers unchanged.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 3: Commit (if git available)**

```bash
git add src/components/MonthGrid.tsx
git commit -m "style: outline selected day in month grid"
```

---

### Task 5: Calendar + Events screens

**Files:**
- Modify: `app/(tabs)/calendar.tsx`
- Modify: `app/(tabs)/events.tsx`

- [ ] **Step 1: Quieter Calendar chrome**

In `calendar.tsx` styles, change today button and nav buttons:

```tsx
  todayBtn: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
  },
  todayBtnText: {
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    marginTop: space.xl,
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
```

Keep JSX/behavior identical.

- [ ] **Step 2: Soft Events filter chips**

In `events.tsx`, replace the filter `Pressable` style/color logic:

```tsx
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                  borderColor: active ? colors.accent : colors.border,
                  borderWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? colors.accentText : colors.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
```

Update styles:

```tsx
  pill: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
  },
  pillText: {
    fontSize: font.sm,
    fontWeight: '700',
  },
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 4: Commit (if git available)**

```bash
git add app/(tabs)/calendar.tsx app/(tabs)/events.tsx
git commit -m "style: quieter calendar nav and soft event filters"
```

---

### Task 6: Settings, Day detail, Tab bar, SettingRow polish

**Files:**
- Modify: `src/components/SettingRow.tsx`
- Modify: `app/(tabs)/settings.tsx`
- Modify: `app/day/[date].tsx`
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: SettingRow title weight**

In `SettingRow.tsx`:

```tsx
  title: {
    fontSize: font.md,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
```

No logic changes.

- [ ] **Step 2: Settings group labels**

In `settings.tsx` styles:

```tsx
  group: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 1.0,
    marginBottom: space.sm,
    marginTop: space.md,
    textTransform: 'uppercase',
  },
```

Cards inherit flatter `Card` from Task 2 — no structural JSX change required.

- [ ] **Step 3: Day detail hero tracking**

In `app/day/[date].tsx` styles, tighten weekday + big day to match Home hierarchy:

```tsx
  weekday: {
    fontSize: font.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  bigDay: {
    fontSize: font.display,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 72,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  noteCard: {
    marginTop: space.sm,
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
```

Inputs already use `colors.bgMuted` / `colors.border` — they pick up warmer paper automatically.

- [ ] **Step 4: Tab bar quieter labels**

In `app/(tabs)/_layout.tsx` `tabBarLabelStyle`:

```tsx
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
```

Keep icons and routes unchanged.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 6: Commit (if git available)**

```bash
git add src/components/SettingRow.tsx app/(tabs)/settings.tsx app/day/[date].tsx app/(tabs)/_layout.tsx
git commit -m "style: polish settings, day detail, and tab bar"
```

---

### Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck once more**

Run: `npm run typecheck`  
Expected: exit 0

- [ ] **Step 2: Manual visual smoke (Expo)**

Run: `npx expo start`  
Then verify on device/simulator:

1. **Home (light):** warm bone bg, flat Can Chi card, vermillion section rules, calm dark hero
2. **Calendar:** today vermillion fill; selected non-today ink outline; gold festival dots
3. **Events:** filters use soft wash + accent text when active (not solid red pills)
4. **Settings:** grouped flat cards, uppercase group labels
5. **Day detail:** large light day number; notes save still works
6. Toggle **dark** theme in Settings — surfaces remain coherent; accent still readable
7. Interactions: month prev/next, festival filter, add/delete note

- [ ] **Step 3: Confirm no unintended files**

Run: `git status` (or skip if no git)  
Expected: only theme/UI files from this plan; no `src/lib/*`, `src/store/*`, or `src/data/*` changes

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Warmer paper / deep ink tokens | Task 1 |
| Flat hairline cards, near-zero shadow | Task 2 |
| SectionHeader vermillion rule | Task 2 |
| Softer less-pill chips | Task 2 |
| Calmer TodayHero | Task 3 |
| Quieter HourStrip | Task 3 |
| Editorial FestivalRow | Task 3 |
| MonthGrid today fill / selected outline / gold dots | Task 4 |
| Calendar quieter nav | Task 5 |
| Events soft filters | Task 5 |
| Settings grouped flat cells | Task 6 |
| Day detail hierarchy + paper inputs | Task 6 |
| Tab bar quieter inactive / vermillion active | Task 6 (labels; colors from Task 1) |
| No new deps / no engine changes | All tasks |
| Typecheck + visual verify | Task 7 |

## Self-review notes

- No TBD/placeholder steps
- Commit steps are optional when git is unavailable
- Visual UI verified via typecheck + manual Expo smoke, not invented style unit tests
- Selected-day outline uses transparent base border to avoid layout shift
