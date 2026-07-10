import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { AppText, AppTextInput } from '../../src/components/AppText';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { SettingRow } from '../../src/components/SettingRow';
import { ToolTile } from '../../src/components/ToolTile';
import { useTheme } from '../../src/hooks/useTheme';
import {
  checkForUpdateManual,
  getLocalAppVersion,
} from '../../src/lib/appUpdate';
import {
  applyBackup,
  buildBackup,
  parseBackup,
  serializeBackup,
} from '../../src/lib/backup';
import {
  DRIVE_BACKUP_PATH_LABEL,
  DriveBackupConfigError,
  DriveBackupMissingFileError,
  connectGoogleDrive,
  disconnectGoogleDrive,
  downloadBackupFromDrive,
  isGoogleDriveBackupSupported,
  syncGoogleDriveSession,
  uploadBackupToDrive,
} from '../../src/lib/googleDriveBackup';
import {
  expoGoNotificationHint,
  rescheduleAllPersonalReminders,
  scheduleTestNotification,
} from '../../src/lib/notifications';
import { isWeb } from '../../src/lib/platform';
import type { ThemeMode } from '../../src/lib/types';
import { useDriveBackupStore } from '../../src/store/driveBackup';
import { useFamilyStore } from '../../src/store/family';
import { useNotesStore } from '../../src/store/notes';
import { usePersonalEventsStore } from '../../src/store/personalEvents';
import { useSettingsStore } from '../../src/store/settings';
import {
  hasUsableProfile,
  useUserProfileStore,
} from '../../src/store/userProfile';
import { font, radius, space } from '../../src/theme/spacing';

const THEME_CYCLE: ThemeMode[] = ['system', 'light', 'dark'];
const THEME_LABEL: Record<ThemeMode, string> = {
  system: 'Theo hệ thống',
  light: 'Sáng',
  dark: 'Tối',
};

