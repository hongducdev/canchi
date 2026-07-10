/**
 * Google Sign-In + Drive REST helpers for personal backup (Android).
 */

import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { useDriveBackupStore } from '../store/driveBackup';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'Can Chi';
const FILE_NAME = 'canchi-backup.json';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

export class DriveBackupCancelledError extends Error {
  constructor() {
    super('cancelled');
    this.name = 'DriveBackupCancelledError';
  }
}

export class DriveBackupConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DriveBackupConfigError';
  }
}

export class DriveBackupMissingFileError extends Error {
  constructor() {
    super('Chưa có bản sao lưu trên Drive');
    this.name = 'DriveBackupMissingFileError';
  }
}

let configured = false;

function webClientId(): string {
  return (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '').trim();
}

export function isGoogleDriveBackupSupported(): boolean {
  return Platform.OS === 'android';
}

function ensureConfigured(): void {
  if (!isGoogleDriveBackupSupported()) {
    throw new DriveBackupConfigError('Google Drive chỉ hỗ trợ trên Android.');
  }
  const clientId = webClientId();
  if (!clientId) {
    throw new DriveBackupConfigError(
      'Chưa cấu hình EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (file .env).'
    );
  }
  if (!configured) {
    GoogleSignin.configure({
      webClientId: clientId,
      scopes: [DRIVE_SCOPE],
      offlineAccess: false,
    });
    configured = true;
  }
}

function formatGoogleError(e: unknown): Error {
  if (isErrorWithCode(e)) {
    if (e.code === statusCodes.SIGN_IN_CANCELLED) {
      return new DriveBackupCancelledError();
    }
    if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return new Error('Thiếu Google Play Services trên máy.');
    }
    const msg = `${e.message ?? ''} ${e.code ?? ''}`.toLowerCase();
    if (
      msg.includes('403') ||
      msg.includes('access_denied') ||
      msg.includes('access denied') ||
      msg.includes('developer_error') ||
      msg.includes('10:')
    ) {
      return new Error(
        'Google từ chối (403). Kiểm tra Test users, Google Drive API, scope drive.file và SHA-1 Android.'
      );
    }
    return new Error(e.message || `Google Sign-In lỗi (${e.code})`);
  }
  if (e instanceof Error) return e;
  return new Error('Thao tác Google thất bại.');
}

async function getAccessToken(): Promise<string> {
  ensureConfigured();
  try {
    const { accessToken } = await GoogleSignin.getTokens();
    if (!accessToken) {
      throw new Error('Không lấy được token Google. Hãy kết nối lại.');
    }
    return accessToken;
  } catch (e) {
    throw formatGoogleError(e);
  }
}

type DriveFile = { id: string; name?: string };

async function driveJson<T>(
  accessToken: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`https://www.googleapis.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) {
      throw new Error('Phiên Google hết hạn. Hãy ngắt kết nối rồi kết nối lại.');
    }
    if (res.status === 403) {
      const lower = body.toLowerCase();
      if (lower.includes('accessnotconfigured') || lower.includes('has not been used')) {
        throw new Error(
          'Chưa bật Google Drive API trên Google Cloud. Bật API rồi thử lại.'
        );
      }
      if (lower.includes('insufficient') || lower.includes('access_denied')) {
        throw new Error(
          'Thiếu quyền Drive (403). Thêm scope drive.file trên OAuth consent, thêm Test user, rồi Ngắt kết nối và Kết nối lại.'
        );
      }
      throw new Error(
        `Drive từ chối (403). Kiểm tra Drive API + Test users + scope. ${body.slice(0, 100)}`
      );
    }
    throw new Error(`Drive lỗi ${res.status}: ${body.slice(0, 180)}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

async function findFolderId(accessToken: string): Promise<string | null> {
  const q = encodeURIComponent(
    `name='${FOLDER_NAME}' and mimeType='${FOLDER_MIME}' and trashed=false`
  );
  const data = await driveJson<{ files?: DriveFile[] }>(
    accessToken,
    `/drive/v3/files?q=${q}&spaces=drive&fields=files(id,name)&pageSize=1`
  );
  return data.files?.[0]?.id ?? null;
}

async function ensureFolderId(accessToken: string): Promise<string> {
  const existing = await findFolderId(accessToken);
  if (existing) return existing;
  const created = await driveJson<DriveFile>(accessToken, '/drive/v3/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: FOLDER_MIME,
    }),
  });
  if (!created.id) throw new Error('Không tạo được thư mục Can Chi trên Drive.');
  return created.id;
}

