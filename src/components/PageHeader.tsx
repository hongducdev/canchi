import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, space } from '../theme/spacing';
import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, subtitle, right }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <AppText style={[styles.title, { color: colors.text }]}>{title}</AppText>
        {subtitle ? (
          <AppText style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
    marginTop: space.sm,
    marginBottom: space.xxl,
  },
  copy: { flex: 1 },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: font.sm,
    lineHeight: 20,
    marginTop: space.xs,
  },
});
