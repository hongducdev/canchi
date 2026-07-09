# Lịch Âm

Premium offline-first Vietnamese Lunar Calendar for iOS and Android.

Built with **React Native**, **Expo SDK 56**, and **TypeScript**. No backend, no accounts, no network required.

## Features

### Calendar core

- Solar ↔ Lunar conversion (Vietnam timezone, years ~1800–2199)
- Can Chi for year, month, day, and hour
- Day zodiac (con giáp theo Địa Chi ngày) across home, calendar, and day detail
- 24 solar terms (tiết khí)
- Giờ Hoàng Đạo / Hắc Đạo
- Traditional day lore: Trực, 28 Tú, stars, directions, recommended activities
- Traditional & national festivals
- Month grid with dual dates
- Tết countdown

### Tools

- Search (days, festivals, solar terms)
- Lucky-day finder (cưới hỏi, khai trương, xuất hành…)
- Personal events + local reminder scheduling
- Memorial day calculator (đầy tháng, 49 ngày, giỗ…)
- Family roster (birth years / zodiac on device)
- Feng shui profile from birth year
- Astronomy catalog (moon, eclipses, meteor showers)

### App

- Local notes (AsyncStorage)
- JSON backup / restore (share sheet)
- Light / dark / system theme
- Haptics toggle
- Fully offline

## Stack

| Piece | Version |
| --- | --- |
| Expo | SDK 56 |
| React Native | 0.85 |
| Expo Router | 56 |
| Web | Expo Web (`react-native-web`) · core + read-only tools |
| Typeface | Google Sans Flex (app + web) |
| State | Zustand + AsyncStorage |

Home-screen widgets (`expo-widgets`) need a **development build** — not available in Expo Go.

Four widgets (Android-first, `enableAndroid: true`):

| Widget | Size | Content |
| --- | --- | --- |
| DayLoreWidget | Medium | Quote / festival + lunar header |
| MonthSmallWidget | Small | Month grid |
| DateMinimalWidget | Small | Large day + lunar |
| ComboWidget | Medium | Day + month grid |

Tap Day Lore / Date Minimal → day detail; Month / Combo → calendar. Theme follows system light/dark.

Web omits family, personal events, notes, backup, and native notifications (use the mobile app for those).

## Run

```bash
npm install
npx expo start
```

Then press `a` (Android), `i` (iOS simulator), or scan the QR code with **Expo Go for SDK 56**.

### Web

```bash
npm run web
```

Opens the Expo web app in the browser. Desktop (≥960px) uses a left sidebar; narrower viewports keep bottom tabs.

Static export:

```bash
npm run build:web
```

Output lands in `dist/` (or the Expo export folder shown in the CLI). Host that folder on any static host (GitHub Pages, Netlify, Cloudflare Pages, nginx).

```bash
npm run typecheck
```

## Project structure

```
app/                 Expo Router screens
  (tabs)/            Home, Calendar, Events, Settings
  day/[date].tsx     Day detail + notes + lore
  lucky.tsx          Lucky-day finder
  personal.tsx       Personal events
  memorial.tsx       Memorial calculator
  family.tsx         Family roster
  fengshui.tsx       Feng shui profile
  astronomy.tsx      Astronomy catalog
  search.tsx         Search
src/
  lib/               Lunar engine, Can Chi, day lore, zodiac, tools
  data/              Festivals
  components/        UI (TodayHero, ZodiacIcon, MonthGrid, …)
  store/             Settings, notes, personal events, family
  theme/             Design tokens
docs/superpowers/    Design specs & implementation plans
```

## Privacy

All computation and storage happen on-device. There are no analytics SDKs, login flows, or cloud sync.