async function findBackupFileId(
  accessToken: string,
  folderId: string
): Promise<string | null> {
  const q = encodeURIComponent(
    `name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`
  );
  const data = await driveJson<{ files?: DriveFile[] }>(
    accessToken,
    `/drive/v3/files?q=${q}&spaces=drive&fields=files(id,name)&pageSize=1`
  );
  return data.files?.[0]?.id ?? null;
}

/** Sign in and persist email in driveBackup store. Returns null if user cancelled. */
export async function connectGoogleDrive(): Promise<{ email: string } | null> {
  ensureConfigured();
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Fresh consent when reconnecting after scope/config changes.
    if (GoogleSignin.hasPreviousSignIn()) {
      try {
        await GoogleSignin.signOut();
      } catch {
        // continue to interactive sign-in
      }
    }
    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) {
      return null;
    }
    if (!isSuccessResponse(response)) {
      return null;
    }
    const email = response.data.user.email;
    if (!email) {
      throw new Error('Tài khoản Google không có email.');
    }
    try {
      await GoogleSignin.addScopes({ scopes: [DRIVE_SCOPE] });
    } catch (scopeErr) {
      // Already granted is fine; real failures surface on getTokens / Drive calls.
      if (isErrorWithCode(scopeErr) && scopeErr.code !== statusCodes.SIGN_IN_CANCELLED) {
        const msg = `${scopeErr.message ?? ''}`.toLowerCase();
        if (msg.includes('403') || msg.includes('access_denied')) {
          throw formatGoogleError(scopeErr);
        }
      }
    }
    // Prove token works before claiming connected.
    await getAccessToken();
    useDriveBackupStore.getState().setConnected(email);
    return { email };
  } catch (e) {
    if (e instanceof DriveBackupCancelledError) return null;
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }
    throw formatGoogleError(e);
  }
}

export async function disconnectGoogleDrive(): Promise<void> {
  if (!isGoogleDriveBackupSupported()) return;
  try {
    ensureConfigured();
    await GoogleSignin.signOut();
  } catch {
    // still clear local connection metadata
  }
  useDriveBackupStore.getState().clearConnection();
}

/** Refresh store email from native session if still signed in. */
export async function syncGoogleDriveSession(): Promise<void> {
  if (!isGoogleDriveBackupSupported()) return;
  try {
    ensureConfigured();
  } catch {
    return;
  }
  const user = GoogleSignin.getCurrentUser();
  if (user?.user.email) {
    useDriveBackupStore.getState().setConnected(user.user.email);
    return;
  }
  if (!GoogleSignin.hasPreviousSignIn()) {
    useDriveBackupStore.getState().clearConnection();
    return;
  }
  try {
    const silent = await GoogleSignin.signInSilently();
    if (silent.type === 'success' && silent.data.user.email) {
      useDriveBackupStore.getState().setConnected(silent.data.user.email);
    } else {
      useDriveBackupStore.getState().clearConnection();
    }
  } catch {
    useDriveBackupStore.getState().clearConnection();
  }
}

export async function uploadBackupToDrive(json: string): Promise<void> {
  const accessToken = await getAccessToken();
  const folderId = await ensureFolderId(accessToken);
  const fileId = await findBackupFileId(accessToken, folderId);

  if (fileId) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: json,
      }
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Không cập nhật được file Drive (${res.status}): ${body.slice(0, 120)}`);
    }
  } else {
    const metadata = {
      name: FILE_NAME,
      parents: [folderId],
      mimeType: 'application/json',
    };
    const boundary = `canchi_${Date.now()}`;
    const body =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      `${json}\r\n` +
      `--${boundary}--`;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Không tạo được file Drive (${res.status}): ${errBody.slice(0, 120)}`);
    }
  }

  useDriveBackupStore.getState().setLastBackupAt(Date.now());
}

export async function downloadBackupFromDrive(): Promise<string> {
  const accessToken = await getAccessToken();
  const folderId = await findFolderId(accessToken);
  if (!folderId) {
    throw new DriveBackupMissingFileError();
  }
  const fileId = await findBackupFileId(accessToken, folderId);
  if (!fileId) {
    throw new DriveBackupMissingFileError();
  }
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 404) throw new DriveBackupMissingFileError();
    throw new Error(`Không tải được bản sao lưu (${res.status}): ${body.slice(0, 120)}`);
  }
  return await res.text();
}

export const DRIVE_BACKUP_PATH_LABEL = `${FOLDER_NAME}/${FILE_NAME}`;