export default function SettingsScreen() {
  const { colors } = useTheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const weekStartsOn = useSettingsStore((s) => s.weekStartsOn);
  const showLunarInGrid = useSettingsStore((s) => s.showLunarInGrid);
  const showFestivals = useSettingsStore((s) => s.showFestivals);
  const haptics = useSettingsStore((s) => s.haptics);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setWeekStartsOn = useSettingsStore((s) => s.setWeekStartsOn);
  const setShowLunarInGrid = useSettingsStore((s) => s.setShowLunarInGrid);
  const setShowFestivals = useSettingsStore((s) => s.setShowFestivals);
  const setHaptics = useSettingsStore((s) => s.setHaptics);
  const notes = useNotesStore((s) => s.notes);
  const personalEvents = usePersonalEventsStore((s) => s.events);
  const familyMembers = useFamilyStore((s) => s.members);
  const userProfile = useUserProfileStore((s) => s.profile);
  const driveEmail = useDriveBackupStore((s) => s.email);
  const lastBackupAt = useDriveBackupStore((s) => s.lastBackupAt);
  const [restoreText, setRestoreText] = useState('');
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [driveBusy, setDriveBusy] = useState(false);
  const appVersion = getLocalAppVersion();
  const showDrive = isGoogleDriveBackupSupported();

  useEffect(() => {
    if (!showDrive) return;
    void syncGoogleDriveSession();
  }, [showDrive]);

  const openAuthorSite = () => {
    Linking.openURL('https://hongduc.dev').catch(() => {
      Alert.alert('Không mở được', 'https://hongduc.dev');
    });
  };

  const onCheckUpdate = async () => {
    if (checkingUpdate) return;
    setCheckingUpdate(true);
    try {
      await checkForUpdateManual();
    } finally {
      setCheckingUpdate(false);
    }
  };

  const currentBackupJson = () => {
    const settings = useSettingsStore.getState();
    const backup = buildBackup(
      useNotesStore.getState().notes,
      usePersonalEventsStore.getState().events,
      {
        themeMode: settings.themeMode,
        weekStartsOn: settings.weekStartsOn,
        showLunarInGrid: settings.showLunarInGrid,
        showFestivals: settings.showFestivals,
        haptics: settings.haptics,
      },
      useUserProfileStore.getState().profile,
      useFamilyStore.getState().members
    );
    return serializeBackup(backup);
  };

  const exportBackup = async () => {
    const json = currentBackupJson();
    try {
      await Share.share({ message: json, title: 'canchi-backup.json' });
    } catch {
      Alert.alert('Không chia sẻ được', 'Sao chép thủ công từ hộp thoại hệ thống nếu có.');
    }
  };

  const importBackup = () => {
    try {
      const data = parseBackup(restoreText);
      const { restoredProfileFamily } = applyBackup(data);
      setRestoreText('');
      Alert.alert(
        'Đã khôi phục',
        restoredProfileFamily
          ? 'Ghi chú, sự kiện, cài đặt, hồ sơ và gia đình đã được nạp lại.'
          : 'Ghi chú, sự kiện và cài đặt đã được nạp lại (bản v1 — giữ hồ sơ/gia đình trên máy).'
      );
    } catch (e) {
      Alert.alert('Lỗi', e instanceof Error ? e.message : 'Không đọc được bản sao lưu.');
    }
  };

  const driveErrorMessage = (e: unknown): string => {
    if (e instanceof DriveBackupConfigError || e instanceof DriveBackupMissingFileError) {
      return e.message;
    }
    if (e instanceof Error) return e.message;
    return 'Thao tác Drive thất bại.';
  };

  const onConnectDrive = async () => {
    if (driveBusy) return;
    setDriveBusy(true);
    try {
      const result = await connectGoogleDrive();
      if (result) {
        Alert.alert('Đã kết nối', result.email);
      }
    } catch (e) {
      Alert.alert('Không kết nối được', driveErrorMessage(e));
    } finally {
      setDriveBusy(false);
    }
  };

  const onDisconnectDrive = () => {
    Alert.alert('Ngắt kết nối Google?', 'Sao lưu trên Drive vẫn giữ nguyên.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Ngắt kết nối',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setDriveBusy(true);
            try {
              await disconnectGoogleDrive();
            } catch (e) {
              Alert.alert('Lỗi', driveErrorMessage(e));
            } finally {
              setDriveBusy(false);
            }
          })();
        },
      },
    ]);
  };

  const onBackupToDrive = async () => {
    if (driveBusy) return;
    setDriveBusy(true);
    try {
      await uploadBackupToDrive(currentBackupJson());
      Alert.alert('Đã sao lưu', `Đã ghi ${DRIVE_BACKUP_PATH_LABEL} trên Drive của bạn.`);
    } catch (e) {
      Alert.alert('Sao lưu thất bại', driveErrorMessage(e));
    } finally {
      setDriveBusy(false);
    }
  };

  const onRestoreFromDrive = async () => {
    if (driveBusy) return;
    setDriveBusy(true);
    try {
      const raw = await downloadBackupFromDrive();
      const data = parseBackup(raw);
      const detail =
        data.version === 2
          ? 'Ghi chú, sự kiện, cài đặt, hồ sơ và gia đình trên máy sẽ bị thay thế.'
          : 'Ghi chú, sự kiện và cài đặt sẽ bị thay thế (bản v1 — giữ hồ sơ/gia đình trên máy).';
      Alert.alert('Khôi phục từ Drive?', detail, [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: () => {
            const { restoredProfileFamily } = applyBackup(data);
            Alert.alert(
              'Đã khôi phục',
              restoredProfileFamily
                ? 'Dữ liệu từ Drive đã được nạp (đầy đủ).'
                : 'Dữ liệu từ Drive đã được nạp (v1).'
            );
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Khôi phục thất bại', driveErrorMessage(e));
    } finally {
      setDriveBusy(false);
    }
  };

  const formatBackupTime = (at: number | null): string => {
    if (!at) return 'Chưa sao lưu';
    try {
      return new Date(at).toLocaleString('vi-VN');
    } catch {
      return 'Chưa sao lưu';
    }
  };

  const cycleTheme = () => {
    const i = THEME_CYCLE.indexOf(themeMode);
    setThemeMode(THEME_CYCLE[(i + 1) % THEME_CYCLE.length]);
  };

  const clearNotes = () => {
    Alert.alert(
      'Xóa ghi chú',
      'Xóa toàn bộ ghi chú đã lưu trên máy?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => useNotesStore.setState({ notes: [] }),
        },
      ]
    );
  };

  const scheduleReminders = async () => {
    try {
      const count = await rescheduleAllPersonalReminders(personalEvents);
      const hint = expoGoNotificationHint();
      const body =
        count > 0
          ? `${count} nhắc cục bộ cho sự kiện cá nhân (8:00 sáng ngày tới).`
          : 'Không có sự kiện phù hợp để nhắc.';
      Alert.alert('Đã lên lịch', hint ? `${body}\n\n${hint}` : body);
    } catch (e) {
      Alert.alert('Lỗi', e instanceof Error ? e.message : 'Không lên lịch được.');
    }
  };

  const testNotif = async () => {
    try {
      await scheduleTestNotification();
      const hint = expoGoNotificationHint();
      Alert.alert(
        'OK',
        hint
          ? `Thông báo thử sẽ hiện sau ~3 giây.\n\n${hint}`
          : 'Thông báo thử sẽ hiện sau ~3 giây.'
      );
    } catch (e) {
      Alert.alert('Lỗi', e instanceof Error ? e.message : 'Không gửi được thông báo.');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Cài đặt</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          {isWeb
            ? 'Lịch âm trên trình duyệt · dữ liệu cá nhân chỉ trên app'
            : 'Mọi dữ liệu chỉ lưu trên thiết bị'}
        </AppText>
      </View>

      <AppText style={[styles.group, { color: colors.textMuted }]}>CÔNG CỤ</AppText>
      <View style={styles.toolsGrid}>
        <ToolTile
          title="Tìm kiếm"
          subtitle="Ngày, lễ hội, tiết khí"
          icon="search-outline"
          onPress={() => router.push('/search')}
        />
        <ToolTile
          title="Ngày tốt"
          subtitle="Cưới hỏi, khai trương, xuất hành…"
          icon="sparkles-outline"
          onPress={() => router.push('/lucky')}
        />
        {!isWeb ? (
          <ToolTile
            title="Sự kiện cá nhân"
            subtitle={`${personalEvents.length} sự kiện trên máy`}
            icon="calendar-outline"
            onPress={() => router.push('/personal')}
          />
        ) : null}
        <ToolTile
          title="Phong thủy"
          subtitle="Mệnh, màu, số, hướng theo năm sinh"
          icon="compass-outline"
          onPress={() => router.push('/fengshui')}
        />
        <ToolTile
          title="Tính ngày lễ"
          subtitle="Đầy tháng, 49 ngày, giỗ…"
          icon="flower-outline"
          onPress={() => router.push('/memorial')}
        />
        {!isWeb ? (
          <ToolTile
            title="Gia đình"
            subtitle={`${familyMembers.length} thành viên trên máy`}
            icon="people-outline"
            onPress={() => router.push('/family')}
          />
        ) : null}
        <ToolTile
          title="Thiên văn"
          subtitle="Trăng, nhật thực, mưa sao băng"
          icon="planet-outline"
          onPress={() => router.push('/astronomy')}
        />
        <ToolTile
          title="Văn khấn"
          subtitle="Mẫu khấn theo dịp · điền hồ sơ"
          icon="book-outline"
          onPress={() => router.push('/van-khan')}
        />
      </View>

      {!isWeb ? (
        <>
          <AppText style={[styles.group, { color: colors.textMuted }]}>HỒ SƠ</AppText>
          <Card padded={false} style={styles.card}>
            <View style={styles.pad}>
              <SettingRow
                title="Hồ sơ của tôi"
                subtitle={
                  hasUsableProfile(userProfile)
                    ? userProfile!.fullName
                    : 'Chưa thiết lập'
                }
                onPress={() => router.push('/profile')}
                isLast
              />
            </View>
          </Card>
        </>
      ) : null}

      <AppText style={[styles.group, { color: colors.textMuted }]}>GIAO DIỆN</AppText>
      <Card padded={false} style={styles.card}>
        <View style={styles.pad}>
          <SettingRow
            title="Chủ đề"
            subtitle="Sáng, tối hoặc theo hệ thống"
            rightLabel={THEME_LABEL[themeMode]}
            onPress={cycleTheme}
          />
          <SettingRow
            title="Tuần bắt đầu"
            subtitle={weekStartsOn === 1 ? 'Thứ Hai' : 'Chủ Nhật'}
            rightLabel={weekStartsOn === 1 ? 'T2' : 'CN'}
            onPress={() => setWeekStartsOn(weekStartsOn === 1 ? 0 : 1)}
            isLast
          />
        </View>
      </Card>

      <AppText style={[styles.group, { color: colors.textMuted }]}>LỊCH</AppText>
      <Card padded={false} style={styles.card}>
        <View style={styles.pad}>
          <SettingRow
            title="Hiện ngày Âm trên lưới"
            value={showLunarInGrid}
            onValueChange={setShowLunarInGrid}
          />
          <SettingRow
            title="Đánh dấu lễ hội"
            subtitle="Chấm vàng trên ngày có lễ"
            value={showFestivals}
            onValueChange={setShowFestivals}
            isLast={isWeb}
          />
          {!isWeb ? (
            <SettingRow
              title="Phản hồi xúc giác"
              value={haptics}
              onValueChange={setHaptics}
              isLast
            />
          ) : null}
        </View>
      </Card>

      {!isWeb ? (
        <>
          <AppText style={[styles.group, { color: colors.textMuted }]}>THÔNG BÁO</AppText>
          <Card padded={false} style={styles.card}>
            <View style={styles.pad}>
              <SettingRow
                title="Lên lịch nhắc sự kiện"
                subtitle="Cục bộ (không dùng push) · 8:00 sáng"
                onPress={scheduleReminders}
              />
              <SettingRow
                title="Thử thông báo"
                subtitle="Cục bộ · hiện sau ~3 giây"
                onPress={testNotif}
                isLast
              />
            </View>
          </Card>

          <AppText style={[styles.group, { color: colors.textMuted }]}>DỮ LIỆU</AppText>
          {showDrive ? (
            <Card style={styles.driveCard}>
              <AppText style={[styles.driveTitle, { color: colors.text }]}>
                Sao lưu Google Drive
              </AppText>
              <AppText style={[styles.driveBody, { color: colors.textSecondary }]}>
                {driveEmail
                  ? `Đã kết nối · ${driveEmail}`
                  : 'Lưu hồ sơ, ghi chú và sự kiện vào Drive cá nhân của bạn.'}
              </AppText>
              {driveEmail ? (
                <AppText style={[styles.driveMeta, { color: colors.textMuted }]}>
                  Lần sao lưu: {formatBackupTime(lastBackupAt)}
                  {'\n'}
                  File: {DRIVE_BACKUP_PATH_LABEL}
                </AppText>
              ) : null}
              {!driveEmail ? (
                <Pressable
                  onPress={onConnectDrive}
                  disabled={driveBusy}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.drivePrimaryBtn,
                    {
                      backgroundColor: colors.accent,
                      opacity: pressed || driveBusy ? 0.85 : 1,
                    },
                  ]}
                >
                  {driveBusy ? (
                    <ActivityIndicator color="#F7F4EE" />
                  ) : (
                    <AppText style={styles.drivePrimaryBtnText}>Kết nối Google</AppText>
                  )}
                </Pressable>
              ) : (
                <View style={styles.driveActions}>
                  <Pressable
                    onPress={onBackupToDrive}
                    disabled={driveBusy}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.drivePrimaryBtn,
                      {
                        backgroundColor: colors.accent,
                        opacity: pressed || driveBusy ? 0.85 : 1,
                      },
                    ]}
                  >
                    {driveBusy ? (
                      <ActivityIndicator color="#F7F4EE" />
                    ) : (
                      <AppText style={styles.drivePrimaryBtnText}>Sao lưu ngay</AppText>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={onRestoreFromDrive}
                    disabled={driveBusy}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.driveSecondaryBtn,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.bgMuted,
                        opacity: pressed || driveBusy ? 0.85 : 1,
                      },
                    ]}
                  >
                    <AppText style={[styles.driveSecondaryBtnText, { color: colors.text }]}>
                      Khôi phục từ Drive
                    </AppText>
                  </Pressable>
                  <Pressable onPress={onDisconnectDrive} disabled={driveBusy}>
                    <AppText style={[styles.driveDisconnect, { color: colors.accentText }]}>
                      Ngắt kết nối
                    </AppText>
                  </Pressable>
                </View>
              )}
            </Card>
          ) : null}
          <Card padded={false} style={styles.card}>
            <View style={styles.pad}>
              <SettingRow
                title="Ghi chú đã lưu"
                subtitle={`${notes.length} ghi chú trên máy`}
                rightLabel={`${notes.length}`}
              />
              <SettingRow
                title="Xuất bản sao lưu JSON"
                subtitle="Chia sẻ file offline (v2)"
                onPress={exportBackup}
              />
              <SettingRow
                title="Xóa tất cả ghi chú"
                subtitle="Không thể hoàn tác"
                onPress={clearNotes}
                isLast
              />
            </View>
          </Card>

          <Card style={styles.restoreCard}>
            <AppText style={[styles.restoreTitle, { color: colors.text }]}>Khôi phục JSON</AppText>
            <AppTextInput
              placeholder="Dán nội dung file sao lưu…"
              placeholderTextColor={colors.textMuted}
              value={restoreText}
              onChangeText={setRestoreText}
              multiline
              style={[
                styles.restoreInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.bgMuted,
                },
              ]}
            />
            <SettingRow
              title="Khôi phục ngay"
              subtitle="Ghi đè dữ liệu hiện tại"
              onPress={importBackup}
              isLast
            />
          </Card>
        </>
      ) : null}

      <AppText style={[styles.group, { color: colors.textMuted }]}>VỀ ỨNG DỤNG</AppText>
      <Card>
        <AppText style={[styles.aboutTitle, { color: colors.text }]}>Can Chi</AppText>
        <AppText style={[styles.aboutBody, { color: colors.textSecondary }]}>
          Ứng dụng lịch âm, Can Chi và ngày tốt — gọn trên máy bạn.
        </AppText>
        <AppText style={[styles.version, { color: colors.textMuted }]}>
          Phiên bản {appVersion}
        </AppText>
        <Pressable onPress={openAuthorSite} accessibilityRole="link">
          <AppText style={[styles.author, { color: colors.text }]}>
            Tác giả{' '}
            <AppText style={{ color: colors.accentText, fontWeight: '600' }}>
              hongducdev
            </AppText>
            {' · '}
            <AppText style={{ color: colors.accentText, fontWeight: '600' }}>
              hongduc.dev
            </AppText>
          </AppText>
        </Pressable>
        <Pressable
          onPress={onCheckUpdate}
          disabled={checkingUpdate}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.updateBtn,
            {
              backgroundColor: colors.accent,
              opacity: pressed || checkingUpdate ? 0.85 : 1,
            },
          ]}
        >
          <AppText style={styles.updateBtnText}>
            {checkingUpdate ? 'Đang kiểm tra…' : 'Kiểm tra cập nhật'}
          </AppText>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: space.sm,
    marginBottom: space.lg,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: font.sm,
    marginTop: 4,
  },
  group: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 1.0,
    marginBottom: space.sm,
    marginTop: space.md,
    textTransform: 'uppercase',
  },
  card: {
    marginBottom: space.sm,
    overflow: 'hidden',
  },
  pad: {
    paddingHorizontal: space.lg,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.sm,
    marginBottom: space.sm,
  },
  restoreCard: {
    marginBottom: space.sm,
  },
  driveCard: {
    marginBottom: space.sm,
  },
  driveTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: space.xs,
  },
  driveBody: {
    fontSize: font.sm,
    lineHeight: 20,
    marginBottom: space.md,
  },
  driveMeta: {
    fontSize: font.xs,
    lineHeight: 18,
    marginBottom: space.md,
  },
  driveActions: {
    gap: space.sm,
  },
  drivePrimaryBtn: {
    minHeight: 48,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drivePrimaryBtnText: {
    fontSize: font.md,
    fontWeight: '700',
    letterSpacing: -0.1,
    color: '#F7F4EE',
  },
  driveSecondaryBtn: {
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driveSecondaryBtnText: {
    fontSize: font.md,
    fontWeight: '600',
  },
  driveDisconnect: {
    fontSize: font.sm,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: space.sm,
  },
  restoreTitle: {
    fontSize: font.md,
    fontWeight: '700',
    marginBottom: space.sm,
  },
  restoreInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    minHeight: 88,
    padding: space.md,
    fontSize: font.sm,
    textAlignVertical: 'top',
    marginBottom: space.sm,
  },
  aboutTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    marginBottom: space.sm,
  },
  aboutBody: {
    fontSize: font.sm,
    lineHeight: 20,
  },
  version: {
    fontSize: font.xs,
    marginTop: space.md,
  },
  author: {
    fontSize: font.sm,
    marginTop: space.sm,
    marginBottom: space.md,
  },
  updateBtn: {
    marginTop: space.sm,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnText: {
    fontSize: font.md,
    fontWeight: '700',
    letterSpacing: -0.1,
    color: '#F7F4EE',
  },
});
