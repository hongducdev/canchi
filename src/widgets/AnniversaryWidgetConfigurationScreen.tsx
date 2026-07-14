import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  WidgetPreview,
  type WidgetConfigurationScreenProps,
} from 'react-native-android-widget';
import { dateKey, parseDateKey } from '../lib/lunar';
import {
  buildAnniversaryWidgetProps,
  createDefaultAnniversaryConfig,
  getAnniversaryWidgetConfig,
  saveAnniversaryWidgetConfig,
  type AnniversaryWidgetConfig,
} from './anniversaryConfig';
import { AnniversaryAndroidWidget } from './android/AnniversaryAndroidWidget';
import { getWidgetLayout } from './android/widgetLayout';

const MIN_DATE = new Date(1800, 0, 1);

function dateFromKey(key: string): Date {
  const date = parseDateKey(key);
  return new Date(date.year, date.month - 1, date.day, 12, 0, 0, 0);
}

export function AnniversaryWidgetConfigurationScreen({
  widgetInfo,
  renderWidget: commitWidget,
  setResult,
}: WidgetConfigurationScreenProps) {
  const dark = useColorScheme() === 'dark';
  const colors = dark
    ? {
        bg: '#0B0F14',
        card: '#121820',
        text: '#F1EDE6',
        muted: '#8A96A5',
        border: '#2B3542',
        accent: '#C9A227',
      }
    : {
        bg: '#F7F4EE',
        card: '#FFFFFF',
        text: '#121820',
        muted: '#6B7A8C',
        border: '#DED7CA',
        accent: '#9B7C1F',
      };
  const [config, setConfig] = useState<AnniversaryWidgetConfig>(() =>
    createDefaultAnniversaryConfig(widgetInfo.widgetId),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void getAnniversaryWidgetConfig(widgetInfo.widgetId).then((saved) => {
      if (active && saved) setConfig(saved);
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [widgetInfo.widgetId]);

  const props = useMemo(() => buildAnniversaryWidgetProps(config), [config]);
  const layout = useMemo(
    () => getWidgetLayout('Anniversary', widgetInfo),
    [widgetInfo],
  );
  const previewWidth = config.displayMode === 'days' ? 150 : 320;
  const previewHeight = config.displayMode === 'days' ? 150 : 130;
  const previewLayout = useMemo(
    () =>
      getWidgetLayout('Anniversary', {
        width: previewWidth,
        height: previewHeight,
      }),
    [previewHeight, previewWidth],
  );

  const renderPreview = useCallback(
    () => (
      <AnniversaryAndroidWidget
        {...props}
        scheme={dark ? 'dark' : 'light'}
        layout={previewLayout}
      />
    ),
    [dark, previewLayout, props],
  );

  const onDateChange = (_event: DateTimePickerChangeEvent, value?: Date) => {
    if (Platform.OS === 'android') setPickerOpen(false);
    if (!value) return;
    setConfig((current) => ({
      ...current,
      startDateKey: dateKey({
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear(),
      }),
    }));
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    const next = {
      ...config,
      title: config.title.trim() || 'Ngày kỷ niệm',
    };
    try {
      await saveAnniversaryWidgetConfig(next);
      const finalProps = buildAnniversaryWidgetProps(next);
      commitWidget({
        light: (
          <AnniversaryAndroidWidget {...finalProps} scheme="light" layout={layout} />
        ),
        dark: <AnniversaryAndroidWidget {...finalProps} scheme="dark" layout={layout} />,
      });
      setResult('ok');
    } finally {
      setSaving(false);
    }
  };

  if (widgetInfo.widgetName !== 'Anniversary') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <Pressable onPress={() => setResult('cancel')} style={styles.cancelOnly}>
          <Text style={{ color: colors.text }}>Đóng</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Cấu hình Ngày kỷ niệm</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {'Dữ liệu chỉ lưu trên thiết bị và riêng cho widget này.'}
        </Text>

        <View style={styles.previewWrap}>
          <WidgetPreview
            width={previewWidth}
            height={previewHeight}
            renderWidget={renderPreview}
          />
        </View>

        <Text style={[styles.label, { color: colors.muted }]}>TÊN KỶ NIỆM</Text>
        <TextInput
          value={config.title}
          onChangeText={(title) => setConfig((current) => ({ ...current, title }))}
          placeholder="Ví dụ: Ngày quen nhau"
          placeholderTextColor={colors.muted}
          maxLength={40}
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
          ]}
        />

        <Text style={[styles.label, { color: colors.muted }]}>NGÀY BẮT ĐẦU</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={[
            styles.input,
            styles.dateInput,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputText, { color: colors.text }]}>
            {dateFromKey(config.startDateKey).toLocaleDateString('vi-VN')}
          </Text>
        </Pressable>
        {pickerOpen ? (
          <DateTimePicker
            value={dateFromKey(config.startDateKey)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={MIN_DATE}
            maximumDate={new Date()}
            onValueChange={onDateChange}
            onDismiss={() => setPickerOpen(false)}
          />
        ) : null}

        <Text style={[styles.label, { color: colors.muted }]}>KIỂU HIỂN THỊ</Text>
        <View style={styles.modeRow}>
          {([
            ['days', 'Tổng số ngày'],
            ['ymd', 'Năm · tháng · ngày'],
          ] as const).map(([mode, label]) => {
            const active = config.displayMode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() =>
                  setConfig((current) => ({
                    ...current,
                    displayMode: mode,
                  }))
                }
                style={[
                  styles.mode,
                  {
                    backgroundColor: active ? `${colors.accent}22` : colors.card,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text style={[styles.modeText, { color: active ? colors.accent : colors.text }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.sizeHint, { color: colors.muted }]}>
          {config.displayMode === 'days'
            ? 'Kích thước phù hợp: 2x2.'
            : 'Kích thước phù hợp: 4x2 — kéo rộng widget sau khi thêm.'}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => setResult('cancel')}
            style={[styles.button, { borderColor: colors.border }]}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Hủy</Text>
          </Pressable>
          <Pressable
            onPress={() => void save()}
            disabled={saving}
            style={[styles.button, styles.primary, { backgroundColor: colors.accent }]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Thêm widget</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 36 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 18 },
  previewWrap: { alignItems: 'center', marginBottom: 22 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 7 },
  input: {
    minHeight: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 18,
  },
  dateInput: { justifyContent: 'center' },
  inputText: { fontSize: 15, fontWeight: '600' },
  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 26 },
  sizeHint: { fontSize: 12, lineHeight: 18, marginTop: -16, marginBottom: 24 },
  mode: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  modeText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { borderWidth: 0 },
  buttonText: { fontSize: 14, fontWeight: '700' },
  cancelOnly: { padding: 24 },
});
