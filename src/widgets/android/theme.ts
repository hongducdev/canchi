import type { ColorProp } from 'react-native-android-widget';

export type WidgetScheme = 'light' | 'dark';

/** Shared chrome — keep all widget shells visually related */
export const WIDGET_RADIUS = 16;
export const WIDGET_PAD = 12;

export type WidgetPalette = {
  bg: ColorProp;
  bgElevated: ColorProp;
  text: ColorProp;
  muted: ColorProp;
  /** Gold — titles, lunar labels, accents */
  accent: ColorProp;
  /** Jade — hoàng đạo / note / header bar */
  jade: ColorProp;
  headerBg: ColorProp;
  headerText: ColorProp;
  weekend: ColorProp;
  festival: ColorProp;
  note: ColorProp;
  todayBg: ColorProp;
  todayText: ColorProp;
  border: ColorProp;
  divider: ColorProp;
  ctaBg: ColorProp;
  ctaBorder: ColorProp;
  ctaText: ColorProp;
};

export function widgetPalette(scheme: WidgetScheme): WidgetPalette {
  if (scheme === 'light') {
    return {
      bg: '#F7F4EE',
      bgElevated: '#FFFFFF',
      text: '#121820',
      muted: '#6B7A8C',
      accent: '#A88B2E',
      jade: '#2F6B5A',
      headerBg: '#2F6B5A',
      headerText: '#FFFFFF',
      weekend: '#B91C1C',
      festival: '#A88B2E',
      note: '#2F6B5A',
      todayBg: '#C23B22',
      todayText: '#FFFFFF',
      border: '#E5DFD4',
      divider: '#D0C8BA',
      ctaBg: '#FFFFFF',
      ctaBorder: '#A88B2E',
      ctaText: '#3A4A5C',
    };
  }
  return {
    bg: '#0B0F14',
    bgElevated: '#121820',
    text: '#F1EDE6',
    muted: '#7A8899',
    accent: '#C9A227',
    jade: '#3D8B74',
    headerBg: '#2F6B5A',
    headerText: '#FFFFFF',
    weekend: '#E85A42',
    festival: '#C9A227',
    note: '#3D8B74',
    todayBg: '#E85A42',
    todayText: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.12)',
    divider: 'rgba(255, 255, 255, 0.14)',
    ctaBg: '#1A2330',
    ctaBorder: '#C9A227',
    ctaText: '#A8B4C4',
  };
}
