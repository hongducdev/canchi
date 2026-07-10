# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Can Chi** is an offline-first Vietnamese lunar calendar app built with **Expo**, **React Native**, and **TypeScript**. The app runs natively on iOS, Android, and web with zero backend—all computation and storage stays on-device.

## Common Commands

### Development

```bash
npm install              # Install dependencies (runs patch-foojay.js as postinstall)
npm start                # Start Expo dev server (press 'a' for Android, 'i' for iOS, 'w' for web)
npm run android          # Build and run on Android emulator/device
npm run ios              # Build and run on iOS simulator/device
npm run web              # Start web dev server (localhost, responds to resizing)
npm run typecheck        # Run TypeScript type checking
npm run lint             # Run Expo linter
```

### Production Builds

```bash
npm run build:web        # Web production export → dist/
npm run build:apk        # Android release APK → android/app/build/outputs/apk/release/app-release.apk
```

**Note:** APK build requires Android SDK and Gradle setup. Uses a debug keystore by default (dev/internal only); production deployments need a proper signing key.

### Widgets (Android Only)

Home screen widgets require a **development or release build** (not Expo Go):

```bash
npx expo prebuild --clean  # Regenerate android/ folder
npm run android            # Install on device/emulator
```

Widget source: `src/widgets/` → Android native code in `android/app/src/main/java/com/canchi/app/widget/`

## Architecture

### State & Storage

- **Zustand stores** (`src/store/`) — lightweight, reactive state (user profile, app settings, theme)
- **AsyncStorage** — persistent on-device key-value store; all data (notes, events, backup) is JSON-serialized
- **No backend** — every computation (lunar conversion, Can Chi calculation, festivals) runs locally

### Core Libraries

| Layer | Tech |
|-------|------|
| Router | Expo Router 56 (file-based, supports `[date].tsx` dynamic routes) |
| UI | React Native + custom components (`src/components/`) |
| State | Zustand + AsyncStorage |
| Lunar math | Custom engine (`src/lib/`) — solar↔lunar conversion, Can Chi, horoscope |
| Theming | Design tokens in `src/theme/` (light/dark/system) |

### Key Concepts

**Lunar engine** (`src/lib/`)
- Converts between solar (Gregorian) and lunar (Vietnamese) calendars
- Computes Can Chi (干支) for year, month, day, hour
- Returns horoscope data, lucky directions, zodiac info
- **Constraint:** Years ~1800–2199 (precision matters for older dates)

**Data sources** (`src/data/`)
- `vankhan.json` — Vietnamese prayer templates (văn khấn) with dynamic profile fills
- Festival list — traditional + national holidays with lunar dates
- Quote/lore database — daily inspirational messages, 28 stars (28 Tú), direction names

**AsyncStorage keys** (checked in code, not documented elsewhere)
- `user_profile` — name, birthdate, hometown
- `personal_events` — user birthdays, anniversaries, reminders
- `notes_<date>` — day-specific notes
- `app_backup` — manual JSON snapshot of all above

### Routing

```
app/
  (tabs)/                   # Main tab-based UI (home, calendar, events, settings)
    _layout.tsx             # 4-tab shell
    (home)/                 # Home screen with today's lunar info
    (calendar)/             # Month/year grid calendar
    (events)/               # Personal events + memorial calculator
    (settings)/             # Theme, haptics, profile, backup/restore
  day/[date].tsx            # Detail page for a specific day (dynamic route)
  van-khan/                 # Prayer (văn khấn) catalog
    index.tsx               # List of templates
    [id].tsx                # Single prayer detail + dynamic fill
  profile.tsx               # User profile editor (native modal-like behavior on iOS)
  _layout.tsx               # Root layout, splash screen setup
```

**Date format:** `YYYY-MM-DD` for solar calendar routing in day detail. The app converts this to lunar on display.

### Android Widgets

Widgets use `react-native-android-widget` to display real-time data without network:

1. **Widget payloads** — React components in `src/widgets/` render to native Android views
2. **Updates** — Every ~30 min (configured in `app.json` → `updatePeriodMillis`)
3. **Package name** — `com.canchi.app` (Java files at `android/app/src/main/java/com/canchi/app/widget/`)
4. **Types:**
   - `DayLore` (Medium) — today's quote + lunar header
   - `DateMinimal` (Small) — large day + lunar
   - `MonthSmall` (Small) — month grid
   - `Combo` (Medium) — day + month
   - `DayDetail` (Large) — full solar/lunar, Can Chi, hoàng đạo

