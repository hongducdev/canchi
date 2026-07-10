# 🌙 Can Chi

**Premium offline-first Vietnamese Lunar Calendar** for iOS, Android, and Web.

Built with **React Native**, **Expo SDK 56**, and **TypeScript**.  
No backend · No accounts · No network required.

[📖 Tài liệu tiếng Việt](docs/vi.md) · [⬇️ Releases](https://github.com/hongducdev/canchi/releases)

---

## ✨ Features

### 📅 Calendar core

- 🔄 Solar ↔ Lunar conversion (Vietnam timezone, years ~1800–2199)
- 🎋 Can Chi for year, month, day, and hour
- 🐲 Day zodiac (con giáp) on home, calendar, and day detail
- 🌿 24 solar terms (*tiết khí*)
- ⏰ Giờ Hoàng Đạo / Hắc Đạo
- 📜 Traditional day lore: Trực, 28 Tú, stars, directions, activities
- 🎉 Traditional & national festivals
- 🗓️ Month grid with dual dates
- 🧨 Tết countdown

### 🧰 Tools

| | Tool | Description |
| --- | --- | --- |
| 🔍 | Search | Days, festivals, solar terms |
| 🍀 | Lucky days | Wedding, opening, travel… |
| 📌 | Personal events | Birthdays & reminders (on-device) |
| 🧮 | Memorial calculator | Đầy tháng, 49 days, giỗ… |
| 👪 | Family roster | Birth years / zodiac locally |
| 🧭 | Feng shui | Profile from birth year |
| 🌌 | Astronomy | Moon, eclipses, meteor showers |
| 🙏 | Văn khấn | Prayer templates + profile fill |
| 👤 | My profile | Name, birth, hometown (native) |

### 📱 App experience

- 📝 Local notes (AsyncStorage)
- 💾 JSON backup / restore (v2 includes profile + family)
- ☁️ Google Drive backup on Android — see [docs/google-drive-backup.md](docs/google-drive-backup.md)
- 🌓 Light / dark / system theme
- 📳 Haptics toggle
- 🔌 Fully offline

---

## 🛠️ Stack

| Piece | Version |
| --- | --- |
| Expo | SDK 56 |
| React Native | 0.85 |
| Expo Router | 56 |
| Web | Expo Web (`react-native-web`) |
| Typeface | Google Sans Flex |
| State | Zustand + AsyncStorage |

---

## 🧩 Home screen widgets (Android)

Requires a **development / release build** — not available in Expo Go.

| Widget | Size | Content |
| --- | --- | --- |
| DayLore | Medium | Quote / festival + lunar header |
| MonthSmall | Small | Month grid |
| DateMinimal | Small | Large day + lunar |
| Combo | Medium | Day + month grid |
| DayDetail | Large | Full today: solar/lunar, can chi, hoàng đạo |

Theme follows system light/dark. After changing widget config:

```bash
npx expo prebuild --clean
npx expo run:android
```

> Web omits family, personal events, notes, backup, profile editing, and native notifications. Văn khấn is available on web (read-only fill).

---

## 🚀 Getting started

```bash
npm install
npx expo start
```

Press `a` (Android), `i` (iOS), or scan the QR with **Expo Go (SDK 56)**.

### 🌐 Web

```bash
npm run web
```

Desktop (≥960px) uses a left sidebar; narrower viewports keep bottom tabs.

```bash
npm run build:web   # static export → dist/
npm run typecheck
```

### 📦 Android APK

```bash
npx expo prebuild --platform android
cd android && .\gradlew.bat assembleRelease
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

First public build is published on [GitHub Releases](https://github.com/hongducdev/canchi/releases) as **v1.0.0**.

---

## 📁 Project structure

```
app/                 Expo Router screens
  (tabs)/            Home · Calendar · Events · Settings
  day/[date].tsx     Day detail + notes + lore
  van-khan/          Prayer catalog & detail
  profile.tsx        User profile (native)
src/
  lib/               Lunar engine, Can Chi, tools
  data/              festivals, quotes, vankhan.json
  components/        UI kit
  store/             Zustand + AsyncStorage
  theme/             Design tokens
  widgets/           Android widget payloads
docs/
  vi.md              Vietnamese user guide
  superpowers/       Design specs & plans
```

---

## 🔒 Privacy

All computation and storage stay on-device.  
No analytics SDKs · No login · No cloud sync.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

Private / personal project unless otherwise stated in individual files.
