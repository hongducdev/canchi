import React from 'react';
import { buildWidgetPayload } from '../buildWidgetPayload';
import { ComboAndroidWidget } from './ComboAndroidWidget';
import { DateMinimalAndroidWidget } from './DateMinimalAndroidWidget';
import { DayLoreAndroidWidget } from './DayLoreAndroidWidget';
import { MonthSmallAndroidWidget } from './MonthSmallAndroidWidget';

export function renderAndroidWidgetFamily(widgetName: string, now = new Date()) {
  const payload = buildWidgetPayload(now);

  switch (widgetName) {
    case 'DayLore':
      return {
        light: <DayLoreAndroidWidget {...payload.dayLore} scheme="light" />,
        dark: <DayLoreAndroidWidget {...payload.dayLore} scheme="dark" />,
      };
    case 'MonthSmall':
      return {
        light: <MonthSmallAndroidWidget {...payload.monthSmall} scheme="light" />,
        dark: <MonthSmallAndroidWidget {...payload.monthSmall} scheme="dark" />,
      };
    case 'DateMinimal':
      return {
        light: (
          <DateMinimalAndroidWidget {...payload.dateMinimal} scheme="light" />
        ),
        dark: (
          <DateMinimalAndroidWidget {...payload.dateMinimal} scheme="dark" />
        ),
      };
    case 'Combo':
      return {
        light: <ComboAndroidWidget {...payload.combo} scheme="light" />,
        dark: <ComboAndroidWidget {...payload.combo} scheme="dark" />,
      };
    default:
      return {
        light: <DayLoreAndroidWidget {...payload.dayLore} scheme="light" />,
        dark: <DayLoreAndroidWidget {...payload.dayLore} scheme="dark" />,
      };
  }
}

export const ANDROID_WIDGET_NAMES = [
  'DayLore',
  'MonthSmall',
  'DateMinimal',
  'Combo',
] as const;
