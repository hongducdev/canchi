import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { FestivalRow } from '../../src/components/FestivalRow';
import { PageHeader } from '../../src/components/PageHeader';
import { Screen } from '../../src/components/Screen';
import { upcomingFestivals } from '../../src/data/festivals';
import { todaySolar } from '../../src/lib/lunar';
import type { Festival } from '../../src/lib/types';
import { useTheme } from '../../src/hooks/useTheme';
import { font, radius, space } from '../../src/theme/spacing';
import { AppText } from '../../src/components/AppText';

type Filter = 'all' | Festival['category'];

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'tet', label: 'Tết' },
  { key: 'le', label: 'Lễ hội' },
  { key: 'quoc-gia', label: 'Quốc gia' },
  { key: 'khac', label: 'Quốc tế' },
];

export default function EventsScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const today = todaySolar();
  const { day, month, year } = today;

  const items = useMemo(() => {
    const list = upcomingFestivals({ day, month, year }, 120);
    if (filter === 'all') return list;
    return list.filter((i) => i.festival.category === filter);
  }, [day, month, year, filter]);

  return (
    <Screen>
      <PageHeader title="Lễ hội" subtitle="Sự kiện âm lịch và ngày lễ, dùng được offline" />

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
              <AppText
                style={[
                  styles.pillText,
                  { color: active ? colors.accentText : colors.textSecondary },
                ]}
              >
                {f.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <AppText style={[styles.emptyText, { color: colors.textMuted }]}>
            Không có sự kiện phù hợp.
          </AppText>
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
