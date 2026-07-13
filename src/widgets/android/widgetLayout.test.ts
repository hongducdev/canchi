import { describe, expect, it } from 'vitest';
import {
  getCompactMonthGridMetrics,
  getWidgetLayout,
} from './widgetLayout';

describe('getWidgetLayout', () => {
  it('uses a compact grid that keeps lunar dates for 2x2 month widgets', () => {
    expect(
      getWidgetLayout('MonthSmall', { width: 110, height: 110 })
    ).toEqual({
      compact: true,
      showLunarGrid: true,
      roomyTypography: false,
    });
  });

  it('keeps the month card compact when OEM launchers over-report its size', () => {
    expect(
      getWidgetLayout('MonthSmall', { width: 180, height: 180 })
    ).toEqual({
      compact: true,
      showLunarGrid: true,
      roomyTypography: true,
    });
  });

  it('treats missing launcher dimensions as constrained', () => {
    expect(getWidgetLayout('Combo', { width: 0, height: 0 }).compact).toBe(
      true
    );
  });

  it('keeps the 4x2 combo grid compact when its height is over-reported', () => {
    expect(getWidgetLayout('Combo', { width: 420, height: 240 })).toEqual({
      compact: true,
      showLunarGrid: true,
      roomyTypography: true,
    });
  });

  it('uses roomy typography for the calendar and weather widget at 4x2', () => {
    expect(getWidgetLayout('CalendarWeather', { width: 300, height: 140 })).toEqual({
      compact: false,
      showLunarGrid: false,
      roomyTypography: true,
    });
  });
});

describe('getCompactMonthGridMetrics', () => {
  it('preserves the original font size when the launcher reports enough room', () => {
    expect(getCompactMonthGridMetrics(5, true)).toEqual({
      rowHeight: 28,
      dayFontSize: 16,
      dayHeight: 16,
      lunarFontSize: 12,
      lunarHeight: 12,
    });
  });

  it('keeps roomy six-row months within their available height', () => {
    expect(getCompactMonthGridMetrics(6, true)).toEqual({
      rowHeight: 24,
      dayFontSize: 14,
      dayHeight: 14,
      lunarFontSize: 10,
      lunarHeight: 10,
    });
  });

  it('fits six-row months without clipping lunar dates', () => {
    expect(getCompactMonthGridMetrics(6, false)).toEqual({
      rowHeight: 14,
      dayFontSize: 9,
      dayHeight: 8,
      lunarFontSize: 6,
      lunarHeight: 6,
    });
  });
});
