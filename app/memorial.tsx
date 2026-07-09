import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { useTheme } from '../src/hooks/useTheme';
import {
  BIRTH_MEMORIALS,
  calculateAllMemorials,
  DEATH_MEMORIALS,
  type MemorialKind,
} from '../src/lib/memorial';
import { isValidSolarDate } from '../src/lib/lunar';
import { font, radius, space } from '../src/theme/spacing';
import { AppText, AppTextInput } from '../src/components/AppText';

type Mode = 'birth' | 'death';

export default function MemorialScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('death');
  const [dateText, setDateText] = useState('1/1/2026');

  const results = useMemo(() => {
    const m = dateText.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (!m) return [];
    const solar = {
      day: Number(m[1]),
      month: Number(m[2]),
      year: Number(m[3]),
    };
    if (!isValidSolarDate(solar)) return [];
    const kinds: MemorialKind[] = mode === 'birth' ? BIRTH_MEMORIALS : DEATH_MEMORIALS;
    return calculateAllMemorials(solar, kinds);
  }, [dateText, mode]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Tính ngày lễ</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Đầy tháng · Thôi nôi · 49 ngày · Giỗ…
        </AppText>
      </View>

      <View style={styles.modeRow}>
        {(['death', 'birth'] as Mode[]).map((m) => {
          const active = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[
                styles.modeChip,
                {
                  backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <AppText
                style={[
                  styles.modeText,
                  { color: active ? colors.accentText : colors.textSecondary },
                ]}
              >
                {m === 'death' ? 'Từ ngày mất' : 'Từ ngày sinh'}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <AppTextInput
        placeholder="Ngày gốc dd/mm/yyyy"
        placeholderTextColor={colors.textMuted}
        value={dateText}
        onChangeText={setDateText}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.borderStrong,
            backgroundColor: colors.bgCard,
          },
        ]}
      />

      <SectionHeader title="Kết quả" subtitle={`${results.length} mốc`} />
      {results.map((r) => (
        <Pressable
          key={r.kind}
          onPress={() => router.push(`/day/${r.dateKey}`)}
          style={({ pressed }) =>
            StyleSheet.flatten([
              styles.row,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderStrong,
                opacity: pressed ? 0.92 : 1,
              },
            ])
          }
        >
          <AppText style={[styles.kind, { color: colors.accentText }]}>{r.label}</AppText>
          <AppText style={[styles.date, { color: colors.text }]}>
            {r.solar.day}/{r.solar.month}/{r.solar.year}
          </AppText>
          <AppText style={[styles.meta, { color: colors.textMuted }]}>
            Âm {r.lunar.day}/{r.lunar.month}
            {r.lunar.leap ? ' (nhuận)' : ''} · +{r.offsetDays} ngày
          </AppText>
        </Pressable>
      ))}

      {results.length === 0 ? (
        <AppText style={{ color: colors.textMuted }}>Nhập ngày hợp lệ dạng 15/8/2026.</AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4 },
  modeRow: { flexDirection: 'row', gap: space.sm, marginBottom: space.md },
  modeChip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modeText: { fontSize: font.sm, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    fontSize: font.md,
    marginBottom: space.md,
  },
  row: {
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
  },
  kind: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  date: { fontSize: font.lg, fontWeight: '700' },
  meta: { fontSize: font.xs, marginTop: 4 },
});
