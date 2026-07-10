import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../src/components/AppText';
import { Screen } from '../src/components/Screen';
import { ToolTile } from '../src/components/ToolTile';
import { useTheme } from '../src/hooks/useTheme';
import {
  LUCKY_ACTIVITY_META,
  LUCKY_ACTIVITY_ORDER,
  type LuckyActivity,
} from '../src/lib/luckyDay';
import { font, space } from '../src/theme/spacing';

const ACTIVITY_ICONS: Record<
  LuckyActivity,
  React.ComponentProps<typeof Ionicons>['name']
> = {
  general: 'sunny-outline',
  wedding: 'heart-outline',
  'dam-ngo': 'gift-outline',
  groundbreaking: 'hammer-outline',
  travel: 'airplane-outline',
  'house-moving': 'home-outline',
  'buy-house': 'business-outline',
  'car-purchase': 'car-outline',
  'exam-interview': 'school-outline',
  paperwork: 'document-text-outline',
  'grand-opening': 'storefront-outline',
  contract: 'create-outline',
  'sang-cat': 'leaf-outline',
  'move-altar': 'swap-horizontal-outline',
  'setup-altar': 'flame-outline',
  'sao-giai-han': 'star-outline',
  'tran-trach': 'shield-outline',
  'cau-an': 'hand-left-outline',
  'new-job': 'briefcase-outline',
};

function openActivity(activity: LuckyActivity) {
  const meta = LUCKY_ACTIVITY_META[activity];
  router.push({
    pathname: '/person-gate',
    params: {
      next: `/lucky/${activity}`,
      ...(meta.couple ? { couple: '1' } : {}),
    },
  });
}

export default function LuckyHubScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Ngày tốt</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Chọn việc · chọn hồ sơ · xem ngày phù hợp
        </AppText>
      </View>

      <View style={styles.toolsGrid}>
        {LUCKY_ACTIVITY_ORDER.map((activity) => {
          const meta = LUCKY_ACTIVITY_META[activity];
          return (
            <ToolTile
              key={activity}
              title={meta.label}
              subtitle={meta.subtitle}
              icon={ACTIVITY_ICONS[activity]}
              onPress={() => openActivity(activity)}
            />
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: space.xs, lineHeight: 20 },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.sm,
    marginBottom: space.sm,
  },
});
