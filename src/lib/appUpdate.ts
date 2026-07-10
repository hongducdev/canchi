import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Alert, Linking, Platform } from 'react-native';

const GITHUB_LATEST =
  'https://api.github.com/repos/hongducdev/canchi/releases/latest';
const AUTO_PROMPT_KEY = 'canchi-update-auto-prompt-day';
const CHANGELOG_MAX = 600;
const FETCH_TIMEOUT_MS = 12_000;
const APK_CACHE_NAME = 'canchi-update.apk';
const ANDROID_PACKAGE = 'com.canchi.app';

export type LatestRelease = {
  version: string;
  tagName: string;
  changelog: string;
  apkUrl: string | null;
  htmlUrl: string;
};

type GithubReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type GithubReleaseResponse = {
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  assets: GithubReleaseAsset[];
};

export function getLocalAppVersion(): string {
  return (
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    '1.1.0'
  );
}

export function parseSemver(raw: string): [number, number, number] | null {
  const cleaned = raw.trim().replace(/^v/i, '');
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function isNewerVersion(local: string, remote: string): boolean {
  const a = parseSemver(local);
  const b = parseSemver(remote);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (b[i] > a[i]) return true;
    if (b[i] < a[i]) return false;
  }
  return false;
}

function pickApkUrl(assets: GithubReleaseAsset[]): string | null {
  const canchi = assets.find((a) => /^canchi-.*\.apk$/i.test(a.name));
  if (canchi) return canchi.browser_download_url;
  const anyApk = assets.find((a) => /\.apk$/i.test(a.name));
  return anyApk?.browser_download_url ?? null;
}

function truncateChangelog(body: string | null): string {
  if (!body) return 'Có bản phát hành mới trên GitHub.';
  const trimmed = body.trim();
  if (trimmed.length <= CHANGELOG_MAX) return trimmed;
  return `${trimmed.slice(0, CHANGELOG_MAX).trimEnd()}…`;
}

export async function fetchLatestRelease(): Promise<LatestRelease> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(GITHUB_LATEST, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'CanChi-App',
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`GitHub trả về ${res.status}`);
    }
    const data = (await res.json()) as GithubReleaseResponse;
    const version =
      parseSemver(data.tag_name)?.join('.') ??
      parseSemver(data.name ?? '')?.join('.') ??
      data.tag_name.replace(/^v/i, '');
    return {
      version,
      tagName: data.tag_name,
      changelog: truncateChangelog(data.body),
      apkUrl: pickApkUrl(data.assets ?? []),
      htmlUrl: data.html_url,
    };
  } finally {
    clearTimeout(timer);
  }
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function wasAutoPromptedToday(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(AUTO_PROMPT_KEY);
  return stored === todayKey();
}

async function markAutoPromptedToday(): Promise<void> {
  await AsyncStorage.setItem(AUTO_PROMPT_KEY, todayKey());
}

async function openUnknownSourcesSettings(): Promise<void> {
  await IntentLauncher.startActivityAsync(
    'android.settings.MANAGE_UNKNOWN_APP_SOURCES',
    { data: `package:${ANDROID_PACKAGE}` }
  );
}

/** Download APK to cache and open the system package installer (Android). */
export async function downloadAndInstallApk(apkUrl: string): Promise<void> {
  if (Platform.OS !== 'android') {
    await Linking.openURL(apkUrl);
    return;
  }

  if (!FileSystem.cacheDirectory) {
    throw new Error('Không truy cập được bộ nhớ tạm trên máy.');
  }

  const dest = `${FileSystem.cacheDirectory}${APK_CACHE_NAME}`;
  const existing = await FileSystem.getInfoAsync(dest);
  if (existing.exists) {
    await FileSystem.deleteAsync(dest, { idempotent: true });
  }

  const downloaded = await FileSystem.downloadAsync(apkUrl, dest, {
    headers: {
      Accept: 'application/vnd.android.package-archive,*/*',
      'User-Agent': 'CanChi-App',
    },
  });

  if (downloaded.status < 200 || downloaded.status >= 300) {
    throw new Error(`Không tải được APK (HTTP ${downloaded.status}).`);
  }

  const contentUri = await FileSystem.getContentUriAsync(downloaded.uri);

  try {
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      type: 'application/vnd.android.package-archive',
      flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    });
  } catch {
    try {
      await openUnknownSourcesSettings();
      Alert.alert(
        'Cho phép cài đặt',
        'Bật “Cho phép từ nguồn này” cho Can Chi, rồi nhấn Tải bản mới lại.'
      );
    } catch {
      throw new Error(
        'Không mở được trình cài đặt. Hãy cho phép cài app từ nguồn này trong Cài đặt hệ thống.'
      );
    }
  }
}

export function showUpdateDialog(release: LatestRelease): void {
  Alert.alert(`Có bản mới ${release.version}`, release.changelog, [
    { text: 'Để sau', style: 'cancel' },
    {
      text: 'Tải bản mới',
      onPress: () => {
        void (async () => {
          if (!release.apkUrl) {
            Linking.openURL(release.htmlUrl).catch(() => {
              Alert.alert('Không mở được liên kết', release.htmlUrl);
            });
            return;
          }
          try {
            if (Platform.OS === 'android') {
              Alert.alert(
                'Đang tải…',
                'APK đang được tải về máy. Giữ app mở cho đến khi hiện màn hình cài đặt.'
              );
            }
            await downloadAndInstallApk(release.apkUrl);
          } catch (e) {
            Alert.alert(
              'Tải / cài thất bại',
              e instanceof Error ? e.message : 'Không tải hoặc cài được bản mới.'
            );
          }
        })();
      },
    },
  ]);
}

/** Manual check from Settings. Always fetches. */
export async function checkForUpdateManual(): Promise<void> {
  try {
    const local = getLocalAppVersion();
    const latest = await fetchLatestRelease();
    if (!isNewerVersion(local, latest.version)) {
      Alert.alert('Đã cập nhật', `Bạn đang dùng bản mới nhất (${local}).`);
      return;
    }
    showUpdateDialog(latest);
  } catch {
    Alert.alert(
      'Không kiểm tra được',
      'Không kết nối được GitHub Releases. Thử lại khi có mạng.'
    );
  }
}

/** Auto check on launch — at most one dialog per calendar day. */
export async function maybeAutoCheckUpdate(): Promise<void> {
  try {
    if (await wasAutoPromptedToday()) return;
    const local = getLocalAppVersion();
    const latest = await fetchLatestRelease();
    if (!isNewerVersion(local, latest.version)) return;
    await markAutoPromptedToday();
    showUpdateDialog(latest);
  } catch {
    // Silent on auto path — offline is normal for this app.
  }
}
