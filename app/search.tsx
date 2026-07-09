import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../src/components/Screen';
import { SectionHeader } from '../src/components/SectionHeader';
import { useTheme } from '../src/hooks/useTheme';
import { dateKey } from '../src/lib/lunar';
import {
  nextFestivalSolar,
  nextTietKhiDate,
  searchCatalog,
  type SearchHit,
} from '../src/lib/search';
import { font, radius, space } from '../src/theme/spacing';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const hits = useMemo(() => searchCatalog(query), [query]);

  const openHit = (hit: SearchHit) => {
    if (hit.kind === 'date') {
      router.push(`/day/${dateKey(hit.solar)}`);
      return;
    }
    if (hit.kind === 'festival') {
      const next = nextFestivalSolar(hit.festival);
      if (next) router.push(`/day/${dateKey(next)}`);
      return;
    }
    const next = nextTietKhiDate(hit.name);
    if (next) router.push(`/day/${dateKey(next)}`);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tìm kiếm</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Ngày · Lễ hội · Tiết khí
        </Text>
      </View>

      <TextInput
        placeholder="VD: Trung Thu, 15/8/2026, Thanh minh…"
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
        autoFocus
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.borderStrong,
            backgroundColor: colors.bgCard,
          },
        ]}
      />

      <SectionHeader title="Kết quả" subtitle={query ? `${hits.length} mục` : 'Nhập từ khóa'} />

      {hits.map((hit) => (
        <Pressable
          key={`${hit.kind}-${hit.label}`}
          onPress={() => openHit(hit)}
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.borderStrong,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.body}>
            <Text style={[styles.kind, { color: colors.accentText }]}>
              {hit.kind === 'date' ? 'Ngày' : hit.kind === 'festival' ? 'Lễ hội' : 'Tiết khí'}
            </Text>
            <Text style={[styles.label, { color: colors.text }]}>{hit.label}</Text>
            <Text style={[styles.detail, { color: colors.textMuted }]}>{hit.detail}</Text>
          </View>
        </Pressable>
      ))}

      {query.length > 0 && hits.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>Không tìm thấy.</Text>
      ) : null}
    </Screen>
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
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
  },
  body: { flex: 1 },
  kind: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  label: { fontSize: font.md, fontWeight: '700' },
  detail: { fontSize: font.xs, marginTop: 4 },
  empty: { fontSize: font.md, marginTop: space.lg },
});
