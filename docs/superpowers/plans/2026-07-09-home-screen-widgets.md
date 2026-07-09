# Home Screen Widgets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship four Android-first `expo-widgets` layouts (Day Lore+Quote, Month small, Date Minimal, Combo) plus a shared `resolveQuote` used by widgets and `TodayHero`.

**Architecture:** App computes `DayInfo` + `resolveQuote` + month-grid cells, then pushes serializable props via `updateTimeline` / `updateSnapshot`. Widget UI files use the `'widget'` directive and `@expo/ui/swift-ui` only (isolated runtime — no imports of lunar libs inside the widget function). Theme colors come from props + `environment.colorScheme`.

**Tech Stack:** Expo SDK 56, `expo-widgets` (~56.0.22), `@expo/ui`, existing `dayInfo` / `lunar` / `festivals`, TypeScript.

**Spec:** `docs/superpowers/specs/2026-07-09-home-screen-widgets-design.md`

**Verification:** Repo has no Jest. Use `npx tsx` smoke scripts + `npm run typecheck`. Native widget gallery requires a development build (`npx expo prebuild` + run Android).

---

## File map

| File | Responsibility |
|------|----------------|
| Create `src/data/quotes.ts` | Quote catalog + `resolveQuote` |
| Create `src/lib/__tests__/quotes.smoke.ts` | Smoke checks for resolveQuote |
| Create `src/widgets/types.ts` | Serializable widget prop types |
| Create `src/widgets/buildWidgetPayload.ts` | Build props from today / month |
| Create `src/widgets/syncWidgets.ts` | Push timelines + reload (native only) |
| Create `src/widgets/DayLoreWidget.tsx` | Layout B |
| Create `src/widgets/MonthSmallWidget.tsx` | Layout C |
| Create `src/widgets/DateMinimalWidget.tsx` | Layout D |
| Create `src/widgets/ComboWidget.tsx` | Layout E |
| Create `src/widgets/index.ts` | Re-exports for app sync |
| Modify `src/components/TodayHero.tsx` | Show resolved quote |
| Modify `app/_layout.tsx` | Sync widgets on launch / foreground |
| Modify `app.json` | `expo-widgets` plugin + 4 widgets + `enableAndroid` |
| Modify `package.json` | Add `expo-widgets` / `@expo/ui` via `npx expo install` |
| Modify `README.md` | Dev-build note for widgets |

---

### Task 1: Quote module + smoke tests

**Files:**
- Create: `src/data/quotes.ts`
- Create: `src/lib/__tests__/quotes.smoke.ts`

- [ ] **Step 1: Add `src/data/quotes.ts`**

```ts
import { dateKey } from '../lib/lunar';
import type { DayInfo } from '../lib/types';

export type Quote = {
  id: string;
  text: string;
  festivalIds?: string[];
};

export type ResolvedQuote =
  | { kind: 'quote'; text: string; quoteId: string }
  | { kind: 'festival'; text: string; festivalId: string };

export const QUOTES: Quote[] = [
  // general + festival-tagged entries (see full file in implementation)
];

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
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
```

Include ≥8 general quotes and tagged quotes for at least: `tet`, `tet-duong-lich`, `gio-to-hung-vuong`, `phat-dan`, `vu-lan`, `trung-thu`, `quoc-khanh`, `giang-sinh`.

- [ ] **Step 2: Add smoke file `src/lib/__tests__/quotes.smoke.ts`** that builds `DayInfo` for a normal day, Tết, and a festival without a tagged quote; asserts kinds and same-day stability.

- [ ] **Step 3: Run** `npx tsx -e "import { smokeQuotes } from './src/lib/__tests__/quotes.smoke.ts'; console.log(smokeQuotes().join('\n'))"`  
  Expected: all assertions print OK / no throw.

- [ ] **Step 4: Commit** `feat: add resolveQuote catalog for widgets and hero`

---

### Task 2: TodayHero quote line

**Files:**
- Modify: `src/components/TodayHero.tsx`

- [ ] **Step 1:** Import `resolveQuote`. After chips (before festivals block), render quote text with `numberOfLines={3}`, gold/muted styling. Keep festival names and chips unchanged.

- [ ] **Step 2:** `npm run typecheck` — expect clean.

- [ ] **Step 3: Commit** `feat: show daily quote on TodayHero`

---

### Task 3: Widget payload builder

**Files:**
- Create: `src/widgets/types.ts`
- Create: `src/widgets/buildWidgetPayload.ts`

- [ ] **Step 1:** Define props:

