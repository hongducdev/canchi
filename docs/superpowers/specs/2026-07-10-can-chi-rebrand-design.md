# Can Chi 1.1.0 — Rebrand, Logo, Author, Update Check

**Date:** 2026-07-10  
**Status:** Approved for planning  
**App:** Can Chi (Expo / React Native)

## Goal

Ship **v1.1.0** with official branding **Can Chi**, a calendar-style launcher icon that shows today’s **lunar day** on Android, author credit in About, and GitHub Releases–based update checking (auto + manual).

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Official name | **Can Chi** everywhere user-facing; “lịch âm” only as calendar meaning |
| About tagline | *Ứng dụng lịch âm, Can Chi và ngày tốt — gọn trên máy bạn.* |
| Author | **hongducdev · hongduc.dev** in Settings → Về ứng dụng only; tap opens https://hongduc.dev |
| About tone | No heavy “offline / riêng tư” emphasis; version line is just `Phiên bản 1.1.0` |
| Logo look | Calendar pad: vermillion header **Can Chi**, large lunar day number, no seal ring |
| Dynamic icon | Android **activity-alias** set for lunar days 1–30; static sample day for store/splash/web/iOS |
| Update check | Auto on app open (network) + manual button in About |
| Update UI | Dialog: new version + short changelog + **Tải bản mới** (APK URL) + **Để sau** |
| Auto spam guard | At most one auto dialog per calendar day; manual always runs |
| Release | `1.1.0`, `versionCode` 2, APK name `canchi-1.1.0.apk`, notes in `docs/releases/v1.1.0.md` |
| GitHub | `https://github.com/hongducdev/canchi` Releases API |

## Out of scope

- Renaming AsyncStorage keys (`licham-*`) or backup schema (avoid data loss)
- Migrating Java package trees / breaking `applicationId` (`com.canchi.app` stays)
- Expo OTA (`expo-updates` remains disabled)
- Force-updating or in-app APK install (open download URL / browser only)
- Dynamic launcher icon on iOS/web (static calendar asset only)

## 1. Branding rename

Replace user-facing **Lịch Âm** with **Can Chi** in:

- In-app: Home brand (`TodayHero`), Settings About, web sidebar, notification titles/channels as appropriate
- Native: `android/.../values/strings.xml` `app_name`, `android/settings.gradle` root project name
- Expo: already `name` / `CFBundleDisplayName` = Can Chi — keep; align widget display names (`· Can Chi`)
- Docs: `README.md`, `docs/vi.md`, LICENSE product name if it says Lịch Âm, release notes
- Deep links: **keep `licham://` in this release** so existing widget click intents keep working; display names still say Can Chi. Scheme migration to `canchi` is a later change if needed.

Do **not** rename feature section titles that mean the Can Chi zodiac system (year/month/day pillars) — those stay “Can Chi” as content.

## 2. About + author

Settings → **Về ứng dụng**:

```
Can Chi
Ứng dụng lịch âm, Can Chi và ngày tốt — gọn trên máy bạn.
Phiên bản {version}
Tác giả hongducdev · hongduc.dev
[ Kiểm tra cập nhật ]
```

- `{version}` from Expo config / `expo-constants` (fallback `1.1.0`), not a hardcoded drift-prone string alone
- Author row is tappable → `Linking.openURL('https://hongduc.dev')`

## 3. Logo & dynamic Android icon

### Visual

- Rounded calendar tile
- Top bar: vermillion `#C23B22`, label **Can Chi** (light text `#F7F4EE`)
- Body: warm paper `#F7F4EE`, large lunar **day** number in ink `#0B0F14`
- Optional small subtitle (e.g. month) only if it stays legible at mipmap sizes; day number is mandatory

### Assets to produce

- `assets/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png` — static sample (e.g. day **15**)
- Android: foreground/mipmap set for days **1–30** used by activity aliases
- After asset drop-in: regenerate native icons via prebuild or copy into `android/app/src/main/res` as required by current project workflow

### Runtime (Android)

- Manifest: default launcher activity + aliases `LauncherDay01` … `LauncherDay30` (names flexible)
- On app start (and when day changes): compute lunar day via existing `solarToLunar`; enable matching alias, disable others via `PackageManager`
- Failure mode: leave last enabled alias; never crash launch
- Web/iOS: static icon only

## 4. Update check (GitHub Releases)

### Source of truth

`GET https://api.github.com/repos/hongducdev/canchi/releases/latest`

Parse:

- `tag_name` / `name` → semver (strip leading `v`)
- `body` → changelog (truncate for dialog)
- `assets[]` → first `.apk` browser download URL (prefer name matching `canchi-*.apk` if multiple)

### Behavior

| Trigger | Behavior |
|---------|----------|
| App open | If network available and no auto prompt yet today → fetch; if remote > local → show dialog; persist “auto shown” date |
| About button | Always fetch; if up to date → friendly message; if newer → same dialog; on error → short error message |

### Semver

Compare `major.minor.patch` numerically. Pre-release tags are ignored unless they are the latest release the API returns (use GitHub’s `latest` which excludes drafts/prereleases by default).

### Privacy

- No analytics; only this GitHub API call when checking
- No auth token; public repo only
- Timeout + cancel on unmount; never block first paint longer than a short background check

### Module shape

- `src/lib/appUpdate.ts` (or similar): `fetchLatestRelease()`, `isNewerVersion(local, remote)`, `getApkAssetUrl(release)`
- Thin UI hook or calls from root layout (auto) + Settings (manual)
- Constants: repo owner/name, max changelog length, storage key for last auto-prompt day

## 5. Version bump & release docs

Update to **1.1.0**:

- `package.json` / lock metadata as needed
- `app.json` `version`
- `android/app/build.gradle` `versionName "1.1.0"`, `versionCode 2`
- `docs/releases/v1.1.0.md` — changelog: rebrand Can Chi, calendar icon, author, update check
- README / `docs/vi.md` install links if they hardcode `licham-1.0.0.apk` → `canchi-1.1.0.apk`

Publishing the GitHub Release + uploading the APK may be a separate operator step after `npm run build:apk`; the app must work against the Releases API once that release exists.

## 6. Testing checklist

- [ ] Launcher label and in-app brand show **Can Chi**
- [ ] About copy, author link, version 1.1.0
- [ ] Android: after midnight / date change, icon day matches lunar day
- [ ] Manual check: up-to-date, newer, network error
- [ ] Auto check: shows once per day when newer release exists
- [ ] Dialog opens APK URL
- [ ] Web still builds; static favicon/brand updated
- [ ] Widgets labels say Can Chi; widgets still update

## Architecture sketch

```
App launch
  ├─ syncWidgets (existing)
  ├─ setLauncherAlias(lunarDay)     [Android only]
  └─ maybeAutoCheckUpdate()         [network, 1×/day]

Settings About
  ├─ version from Constants
  ├─ author → hongduc.dev
  └─ checkUpdate() → dialog | toast
```

## Success criteria

1. No user-visible “Lịch Âm” as product name  
2. Calendar-style branding + Android icon tracks lunar day  
3. Author visible and linkable from About  
4. Users can discover and download newer GitHub Release APKs without leaving the app’s guidance flow  
5. Version metadata consistent at **1.1.0** / versionCode **2**
