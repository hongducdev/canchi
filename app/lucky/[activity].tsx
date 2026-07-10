import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { useTheme } from '../../src/hooks/useTheme';
import { dateKey } from '../../src/lib/lunar';
import {
  findActivityDays,
  isLuckyActivity,
  LUCKY_ACTIVITY_META,
  type LuckyDayResult,
} from '../../src/lib/luckyDay';
import {
  analyzeWeddingAges,
  type PersonMarriageAgeReport,
  type WeddingAgeReport,
} from '../../src/lib/marriageAge';
import {
  buildViewerSummary,
  type ViewerSummary,
} from '../../src/lib/viewerProfile';
import {
  hasSessionPrimary,
  useSessionPersonStore,
} from '../../src/store/sessionPerson';
import { font, radius, space } from '../../src/theme/spacing';

function SectionEyebrow({
  label,
  emphasis,
  colors,
}: {
  label: string;
  emphasis?: 'viewer' | 'luan';
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const color =
    emphasis === 'luan'
      ? colors.accentText
      : emphasis === 'viewer'
        ? colors.jade
        : colors.textMuted;
  return (
    <AppText style={[styles.sectionEyebrow, { color }]}>{label}</AppText>
  );
}

function ViewerCard({
  title,
  summary,
  colors,
}: {
  title: string;
  summary: ViewerSummary;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View
      style={[
        styles.panel,
        styles.viewerPanel,
        {
          backgroundColor: colors.bgElevated,
          borderColor: colors.jade,
        },
      ]}
    >
      <View style={[styles.panelAccent, { backgroundColor: colors.jade }]} />
      <View style={styles.panelBody}>
        <AppText style={[styles.panelKicker, { color: colors.jade }]}>{title}</AppText>
        <AppText style={[styles.panelHero, { color: colors.text }]}>
          {summary.label}
        </AppText>
        <View style={styles.factGrid}>
          <Fact
            label="Ngày sinh dương"
            value={summary.solarBirth}
            colors={colors}
          />
          <Fact
            label="Ngày sinh âm"
            value={summary.lunarBirth}
            colors={colors}
          />
          <Fact
            label="Tuổi Can Chi"
            value={`${summary.canChi} · ${summary.animal}`}
            colors={colors}
          />
          <Fact label="Mệnh" value={summary.menh} colors={colors} />
          <Fact
            label="Tuổi âm"
            value={`${summary.tuoiAm} tuổi`}
            colors={colors}
            wide
          />
        </View>
      </View>
    </View>
  );
}

function Fact({
  label,
  value,
  colors,
  wide,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
  wide?: boolean;
}) {
  return (
    <View style={[styles.fact, wide && styles.factWide]}>
      <AppText style={[styles.factLabel, { color: colors.textMuted }]}>{label}</AppText>
      <AppText style={[styles.factValue, { color: colors.text }]}>{value}</AppText>
    </View>
  );
}

function TabooChip({
  report,
  colors,
}: {
  report: PersonMarriageAgeReport;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const items = [
    { key: 'kim', r: report.kimLau },
    { key: 'hoang', r: report.hoangOc },
    { key: 'tam', r: report.tamTai },
  ] as const;

  return (
    <View
      style={[
        styles.tabooBlock,
        {
          backgroundColor: colors.bg,
          borderColor: report.anyHit ? colors.accent : colors.border,
        },
      ]}
    >
      <View style={styles.tabooHead}>
        <AppText style={[styles.tabooPersonTitle, { color: colors.text }]}>
          {report.role}
        </AppText>
        <AppText style={[styles.tabooPersonMeta, { color: colors.textMuted }]}>
          {report.personLabel} · {report.tuoiAm} tuổi âm
        </AppText>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: report.anyHit ? colors.accentSoft : 'rgba(47,107,90,0.12)',
            },
          ]}
        >
          <AppText
            style={[
              styles.statusPillText,
              { color: report.anyHit ? colors.accentText : colors.jade },
            ]}
          >
            {report.anyHit ? 'Có phạm hạn' : 'Không phạm'}
          </AppText>
        </View>
      </View>
      {items.map(({ key, r }) => (
        <View
          key={key}
          style={[
            styles.tabooRow,
            {
              backgroundColor: r.hit ? colors.accentSoft : colors.bgMuted,
              borderColor: r.hit ? colors.accent : colors.border,
            },
          ]}
        >
          <AppText
            style={[
              styles.tabooTag,
              { color: r.hit ? colors.accentText : colors.jade },
            ]}
          >
            {r.hit ? 'PHẠM' : 'ỔN'} · {r.label}
          </AppText>
          <AppText
            style={[
              styles.tabooDetail,
              { color: r.hit ? colors.text : colors.textSecondary },
            ]}
          >
            {r.detail}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function WeddingAgeCard({
  report,
  colors,
}: {
  report: WeddingAgeReport;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View
      style={[
        styles.panel,
        styles.luanPanel,
        {
          backgroundColor: colors.accentSoft,
          borderColor: colors.accent,
        },
      ]}
    >
      <View style={[styles.panelAccent, { backgroundColor: colors.accent }]} />
      <View style={styles.panelBody}>
        <View style={styles.luanTitleRow}>
          <AppText style={[styles.luanTitle, { color: colors.accentText }]}>
            Luận tuổi kết hôn
          </AppText>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: report.anyHit
                  ? colors.accent
                  : colors.jade,
              },
            ]}
          >
            <AppText style={[styles.statusPillTextOn, { color: '#F7F4EE' }]}>
              {report.anyHit ? 'Cần lưu ý' : 'Thuận'}
            </AppText>
          </View>
        </View>
        <AppText style={[styles.luanSub, { color: colors.accentText }]}>
          {report.yearLabel} · Kim Lâu · Hoàng Ốc · Tam Tai
        </AppText>
        <TabooChip report={report.groom} colors={colors} />
        <View style={{ height: space.sm }} />
        <TabooChip report={report.bride} colors={colors} />
        <AppText style={[styles.tabooFoot, { color: colors.accentText }]}>
          {report.anyHit
            ? 'Có phạm hạn — cân nhắc chọn năm khác hoặc hóa giải theo tục lệ địa phương.'
            : 'Cả hai không phạm Kim Lâu, Hoàng Ốc, Tam Tai trong năm xem.'}
        </AppText>
      </View>
    </View>
  );
}

function DayResultCard({
  result,
  colors,
}: {
  result: LuckyDayResult;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const scoreColor =
    result.verdict === 'good'
      ? colors.jade
      : result.verdict === 'bad'
        ? colors.accent
        : colors.textMuted;
  const showIssues = result.verdict !== 'good' || result.issues.length > 0;

  return (
    <Pressable
      onPress={() => router.push(`/day/${dateKey(result.solar)}`)}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.dayRow,
          {
            backgroundColor: colors.bgMuted,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ])
      }
    >
      <View style={styles.scoreCol}>
        <AppText style={[styles.dayScore, { color: scoreColor }]}>{result.score}</AppText>
        <AppText style={[styles.scoreUnit, { color: colors.textMuted }]}>điểm</AppText>
        <AppText style={[styles.verdict, { color: scoreColor }]}>
          {result.verdict === 'good'
            ? 'Tốt'
            : result.verdict === 'bad'
              ? 'Xấu'
              : 'TB'}
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText style={[styles.dayDate, { color: colors.textSecondary }]}>
          {result.solar.day}/{result.solar.month}/{result.solar.year}
        </AppText>
        <AppText style={[styles.meta, { color: colors.textMuted }]}>
          Âm {result.info.lunar.day}/{result.info.lunar.month}
          {result.info.lunar.leap ? ' (nhuận)' : ''} · {result.info.canChiDay} · Trực{' '}
          {result.info.lore.truc}
        </AppText>
        {result.reasons.length > 0 ? (
          <AppText style={[styles.reasons, { color: colors.textMuted }]} numberOfLines={2}>
            {result.reasons.join(' · ')}
          </AppText>
        ) : null}
        {showIssues && result.issues.length > 0 ? (
          <View style={styles.issuesBox}>
            <AppText style={[styles.issuesTitle, { color: colors.textMuted }]}>
              Phạm / cần tránh
            </AppText>
            {result.issues.map((issue, i) => (
              <AppText
                key={`${i}-${issue.slice(0, 24)}`}
                style={[styles.issueLine, { color: colors.textSecondary }]}
              >
                · {issue}
              </AppText>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function LuckyActivityScreen() {
  const { colors } = useTheme();
  const { activity: raw } = useLocalSearchParams<{ activity: string }>();
  const activity = typeof raw === 'string' ? raw : '';
  const primary = useSessionPersonStore((s) => s.primary);
  const secondary = useSessionPersonStore((s) => s.secondary);
  const horizonDays = useSessionPersonStore((s) => s.horizonDays);

  const valid = isLuckyActivity(activity);
  const meta = valid ? LUCKY_ACTIVITY_META[activity] : null;

  useEffect(() => {
    if (!valid) return;
    if (hasSessionPrimary(primary)) return;
    const couple = meta?.couple ? '&couple=1' : '';
    router.replace(
      `/person-gate?next=${encodeURIComponent(`/lucky/${activity}`)}${couple}`
    );
  }, [valid, primary, activity, meta?.couple]);

  const results = useMemo(() => {
    if (!valid || !primary) return [];
    return findActivityDays(
      activity,
      primary,
      meta?.couple ? secondary : null,
      undefined,
      horizonDays
    );
  }, [valid, activity, primary, secondary, meta?.couple, horizonDays]);

  const primarySummary = useMemo(
    () => (primary ? buildViewerSummary(primary) : null),
    [primary]
  );
  const secondarySummary = useMemo(
    () => (secondary && meta?.couple ? buildViewerSummary(secondary) : null),
    [secondary, meta?.couple]
  );

  const weddingAge = useMemo(() => {
    if (activity !== 'wedding' || !primary || !secondary) return null;
    return analyzeWeddingAges(primary, secondary);
  }, [activity, primary, secondary]);

  if (!valid || !meta) {
    return (
      <Screen>
        <AppText style={{ color: colors.text }}>Việc không hợp lệ.</AppText>
      </Screen>
    );
  }

  if (!hasSessionPrimary(primary) || !primarySummary) {
    return null;
  }

  const goodCount = results.filter((r) => r.verdict === 'good').length;
  const badCount = results.filter((r) => r.verdict === 'bad').length;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>{meta.label}</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          {horizonDays} ngày tới · tham khảo
        </AppText>
      </View>

      <View
        style={[
          styles.focusBand,
          { backgroundColor: colors.bgMuted, borderColor: colors.borderStrong },
        ]}
      >
        <SectionEyebrow label="Người xem" emphasis="viewer" colors={colors} />
        <ViewerCard
          title={meta.couple ? 'Chú rể' : 'Thông tin người xem'}
          summary={primarySummary}
          colors={colors}
        />
        {secondarySummary ? (
          <ViewerCard title="Cô dâu" summary={secondarySummary} colors={colors} />
        ) : null}

        {weddingAge ? (
          <>
            <SectionEyebrow
              label="Luận tuổi kết hôn"
              emphasis="luan"
              colors={colors}
            />
            <WeddingAgeCard report={weddingAge} colors={colors} />
          </>
        ) : null}
      </View>

      <View style={styles.resultsBlock}>
        <SectionHeader
          title="Danh sách ngày"
          subtitle={`${results.length} ngày · ${goodCount} tốt · ${badCount} xấu`}
        />
        {results.map((r) => (
          <DayResultCard key={dateKey(r.solar)} result={r} colors={colors} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.md },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4, lineHeight: 20 },
  focusBand: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.xl,
    gap: space.sm,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: space.xs,
    marginBottom: space.xs,
  },
  panel: {
    borderWidth: 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: space.sm,
  },
  viewerPanel: {},
  luanPanel: {},
  panelAccent: { width: 5 },
  panelBody: { flex: 1, padding: space.lg, gap: space.sm },
  panelKicker: {
    fontSize: font.xs,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  panelHero: {
    fontSize: font.xl,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: space.xs,
  },
  factGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  fact: {
    width: '48%',
    gap: 2,
  },
  factWide: {
    width: '100%',
  },
  factLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  factValue: {
    fontSize: font.md,
    fontWeight: '600',
    lineHeight: 22,
  },
  luanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  luanTitle: {
    fontSize: font.xl,
    fontWeight: '800',
    letterSpacing: -0.4,
    flex: 1,
  },
  luanSub: {
    fontSize: font.sm,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: space.xs,
  },
  statusPill: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusPillTextOn: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  tabooBlock: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  tabooHead: { gap: 4 },
  tabooPersonTitle: { fontSize: font.lg, fontWeight: '800', letterSpacing: -0.3 },
  tabooPersonMeta: { fontSize: font.sm, lineHeight: 18 },
  tabooRow: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: space.md,
    gap: 4,
  },
  tabooTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tabooDetail: { fontSize: font.sm, lineHeight: 20, fontWeight: '500' },
  tabooFoot: {
    fontSize: font.sm,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: space.xs,
  },
  resultsBlock: {
    opacity: 0.92,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: space.sm,
    gap: space.md,
  },
  scoreCol: { alignItems: 'center', minWidth: 44, paddingTop: 2 },
  dayScore: {
    fontSize: font.xxl,
    fontWeight: '300',
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  scoreUnit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  verdict: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.4,
  },
  body: { flex: 1 },
  dayDate: { fontSize: font.lg, fontWeight: '700', letterSpacing: -0.3 },
  meta: { fontSize: font.sm, marginTop: 4, lineHeight: 18 },
  reasons: { fontSize: font.sm, marginTop: 6, lineHeight: 20 },
  issuesBox: { marginTop: space.sm, gap: 4 },
  issuesTitle: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  issueLine: { fontSize: font.sm, lineHeight: 20 },
});
