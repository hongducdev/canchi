import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../hooks/useTheme';
import {
  resolveZodiacKey,
  ZODIAC_ACCENT,
  ZODIAC_LABEL_VI,
  type ZodiacKey,
} from '../lib/zodiac';
import { font, radius, space } from '../theme/spacing';

type Props = {
  year?: number;
  animal?: string;
  chi?: string;
  zodiacKey?: ZodiacKey;
  size?: number;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Compact Unicode marks — readable without native SVG (Expo Go safe). */
const ZODIAC_GLYPH: Record<ZodiacKey, string> = {
  rat: '鼠',
  ox: '牛',
  tiger: '虎',
  cat: '猫',
  dragon: '龙',
  snake: '蛇',
  horse: '马',
  goat: '羊',
  monkey: '猴',
  rooster: '鸡',
  dog: '狗',
  pig: '猪',
};

export function ZodiacIcon({
  year,
  animal,
  chi,
  zodiacKey: zodiacKeyProp,
  size = 36,
  showLabel = false,
  style,
}: Props) {
  const { colors } = useTheme();
  const key = zodiacKeyProp ?? resolveZodiacKey({ year, animal, chi });
  if (!key) return null;

  const accent = ZODIAC_ACCENT[key];
  const glyphSize = Math.round(size * 0.48);

  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.badge,
          {
            width: size,
            height: size,
            borderRadius: radius.sm,
            backgroundColor: `${accent}22`,
            borderColor: `${accent}55`,
          },
        ]}
      >
        <Text style={[styles.glyph, { color: accent, fontSize: glyphSize, lineHeight: glyphSize + 4 }]}>
          {ZODIAC_GLYPH[key]}
        </Text>
      </View>
      {showLabel ? (
        <AppText style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
          {ZODIAC_LABEL_VI[key]}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: space.xs,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  glyph: {
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: font.xs,
    fontWeight: '600',
  },
});
