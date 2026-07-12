import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { ZodiacIcon } from '../src/components/ZodiacIcon';
import { useTheme } from '../src/hooks/useTheme';
import { buildFengShuiProfile } from '../src/lib/fengShui';
import { font, radius, space } from '../src/theme/spacing';
import { AppText, AppTextInput } from '../src/components/AppText';

export default function FengShuiScreen() {
  const { colors } = useTheme();
  const [year, setYear] = useState(String(new Date().getFullYear() - 25));
  const profile = useMemo(() => {
    const y = Number(year);
    if (!y || y < 1800 || y > 2199) return null;
    return buildFengShuiProfile(y);
  }, [year]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Phong thủy</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Mệnh · màu · số · hướng (theo năm sinh)
        </AppText>
      </View>

      <AppTextInput
        placeholder="Năm sinh (dương lịch)"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        value={year}
        onChangeText={setYear}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.borderStrong,
            backgroundColor: colors.bgCard,
          },
        ]}
      />

      {profile ? (
        <>
          <SectionHeader title="Bản mệnh" />
          <Card>
            <View style={styles.zodiacBanner}>
              <ZodiacIcon year={profile.birthYear} size={52} />
              <View style={styles.zodiacCopy}>
                <AppText style={[styles.zodiacEyebrow, { color: colors.textMuted }]}>
                  {profile.canChi}
                </AppText>
                <AppText style={[styles.zodiacTitle, { color: colors.text }]}>
                  {profile.canChi.split(' ')[1]}
                </AppText>
                <AppText style={[styles.zodiacSub, { color: colors.textSecondary }]}>
                  Mệnh {profile.menhLabel}
                </AppText>
              </View>
            </View>
            <Row label="Năm" value={String(profile.birthYear)} colors={colors} />
            <Row label="Can Chi" value={profile.canChi} colors={colors} />
            <Row label="Nạp âm" value={profile.napAm} colors={colors} />
            <Row label="Mệnh" value={profile.menhLabel} colors={colors} last />
          </Card>

          <SectionHeader title="May mắn" />
          <Card>
            <Row label="Màu hợp" value={profile.luckyColors.join(' · ')} colors={colors} />
            <Row label="Số hợp" value={profile.luckyNumbers.join(', ')} colors={colors} />
            <Row label="Hướng tốt" value={profile.luckyDirections.join(' · ')} colors={colors} />
            <Row label="Hướng nhà" value={profile.houseOrientation} colors={colors} />
            <Row label="Hướng bàn làm việc" value={profile.officeOrientation} colors={colors} last />
          </Card>
        </>
      ) : (
        <AppText style={{ color: colors.textMuted }}>Nhập năm sinh hợp lệ (1800–2199).</AppText>
      )}
    </Screen>
  );
}

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: { textMuted: string; text: string; border: string };
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <AppText style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</AppText>
      <AppText style={[styles.rowValue, { color: colors.text }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    fontSize: font.md,
    marginBottom: space.md,
  },
  zodiacBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingBottom: space.lg,
    marginBottom: space.sm,
  },
  zodiacCopy: { flex: 1 },
  zodiacEyebrow: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  zodiacTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  zodiacSub: {
    fontSize: font.sm,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: space.md,
    gap: space.md,
  },
  rowLabel: { fontSize: font.sm, maxWidth: '40%' },
  rowValue: { fontSize: font.md, fontWeight: '700', flex: 1, textAlign: 'right' },
});
