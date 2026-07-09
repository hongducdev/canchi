import React from 'react';
import { buildWidgetPayload } from '../buildWidgetPayload';
import type { WidgetPayload } from '../types';
import { ComboAndroidWidget } from './ComboAndroidWidget';
import { DateMinimalAndroidWidget } from './DateMinimalAndroidWidget';
import { DayLoreAndroidWidget } from './DayLoreAndroidWidget';
import { MonthSmallAndroidWidget } from './MonthSmallAndroidWidget';

function familyFromPayload(widgetName: string, payload: WidgetPayload) {
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

export async function renderAndroidWidgetFamily(
  widgetName: string,
  now = new Date()
) {
  const payload = await buildWidgetPayload(now);
  return familyFromPayload(widgetName, payload);
}

export const ANDROID_WIDGET_NAMES = [
  'DayLore',
  'MonthSmall',
  'DateMinimal',
  'Combo',
] as const;
