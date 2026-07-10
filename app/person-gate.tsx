import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import React, { createElement, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AppText } from '../src/components/AppText';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/hooks/useTheme';
import { isWeb } from '../src/lib/platform';
import {
  DEFAULT_HORIZON_DAYS,
  HORIZON_DAY_OPTIONS,
  useSessionPersonStore,
  type SessionPerson,
} from '../src/store/sessionPerson';
import {
  GENDER_LABEL,
  hasUsableProfile,
  useUserProfileStore,
  type UserGender,
} from '../src/store/userProfile';
import { font, radius, space } from '../src/theme/spacing';

const GENDERS = Object.keys(GENDER_LABEL) as UserGender[];

const MIN_BIRTH = new Date(1800, 0, 1);
const MAX_BIRTH = new Date();

type Draft = {
  mode: 'profile' | 'temp';
  birthDate: Date | null;
  gender?: UserGender;
};

function emptyDraft(preferProfile: boolean): Draft {
  return {
    mode: preferProfile ? 'profile' : 'temp',
    birthDate: null,
    gender: undefined,
  };
}

function formatBirthDate(d: Date): string {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function profileHasFullBirth(
  profile: ReturnType<typeof useUserProfileStore.getState>['profile']
): boolean {
  return Boolean(
    profile &&
      hasUsableProfile(profile) &&
      profile.birthYear != null &&
      profile.birthMonth != null &&
      profile.birthDay != null
  );
}

function BirthDateField({
  value,
  onChange,
  colors,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const [open, setOpen] = useState(false);
  const shown = value ?? new Date(1990, 0, 1);

  const onValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
    }
    onChange(date);
  };

  const onDismiss = () => {
    setOpen(false);
  };

  if (isWeb) {
    const iso = value
      ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
      : '';
    return (
      <View
        style={[
          styles.dateBtn,
          {
            borderColor: colors.borderStrong,
            backgroundColor: colors.bgCard,
          },
        ]}
      >
        {createElement('input', {
          type: 'date',
          value: iso,
          min: '1800-01-01',
          max: MAX_BIRTH.toISOString().slice(0, 10),
          onChange: (e: { target: { value: string } }) => {
            const raw = e.target.value;
            if (!raw) return;
            const [y, m, d] = raw.split('-').map(Number);
            onChange(new Date(y, m - 1, d));
          },
          style: {
            border: 'none',
            background: 'transparent',
            color: colors.text,
            fontSize: 16,
            width: '100%',
            outline: 'none',
          },
        })}
      </View>
    );
  }

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.dateBtn,
          {
            borderColor: colors.borderStrong,
            backgroundColor: colors.bgCard,
          },
        ]}
      >
        <AppText style={{ color: value ? colors.text : colors.textMuted }}>
          {value ? formatBirthDate(value) : 'Chọn ngày sinh'}
        </AppText>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={shown}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onValueChange={onValueChange}
          onDismiss={onDismiss}
          minimumDate={MIN_BIRTH}
          maximumDate={MAX_BIRTH}
        />
      ) : null}
      {Platform.OS === 'ios' && open ? (
        <Pressable onPress={() => setOpen(false)} style={styles.iosDone}>
          <AppText style={{ color: colors.accentText, fontWeight: '700' }}>Xong</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

function PersonBlock({
  title,
  draft,
  onChange,
  canUseProfile,
  profileLabel,
  colors,
}: {
  title: string;
  draft: Draft;
  onChange: (next: Draft) => void;
  canUseProfile: boolean;
  profileLabel: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Card style={styles.block}>
      <AppText style={[styles.blockTitle, { color: colors.text }]}>{title}</AppText>

      {canUseProfile ? (
        <Pressable
          onPress={() => onChange({ ...draft, mode: 'profile' })}
          style={[
            styles.option,
            {
              borderColor: draft.mode === 'profile' ? colors.accent : colors.border,
              backgroundColor:
                draft.mode === 'profile' ? colors.accentSoft : colors.bgMuted,
            },
          ]}
        >
          <AppText
            style={[
              styles.optionTitle,
              { color: draft.mode === 'profile' ? colors.accentText : colors.text },
            ]}
          >
            Hồ sơ của tôi
          </AppText>
          <AppText style={[styles.optionSub, { color: colors.textMuted }]}>
            {profileLabel}
          </AppText>
        </Pressable>
      ) : null}

      <Pressable
        onPress={() => onChange({ ...draft, mode: 'temp' })}
        style={[
          styles.option,
          {
            borderColor: draft.mode === 'temp' ? colors.accent : colors.border,
            backgroundColor:
              draft.mode === 'temp' ? colors.accentSoft : colors.bgMuted,
          },
        ]}
      >
        <AppText
          style={[
            styles.optionTitle,
            { color: draft.mode === 'temp' ? colors.accentText : colors.text },
          ]}
        >
          Thông tin mới
        </AppText>
        <AppText style={[styles.optionSub, { color: colors.textMuted }]}>
          Chỉ dùng lần này · không lưu
        </AppText>
      </Pressable>

      {draft.mode === 'temp' ? (
        <View style={styles.form}>
          <AppText style={[styles.fieldLabel, { color: colors.textMuted }]}>
            Ngày sinh
          </AppText>
          <BirthDateField
            value={draft.birthDate}
            onChange={(birthDate) => onChange({ ...draft, birthDate })}
            colors={colors}
          />
          <View style={styles.genderRow}>
            {GENDERS.map((g) => {
              const active = draft.gender === g;
              return (
                <Pressable
                  key={g}
                  onPress={() =>
                    onChange({
                      ...draft,
                      gender: active ? undefined : g,
                    })
                  }
                  style={[
                    styles.genderChip,
                    {
                      backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.genderText,
                      { color: active ? colors.accentText : colors.textSecondary },
                    ]}
                  >
                    {GENDER_LABEL[g]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

function draftToPerson(
  draft: Draft,
  profile: ReturnType<typeof useUserProfileStore.getState>['profile']
): SessionPerson | null {
  if (draft.mode === 'profile') {
    if (!profileHasFullBirth(profile) || !profile) return null;
    return {
      fullName: profile.fullName.trim(),
      birthYear: profile.birthYear!,
      birthMonth: profile.birthMonth,
      birthDay: profile.birthDay,
      gender: profile.gender,
      source: 'profile',
    };
  }
  if (!draft.birthDate) return null;
  const year = draft.birthDate.getFullYear();
  const month = draft.birthDate.getMonth() + 1;
  const day = draft.birthDate.getDate();
  if (year < 1800 || year > MAX_BIRTH.getFullYear()) return null;
  return {
    birthYear: year,
    birthMonth: month,
    birthDay: day,
    gender: draft.gender,
    source: 'temp',
  };
}

export default function PersonGateScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ next?: string; couple?: string }>();
  const next = typeof params.next === 'string' ? params.next : '/(tabs)/utilities';
  const couple = params.couple === '1' || params.couple === 'true';
  const profile = useUserProfileStore((s) => s.profile);
  const setSession = useSessionPersonStore((s) => s.setSession);

  const canUseProfile = useMemo(() => profileHasFullBirth(profile), [profile]);

  const profileLabel = useMemo(() => {
    if (!canUseProfile || !profile) return 'Chưa có ngày sinh đầy đủ trong hồ sơ';
    return `${profile.fullName} · ${profile.birthDay}/${profile.birthMonth}/${profile.birthYear}`;
  }, [canUseProfile, profile]);

  const [primary, setPrimary] = useState<Draft>(() => emptyDraft(canUseProfile));
  const [secondary, setSecondary] = useState<Draft>(() => emptyDraft(false));
  const [horizonDays, setHorizonDays] = useState<number>(DEFAULT_HORIZON_DAYS);

  const continueNext = () => {
    const p = draftToPerson(primary, profile);
    if (!p) {
      Alert.alert(
        'Thiếu thông tin',
        canUseProfile && primary.mode === 'profile'
          ? 'Hồ sơ cần có ngày sinh đầy đủ (ngày/tháng/năm).'
          : 'Chọn ngày sinh đầy đủ bằng lịch.'
      );
      return;
    }

    let s: SessionPerson | null = null;
    if (couple) {
      s = draftToPerson(secondary, profile);
      if (!s) {
        Alert.alert(
          'Thiếu thông tin cô dâu',
          'Chọn hồ sơ hoặc chọn ngày sinh đầy đủ cho cả hai người.'
        );
        return;
      }
    }

    setSession(p, s, horizonDays);
    router.replace(next as Href);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Chọn hồ sơ</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          {couple
            ? 'Kết hôn / Dặm ngõ cần ngày sinh chú rể và cô dâu'
            : 'Dùng hồ sơ đã lưu hoặc nhập ngày sinh tạm (không lưu)'}
        </AppText>
      </View>

      <PersonBlock
        title={couple ? 'Chú rể' : 'Người xem ngày'}
        draft={primary}
        onChange={setPrimary}
        canUseProfile={canUseProfile}
        profileLabel={profileLabel}
        colors={colors}
      />

      {couple ? (
        <PersonBlock
          title="Cô dâu"
          draft={secondary}
          onChange={setSecondary}
          canUseProfile={canUseProfile}
          profileLabel={profileLabel}
          colors={colors}
        />
      ) : null}

      <Card style={styles.block}>
        <AppText style={[styles.blockTitle, { color: colors.text }]}>
          Số ngày cần xem
        </AppText>
        <AppText style={[styles.optionSub, { color: colors.textMuted }]}>
          Liệt kê đủ các ngày tới (tốt và xấu)
        </AppText>
        <View style={styles.genderRow}>
          {HORIZON_DAY_OPTIONS.map((n) => {
            const active = horizonDays === n;
            return (
              <Pressable
                key={n}
                onPress={() => setHorizonDays(n)}
                style={[
                  styles.genderChip,
                  {
                    backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.genderText,
                    { color: active ? colors.accentText : colors.textSecondary },
                  ]}
                >
                  {n} ngày
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {!canUseProfile ? (
        <AppText style={[styles.hint, { color: colors.textMuted }]}>
          Chưa có hồ sơ đủ ngày sinh — chọn ngày trên lịch, hoặc bổ sung hồ sơ trong Cài
          đặt.
        </AppText>
      ) : null}

      <Pressable
        onPress={continueNext}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: colors.accent, opacity: pressed ? 0.88 : 1 },
        ]}
      >
        <AppText style={styles.ctaText}>Tiếp tục</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: space.xs, lineHeight: 20 },
  block: { marginBottom: space.md, gap: space.sm },
  blockTitle: {
    fontSize: font.md,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: space.xs,
  },
  option: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    gap: 4,
  },
  optionTitle: { fontSize: font.md, fontWeight: '600' },
  optionSub: { fontSize: font.sm, lineHeight: 18 },
  form: { gap: space.sm, marginTop: space.xs },
  fieldLabel: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  dateBtn: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  iosDone: {
    alignSelf: 'flex-end',
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  genderChip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  genderText: { fontSize: font.xs, fontWeight: '700' },
  hint: { fontSize: font.sm, lineHeight: 20, marginBottom: space.md },
  cta: {
    marginTop: space.sm,
    marginBottom: space.xl,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#F7F4EE',
    fontSize: font.md,
    fontWeight: '700',
  },
});
