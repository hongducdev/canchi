import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSettingsStore } from '../store/settings';

export function useHaptics() {
  const enabled = useSettingsStore((s) => s.haptics);

  const light = useCallback(() => {
    if (Platform.OS === 'web' || !enabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [enabled]);

  const medium = useCallback(() => {
    if (Platform.OS === 'web' || !enabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [enabled]);

  const selection = useCallback(() => {
    if (Platform.OS === 'web' || !enabled) return;
    void Haptics.selectionAsync();
  }, [enabled]);

  return { light, medium, selection };
}
