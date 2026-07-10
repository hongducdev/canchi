import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { AppText, AppTextInput } from '../src/components/AppText';
import { useTheme } from '../src/hooks/useTheme';
import { buildDayInfo } from '../src/lib/dayInfo';
import { dateKey, todaySolar } from '../src/lib/lunar';
import { isWeb } from '../src/lib/platform';
import {
  rankVanKhanForDay,
  searchVanKhan,
  type ProfileSubject,
} from '../src/lib/vanKhan';
import {
  VAN_KHAN_CATEGORY_LABEL,
  type VanKhan,
  type VanKhanCategory,
} from '../src/data/vanKhan';
import { useFamilyStore } from '../src/store/family';
import {
  hasUsableProfile,
  useUserProfileStore,
} from '../src/store/userProfile';
import { font, radius, space } from '../src/theme/spacing';

type CatFilter = VanKhanCategory | 'all';

const CATEGORIES: CatFilter[] = [
  'all',
  'dinh-ky',
  'tai-loc',
  'tet',
  'le-tiet',
  'su-kien',
];

function PrayerRow({
  item,
  onPress,
  colors,
}: {
  item: VanKhan;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={onPress}
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
      <AppText style={[styles.rowTitle, { color: colors.text }]}>
        {item.shortTitle}
      </AppText>
      <AppText style={[styles.rowMeta, { color: colors.gold }]}>
        {item.category.name}
      </AppText>
      <AppText style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={2}>
        {item.occasion}
      </AppText>
    </Pressable>
  );
}

export default function VanKhanScreen() {
  const { colors } = useTheme();
  const profile = useUserProfileStore((s) => s.profile);
  const members = useFamilyStore((s) => s.members);
  const [subject, setSubject] = useState<ProfileSubject>({ kind: 'self' });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CatFilter>('all');

  const todayInfo = useMemo(() => buildDayInfo(todaySolar()), []);
  const todayKey = dateKey(todaySolar());

  const suggested = useMemo(
    () => rankVanKhanForDay(todayInfo, 4),
    [todayInfo]
  );

  const list = useMemo(
    () => searchVanKhan(query, category),
    [query, category]
  );

  const subjectKey =
    subject.kind === 'self' ? 'self' : `family:${subject.memberId}`;

  const openDetail = (id: string) => {
    router.push({
      pathname: '/van-khan/[id]',
      params: { id, subject: subjectKey },
    });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Văn khấn</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Mẫu tham khảo theo dịp · điền từ hồ sơ trên máy
        </AppText>
      </View>

      {!isWeb && !hasUsableProfile(profile) ? (
        <Pressable
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <AppText style={{ color: colors.accentText, fontWeight: '700', fontSize: font.sm }}>
            Thiết lập hồ sơ để điền tên · năm sinh vào văn khấn
          </AppText>
        </Pressable>
      ) : null}

      {!isWeb ? (
        <>
          <AppText style={[styles.label, { color: colors.textMuted }]}>Điền cho</AppText>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setSubject({ kind: 'self' })}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    subject.kind === 'self' ? colors.accentSoft : colors.bgMuted,
                  borderColor:
                    subject.kind === 'self' ? colors.accent : colors.border,
                },
              ]}
            >
              <AppText
                style={{
                  color:
                    subject.kind === 'self' ? colors.accentText : colors.textSecondary,
                  fontSize: font.sm,
                  fontWeight: '600',
                }}
              >
                Tôi{profile?.fullName ? ` · ${profile.fullName}` : ''}
              </AppText>
            </Pressable>
            {members.map((m) => {
              const active =
                subject.kind === 'family' && subject.memberId === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setSubject({ kind: 'family', memberId: m.id })}
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
                    {m.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      <SectionHeader
        title="Phù hợp hôm nay"
        subtitle="Theo lễ / rằm / mùng 1"
      />
      {suggested.length === 0 ? (
        <Card>
          <AppText style={{ color: colors.textMuted, fontSize: font.sm }}>
            Không có mẫu nổi bật cho hôm nay — xem danh sách bên dưới.
          </AppText>
        </Card>
      ) : (
        suggested.map((item) => (
          <PrayerRow
            key={item.id}
            item={item}
            colors={colors}
            onPress={() => openDetail(item.id)}
          />
        ))
      )}

      <Pressable onPress={() => router.push(`/day/${todayKey}`)} style={styles.link}>
        <AppText style={{ color: colors.jade, fontSize: font.sm, fontWeight: '600' }}>
          Xem điểm hợp ngày hôm nay →
        </AppText>
      </Pressable>

      <SectionHeader title="Tất cả mẫu" />
      <AppTextInput
        placeholder="Tìm theo tên, dịp…"
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.borderStrong,
            backgroundColor: colors.bgCard,
          },
        ]}
      />
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => {
          const active = category === c;
          const label = c === 'all' ? 'Tất cả' : VAN_KHAN_CATEGORY_LABEL[c];
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
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
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {list.map((item) => (
        <PrayerRow
          key={item.id}
          item={item}
          colors={colors}
          onPress={() => openDetail(item.id)}
        />
      ))}
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
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: font.md,
    marginBottom: space.md,
  },
  row: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.lg,
    marginBottom: space.sm,
  },
  rowTitle: { fontSize: font.md, fontWeight: '700' },
  rowMeta: { fontSize: font.xs, fontWeight: '600', marginTop: 4 },
  rowSub: { fontSize: font.sm, marginTop: 6, lineHeight: 18 },
  cta: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.lg,
  },
  link: { marginBottom: space.lg, marginTop: space.xs },
});
