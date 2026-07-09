import { useColorScheme } from 'react-native';
import { getColors, type ThemeColors } from '../theme/colors';
import { useSettingsStore } from '../store/settings';

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const system = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && system === 'dark');

  return {
    colors: getColors(isDark ? 'dark' : 'light'),
    isDark,
  };
}
