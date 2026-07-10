import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
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
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>Tiện ích</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          Công cụ lịch âm & phong tục
        </AppText>
      </View>

      <View style={styles.toolsGrid}>
        <ToolTile
          title="Tìm kiếm"
          subtitle="Ngày, lễ hội, tiết khí"
          icon="search-outline"
          onPress={() => router.push('/search')}
        />
        <ToolTile
          title="Ngày tốt"
          subtitle="Cưới hỏi, khai trương, xuất hành…"
          icon="sparkles-outline"
          onPress={() => router.push('/lucky')}
        />
        {!isWeb ? (
          <ToolTile
            title="Sự kiện cá nhân"
            subtitle={`${personalEvents.length} sự kiện trên máy`}
            icon="calendar-outline"
            onPress={() => router.push('/personal')}
          />
        ) : null}
        <ToolTile
          title="Phong thủy"
          subtitle="Mệnh, màu, số, hướng theo năm sinh"
          icon="compass-outline"
          onPress={() => router.push('/fengshui')}
        />
        <ToolTile
          title="Tính ngày lễ"
          subtitle="Đầy tháng, 49 ngày, giỗ…"
          icon="flower-outline"
          onPress={() => router.push('/memorial')}
        />
        {!isWeb ? (
          <ToolTile
            title="Gia đình"
            subtitle={`${familyMembers.length} thành viên trên máy`}
            icon="people-outline"
            onPress={() => router.push('/family')}
          />
        ) : null}
        <ToolTile
          title="Thiên văn"
          subtitle="Trăng, nhật thực, mưa sao băng"
          icon="planet-outline"
          onPress={() => router.push('/astronomy')}
        />
        <ToolTile
          title="Văn khấn"
          subtitle="Mẫu khấn theo dịp · điền hồ sơ"
          icon="book-outline"
          onPress={() => router.push('/van-khan')}
        />
      </View>
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
    marginTop: space.xs,
    lineHeight: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.sm,
    marginBottom: space.sm,
  },
});
