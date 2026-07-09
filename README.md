# Lịch Âm

Premium offline-first Vietnamese Lunar Calendar for iOS and Android.

Built with **React Native**, **Expo**, and **TypeScript**. No backend, no accounts, no network required.

## Features

- Solar ↔ Lunar conversion (Vietnam timezone, years ~1800–2199)
- Can Chi for year, month, day, and hour
- 24 solar terms (tiết khí)
- Giờ Hoàng Đạo / Hắc Đạo
- Traditional & national festivals
- Month grid with dual dates
- Local notes (AsyncStorage)
- Light / dark / system theme
- Fully offline

## Run

```bash
npm install
npx expo start
```

Then press `a` (Android), `i` (iOS simulator), or scan the QR code with Expo Go.

## Project structure

```
app/                 Expo Router screens
  (tabs)/            Home, Calendar, Events, Settings
  day/[date].tsx     Day detail + notes
src/
  lib/               Lunar engine, Can Chi, hours, solar terms
  data/              Festivals
  components/        UI
  store/             Settings & notes (Zustand + AsyncStorage)
  theme/             Design tokens
```

## Privacy

All computation and storage happen on-device. There are no analytics SDKs, login flows, or cloud sync.
