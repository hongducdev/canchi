import type { ColorProp } from 'react-native-android-widget';

export type WidgetScheme = 'light' | 'dark';

export type WidgetPalette = {
  bg: ColorProp;
  text: ColorProp;
  muted: ColorProp;
  accent: ColorProp;
  weekend: ColorProp;
  todayBg: ColorProp;
  todayText: ColorProp;
  border: ColorProp;
};

export function widgetPalette(scheme: WidgetScheme): WidgetPalette {
  if (scheme === 'light') {
    return {
      bg: '#F7F4EE',
      text: '#121820',
      muted: '#6B7A8C',
      accent: '#A88B2E',
      weekend: '#B91C1C',
      todayBg: '#C23B22',
      todayText: '#FFFFFF',
      border: '#E5DFD4',
    };
  }
  return {
    bg: '#0B0F14',
    text: '#F1EDE6',
    muted: '#7A8899',
    accent: '#C9A227',
    weekend: '#E85A42',
    todayBg: '#E85A42',
    todayText: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.12)',
  };
}
