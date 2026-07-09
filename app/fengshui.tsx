import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { useTheme } from '../src/hooks/useTheme';
import { buildFengShuiProfile } from '../src/lib/fengShui';
import { font, radius, space } from '../src/theme/spacing';

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
        <Text style={[styles.title, { color: colors.text }]}>Phong thủy</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Mệnh · màu · số · hướng (theo năm sinh)
        </Text>
      </View>

      <TextInput
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
            <Row label="Năm" value={String(profile.birthYear)} colors={colors} />
            <Row label="Can Chi" value={profile.canChi} colors={colors} />
            <Row label="Con giáp" value={profile.animal} colors={colors} />
            <Row label="Ngũ hành" value={profile.element} colors={colors} last />
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
        <Text style={{ color: colors.textMuted }}>Nhập năm sinh hợp lệ (1800–2199).</Text>
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
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
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
