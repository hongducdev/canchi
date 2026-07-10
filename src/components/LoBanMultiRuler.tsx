import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import {
  LO_BAN_RULERS,
  type LoBanRuler,
} from '../lib/loBan';
import { radius, space } from '../theme/spacing';
import { AppText } from './AppText';

const DEFAULT_RANGE_CM = 1000;
const PIXELS_PER_CM = 36;
const WINDOW_STEP_CM = 20;
const WINDOW_BUFFER_CM = 40;
const GOOD_RED = '#B4232F';
const BAD_BLACK = '#17191D';
const NEEDLE_GOLD = '#D6A84B';
const BAND_TEXT = '#FFF8ED';

type Props = {
  valueCm: number;
  onChangeCm: (valueCm: number) => void;
  rangeCm?: number;
};

type Segment = {
  key: string;
  left: number;
  width: number;
  name: string;
  good: boolean;
};

function rangeStartFor(valueCm: number, rangeCm: number): number {
  if (valueCm <= rangeCm) return 0;
  return Math.floor(valueCm / rangeCm) * rangeCm;
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function buildLargeSegments(
  ruler: LoBanRuler,
  startCm: number,
  endCm: number,
  rangeStartCm: number
): Segment[] {
  const segmentCm = ruler.cycleCm / ruler.cung.length;
  const first = Math.max(0, Math.floor(startCm / segmentCm) - 1);
  const last = Math.ceil(endCm / segmentCm) + 1;
  const segments: Segment[] = [];

  for (let index = first; index <= last; index++) {
    const cung = ruler.cung[positiveModulo(index, ruler.cung.length)]!;
    const segmentStartCm = index * segmentCm;
    segments.push({
      key: `large-${ruler.id}-${index}`,
      left: (segmentStartCm - rangeStartCm) * PIXELS_PER_CM,
      width: segmentCm * PIXELS_PER_CM,
      name: cung.name,
      good: cung.good,
    });
  }

  return segments;
}

function buildSmallSegments(
  ruler: LoBanRuler,
  startCm: number,
  endCm: number,
  rangeStartCm: number
): Segment[] {
  const flattened = ruler.cung.flatMap((largeCung) =>
    largeCung.smallCung.map((smallCung) => ({
      ...smallCung,
      good: largeCung.good,
    }))
  );
  const segmentCm = ruler.cycleCm / flattened.length;
  const first = Math.max(0, Math.floor(startCm / segmentCm) - 1);
  const last = Math.ceil(endCm / segmentCm) + 1;
  const segments: Segment[] = [];

  for (let index = first; index <= last; index++) {
    const cung = flattened[positiveModulo(index, flattened.length)]!;
    const segmentStartCm = index * segmentCm;
    segments.push({
      key: `small-${ruler.id}-${index}`,
      left: (segmentStartCm - rangeStartCm) * PIXELS_PER_CM,
      width: segmentCm * PIXELS_PER_CM,
      name: cung.name,
      good: cung.good,
    });
  }

  return segments;
}

function RulerBand({
  segments,
  compact,
  borderColor,
}: {
  segments: Segment[];
  compact?: boolean;
  borderColor: string;
}) {
  return (
    <View
      style={[
        styles.band,
        compact ? styles.smallBand : styles.largeBand,
        { borderColor },
      ]}
    >
      {segments.map((segment) => (
        <View
          key={segment.key}
          style={[
            styles.segment,
            {
              left: segment.left,
              width: segment.width,
              backgroundColor: segment.good ? GOOD_RED : BAD_BLACK,
              borderColor,
            },
          ]}
        >
          <AppText
            numberOfLines={1}
            style={[styles.segmentText, compact && styles.smallSegmentText]}
          >
            {segment.name}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function RulerRow({
  ruler,
  startCm,
  endCm,
  rangeStartCm,
  borderColor,
}: {
  ruler: LoBanRuler;
  startCm: number;
  endCm: number;
  rangeStartCm: number;
  borderColor: string;
}) {
  const largeSegments = useMemo(
    () => buildLargeSegments(ruler, startCm, endCm, rangeStartCm),
    [endCm, rangeStartCm, ruler, startCm]
  );
  const smallSegments = useMemo(
    () => buildSmallSegments(ruler, startCm, endCm, rangeStartCm),
    [endCm, rangeStartCm, ruler, startCm]
  );

  return (
    <View style={styles.rulerRow}>
      <RulerBand segments={largeSegments} borderColor={borderColor} />
      <RulerBand segments={smallSegments} compact borderColor={borderColor} />
    </View>
  );
}

export function LoBanMultiRuler({
  valueCm,
  onChangeCm,
  rangeCm = DEFAULT_RANGE_CM,
}: Props) {
  const { colors, isDark } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const lastEmittedRef = useRef(valueCm);
  const programmaticTargetRef = useRef<number | null>(null);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRangeStart = rangeStartFor(valueCm, rangeCm);
  const rangeStartRef = useRef(initialRangeStart);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [rangeStartCm, setRangeStartCm] = useState(initialRangeStart);
  const [windowBucket, setWindowBucket] = useState(() =>
    Math.floor((valueCm - rangeStartFor(valueCm, rangeCm)) / WINDOW_STEP_CM)
  );

  const padding = viewportWidth / 2;
  const visibleCenterCm = rangeStartCm + windowBucket * WINDOW_STEP_CM;
  const renderStartCm = Math.max(rangeStartCm, visibleCenterCm - WINDOW_BUFFER_CM);
  const renderEndCm = Math.min(
    rangeStartCm + rangeCm,
    visibleCenterCm + WINDOW_BUFFER_CM * 2
  );
  const contentWidth = rangeCm * PIXELS_PER_CM + padding * 2;
  const rulerWidth = rangeCm * PIXELS_PER_CM;
  const borderColor = isDark ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.18)';

  const ticks = useMemo(() => {
    const ticksInWindow: { cm: number; major: boolean }[] = [];
    const firstHalfCm = Math.max(0, Math.floor(renderStartCm * 2));
    const lastHalfCm = Math.ceil(renderEndCm * 2);

    for (let halfCm = firstHalfCm; halfCm <= lastHalfCm; halfCm++) {
      const cm = halfCm / 2;
      ticksInWindow.push({ cm, major: Number.isInteger(cm) && cm % 5 === 0 });
    }
    return ticksInWindow;
  }, [renderEndCm, renderStartCm]);

  const clearProgrammaticScroll = useCallback(() => {
    programmaticTargetRef.current = null;
    if (programmaticTimerRef.current) {
      clearTimeout(programmaticTimerRef.current);
      programmaticTimerRef.current = null;
    }
  }, []);

  const markProgrammaticScroll = useCallback(
    (targetX: number) => {
      clearProgrammaticScroll();
      programmaticTargetRef.current = targetX;
      programmaticTimerRef.current = setTimeout(clearProgrammaticScroll, 3000);
    },
    [clearProgrammaticScroll]
  );

  const scrollToValue = useCallback(
    (nextValueCm: number, animated: boolean) => {
      if (viewportWidth <= 0) return;
      const nextRangeStart = rangeStartFor(nextValueCm, rangeCm);
      if (nextRangeStart !== rangeStartCm) {
        rangeStartRef.current = nextRangeStart;
        setRangeStartCm(nextRangeStart);
        setWindowBucket(
          Math.floor((nextValueCm - nextRangeStart) / WINDOW_STEP_CM)
        );
      }
      const targetX =
        Math.max(0, Math.min(rangeCm, nextValueCm - nextRangeStart)) *
        PIXELS_PER_CM;
      markProgrammaticScroll(targetX);
      scrollRef.current?.scrollTo({ x: targetX, animated });
    },
    [markProgrammaticScroll, rangeCm, rangeStartCm, viewportWidth]
  );

  useEffect(() => {
    if (Math.abs(valueCm - lastEmittedRef.current) < 0.005) return;
    lastEmittedRef.current = valueCm;
    scrollToValue(valueCm, true);
  }, [scrollToValue, valueCm]);

  useEffect(
    () => clearProgrammaticScroll,
    [clearProgrammaticScroll]
  );

  const onLayout = (event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
    requestAnimationFrame(() => {
      const targetX =
        Math.max(0, Math.min(rangeCm, valueCm - rangeStartRef.current)) *
        PIXELS_PER_CM;
      markProgrammaticScroll(targetX);
      scrollRef.current?.scrollTo({ x: targetX, animated: false });
    });
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const offsetCm = scrollX / PIXELS_PER_CM;
    const clampedOffsetCm = Math.max(0, Math.min(rangeCm, offsetCm));
    const nextBucket = Math.floor(
      clampedOffsetCm / WINDOW_STEP_CM
    );
    if (nextBucket !== windowBucket) setWindowBucket(nextBucket);
    const programmaticTarget = programmaticTargetRef.current;
    if (programmaticTarget !== null) {
      if (Math.abs(scrollX - programmaticTarget) <= 0.5) {
        clearProgrammaticScroll();
      }
      return;
    }
    const nextCm =
      Math.round((rangeStartRef.current + clampedOffsetCm) * 100) / 100;
    if (Math.abs(nextCm - lastEmittedRef.current) < 0.005) return;
    lastEmittedRef.current = nextCm;
    onChangeCm(nextCm);
  };

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { backgroundColor: colors.bgMuted }]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        nestedScrollEnabled
        decelerationRate="fast"
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          clearProgrammaticScroll();
        }}
        onMomentumScrollEnd={clearProgrammaticScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: contentWidth || undefined }}
      >
        <View style={{ width: padding || 1 }} />
        <View style={[styles.rulerCanvas, { width: rulerWidth }]}>
          <View style={styles.ticks}>
            {ticks.map(({ cm, major }) => (
              <View
                key={cm}
                style={[
                  styles.tickColumn,
                  {
                    left: (cm - rangeStartCm) * PIXELS_PER_CM,
                    width: PIXELS_PER_CM / 2,
                  },
                ]}
              >
                <View
                  style={[
                    styles.tick,
                    {
                      height: major ? 18 : Number.isInteger(cm) ? 12 : 7,
                      backgroundColor: colors.textMuted,
                    },
                  ]}
                />
                {major ? (
                  <AppText style={[styles.tickLabel, { color: colors.textMuted }]}>
                    {cm}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>

          {LO_BAN_RULERS.map((ruler) => (
            <RulerRow
              key={ruler.id}
              ruler={ruler}
              startCm={renderStartCm}
              endCm={renderEndCm}
              rangeStartCm={rangeStartCm}
              borderColor={borderColor}
            />
          ))}
        </View>
        <View style={{ width: padding || 1 }} />
      </ScrollView>

      <View pointerEvents="none" style={styles.fixedOverlay}>
        <View style={[styles.needle, { backgroundColor: NEEDLE_GOLD }]} />
        <View style={[styles.needleHead, { borderTopColor: NEEDLE_GOLD }]} />
        <View style={styles.rowLabels}>
          {LO_BAN_RULERS.map((ruler) => (
            <View
              key={ruler.id}
              style={[styles.rowLabel, { borderColor: colors.borderStrong }]}
            >
              <AppText style={styles.rowLabelText}>{ruler.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.rangeBadge, { backgroundColor: colors.bgCard }]}>
        <AppText style={[styles.rangeText, { color: colors.textMuted }]}>
          {rangeStartCm.toLocaleString('vi-VN')}–
          {(rangeStartCm + rangeCm).toLocaleString('vi-VN')} cm
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 338,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: space.lg,
  },
  rulerCanvas: {
    height: 316,
    position: 'relative',
  },
  ticks: {
    height: 44,
    position: 'relative',
  },
  tickColumn: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  tick: {
    width: 1,
  },
  tickLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  rulerRow: {
    height: 88,
    gap: 3,
    marginBottom: 2,
  },
  band: {
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  largeBand: {
    height: 48,
  },
  smallBand: {
    height: 34,
  },
  segment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 2,
  },
  segmentText: {
    color: BAND_TEXT,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  smallSegmentText: {
    fontSize: 8,
    fontWeight: '700',
  },
  fixedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: 'center',
  },
  needle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
  },
  needleHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  rowLabels: {
    position: 'absolute',
    left: 5,
    top: 48,
    gap: 4,
  },
  rowLabel: {
    width: 58,
    height: 84,
    borderWidth: 1,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(23,25,29,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabelText: {
    color: BAND_TEXT,
    fontSize: 10,
    fontWeight: '800',
  },
  rangeBadge: {
    position: 'absolute',
    right: space.sm,
    bottom: 3,
    borderRadius: radius.full,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  rangeText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
