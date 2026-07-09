import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { ZodiacIcon } from '../src/components/ZodiacIcon';
import { useTheme } from '../src/hooks/useTheme';
import { canChiYear } from '../src/lib/canChi';
import { isWeb } from '../src/lib/platform';
import { ZODIAC_LABEL_VI, zodiacKeyFromYear } from '../src/lib/zodiac';
import {
  FAMILY_RELATION_LABEL,
  useFamilyStore,
} from '../src/store/family';
import type { FamilyRelation } from '../src/lib/types';
import { font, radius, space } from '../src/theme/spacing';

const RELATIONS = Object.keys(FAMILY_RELATION_LABEL) as FamilyRelation[];

export default function FamilyScreen() {
  const { colors } = useTheme();
  const members = useFamilyStore((s) => s.members);
  const addMember = useFamilyStore((s) => s.addMember);
  const deleteMember = useFamilyStore((s) => s.deleteMember);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState<FamilyRelation>('parent');
  const [birthYear, setBirthYear] = useState('');
  const [solarDay, setSolarDay] = useState('');
  const [solarMonth, setSolarMonth] = useState('');
  const [note, setNote] = useState('');

  const sorted = useMemo(
    () => [...members].sort((a, b) => b.updatedAt - a.updatedAt),
    [members]
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
    if (!name.trim()) {
      Alert.alert('Thiếu tên', 'Nhập tên thành viên.');
      return;
    }
    const year = birthYear ? Number(birthYear) : undefined;
    const d = solarDay ? Number(solarDay) : undefined;
    const m = solarMonth ? Number(solarMonth) : undefined;
    if (year != null && (year < 1800 || year > 2199)) {
      Alert.alert('Năm không hợp lệ', 'Năm sinh 1800–2199.');
      return;
    }
    addMember({
      name,
      relation,
      birthYear: year,
      solarBirthdayDay: d,
      solarBirthdayMonth: m,
      note,
    });
    setName('');
    setBirthYear('');
    setSolarDay('');
    setSolarMonth('');
    setNote('');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Gia đình</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Thành viên · sinh nhật · chỉ trên máy
        </Text>
      </View>

      <SectionHeader title="Thêm thành viên" />
      <Card>
        <TextInput
          placeholder="Tên"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
          ]}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Quan hệ</Text>
        <View style={styles.chips}>
          {RELATIONS.map((r) => {
            const active = relation === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRelation(r)}
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
                  {FAMILY_RELATION_LABEL[r]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          placeholder="Năm sinh (tuỳ chọn)"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={birthYear}
          onChangeText={setBirthYear}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
          ]}
        />
        <View style={styles.dateRow}>
          <TextInput
            placeholder="Ngày SN"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={solarDay}
            onChangeText={setSolarDay}
            style={[
              styles.input,
              styles.half,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
            ]}
          />
          <TextInput
            placeholder="Tháng SN"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={solarMonth}
            onChangeText={setSolarMonth}
            style={[
              styles.input,
              styles.half,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
            ]}
          />
        </View>
        <TextInput
          placeholder="Ghi chú"
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={setNote}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgMuted },
          ]}
        />

        <Pressable onPress={save} style={[styles.saveBtn, { backgroundColor: colors.accent }]}>
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.saveText}>Lưu thành viên</Text>
        </Pressable>
      </Card>

      <SectionHeader title="Thành viên" subtitle={`${sorted.length} người`} />
      {sorted.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>Chưa có thành viên.</Text>
      ) : (
        sorted.map((m) => (
          <View
            key={m.id}
            style={[
              styles.item,
              { backgroundColor: colors.bgCard, borderColor: colors.borderStrong },
            ]}
          >
            <View style={styles.itemBody}>
              <View style={styles.itemTop}>
                {m.birthYear ? <ZodiacIcon year={m.birthYear} size={32} /> : null}
                <View style={styles.itemText}>
                  <Text style={[styles.itemKind, { color: colors.accentText }]}>
                    {FAMILY_RELATION_LABEL[m.relation]}
                  </Text>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{m.name}</Text>
                </View>
              </View>
              <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                {m.birthYear
                  ? `${m.birthYear} · ${canChiYear(m.birthYear)} (${ZODIAC_LABEL_VI[zodiacKeyFromYear(m.birthYear)]})`
                  : 'Chưa có năm sinh'}
                {m.solarBirthdayDay && m.solarBirthdayMonth
                  ? ` · SN ${m.solarBirthdayDay}/${m.solarBirthdayMonth}`
                  : ''}
                {m.note ? ` · ${m.note}` : ''}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                Alert.alert('Xóa thành viên?', m.name, [
                  { text: 'Hủy', style: 'cancel' },
                  {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => deleteMember(m.id),
                  },
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
  label: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: space.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.md },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: font.xs, fontWeight: '700' },
  dateRow: { flexDirection: 'row', gap: space.sm },
  half: { flex: 1 },
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
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  itemText: { flex: 1 },
  itemKind: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemTitle: { fontSize: font.md, fontWeight: '700' },
  itemMeta: { fontSize: font.xs, marginTop: 4, lineHeight: 16 },
});