## Project Structure Highlights

```
app/                          # Expo Router pages
src/
  lib/                        # Core lunar engine
    lunar.ts                  # Solar ↔ lunar conversion
    canChi.ts                 # Can Chi (zodiac) calculation
    horoscope.ts              # Day zodiac, lucky directions
    dayPersonScore.ts         # Birth year compatibility
    vanKhan.ts                # Prayer template matching
  data/
    vankhan.json              # Prayer templates
    festivals.ts              # Holiday list
    quotes.ts                 # Daily lore/messages
  components/                 # Reusable UI kit (buttons, cards, tabs, etc.)
  store/
    userProfile.ts            # Zustand store for user data + AsyncStorage persist
  theme/                      # Design tokens (colors, spacing, typography)
  widgets/                    # Android widget React components
android/
  app/
    src/main/
      java/com/canchi/app/    # Package root (after renaming from com.licham.app)
        widget/               # Native Android widget implementations
      res/                    # Android resources (drawables, layouts)
    build.gradle              # App-level config (package: com.canchi.app)
docs/
  vi.md                       # Vietnamese user guide
  superpowers/                # Design specs & implementation plans
```

## Development Patterns

### Adding a Tool / Screen

1. Create route in `app/` (or `src/` if a shared component) — uses file-based routing
2. Add state to `src/store/` if persistent data needed
3. Fetch data from `src/lib/` or `src/data/` (no async calls — all local)
4. Style with tokens from `src/theme/`, use `src/components/` kit
5. Test on Android emulator (`npm run android`), iOS simulator (`npm run ios`), and web (`npm run web`)

### Persisting Data

```typescript
// Store with AsyncStorage sync (Zustand middleware)
import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useUserProfile = create((set) => ({
  profile: null,
  // ... computed selectors
}))

// Manual AsyncStorage for one-off saves
import AsyncStorage from '@react-native-async-storage/async-storage'
await AsyncStorage.setItem('key', JSON.stringify(data))
const data = JSON.parse(await AsyncStorage.getItem('key') ?? '{}')
```

### Lunar Calculations

All dates in the lunar engine are `{ year, month, day, leap }` objects (Vietnamese lunar calendar, not Chinese). The engine handles leap months.

```typescript
import { solarToLunar, lunarToSolar } from '@/lib/lunar'

const lunar = solarToLunar(2026, 7, 10)  // → { year: 2026, month: 6, day: 25, leap: false }
const solar = lunarToSolar(2026, 6, 25)  // → { year: 2026, month: 7, day: 10 }
```

### Theming

The app supports light, dark, and system themes. Theme context is in `src/theme/`; components consume it via React Context or hook.

```typescript
import { useTheme } from '@/theme'
const { colors, spacing } = useTheme()
```

## Deployment

**Android APK:**
1. Update `version` in `package.json` and `versionCode` / `versionName` in `android/app/build.gradle`
2. Run `npm run build:apk`
3. Rename output APK for release (e.g., `canchi-v1.0.0.apk`)
4. Publish via GitHub Releases (`gh release create ...`)

**Web:**
1. Run `npm run build:web` → outputs to `dist/`
2. Deploy `dist/` to a static host (GitHub Pages, Vercel, etc.)

## Key Dependencies

- **expo@^56.0.0** — framework & build tools
- **react-native@0.85.3** — core
- **expo-router@~56.2.14** — file-based routing
- **zustand@^5.0.5** — state management
- **@react-native-async-storage/async-storage@2.2.0** — persistent storage
- **react-native-android-widget@^0.20.3** — home screen widgets
- **react-native-reanimated@4.3.1** — animations (for gesture handler)
- **@expo-google-fonts/google-sans-flex@^0.4.3** — typeface

## Testing & Debugging

- **TypeScript:** `npm run typecheck` (no test suite yet)
- **Linting:** `npm run lint` (Expo-managed ESLint config)
- **Device Testing:** Use emulators or physical devices; Expo Go for fast iteration, development builds for widgets
- **AsyncStorage DevTools:** Use React Native debugger or inspect via ADB (`adb shell`)

## Privacy & Offline

All data stays on-device. No analytics, no backend, no login. This is non-negotiable for the user model—emphasize in any feature discussions.

## Notes for Future Work

- The app currently has no automated tests; consider adding Jest + React Native Testing Library if complexity grows
- Widget updates are currently time-based; consider location-aware updates if astronomy features expand
- The lunar engine is hardcoded for Vietnam timezone; adapt carefully if supporting other locales
