import { Magnetometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../src/components/AppText';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/hooks/useTheme';
import {
  readingFromMagnetometer,
  type CompassReading,
} from '../src/lib/compass';
import { isWeb } from '../src/lib/platform';
import { font, space } from '../src/theme/spacing';

const EMPTY: CompassReading = {
  heading: 0,
  cardinal: { key: 'N', label: 'Bắc' },
  mountain: { name: 'Tý', centerDeg: 0 },
};

export default function CompassScreen() {
  const { colors } = useTheme();
  const [reading, setReading] = useState<CompassReading>(EMPTY);
  const [available, setAvailable] = useState<boolean | null>(isWeb ? false : null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isWeb) return;

    let sub: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const ok = await Magnetometer.isAvailableAsync();
        if (cancelled) return;
        setAvailable(ok);
        if (!ok) return;
        Magnetometer.setUpdateInterval(100);
        sub = Magnetometer.addListener((data) => {
          setReading(readingFromMagnetometer(data.x, data.y));
        });
      } catch {
        if (!cancelled) {
          setAvailable(false);
          setError('Không đọc được cảm biến từ trường.');
        }
      }
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  if (isWeb || available === false) {
    return (
      <Screen>
        <View style={styles.header}>
          <AppText style={[styles.title, { color: colors.text }]}>La bàn</AppText>
        </View>
        <Card>
          <AppText style={[styles.msg, { color: colors.text }]}>
            La bàn cần cảm biến từ trường trên điện thoại.
          </AppText>
          <AppText style={[styles.msgSub, { color: colors.textMuted }]}>
            {error ??
              'Mở tính năng này trên app Android/iOS (không dùng được trên trình duyệt).'}
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (available === null) {
    return (
      <Screen>
        <AppText style={{ color: colors.textMuted }}>Đang kết nối cảm biến…</AppText>
      </Screen>
    );
  }

  const rotation = -reading.heading;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={[styles.title, { color: colors.text }]}>La bàn</AppText>
        <AppText style={[styles.sub, { color: colors.textMuted }]}>
          8 hướng · 24 sơn · tham khảo
        </AppText>
      </View>

      <View style={styles.dialWrap}>
        <View
          style={[
            styles.dial,
            {
              borderColor: colors.borderStrong,
              backgroundColor: colors.bgCard,
            },
          ]}
        >
          <View
            style={[
              styles.rose,
              { transform: [{ rotate: `${rotation}deg` }] },
            ]}
          >
            <AppText style={[styles.roseN, { color: colors.accent }]}>B</AppText>
            <AppText style={[styles.roseE, { color: colors.textMuted }]}>Đ</AppText>
            <AppText style={[styles.roseS, { color: colors.textMuted }]}>N</AppText>
            <AppText style={[styles.roseW, { color: colors.textMuted }]}>T</AppText>
            <View style={[styles.needle, { backgroundColor: colors.accent }]} />
          </View>
          <View style={[styles.crosshair, { backgroundColor: colors.jade }]} />
        </View>
      </View>

      <Card style={styles.readout}>
        <AppText style={[styles.deg, { color: colors.text }]}>
          {reading.heading.toFixed(0)}°
        </AppText>
        <AppText style={[styles.cardinal, { color: colors.accentText }]}>
          {reading.cardinal.label}
        </AppText>
        <AppText style={[styles.mountain, { color: colors.textSecondary }]}>
          Sơn {reading.mountain.name}
        </AppText>
      </Card>

      <AppText style={[styles.disclaimer, { color: colors.textMuted }]}>
        Giữ máy nằm ngang, tránh nam châm / kim loại. Cần hiệu chỉnh từ trường thiết bị
        nếu lệch.
      </AppText>
    </Screen>
  );
}

const DIAL = 260;

const styles = StyleSheet.create({
  header: { marginTop: space.sm, marginBottom: space.lg },
  title: { fontSize: font.xxl, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: font.sm, marginTop: 4, lineHeight: 20 },
  msg: { fontSize: font.md, fontWeight: '600', lineHeight: 22, marginBottom: space.sm },
  msgSub: { fontSize: font.sm, lineHeight: 20 },
  dialWrap: { alignItems: 'center', marginBottom: space.lg },
  dial: {
    width: DIAL,
    height: DIAL,
    borderRadius: DIAL / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rose: {
    width: DIAL - 24,
    height: DIAL - 24,
    borderRadius: (DIAL - 24) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roseN: {
    position: 'absolute',
    top: 8,
    fontSize: font.lg,
    fontWeight: '800',
  },
  roseE: {
    position: 'absolute',
    right: 12,
    fontSize: font.md,
    fontWeight: '700',
  },
  roseS: {
    position: 'absolute',
    bottom: 8,
    fontSize: font.md,
    fontWeight: '700',
  },
  roseW: {
    position: 'absolute',
    left: 12,
    fontSize: font.md,
    fontWeight: '700',
  },
  needle: {
    width: 4,
    height: DIAL / 2 - 40,
    borderRadius: 2,
    marginBottom: DIAL / 4,
  },
  crosshair: {
    position: 'absolute',
    top: 10,
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  readout: { alignItems: 'center', gap: space.xs, marginBottom: space.md },
  deg: { fontSize: 48, fontWeight: '200', letterSpacing: -2 },
  cardinal: { fontSize: font.xl, fontWeight: '800', letterSpacing: -0.3 },
  mountain: { fontSize: font.md, fontWeight: '600' },
  disclaimer: { fontSize: font.sm, lineHeight: 20, marginBottom: space.xl },
});
