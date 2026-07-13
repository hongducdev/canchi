import { router, type Href } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { PageHeader } from '../../src/components/PageHeader';
import { Screen } from '../../src/components/Screen';
import { ToolTile } from '../../src/components/ToolTile';
import { useTheme } from '../../src/hooks/useTheme';
import { isWeb } from '../../src/lib/platform';
import { useFamilyStore } from '../../src/store/family';
import { usePersonalEventsStore } from '../../src/store/personalEvents';
import { font, space } from '../../src/theme/spacing';

export default function UtilitiesScreen() {
  const { colors } = useTheme();
  const personalEvents = usePersonalEventsStore((s) => s.events);
  const familyMembers = useFamilyStore((s) => s.members);

  return (
    <Screen>
      <PageHeader title="Tiện ích" subtitle="Công cụ lịch âm và phong tục" />

      <AppText style={[styles.group, { color: colors.textMuted }]}>TRA CỨU</AppText>
      <View style={styles.toolsGrid}>
        <ToolTile
          title="Tìm kiếm"
          subtitle="Ngày, lễ hội, tiết khí"
          icon="search-outline"
          onPress={() => router.push('/search')}
        />
        <ToolTile
          title="Thiên văn"
          subtitle="Trăng, nhật thực, mưa sao băng"
          icon="planet-outline"
          onPress={() => router.push('/astronomy')}
        />
      </View>

      <AppText style={[styles.group, { color: colors.textMuted }]}>NGÀY & VIỆC</AppText>
      <View style={styles.toolsGrid}>
        <ToolTile
          title="Ngày tốt"
          subtitle="Chọn việc · xem ngày theo tuổi"
          icon="sparkles-outline"
          onPress={() => router.push('/lucky')}
        />
        <ToolTile
          title="Tính ngày lễ"
          subtitle="Đầy tháng, 49 ngày, giỗ…"
          icon="flower-outline"
          onPress={() =>
            router.push({
              pathname: '/person-gate',
              params: { next: '/memorial' },
            })
          }
        />
        <ToolTile
          title="Văn khấn"
          subtitle="Mẫu khấn theo dịp · điền hồ sơ"
          icon="book-outline"
          onPress={() =>
            router.push({
              pathname: '/person-gate',
              params: { next: '/van-khan' },
            })
          }
        />
      </View>

      <AppText style={[styles.group, { color: colors.textMuted }]}>CÁ NHÂN</AppText>
      <View style={styles.toolsGrid}>
        {!isWeb ? (
          <ToolTile
            title="Sự kiện cá nhân"
            subtitle={`${personalEvents.length} sự kiện trên máy`}
            icon="calendar-outline"
            onPress={() => router.push('/personal')}
          />
        ) : null}
        {!isWeb ? (
          <ToolTile
            title="Gia đình"
            subtitle={`${familyMembers.length} thành viên trên máy`}
            icon="people-outline"
            onPress={() => router.push('/family')}
          />
        ) : null}
        <ToolTile
          title="Phong thủy"
          subtitle="Mệnh, màu, số, hướng theo năm sinh"
          icon="compass-outline"
          onPress={() => router.push('/fengshui')}
        />
        {!isWeb ? (
          <ToolTile
            title="La bàn"
            subtitle="Hướng · độ · 24 sơn"
            icon="navigate-outline"
            onPress={() => router.push('/compass' as Href)}
          />
        ) : null}
        <ToolTile
          title="Thước Lỗ Ban"
          subtitle="52,2 · 42,9 · 38,8 cm"
          icon="resize-outline"
          onPress={() => router.push('/lo-ban' as Href)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 1.0,
    marginBottom: space.sm,
    marginTop: space.md,
    textTransform: 'uppercase',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.sm,
    marginBottom: space.sm,
  },
});
