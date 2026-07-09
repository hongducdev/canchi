/**
 * Google Sans Flex — loaded in root layout; use AppText / typeface() for UI copy.
 */

import {
  GoogleSansFlex_100Thin,
  GoogleSansFlex_200ExtraLight,
  GoogleSansFlex_300Light,
  GoogleSansFlex_400Regular,
  GoogleSansFlex_500Medium,
  GoogleSansFlex_600SemiBold,
  GoogleSansFlex_700Bold,
  GoogleSansFlex_800ExtraBold,
  GoogleSansFlex_900Black,
} from '@expo-google-fonts/google-sans-flex';
import { Platform, type TextStyle } from 'react-native';

export const googleSansFlexFaces = {
  GoogleSansFlex_100Thin,
  GoogleSansFlex_200ExtraLight,
  GoogleSansFlex_300Light,
  GoogleSansFlex_400Regular,
  GoogleSansFlex_500Medium,
  GoogleSansFlex_600SemiBold,
  GoogleSansFlex_700Bold,
  GoogleSansFlex_800ExtraBold,
  GoogleSansFlex_900Black,
};

export const fontFamily = {
  thin: 'GoogleSansFlex_100Thin',
  extraLight: 'GoogleSansFlex_200ExtraLight',
  light: 'GoogleSansFlex_300Light',
  regular: 'GoogleSansFlex_400Regular',
  medium: 'GoogleSansFlex_500Medium',
  semiBold: 'GoogleSansFlex_600SemiBold',
  bold: 'GoogleSansFlex_700Bold',
  extraBold: 'GoogleSansFlex_800ExtraBold',
  black: 'GoogleSansFlex_900Black',
} as const;

const WEIGHT_TO_FAMILY: Record<string, string> = {
  '100': fontFamily.thin,
  '200': fontFamily.extraLight,
  '300': fontFamily.light,
  '400': fontFamily.regular,
  '500': fontFamily.medium,
  '600': fontFamily.semiBold,
  '700': fontFamily.bold,
  '800': fontFamily.extraBold,
  '900': fontFamily.black,
  normal: fontFamily.regular,
  bold: fontFamily.bold,
};

export function familyForWeight(weight: string | number | undefined): string {
  if (weight == null) return fontFamily.regular;
  return WEIGHT_TO_FAMILY[String(weight)] ?? fontFamily.regular;
}

/**
 * Map numeric/named fontWeight to the matching Google Sans Flex face.
 * Prefer AppText; use this for headerTitleStyle / tabBarLabelStyle objects.
 */
export function typeface(weight?: TextStyle['fontWeight']): TextStyle {
  return {
    fontFamily: familyForWeight(weight),
  };
}

/** Inject web document fallbacks after fonts are loaded. */
export function enableGoogleSansFlexWeb() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const id = 'licham-google-sans-flex';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    html, body {
      font-family: ${fontFamily.regular}, "Segoe UI", "Noto Sans", system-ui, sans-serif;
    }
  `;
  document.head.appendChild(style);
}
