import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { SettingRow } from '../../src/components/SettingRow';
import { useTheme } from '../../src/hooks/useTheme';
import { buildBackup, parseBackup, serializeBackup } from '../../src/lib/backup';
import { useNotesStore } from '../../src/store/notes';
import { usePersonalEventsStore } from '../../src/store/personalEvents';
import { useSettingsStore } from '../../src/store/settings';
import type { ThemeMode } from '../../src/lib/types';
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
  const [restoreText, setRestoreText] = useState('');

  const exportBackup = async () => {
    const settings = useSettingsStore.getState();
    const backup = buildBackup(notes, personalEvents, {
      themeMode: settings.themeMode,
      weekStartsOn: settings.weekStartsOn,
      showLunarInGrid: settings.showLunarInGrid,
      showFestivals: settings.showFestivals,
      haptics: settings.haptics,
    });
    const json = serializeBackup(backup);
    try {
      await Share.share({ message: json, title: 'licham-backup.json' });
    } catch {
      Alert.alert('Không chia sẻ được', 'Sao chép thủ công từ hộp thoại hệ thống nếu có.');
    }
  };

  const importBackup = () => {
    try {
      const data = parseBackup(restoreText);
      useNotesStore.setState({ notes: data.notes });
      usePersonalEventsStore.setState({ events: data.personalEvents });
      useSettingsStore.setState({
        themeMode: data.settings.themeMode,
        weekStartsOn: data.settings.weekStartsOn,
        showLunarInGrid: data.settings.showLunarInGrid,
        showFestivals: data.settings.showFestivals,
        haptics: data.settings.haptics,
      });
      setRestoreText('');
      Alert.alert('Đã khôi phục', 'Ghi chú, sự kiện và cài đặt đã được nạp lại.');
    } catch (e) {
      Alert.alert('Lỗi', e instanceof Error ? e.message : 'Không đọc được bản sao lưu.');
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

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Cài đặt</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Mọi dữ liệu chỉ lưu trên thiết bị
        </Text>
      </View>

      <Text style={[styles.group, { color: colors.textMuted }]}>CÔNG CỤ</Text>
      <Card padded={false} style={styles.card}>
        <View style={styles.pad}>
          <SettingRow
            title="Tìm kiếm"
            subtitle="Ngày, lễ hội, tiết khí"
            onPress={() => router.push('/search')}
          />
          <SettingRow
            title="Ngày tốt"
            subtitle="Cưới hỏi, khai trương, xuất hành…"
            onPress={() => router.push('/lucky')}
          />
          <SettingRow
            title="Sự kiện cá nhân"
            subtitle={`${personalEvents.length} sự kiện trên máy`}
            onPress={() => router.push('/personal')}
          />
          <SettingRow
            title="Phong thủy"
            subtitle="Mệnh, màu, số, hướng theo năm sinh"
            onPress={() => router.push('/fengshui')}
            isLast
          />
        </View>
      </Card>

      <Text style={[styles.group, { color: colors.textMuted }]}>GIAO DIỆN</Text>
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

      <Text style={[styles.group, { color: colors.textMuted }]}>LỊCH</Text>
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
          />
          <SettingRow
            title="Phản hồi xúc giác"
            value={haptics}
            onValueChange={setHaptics}
            isLast
          />
        </View>
      </Card>

      <Text style={[styles.group, { color: colors.textMuted }]}>DỮ LIỆU</Text>
      <Card padded={false} style={styles.card}>
        <View style={styles.pad}>
          <SettingRow
            title="Ghi chú đã lưu"
            subtitle={`${notes.length} ghi chú trên máy`}
            rightLabel={`${notes.length}`}
          />
          <SettingRow
            title="Xuất bản sao lưu JSON"
            subtitle="Chia sẻ file offline"
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
        <Text style={[styles.restoreTitle, { color: colors.text }]}>Khôi phục JSON</Text>
        <TextInput
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

      <Text style={[styles.group, { color: colors.textMuted }]}>VỀ ỨNG DỤNG</Text>
      <Card>
        <Text style={[styles.aboutTitle, { color: colors.text }]}>Lịch Âm</Text>
        <Text style={[styles.aboutBody, { color: colors.textSecondary }]}>
          Lịch âm dương Việt Nam, hoạt động hoàn toàn offline. Không tài khoản, không
          máy chủ, không theo dõi. Tính Can Chi, tiết khí, giờ hoàng đạo và lễ hội
          truyền thống ngay trên máy bạn.
        </Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Phiên bản 1.0.0 · Riêng tư · Offline-first
        </Text>
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
  restoreCard: {
    marginBottom: space.sm,
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
    marginTop: space.lg,
  },
});
