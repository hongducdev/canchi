import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { formatHourRange } from '../lib/gioHoangDao';
import type { HourSlot } from '../lib/types';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { AppText } from './AppText';

type Props = {
  hours: HourSlot[];
  tone: 'hoang' | 'hac';
};

export function HourStrip({ hours, tone }: Props) {
  const { colors } = useTheme();
  const accent = tone === 'hoang' ? colors.hoangDao : colors.hacDao;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {hours.map((h) => (
        <View
          key={h.name}
          style={[
            styles.card,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.border,
            },
          ]}
        >
          <AppText style={[styles.name, { color: accent }]}>{h.name}</AppText>
          <AppText style={[styles.range, { color: colors.textSecondary }]}>
            {formatHourRange(h.startHour, h.endHour)}
          </AppText>
          <AppText style={[styles.canChi, { color: colors.textMuted }]}>{h.canChi}</AppText>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: space.sm,
    paddingVertical: 2,
  },
  card: {
    minWidth: 96,
    padding: space.md,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  name: {
    fontSize: font.md,
    fontWeight: '700',
  },
  range: {
    fontSize: font.xs,
    marginTop: 4,
  },
  canChi: {
    fontSize: font.xs,
    marginTop: 6,
  },
});
