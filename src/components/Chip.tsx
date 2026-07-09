import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { AppText } from './AppText';

type Props = {
  label: string;
  tone?: 'default' | 'accent' | 'gold' | 'jade' | 'muted';
};

export function Chip({ label, tone = 'default' }: Props) {
  const { colors } = useTheme();

  const bg =
    tone === 'accent'
      ? colors.accentSoft
      : tone === 'gold'
        ? 'rgba(201, 162, 39, 0.15)'
        : tone === 'jade'
          ? 'rgba(47, 107, 90, 0.15)'
          : tone === 'muted'
            ? colors.bgMuted
            : colors.bgMuted;

  const fg =
    tone === 'accent'
      ? colors.accentText
      : tone === 'gold'
        ? colors.gold
        : tone === 'jade'
          ? colors.jade
          : colors.textSecondary;

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <AppText style={[styles.text, { color: fg }]} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.xs + 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: font.sm,
    fontWeight: '600',
  },
});
