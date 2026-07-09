import { Platform } from 'react-native';
import { buildWidgetPayload } from './buildWidgetPayload';
import ComboWidget from './ComboWidget';
import DateMinimalWidget from './DateMinimalWidget';
import DayLoreWidget from './DayLoreWidget';
import MonthSmallWidget from './MonthSmallWidget';

/**
 * Push today's calendar data into all home-screen widgets.
 * No-ops on web / Expo Go when the native module is missing.
 */
export function syncWidgets(now = new Date()): void {
  if (Platform.OS === 'web') return;

  try {
    const payload = buildWidgetPayload(now);
    const next = buildWidgetPayload(payload.nextMidnight);

    DayLoreWidget.updateTimeline([
      { date: now, props: payload.dayLore },
      { date: payload.nextMidnight, props: next.dayLore },
    ]);
    MonthSmallWidget.updateTimeline([
      { date: now, props: payload.monthSmall },
      { date: payload.nextMidnight, props: next.monthSmall },
    ]);
    DateMinimalWidget.updateTimeline([
      { date: now, props: payload.dateMinimal },
      { date: payload.nextMidnight, props: next.dateMinimal },
    ]);
    ComboWidget.updateTimeline([
      { date: now, props: payload.combo },
      { date: payload.nextMidnight, props: next.combo },
    ]);
  } catch {
    // Native widgets unavailable (Expo Go / missing prebuild).
  }
}
