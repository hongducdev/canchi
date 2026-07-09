import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FestivalRow } from '../../src/components/FestivalRow';
import { Screen } from '../../src/components/Screen';
import { upcomingFestivals } from '../../src/data/festivals';
import { todaySolar } from '../../src/lib/lunar';
import type { Festival } from '../../src/lib/types';
import { useTheme } from '../../src/hooks/useTheme';
import { font, radius, space } from '../../src/theme/spacing';

type Filter = 'all' | Festival['category'];

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'tet', label: 'Tết' },
  { key: 'le', label: 'Lễ hội' },
  { key: 'quoc-gia', label: 'Quốc gia' },
];

export default function EventsScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const today = todaySolar();

  const items = useMemo(() => {
    const list = upcomingFestivals(today, 40);
    if (filter === 'all') return list;
    return list.filter((i) => i.festival.category === filter);
  }, [today.day, today.month, today.year, filter]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Lễ hội</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Sự kiện Âm lịch & ngày lễ (offline)
        </Text>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.accentSoft : colors.bgMuted,
                  borderColor: active ? colors.accent : colors.border,
                  borderWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? colors.accentText : colors.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Không có sự kiện phù hợp.
          </Text>
        </View>
      ) : (
        items.map(({ festival, solar, lunar }) => (
          <FestivalRow
            key={`${festival.id}-${solar.year}-${solar.month}-${solar.day}`}
            festival={festival}
            solar={solar}
            lunar={lunar}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: space.sm,
    marginBottom: space.lg,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: font.sm,
    marginTop: 4,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginBottom: space.lg,
  },
  pill: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
  },
  pillText: {
    fontSize: font.sm,
    fontWeight: '700',
  },
  empty: {
    paddingVertical: space.huge,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: font.md,
  },
});
