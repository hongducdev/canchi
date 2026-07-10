import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { AppText, AppTextInput } from '../src/components/AppText';
import { useTheme } from '../src/hooks/useTheme';
import { CHI } from '../src/lib/canChi';
import { isWeb } from '../src/lib/platform';
import {
  GENDER_LABEL,
  useUserProfileStore,
  type UserGender,
} from '../src/store/userProfile';
import { font, radius, space } from '../src/theme/spacing';

const GENDERS = Object.keys(GENDER_LABEL) as UserGender[];

export default function ProfileScreen() {
  const { colors } = useTheme();
  const profile = useUserProfileStore((s) => s.profile);
  const saveProfile = useUserProfileStore((s) => s.saveProfile);
  const clearProfile = useUserProfileStore((s) => s.clearProfile);

  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [gender, setGender] = useState<UserGender | undefined>(profile?.gender);
  const [birthYear, setBirthYear] = useState(
    profile?.birthYear != null ? String(profile.birthYear) : ''
  );
  const [birthMonth, setBirthMonth] = useState(
    profile?.birthMonth != null ? String(profile.birthMonth) : ''
  );
  const [birthDay, setBirthDay] = useState(
    profile?.birthDay != null ? String(profile.birthDay) : ''
  );
  const [lunarDay, setLunarDay] = useState(
    profile?.lunarBirthDay != null ? String(profile.lunarBirthDay) : ''
  );
  const [lunarMonth, setLunarMonth] = useState(
    profile?.lunarBirthMonth != null ? String(profile.lunarBirthMonth) : ''
  );
  const [birthHourChi, setBirthHourChi] = useState(profile?.birthHourChi);
  const [hometown, setHometown] = useState(profile?.hometown ?? '');

  useEffect(() => {
    if (isWeb) router.replace('/(tabs)/settings');
  }, []);

  if (isWeb) return null;

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      borderColor: colors.borderStrong,
      backgroundColor: colors.bgCard,
    },
  ];

  const save = () => {
    if (!fullName.trim()) {
      Alert.alert('Thiếu tên', 'Nhập họ tên.');
      return;
    }
    const year = birthYear ? Number(birthYear) : undefined;
    const month = birthMonth ? Number(birthMonth) : undefined;
    const day = birthDay ? Number(birthDay) : undefined;
    if (year != null && (year < 1800 || year > 2199)) {
      Alert.alert('Năm không hợp lệ', 'Năm sinh 1800–2199.');
      return;
    }
    if (month != null && (month < 1 || month > 12)) {
      Alert.alert('Tháng không hợp lệ', 'Tháng 1–12.');
      return;
    }
    if (day != null && (day < 1 || day > 31)) {
      Alert.alert('Ngày không hợp lệ', 'Ngày 1–31.');
      return;
    }
    saveProfile({
      fullName,
      gender,
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      lunarBirthDay: lunarDay ? Number(lunarDay) : undefined,
      lunarBirthMonth: lunarMonth ? Number(lunarMonth) : undefined,
      birthHourChi,
      hometown,
    });
    Alert.alert('Đã lưu', 'Hồ sơ đã lưu trên máy.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const onClear = () => {
    Alert.alert('Xóa hồ sơ', 'Xóa toàn bộ thông tin hồ sơ trên máy?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          clearProfile();
          setFullName('');
          setGender(undefined);
          setBirthYear('');
          setBirthMonth('');
          setBirthDay('');
          setLunarDay('');
          setLunarMonth('');
          setBirthHourChi(undefined);
          setHometown('');
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Hồ sơ của tôi</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Dùng để điền văn khấn và tính điểm hợp ngày · chỉ lưu trên máy
        </AppText>
      </View>

      <SectionHeader title="Thông tin cơ bản" />
      <AppTextInput
        placeholder="Họ và tên"
        placeholderTextColor={colors.textMuted}
        value={fullName}
        onChangeText={setFullName}
        style={inputStyle}
      />

      <AppText style={[styles.label, { color: colors.textMuted }]}>Giới tính</AppText>
      <View style={styles.chipRow}>
        {GENDERS.map((g) => {
          const active = gender === g;
          return (
            <Pressable
              key={g}
              onPress={() => setGender(g)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <AppText
                style={{
                  color: active ? colors.accentText : colors.textSecondary,
                  fontSize: font.sm,
                  fontWeight: '600',
                }}
              >
                {GENDER_LABEL[g]}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Sinh dương lịch" subtitle="Năm sinh cần có để tính điểm hợp" />
      <View style={styles.row3}>
        <AppTextInput
          placeholder="Ngày"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={birthDay}
          onChangeText={setBirthDay}
          style={[inputStyle, styles.flex1]}
        />
        <AppTextInput
          placeholder="Tháng"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={birthMonth}
          onChangeText={setBirthMonth}
          style={[inputStyle, styles.flex1]}
        />
        <AppTextInput
          placeholder="Năm"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={birthYear}
          onChangeText={setBirthYear}
          style={[inputStyle, styles.flex1]}
        />
      </View>

      <SectionHeader title="Sinh âm lịch" subtitle="Tùy chọn" />
      <View style={styles.row3}>
        <AppTextInput
          placeholder="Ngày ÂL"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={lunarDay}
          onChangeText={setLunarDay}
          style={[inputStyle, styles.flex1]}
        />
        <AppTextInput
          placeholder="Tháng ÂL"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={lunarMonth}
          onChangeText={setLunarMonth}
          style={[inputStyle, styles.flex1]}
        />
      </View>

      <SectionHeader title="Giờ sinh" subtitle="Địa chi · tùy chọn" />
      <View style={styles.chipRow}>
        {CHI.map((chi) => {
          const active = birthHourChi === chi;
          return (
            <Pressable
              key={chi}
              onPress={() => setBirthHourChi(active ? undefined : chi)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <AppText
                style={{
                  color: active ? colors.accentText : colors.textSecondary,
                  fontSize: font.sm,
                  fontWeight: '600',
                }}
              >
                {chi}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Quê quán" />
      <AppTextInput
        placeholder="Tỉnh / thành · xã…"
        placeholderTextColor={colors.textMuted}
        value={hometown}
        onChangeText={setHometown}
        style={inputStyle}
      />

      <Pressable
        onPress={save}
        style={({ pressed }) => [
          styles.primaryBtn,
          { backgroundColor: colors.accent, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <AppText style={[styles.primaryBtnText, { color: colors.todayText }]}>
          Lưu hồ sơ
        </AppText>
      </Pressable>

      {profile ? (
        <Pressable onPress={onClear} style={styles.clearBtn}>
          <AppText style={{ color: colors.accent, fontSize: font.sm, fontWeight: '600' }}>
            Xóa hồ sơ
          </AppText>
        </Pressable>
      ) : null}

      <Card style={styles.hint}>
        <AppText style={{ color: colors.textMuted, fontSize: font.sm, lineHeight: 20 }}>
          Thông tin chỉ lưu trên thiết bị, dùng để điền mẫu văn khấn và ước lượng điểm hợp
          ngày (tham khảo văn hóa, không thay thế chuyên gia).
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: space.xs, lineHeight: 20 },
  label: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: space.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: font.md,
    marginBottom: space.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginBottom: space.lg,
  },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  row3: { flexDirection: 'row', gap: space.sm },
  flex1: { flex: 1 },
  primaryBtn: {
    marginTop: space.md,
    paddingVertical: space.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: font.md, fontWeight: '700' },
  clearBtn: { alignItems: 'center', marginTop: space.lg, padding: space.sm },
  hint: { marginTop: space.xl },
});
