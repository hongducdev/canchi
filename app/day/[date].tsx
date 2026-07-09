import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { HourStrip } from '../../src/components/HourStrip';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { buildDayInfo, formatLunarLong, formatSolarLong } from '../../src/lib/dayInfo';
import { dailyActivityScores, overallDayScore } from '../../src/lib/dailyScore';
import { parseDateKey, isValidSolarDate } from '../../src/lib/lunar';
import { useNotesStore } from '../../src/store/notes';
import { useTheme } from '../../src/hooks/useTheme';
import { font, radius, space } from '../../src/theme/spacing';

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { colors } = useTheme();
  const notes = useNotesStore((s) => s.notes);
  const addNote = useNotesStore((s) => s.addNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const solar = useMemo(() => {
    try {
      return parseDateKey(String(date));
    } catch {
      return null;
    }
  }, [date]);

  const info = useMemo(() => {
    if (!solar || !isValidSolarDate(solar)) return null;
    return buildDayInfo(solar);
  }, [solar]);

  const dayNotes = useMemo(
    () => notes.filter((n) => n.dateKey === date),
    [notes, date]
  );

  const activityScores = useMemo(
    () => (info ? dailyActivityScores(info) : []),
    [info]
  );
  const dayScore = useMemo(() => (info ? overallDayScore(info) : 0), [info]);

  if (!info || !solar) {
    return (
      <Screen>
        <Text style={{ color: colors.text }}>Ngày không hợp lệ.</Text>
      </Screen>
    );
  }

  const { lore, moon } = info;

  const saveNote = () => {
    if (!title.trim() && !body.trim()) {
      Alert.alert('Ghi chú trống', 'Nhập tiêu đề hoặc nội dung.');
      return;
    }
    addNote(String(date), title, body);
    setTitle('');
    setBody('');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${solar.day}/${solar.month}/${solar.year}`,
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
        }}
      />
      <Screen>
        <View style={styles.heroBlock}>
          <Text style={[styles.weekday, { color: colors.textMuted }]}>
            {info.weekdayName}
            {info.isToday ? ' · Hôm nay' : ''}
          </Text>
          <Text style={[styles.bigDay, { color: colors.text }]}>{solar.day}</Text>
          <Text style={[styles.solarLine, { color: colors.textSecondary }]}>
            {formatSolarLong(solar)}
          </Text>
          <Text style={[styles.lunarLine, { color: colors.text }]}>
            {formatLunarLong(info)}
          </Text>
          <View style={styles.chips}>
            <Chip label={`Ngày ${info.canChiDay}`} tone="accent" />
            {lore.nguHanh ? <Chip label={`Hành ${lore.nguHanh}`} tone="jade" /> : null}
            <Chip label={info.tietKhi} tone="gold" />
            <Chip
              label={lore.isAuspiciousDay ? 'Ngày tốt' : lore.isInauspiciousDay ? 'Ngày xấu' : 'Trung bình'}
              tone={lore.isAuspiciousDay ? 'jade' : lore.isInauspiciousDay ? 'accent' : 'muted'}
            />
          </View>
        </View>

        {info.festivals.length > 0 ? (
          <>
            <SectionHeader title="Lễ hội" />
            <Card>
              {info.festivals.map((f, i) => (
                <View
                  key={f.id}
                  style={[
                    styles.festItem,
                    i < info.festivals.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                      marginBottom: space.md,
                      paddingBottom: space.md,
                    },
                  ]}
                >
                  <Text style={[styles.festName, { color: colors.text }]}>{f.name}</Text>
                  {f.description ? (
                    <Text style={[styles.festDesc, { color: colors.textSecondary }]}>
                      {f.description}
                    </Text>
                  ) : null}
                </View>
              ))}
            </Card>
          </>
        ) : null}

        <SectionHeader title="Can Chi" subtitle="Thiên Can · Địa Chi · Ngũ Hành" />
        <Card>
          <Row label="Thiên Can" value={lore.thienCan} colors={colors} />
          <Row label="Địa Chi" value={lore.diaChi} colors={colors} />
          <Row label="Năm con giáp" value={lore.zodiacYear} colors={colors} />
          <Row label="Ngũ Hành" value={lore.nguHanh} colors={colors} />
          <Row label="Năm" value={info.canChiYear} colors={colors} />
          <Row label="Tháng" value={info.canChiMonth} colors={colors} />
          <Row label="Ngày" value={info.canChiDay} colors={colors} />
          <Row label="Giờ hiện tại" value={info.canChiHour} colors={colors} last />
        </Card>

        <SectionHeader title="Trực · Tú · Tiết khí" />
        <Card>
          <Row label="Tiết khí" value={info.tietKhi} colors={colors} />
          <Row label="Trực ngày" value={lore.truc} colors={colors} />
          <Row label="Ý nghĩa Trực" value={lore.trucMeaning} colors={colors} />
          <Row label="Nhị Thập Bát Tú" value={lore.nhiThapBatTu} colors={colors} />
          <Row label="Thập Nhị Kiến Trừ" value={lore.truc} colors={colors} last />
        </Card>

        <SectionHeader title="Mặt trăng" subtitle={moon.cycleLabel} />
        <Card>
          <Row label="Pha hiện tại" value={moon.phaseName} colors={colors} />
          <Row
            label="Độ sáng"
            value={`${Math.round(moon.illumination * 100)}%`}
            colors={colors}
          />
          <Row
            label="Trăng mới"
            value={moon.isNewMoon ? 'Hôm nay' : `Còn ${moon.daysToNewMoon} ngày`}
            colors={colors}
          />
          <Row
            label="Trăng tròn"
            value={moon.isFullMoon ? 'Hôm nay' : `Còn ${moon.daysToFullMoon} ngày`}
            colors={colors}
            last
          />
        </Card>

        <SectionHeader title="Sao tốt · Sao xấu" />
        <Card>
          <Row label="Sao tốt" value={lore.goodStars.join(' · ') || '—'} colors={colors} />
          <Row label="Sao xấu" value={lore.badStars.join(' · ') || '—'} colors={colors} last />
        </Card>

        <SectionHeader title="Hướng · Tuổi xung" />
        <Card>
          <Row label="Hướng tốt" value={lore.luckyDirections.join(' · ')} colors={colors} />
          <Row label="Thần Tài" value={lore.wealthGodDirection} colors={colors} />
          <Row label="Hỷ Thần" value={lore.happinessGodDirection} colors={colors} />
          <Row
            label="Tuổi xung"
            value={lore.conflictingAges.join(' · ')}
            colors={colors}
            last
          />
        </Card>

        <SectionHeader title="Nên làm · Nên tránh" />
        <Card>
          <Row
            label="Nên làm"
            value={lore.activitiesRecommended.join(' · ')}
            colors={colors}
          />
          <Row
            label="Nên tránh"
            value={lore.activitiesToAvoid.join(' · ')}
            colors={colors}
          />
          <Row
            label="Giờ xuất hành"
            value={lore.departureHours.join(' · ') || '—'}
            colors={colors}
            last
          />
        </Card>

        <SectionHeader
          title="Điểm ngày"
          subtitle={`Tổng hợp ${dayScore}/100 · theo việc`}
        />
        <Card>
          {activityScores.slice(0, 6).map((s, i, arr) => (
            <Row
              key={s.activity}
              label={s.label}
              value={`${s.score}`}
              colors={colors}
              last={i === arr.length - 1}
            />
          ))}
        </Card>

        <SectionHeader title="Giờ Hoàng Đạo" subtitle="Giờ tốt trong ngày" />
        <HourStrip hours={info.gioHoangDao} tone="hoang" />

        <SectionHeader title="Giờ Hắc Đạo" subtitle="Giờ xấu trong ngày" />
        <HourStrip hours={info.gioHacDao} tone="hac" />

        <SectionHeader title="Ghi chú" subtitle="Lưu trên máy · offline" />
        <Card>
          <TextInput
            placeholder="Tiêu đề"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.bgMuted,
              },
            ]}
          />
          <TextInput
            placeholder="Nội dung ghi chú..."
            placeholderTextColor={colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            style={[
              styles.input,
              styles.area,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.bgMuted,
              },
            ]}
          />
          <Pressable
            onPress={saveNote}
            style={[styles.saveBtn, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveText}>Lưu ghi chú</Text>
          </Pressable>
        </Card>

        {dayNotes.map((n) => (
          <View
            key={n.id}
            style={[
              styles.noteCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <View style={styles.noteHead}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>{n.title}</Text>
              <Pressable
                onPress={() =>
                  Alert.alert('Xóa ghi chú?', n.title, [
                    { text: 'Hủy', style: 'cancel' },
                    {
                      text: 'Xóa',
                      style: 'destructive',
                      onPress: () => deleteNote(n.id),
                    },
                  ])
                }
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
            {n.body ? (
              <Text style={[styles.noteBody, { color: colors.textSecondary }]}>{n.body}</Text>
            ) : null}
          </View>
        ))}
      </Screen>
    </>
  );
}

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: { textMuted: string; text: string; border: string };
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBlock: {
    marginTop: space.sm,
    marginBottom: space.md,
  },
  weekday: {
    fontSize: font.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  bigDay: {
    fontSize: font.display,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 72,
  },
  solarLine: {
    fontSize: font.md,
  },
  lunarLine: {
    fontSize: font.md,
    fontWeight: '600',
    marginTop: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.lg,
  },
  festItem: {},
  festName: {
    fontSize: font.md,
    fontWeight: '700',
  },
  festDesc: {
    fontSize: font.sm,
    marginTop: 4,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: space.md,
    gap: space.md,
  },
  rowLabel: {
    fontSize: font.sm,
    flexShrink: 0,
    maxWidth: '38%',
  },
  rowValue: {
    fontSize: font.md,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: font.md,
    marginBottom: space.sm,
  },
  area: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: font.md,
  },
  noteCard: {
    marginTop: space.sm,
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  noteHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: font.md,
    fontWeight: '700',
    flex: 1,
    paddingRight: space.sm,
  },
  noteBody: {
    marginTop: space.sm,
    fontSize: font.sm,
    lineHeight: 20,
  },
});
