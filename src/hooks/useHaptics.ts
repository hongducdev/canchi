import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { useSettingsStore } from '../store/settings';

export function useHaptics() {
  const enabled = useSettingsStore((s) => s.haptics);

  const light = useCallback(() => {
    if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [enabled]);

  const medium = useCallback(() => {
    if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [enabled]);

  const selection = useCallback(() => {
    if (enabled) void Haptics.selectionAsync();
  }, [enabled]);

  return { light, medium, selection };
}
