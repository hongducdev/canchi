import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ListRenderItemInfo,
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
type FestivalOccurrence = ReturnType<typeof upcomingFestivals>[number];

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

  const allItems = useMemo(
    () => upcomingFestivals({ day, month, year }, 120),
    [day, month, year],
  );
  const items = useMemo(
    () =>
      filter === 'all'
        ? allItems
        : allItems.filter((item) => item.festival.category === filter),
    [allItems, filter],
  );

  const renderItem = useCallback(
    ({ item: { festival, solar, lunar } }: ListRenderItemInfo<FestivalOccurrence>) => (
      <FestivalRow festival={festival} solar={solar} lunar={lunar} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    ({ festival, solar }: FestivalOccurrence) =>
      `${festival.id}-${solar.year}-${solar.month}-${solar.day}`,
    [],
  );

  return (
    <Screen scroll={false}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>
            <PageHeader
              title="Lễ hội"
              subtitle="Sự kiện âm lịch và ngày lễ, dùng được offline"
            />
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
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText style={[styles.emptyText, { color: colors.textMuted }]}>
              {'Không có sự kiện phù hợp.'}
            </AppText>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={24}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: space.lg,
    paddingBottom: 100,
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
