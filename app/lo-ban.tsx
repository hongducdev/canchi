import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, AppTextInput } from '../src/components/AppText';
import { Card } from '../src/components/Card';
import { LoBanMultiRuler } from '../src/components/LoBanMultiRuler';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/hooks/useTheme';
import {
  convertLoBanUnit,
  measureAllLoBan,
  suggestGoodSize,
  type LoBanResult,
  type LoBanUnit,
} from '../src/lib/loBan';
import { font, radius, space } from '../src/theme/spacing';

const GOOD_RED = '#B4232F';
const BAD_BLACK = '#17191D';
const LIGHT_TEXT = '#FFF8ED';

function trimDecimal(value: number, decimals: number): string {
  return value
    .toFixed(decimals)
    .replace(/\.?0+$/, '')
    .replace('.', ',');
}

function formatForUnit(sizeCm: number, unit: LoBanUnit): string {
  const converted = convertLoBanUnit(sizeCm, 'cm', unit);
  return trimDecimal(converted, unit === 'mm' ? 1 : 2);
}

function parseMeasurement(text: string, unit: LoBanUnit): number | null {
  const parsed = Number(text.trim().replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return convertLoBanUnit(parsed, unit, 'cm');
}

function ResultCard({
  result,
  unit,
}: {
  result: LoBanResult;
  unit: LoBanUnit;
}) {
  const { colors } = useTheme();
  const suggestion = suggestGoodSize(result.ruler.id, result.sizeCm);
  const good = result.largeCung.good;

  return (
    <Card
      style={[
        styles.resultCard,
        {
          backgroundColor: good ? 'rgba(180,35,47,0.09)' : BAD_BLACK,
          borderColor: good ? GOOD_RED : colors.borderStrong,
        },
      ]}
    >
      <View style={styles.resultHeader}>
        <View style={styles.resultHeading}>
          <AppText style={[styles.rulerName, { color: good ? GOOD_RED : LIGHT_TEXT }]}>
            Thước {result.ruler.label}
          </AppText>
          <AppText
            style={[
              styles.rulerPurpose,
              { color: good ? colors.textMuted : 'rgba(255,248,237,0.72)' },
            ]}
          >
            {result.ruler.subtitle}
          </AppText>
        </View>
        <View style={[styles.statusPill, { backgroundColor: good ? GOOD_RED : '#34373D' }]}>
          <AppText style={styles.statusText}>{good ? 'TỐT' : 'XẤU'}</AppText>
        </View>
      </View>

      <View style={styles.cungRow}>
        <View style={styles.cungBlock}>
          <AppText
            style={[
              styles.cungLabel,
              { color: good ? colors.textMuted : 'rgba(255,248,237,0.64)' },
            ]}
          >
            CUNG LỚN
          </AppText>
          <AppText style={[styles.largeCung, { color: good ? colors.text : LIGHT_TEXT }]}>
            {result.largeCung.name}
          </AppText>
        </View>
        <View style={styles.cungBlock}>
          <AppText
            style={[
              styles.cungLabel,
              { color: good ? colors.textMuted : 'rgba(255,248,237,0.64)' },
            ]}
          >
            CUNG NHỎ
          </AppText>
          <AppText style={[styles.smallCung, { color: good ? GOOD_RED : LIGHT_TEXT }]}>
            {result.smallCung.name}
          </AppText>
        </View>
      </View>

      <AppText style={[styles.meaning, { color: good ? colors.text : LIGHT_TEXT }]}>
        {result.largeCung.meaning} {result.smallCung.meaning}
      </AppText>

      <AppText
        style={[
          styles.meta,
          { color: good ? colors.textMuted : 'rgba(255,248,237,0.64)' },
        ]}
      >
        {formatForUnit(result.sizeCm, unit)} {unit} · vị trí{' '}
        {trimDecimal(result.offsetCm, 2)} cm trong chu kỳ
      </AppText>

      {suggestion !== null ? (
        <AppText
          style={[styles.suggestion, { color: good ? GOOD_RED : '#F3C969' }]}
        >
          Kích thước tốt gần nhất: {formatForUnit(suggestion, unit)} {unit}
        </AppText>
      ) : null}
    </Card>
  );
}

export default function LoBanScreen() {
  const { colors } = useTheme();
  const [unit, setUnit] = useState<LoBanUnit>('cm');
  const [sizeCm, setSizeCm] = useState(90);
  const [sizeText, setSizeText] = useState('90');

  const results = useMemo(() => measureAllLoBan(sizeCm), [sizeCm]);
  const inputValid = parseMeasurement(sizeText, unit) !== null;

  const applyDraggedCm = (cm: number) => {
    const next = Math.max(0.01, Math.round(cm * 100) / 100);
    setSizeCm(next);
    setSizeText(formatForUnit(next, unit));
  };

  const onChangeText = (text: string) => {
    setSizeText(text);
    const parsedCm = parseMeasurement(text, unit);
    if (parsedCm !== null) setSizeCm(parsedCm);
  };

  const changeUnit = (nextUnit: LoBanUnit) => {
    if (nextUnit === unit) return;
    setUnit(nextUnit);
    setSizeText(formatForUnit(sizeCm, nextUnit));
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Thước Lỗ Ban</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Đỏ dùng · đen bỏ · tra đồng thời ba loại thước
        </AppText>
      </View>

      <AppText style={[styles.label, { color: colors.textMuted }]}>Kích thước</AppText>
      <View style={styles.inputRow}>
        <AppTextInput
          placeholder={unit === 'mm' ? 'vd. 900' : 'vd. 90'}
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={sizeText}
          onChangeText={onChangeText}
          onBlur={() => setSizeText(formatForUnit(sizeCm, unit))}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: inputValid ? colors.borderStrong : GOOD_RED,
              backgroundColor: colors.bgCard,
            },
          ]}
        />
        <View
          style={[
            styles.unitControl,
            { backgroundColor: colors.bgMuted, borderColor: colors.border },
          ]}
        >
          {(['mm', 'cm'] as const).map((candidate) => {
            const active = unit === candidate;
            return (
              <Pressable
                key={candidate}
                onPress={() => changeUnit(candidate)}
                style={[
                  styles.unitButton,
                  active && { backgroundColor: GOOD_RED },
                ]}
              >
                <AppText
                  style={[
                    styles.unitText,
                    { color: active ? LIGHT_TEXT : colors.textMuted },
                  ]}
                >
                  {candidate}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {!inputValid ? (
        <AppText style={styles.inputError}>Nhập kích thước lớn hơn 0.</AppText>
      ) : (
        <AppText style={[styles.conversion, { color: colors.textMuted }]}>
          {unit === 'mm'
            ? `${trimDecimal(sizeCm, 2)} cm`
            : `${trimDecimal(sizeCm * 10, 1)} mm`}
        </AppText>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: GOOD_RED }]} />
          <AppText style={[styles.legendText, { color: colors.textMuted }]}>
            Cung tốt
          </AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: BAD_BLACK }]} />
          <AppText style={[styles.legendText, { color: colors.textMuted }]}>
            Cung xấu
          </AppText>
        </View>
        <AppText style={[styles.dragHint, { color: colors.textMuted }]}>
          Kéo thước qua kim vàng
        </AppText>
      </View>

      <LoBanMultiRuler valueCm={sizeCm} onChangeCm={applyDraggedCm} />
      {sizeCm > 1000 ? (
        <AppText style={[styles.rangeNotice, { color: colors.textMuted }]}>
          Thước đang hiển thị dải{' '}
          {(Math.floor(sizeCm / 1000) * 1000).toLocaleString('vi-VN')}–
          {((Math.floor(sizeCm / 1000) + 1) * 1000).toLocaleString('vi-VN')} cm
          chứa kích thước đã nhập.
        </AppText>
      ) : null}

      <AppText style={[styles.label, { color: colors.textMuted }]}>
        Kết quả tra cứu
      </AppText>
      <View style={styles.results}>
        {results.map((result) => (
          <ResultCard key={result.ruler.id} result={result} unit={unit} />
        ))}
      </View>

      <Card style={styles.guideCard}>
        <AppText style={[styles.guideTitle, { color: colors.text }]}>
          Chọn đúng loại thước
        </AppText>
        {[
          ['52,2 cm', 'Đo khoảng thông thủy như cửa, cửa sổ, ô thoáng.'],
          ['42,9 cm', 'Đo phủ bì khối đặc như bếp, bệ, bậc, nội thất.'],
          ['38,8 cm', 'Đo âm phần và đồ thờ như bàn thờ, tủ thờ.'],
        ].map(([label, description]) => (
          <View key={label} style={styles.guideRow}>
            <AppText style={[styles.guideLabel, { color: GOOD_RED }]}>
              {label}
            </AppText>
            <AppText style={[styles.guideText, { color: colors.textMuted }]}>
              {description}
            </AppText>
          </View>
        ))}
      </Card>

      <AppText style={[styles.disclaimer, { color: colors.textMuted }]}>
        Thước Lỗ Ban là tham khảo phong thủy dân gian. Luôn ưu tiên công năng,
        thẩm mỹ, an toàn và tiêu chuẩn kỹ thuật xây dựng.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4, lineHeight: 20 },
  label: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: space.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: font.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unitControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 3,
  },
  unitButton: {
    minWidth: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  unitText: {
    fontSize: font.sm,
    fontWeight: '800',
  },
  conversion: {
    fontSize: font.sm,
    marginTop: space.xs,
    marginBottom: space.lg,
  },
  inputError: {
    color: GOOD_RED,
    fontSize: font.sm,
    marginTop: space.xs,
    marginBottom: space.lg,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: font.xs,
    fontWeight: '600',
  },
  dragHint: {
    flex: 1,
    textAlign: 'right',
    fontSize: font.xs,
  },
  results: {
    gap: space.md,
    marginBottom: space.lg,
  },
  rangeNotice: {
    fontSize: font.sm,
    lineHeight: 19,
    marginTop: -space.sm,
    marginBottom: space.lg,
  },
  resultCard: {
    borderWidth: 1,
    gap: space.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
  },
  resultHeading: {
    flex: 1,
    gap: 3,
  },
  rulerName: {
    fontSize: font.lg,
    fontWeight: '800',
  },
  rulerPurpose: {
    fontSize: font.sm,
    lineHeight: 18,
  },
  statusPill: {
    borderRadius: radius.full,
    paddingHorizontal: space.sm,
    paddingVertical: 5,
  },
  statusText: {
    color: LIGHT_TEXT,
    fontSize: font.xs,
    fontWeight: '900',
  },
  cungRow: {
    flexDirection: 'row',
    gap: space.lg,
  },
  cungBlock: {
    flex: 1,
    gap: 3,
  },
  cungLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  largeCung: {
    fontSize: font.xl,
    fontWeight: '800',
  },
  smallCung: {
    fontSize: font.md,
    fontWeight: '800',
  },
  meaning: {
    fontSize: font.md,
    lineHeight: 22,
  },
  meta: {
    fontSize: font.sm,
    lineHeight: 18,
  },
  suggestion: {
    fontSize: font.sm,
    fontWeight: '800',
  },
  guideCard: {
    marginBottom: space.lg,
    gap: space.md,
  },
  guideTitle: {
    fontSize: font.lg,
    fontWeight: '800',
  },
  guideRow: {
    flexDirection: 'row',
    gap: space.md,
  },
  guideLabel: {
    width: 64,
    fontSize: font.sm,
    fontWeight: '800',
  },
  guideText: {
    flex: 1,
    fontSize: font.sm,
    lineHeight: 19,
  },
  disclaimer: {
    fontSize: font.sm,
    lineHeight: 20,
    marginBottom: space.xl,
  },
});
