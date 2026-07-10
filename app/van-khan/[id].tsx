import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { AppText } from '../../src/components/AppText';
import { useTheme } from '../../src/hooks/useTheme';
import { buildDayInfo } from '../../src/lib/dayInfo';
import { todaySolar } from '../../src/lib/lunar';
import {
  fillVanKhan,
  getVanKhanById,
  resolveFillContext,
  withDayLabels,
  type ProfileSubject,
} from '../../src/lib/vanKhan';
import { getRelatedVanKhan } from '../../src/data/vanKhan';
import { useFamilyStore } from '../../src/store/family';
import { useUserProfileStore } from '../../src/store/userProfile';
import { font, radius, space } from '../../src/theme/spacing';

function parseSubject(raw: string | undefined): ProfileSubject {
  if (!raw || raw === 'self') return { kind: 'self' };
  if (raw.startsWith('family:')) {
    return { kind: 'family', memberId: raw.slice('family:'.length) };
  }
  return { kind: 'self' };
}

function BulletList({
  items,
  colors,
}: {
  items: string[];
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.bulletList}>
      {items.map((line, i) => (
        <AppText key={`${i}-${line.slice(0, 12)}`} style={[styles.bullet, { color: colors.text }]}>
          · {line}
        </AppText>
      ))}
    </View>
  );
}

export default function VanKhanDetailScreen() {
  const { id, subject: subjectParam } = useLocalSearchParams<{
    id: string;
    subject?: string;
  }>();
  const { colors } = useTheme();
  const profile = useUserProfileStore((s) => s.profile);
  const members = useFamilyStore((s) => s.members);
  const [filled, setFilled] = useState(true);

  const item = useMemo(() => getVanKhanById(String(id)), [id]);
  const subject = useMemo(() => parseSubject(subjectParam), [subjectParam]);
  const todayInfo = useMemo(() => buildDayInfo(todaySolar()), []);
  const ctx = useMemo(() => {
    const base = resolveFillContext(subject, profile, members);
    return withDayLabels(base, todayInfo);
  }, [subject, profile, members, todayInfo]);

  const related = useMemo(() => (item ? getRelatedVanKhan(item) : []), [item]);

  const hasAnyFill = Boolean(
    ctx.fullName ||
      ctx.birthYear ||
      ctx.hometown ||
      ctx.address ||
      ctx.gender ||
      ctx.birthHourChi ||
      ctx.birthDay ||
      ctx.lunarDateLabel
  );

  if (!item) {
    return (
      <Screen>
        <AppText style={{ color: colors.text }}>Không tìm thấy văn khấn.</AppText>
      </Screen>
    );
  }

  const body = filled && hasAnyFill ? fillVanKhan(item.body, ctx) : item.body;
  const requiredOfferings = item.offerings.filter((o) => o.required);
  const optionalOfferings = item.offerings.filter((o) => !o.required);

  return (
    <Screen>
      <AppText style={[styles.title, { color: colors.text }]}>{item.title}</AppText>
      <AppText style={[styles.meta, { color: colors.gold }]}>
        {item.category.name} · {item.occasion}
      </AppText>
      {item.recommendedTime.length > 0 ? (
        <AppText style={[styles.time, { color: colors.textMuted }]}>
          Giờ nên: {item.recommendedTime.join(' · ')}
        </AppText>
      ) : null}

      {hasAnyFill ? (
        <View style={styles.toggleRow}>
          {(
            [
              { key: true, label: 'Đã điền' },
              { key: false, label: 'Bản gốc' },
            ] as const
          ).map((opt) => {
            const active = filled === opt.key;
            return (
              <Pressable
                key={opt.label}
                onPress={() => setFilled(opt.key)}
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
                  {opt.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <SectionHeader title="Văn khấn" />
      <Card>
        <AppText style={[styles.body, { color: colors.text }]}>{body}</AppText>
      </Card>

      <SectionHeader title="Ý nghĩa" />
      <Card>
        <AppText style={[styles.prose, { color: colors.textSecondary }]}>{item.meaning}</AppText>
      </Card>

      {item.offerings.length > 0 ? (
        <>
          <SectionHeader title="Lễ vật" />
          <Card>
            {requiredOfferings.length > 0 ? (
              <>
                <AppText style={[styles.subLabel, { color: colors.textMuted }]}>Cần có</AppText>
                <BulletList
                  items={requiredOfferings.map((o) => o.name)}
                  colors={colors}
                />
              </>
            ) : null}
            {optionalOfferings.length > 0 ? (
              <>
                <AppText
                  style={[
                    styles.subLabel,
                    { color: colors.textMuted, marginTop: requiredOfferings.length ? space.md : 0 },
                  ]}
                >
                  Tùy tâm
                </AppText>
                <BulletList
                  items={optionalOfferings.map((o) => o.name)}
                  colors={colors}
                />
              </>
            ) : null}
          </Card>
        </>
      ) : null}

      {item.preparation.length > 0 ? (
        <>
          <SectionHeader title="Chuẩn bị" />
          <Card>
            <BulletList items={item.preparation} colors={colors} />
          </Card>
        </>
      ) : null}

      {item.ritualSteps.length > 0 ? (
        <>
          <SectionHeader title="Các bước" />
          <Card>
            <View style={styles.bulletList}>
              {item.ritualSteps.map((step, i) => (
                <AppText
                  key={`${i}-${step.slice(0, 12)}`}
                  style={[styles.bullet, { color: colors.text }]}
                >
                  {i + 1}. {step}
                </AppText>
              ))}
            </View>
          </Card>
        </>
      ) : null}

      {item.notes.length > 0 ? (
        <>
          <SectionHeader title="Lưu ý" />
          <Card>
            <BulletList items={item.notes} colors={colors} />
          </Card>
        </>
      ) : null}

      {related.length > 0 ? (
        <>
          <SectionHeader title="Liên quan" />
          {related.map((r) => (
            <Pressable
              key={r.id}
              onPress={() =>
                router.push({
                  pathname: '/van-khan/[id]',
                  params: { id: r.id, subject: subjectParam ?? 'self' },
                })
              }
              style={({ pressed }) => [
                styles.related,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderStrong,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <AppText style={{ color: colors.text, fontWeight: '700', fontSize: font.md }}>
                {r.shortTitle}
              </AppText>
              <AppText style={{ color: colors.textMuted, fontSize: font.sm, marginTop: 4 }}>
                {r.occasion}
              </AppText>
            </Pressable>
          ))}
        </>
      ) : null}

      <AppText style={[styles.disclaimer, { color: colors.textMuted }]}>
        Văn mẫu tham khảo · chỉnh sửa cho phù hợp gia đình và vùng miền của bạn.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: space.xs,
  },
  meta: { fontSize: font.sm, fontWeight: '600', marginBottom: space.xs },
  time: { fontSize: font.xs, marginBottom: space.lg },
  toggleRow: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.md,
  },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  body: {
    fontSize: font.md,
    lineHeight: 26,
  },
  prose: {
    fontSize: font.sm,
    lineHeight: 22,
  },
  subLabel: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: space.sm,
  },
  bulletList: { gap: space.sm },
  bullet: { fontSize: font.sm, lineHeight: 22 },
  related: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.lg,
    marginBottom: space.sm,
  },
  disclaimer: {
    fontSize: font.xs,
    marginTop: space.lg,
    marginBottom: space.xl,
    lineHeight: 18,
  },
});
