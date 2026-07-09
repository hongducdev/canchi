import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { useTheme } from '../src/hooks/useTheme';
import { isWeb } from '../src/lib/platform';
import {
  PERSONAL_KIND_LABEL,
  usePersonalEventsStore,
} from '../src/store/personalEvents';
import type { PersonalEventKind } from '../src/lib/types';
import { font, radius, space } from '../src/theme/spacing';

const KINDS: PersonalEventKind[] = [
  'lunar-birthday',
  'solar-birthday',
  'wedding',
  'death-anniversary',
  'reminder',
  'custom',
];

export default function PersonalEventsScreen() {
  const { colors } = useTheme();
  const events = usePersonalEventsStore((s) => s.events);
  const addEvent = usePersonalEventsStore((s) => s.addEvent);
  const deleteEvent = usePersonalEventsStore((s) => s.deleteEvent);

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [kind, setKind] = useState<PersonalEventKind>('solar-birthday');
  const [calendar, setCalendar] = useState<'solar' | 'lunar'>('solar');
  const [recurring, setRecurring] = useState(true);
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');

  const sorted = useMemo(
    () => [...events].sort((a, b) => b.updatedAt - a.updatedAt),
    [events]
  );

  useEffect(() => {
    if (isWeb) {
      router.replace('/(tabs)/settings');
    }
  }, []);

  if (isWeb) {
    return null;
  }

  const save = () => {
    const d = Number(day);
    const m = Number(month);
    if (!title.trim()) {
      Alert.alert('Thiếu tiêu đề', 'Nhập tên sự kiện.');
      return;
    }
    if (!d || !m || d < 1 || d > 31 || m < 1 || m > 12) {
      Alert.alert('Ngày không hợp lệ', 'Kiểm tra ngày và tháng.');
      return;
    }
    if (calendar === 'solar') {
      addEvent({
        title,
        note,
        kind,
        calendar: 'solar',
        recurring,
        solarDay: d,
        solarMonth: m,
      });
    } else {
      addEvent({
        title,
        note,
        kind: kind === 'solar-birthday' ? 'lunar-birthday' : kind,
        calendar: 'lunar',
        recurring,
        lunarDay: d,
        lunarMonth: m,
        lunarLeap: false,
      });
    }
    setTitle('');
    setNote('');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Sự kiện cá nhân</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Sinh nhật · Giỗ · Nhắc việc · Offline
        </Text>
      </View>

      <SectionHeader title="Thêm sự kiện" />
      <Card>
        <TextInput
          placeholder="Tiêu đề"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
          ]}
        />
        <TextInput
          placeholder="Ghi chú (tuỳ chọn)"
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={setNote}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
          ]}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Loại</Text>
        <View style={styles.chips}>
          {KINDS.map((k) => {
            const active = kind === k;
            return (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.accentText : colors.textSecondary },
                  ]}
                >
                  {PERSONAL_KIND_LABEL[k]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.rowBetween}>
          <Text style={[styles.labelInline, { color: colors.textMuted }]}>Lịch Âm</Text>
          <Switch
            value={calendar === 'lunar'}
            onValueChange={(v) => setCalendar(v ? 'lunar' : 'solar')}
            trackColor={{ false: colors.bgMuted, true: colors.accent }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.labelInline, { color: colors.textMuted }]}>Lặp hàng năm</Text>
          <Switch
            value={recurring}
            onValueChange={setRecurring}
            trackColor={{ false: colors.bgMuted, true: colors.accent }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.dateRow}>
          <TextInput
            placeholder="Ngày"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={day}
            onChangeText={setDay}
            style={[
              styles.input,
              styles.dateInput,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
            ]}
          />
          <TextInput
            placeholder="Tháng"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={month}
            onChangeText={setMonth}
            style={[
              styles.input,
              styles.dateInput,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
            ]}
          />
        </View>

        <Pressable onPress={save} style={[styles.saveBtn, { backgroundColor: colors.accent }]}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.saveText}>Lưu sự kiện</Text>
        </Pressable>
      </Card>

      <SectionHeader title="Đã lưu" subtitle={`${sorted.length} sự kiện`} />
      {sorted.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          Chưa có sự kiện cá nhân.
        </Text>
      ) : (
        sorted.map((e) => (
          <View
            key={e.id}
            style={[
              styles.item,
              { backgroundColor: colors.bgCard, borderColor: colors.borderStrong },
            ]}
          >
            <View style={styles.itemBody}>
              <Text style={[styles.itemKind, { color: colors.accentText }]}>
                {PERSONAL_KIND_LABEL[e.kind]}
                {e.recurring ? ' · Lặp năm' : ''}
              </Text>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{e.title}</Text>
              <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                {e.calendar === 'lunar'
                  ? `Âm ${e.lunarDay}/${e.lunarMonth}`
                  : `Dương ${e.solarDay}/${e.solarMonth}`}
                {e.note ? ` · ${e.note}` : ''}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                Alert.alert('Xóa sự kiện?', e.title, [
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Xóa', style: 'destructive', onPress: () => deleteEvent(e.id) },
                ])
              }
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: font.md,
    marginBottom: space.sm,
  },
  label: { fontSize: font.xs, fontWeight: '700', letterSpacing: 0.6, marginBottom: space.sm },
  labelInline: { fontSize: font.sm, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.md },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: font.xs, fontWeight: '700' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  dateRow: { flexDirection: 'row', gap: space.sm },
  dateInput: { flex: 1 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: font.md },
  empty: { fontSize: font.md, marginBottom: space.xl },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
    gap: space.md,
  },
  itemBody: { flex: 1 },
  itemKind: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemTitle: { fontSize: font.md, fontWeight: '700' },
  itemMeta: { fontSize: font.xs, marginTop: 4 },
});
