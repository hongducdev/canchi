import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { familyForWeight } from '../theme/fonts';

/**
 * Single style object (never an array) so web / Link asChild never
 * assigns indexed keys onto CSSStyleDeclaration.
 */
function withTypeface(style: StyleProp<TextStyle> | undefined): TextStyle {
  const flat = StyleSheet.flatten(style) ?? {};
  const { fontWeight, ...rest } = flat;
  return {
    ...rest,
    fontFamily: familyForWeight(fontWeight as string | number | undefined),
    // Face files already encode weight; omit numeric weight on web faux-bold.
    fontWeight: undefined,
  };
}

/** Default UI text — Google Sans Flex with weight → face mapping. */
export function AppText({ style, ...rest }: TextProps) {
  return <Text {...rest} style={withTypeface(style)} />;
}

export function AppTextInput({ style, ...rest }: TextInputProps) {
  return <TextInput {...rest} style={withTypeface(style)} />;
}