```ts
export type WidgetMonthCell = {
  day: number | null;
  lunarDay: number | null;
  isToday: boolean;
  isWeekend: boolean;
};

export type DayLoreWidgetProps = {
  headerDate: string;
  lunarShort: string;
  bodyText: string;
  footerText: string;
  scheme: 'light' | 'dark';
};

export type DateMinimalWidgetProps = {
  monthLabel: string;
  day: number;
  lunarShort: string;
  scheme: 'light' | 'dark';
};

export type MonthSmallWidgetProps = {
  title: string;
  weekdayLabels: string[];
  cells: WidgetMonthCell[];
  scheme: 'light' | 'dark';
};

export type ComboWidgetProps = {
  monthLabel: string;
  day: number;
  weekdayName: string;
  lunarShort: string;
  weekdayLabels: string[];
  cells: WidgetMonthCell[];
  scheme: 'light' | 'dark';
};
```

- [ ] **Step 2:** `buildWidgetPayload(now = new Date())` uses `todaySolar`, `buildDayInfo`, `resolveQuote`, `formatLunarShort`, Monday-start month grid (ignore settings). `scheme` default `'dark'` (overridden at render by environment when pushing — still include for snapshot).

Weekday labels fixed: `['T2','T3','T4','T5','T6','T7','CN']`. Weekend = columns T7/CN (indices 5,6) or solar weekday 0/6.

- [ ] **Step 3: Commit** `feat: build serializable home widget payloads`

---

### Task 4: Install expo-widgets + app.json

**Files:**
- Modify: `package.json` / lockfile via install
- Modify: `app.json`

- [ ] **Step 1:** `npx expo install expo-widgets`

- [ ] **Step 2:** Add plugin (names must match `createWidget`):

```json
[
  "expo-widgets",
  {
    "enableAndroid": true,
    "bundleIdentifier": "com.licham.app.widgets",
    "groupIdentifier": "group.com.licham.app",
    "widgets": [
      {
        "name": "DayLoreWidget",
        "displayName": "Lời hay · Lịch Âm",
        "description": "Ngày dương/âm và lời hay hoặc tên lễ",
        "ios": { "supportedFamilies": ["systemMedium"] }
      },
      {
        "name": "MonthSmallWidget",
        "displayName": "Tháng · Lịch Âm",
        "description": "Lưới tháng dương/âm",
        "ios": { "supportedFamilies": ["systemSmall"] }
      },
      {
        "name": "DateMinimalWidget",
        "displayName": "Ngày · Lịch Âm",
        "description": "Ngày lớn và âm lịch",
        "ios": { "supportedFamilies": ["systemSmall"] }
      },
      {
        "name": "ComboWidget",
        "displayName": "Ngày + Tháng · Lịch Âm",
        "description": "Ngày hôm nay và lưới tháng",
        "ios": { "supportedFamilies": ["systemMedium"] }
      }
    ]
  }
]
```

- [ ] **Step 3: Commit** `chore: add expo-widgets with Android enabled`

---

### Task 5: Four widget UI components + sync

**Files:**
- Create widget TSX files under `src/widgets/`
- Create `src/widgets/syncWidgets.ts`, `src/widgets/index.ts`
- Modify `app/_layout.tsx`
- Modify `README.md`

- [ ] **Step 1:** Each widget: `createWidget(name, Component)` with `'widget'` directive; only `@expo/ui/swift-ui` + modifiers; colors from `environment.colorScheme` (inline hex maps inside the function — no outer consts). Use props for all text/grid data.

- [ ] **Step 2:** `syncWidgets()` builds payload, calls `updateTimeline` with now + next local midnight for each widget; guard with `Platform.OS !== 'web'` and try/catch (Expo Go / missing native module).

- [ ] **Step 3:** Call `syncWidgets()` from root layout `useEffect` on mount (native only).

- [ ] **Step 4:** README: note widgets need development build; list four widget names.

- [ ] **Step 5:** `npm run typecheck`

- [ ] **Step 6: Commit** `feat: register four expo home screen widgets`

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Layouts B/C/D/E | 5 |
| System theme | 5 (environment.colorScheme) |
| resolveQuote rules | 1 |
| TodayHero quote | 2 |
| Props from dayInfo (no lib in widget) | 3, 5 |
| enableAndroid + plugin | 4 |
| Midnight refresh timeline | 5 |
| Tap deep links | Best-effort via Link/openURL if Expo UI supports; else document as follow-up if API lacks link on Android |
| Out of scope A/F/weather | Not implemented |

## Tap / deep link note

If `expo-widgets` Button/`Link` to `licham://day/...` is available in current API, wire B/D → day and C/E → calendar. If not on Android experimental, ship display-only and note in README.
