import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { HourStrip } from '../../src/components/HourStrip';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { ZodiacIcon } from '../../src/components/ZodiacIcon';
import { buildDayInfo, formatLunarLong, formatSolarLong } from '../../src/lib/dayInfo';
import { dailyActivityScores, overallDayScore } from '../../src/lib/dailyScore';
import { scoreDayForPerson } from '../../src/lib/dayPersonScore';
import { parseDateKey, isValidSolarDate } from '../../src/lib/lunar';
import { isWeb } from '../../src/lib/platform';
import { profileToFillContext } from '../../src/lib/vanKhan';
import { useNotesStore } from '../../src/store/notes';
import { useUserProfileStore } from '../../src/store/userProfile';
import { syncWidgets } from '../../src/widgets/syncWidgets';
import { useTheme } from '../../src/hooks/useTheme';
import { font, radius, space } from '../../src/theme/spacing';
import { AppText, AppTextInput } from '../../src/components/AppText';

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { colors } = useTheme();
  const notes = useNotesStore((s) => s.notes);
  const addNote = useNotesStore((s) => s.addNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const profile = useUserProfileStore((s) => s.profile);

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
  const personScore = useMemo(() => {
    if (!info) return null;
    return scoreDayForPerson(info, profileToFillContext(profile));
  }, [info, profile]);

  if (!info || !solar) {
    return (
      <Screen>
        <AppText style={{ color: colors.text }}>Ngày không hợp lệ.</AppText>
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
    void syncWidgets();
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
          <AppText style={[styles.weekday, { color: colors.textMuted }]}>
            {info.weekdayName}
            {info.isToday ? ' · Hôm nay' : ''}
          </AppText>
          <AppText style={[styles.bigDay, { color: colors.text }]}>{solar.day}</AppText>
          <AppText style={[styles.solarLine, { color: colors.textSecondary }]}>
            {formatSolarLong(solar)}
          </AppText>
          <AppText style={[styles.lunarLine, { color: colors.text }]}>
            {formatLunarLong(info)}
          </AppText>
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
                  <AppText style={[styles.festName, { color: colors.text }]}>{f.name}</AppText>
                  {f.description ? (
                    <AppText style={[styles.festDesc, { color: colors.textSecondary }]}>
                      {f.description}
                    </AppText>
                  ) : null}
                </View>
              ))}
            </Card>
          </>
        ) : null}

        <SectionHeader title="Can Chi" subtitle="Thiên Can · Địa Chi · Ngũ Hành" />
        <Card>
          <View style={styles.zodiacBanner}>
            <ZodiacIcon chi={lore.diaChi} size={52} />
            <View style={styles.zodiacCopy}>
              <AppText style={[styles.zodiacEyebrow, { color: colors.textMuted }]}>
                Địa Chi ngày · {info.canChiDay}
              </AppText>
              <AppText style={[styles.zodiacTitle, { color: colors.text }]}>
                {lore.diaChi}
              </AppText>
              <AppText style={[styles.zodiacSub, { color: colors.textSecondary }]}>
                Năm {info.canChiYear}
              </AppText>
            </View>
          </View>
          <Row label="Thiên Can" value={lore.thienCan} colors={colors} />
          <Row label="Địa Chi ngày" value={lore.diaChi} colors={colors} />
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

        <SectionHeader
          title="Điểm hợp"
          subtitle="Theo hồ sơ của bạn · tham khảo"
        />
        <Card>
          {personScore ? (
            <>
              <View style={styles.personScoreHero}>
                <AppText style={[styles.personScoreNum, { color: colors.jade }]}>
                  {personScore.score}
                </AppText>
                <AppText style={[styles.personScoreUnit, { color: colors.textMuted }]}>
                  / 100
                </AppText>
              </View>
              {personScore.reasons.map((r, i) => (
                <AppText
                  key={`${r}-${i}`}
                  style={[styles.personReason, { color: colors.textSecondary }]}
                >
                  · {r}
                </AppText>
              ))}
              <AppText style={[styles.personDisclaimer, { color: colors.textMuted }]}>
                Ước lượng văn hóa theo can chi và lịch ngày — không thay thế tư vấn chuyên môn.
              </AppText>
            </>
          ) : !isWeb ? (
            <Pressable onPress={() => router.push('/profile')}>
              <AppText style={{ color: colors.accentText, fontWeight: '600' }}>
                Thiết lập hồ sơ (năm sinh) để xem điểm hợp →
              </AppText>
            </Pressable>
          ) : (
            <AppText style={{ color: colors.textMuted, fontSize: font.sm }}>
              Điểm hợp theo hồ sơ chỉ có trên app (cần năm sinh).
            </AppText>
          )}
        </Card>

        <SectionHeader title="Giờ Hoàng Đạo" subtitle="Giờ tốt trong ngày" />
        <HourStrip hours={info.gioHoangDao} tone="hoang" />

        <SectionHeader title="Giờ Hắc Đạo" subtitle="Giờ xấu trong ngày" />
        <HourStrip hours={info.gioHacDao} tone="hac" />

        {!isWeb ? (
          <>
            <SectionHeader title="Ghi chú" subtitle="Lưu trên máy · offline" />
            <Card>
              <AppTextInput
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
              <AppTextInput
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
                <AppText style={styles.saveText}>Lưu ghi chú</AppText>
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
                  <AppText style={[styles.noteTitle, { color: colors.text }]}>{n.title}</AppText>
                  <Pressable
                    onPress={() =>
                      Alert.alert('Xóa ghi chú?', n.title, [
                        { text: 'Hủy', style: 'cancel' },
                        {
                          text: 'Xóa',
                          style: 'destructive',
                          onPress: () => {
                            deleteNote(n.id);
                            void syncWidgets();
                          },
                        },
                      ])
                    }
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
                {n.body ? (
                  <AppText style={[styles.noteBody, { color: colors.textSecondary }]}>{n.body}</AppText>
                ) : null}
              </View>
            ))}
          </>
        ) : null}
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
      <AppText style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</AppText>
      <AppText style={[styles.rowValue, { color: colors.text }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBlock: {
    marginTop: space.sm,
    marginBottom: space.md,
  },
  zodiacBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingBottom: space.lg,
    marginBottom: space.sm,
  },
  zodiacCopy: {
    flex: 1,
  },
  zodiacEyebrow: {
    fontSize: font.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  zodiacTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  zodiacSub: {
    fontSize: font.sm,
    marginTop: 2,
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
  personScoreHero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: space.md,
  },
  personScoreNum: {
    fontSize: 40,
    fontWeight: '200',
    letterSpacing: -1,
  },
  personScoreUnit: {
    fontSize: font.md,
    fontWeight: '600',
    marginLeft: 6,
  },
  personReason: {
    fontSize: font.sm,
    lineHeight: 20,
    marginBottom: 4,
  },
  personDisclaimer: {
    fontSize: font.xs,
    lineHeight: 18,
    marginTop: space.md,
  },
});
