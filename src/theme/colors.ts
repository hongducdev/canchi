/**
 * Lịch Âm design tokens.
 * Direction: deep ink + vermillion accent (cultural, non-generic).
 */

export type ColorScheme = 'light' | 'dark';

const palette = {
  ink950: '#0B0F14',
  ink900: '#121820',
  ink800: '#1A2330',
  ink700: '#243041',
  ink600: '#3A4A5C',
  mist100: '#F1EDE6',
  mist50: '#F7F4EE',
  mist200: '#E5DFD4',
  mist300: '#D0C8BA',
  vermillion: '#C23B22',
  vermillionDeep: '#9E2F1C',
  vermillionSoft: '#E85A42',
  gold: '#C9A227',
  goldMuted: '#A88B2E',
  jade: '#2F6B5A',
  jadeSoft: '#3D8B74',
  slate: '#6B7A8C',
  danger: '#B91C1C',
  success: '#1B7A5A',
} as const;

export type ThemeColors = {
  bg: string;
  bgElevated: string;
  bgCard: string;
  bgMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  gold: string;
  jade: string;
  today: string;
  todayText: string;
  festival: string;
  tabBar: string;
  tabInactive: string;
  tabActive: string;
  shadow: string;
  hoangDao: string;
  hacDao: string;
  heroGradient: [string, string];
  statusBar: 'light' | 'dark';
};

export const lightColors: ThemeColors = {
  bg: palette.mist50,
  bgElevated: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgMuted: palette.mist100,
  border: palette.mist200,
  borderStrong: palette.mist300,
  text: palette.ink900,
  textSecondary: palette.ink600,
  textMuted: palette.slate,
  textInverse: palette.mist50,
  accent: palette.vermillion,
  accentSoft: 'rgba(194, 59, 34, 0.10)',
  accentText: palette.vermillionDeep,
  gold: palette.goldMuted,
  jade: palette.jade,
  today: palette.vermillion,
  todayText: '#FFFFFF',
  festival: palette.goldMuted,
  tabBar: 'rgba(247, 244, 238, 0.94)',
  tabInactive: palette.slate,
  tabActive: palette.vermillionDeep,
  shadow: 'rgba(18, 24, 32, 0.04)',
  hoangDao: palette.jade,
  hacDao: palette.slate,
  heroGradient: ['#FFFFFF', palette.mist100],
  statusBar: 'dark',
};

export const darkColors: ThemeColors = {
  bg: palette.ink950,
  bgElevated: palette.ink900,
  bgCard: palette.ink800,
  bgMuted: palette.ink700,
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: palette.mist100,
  textSecondary: '#A8B4C4',
  textMuted: '#7A8899',
  textInverse: palette.ink950,
  accent: palette.vermillionSoft,
  accentSoft: 'rgba(232, 90, 66, 0.16)',
  accentText: '#FFB4A8',
  gold: palette.gold,
  jade: palette.jadeSoft,
  today: palette.vermillionSoft,
  todayText: '#FFFFFF',
  festival: palette.gold,
  tabBar: 'rgba(11, 15, 20, 0.94)',
  tabInactive: '#7A8899',
  tabActive: palette.vermillionSoft,
  shadow: 'rgba(0,0,0,0.35)',
  hoangDao: palette.jadeSoft,
  hacDao: '#7A8899',
  heroGradient: ['#0B0F14', '#1A2330'],
  statusBar: 'light',
};

export function getColors(scheme: ColorScheme): ThemeColors {
  return scheme === 'dark' ? darkColors : lightColors;
}

export { palette };
