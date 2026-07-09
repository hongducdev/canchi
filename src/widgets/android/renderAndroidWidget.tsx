'use no memo';

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
        light: (
          <MonthSmallAndroidWidget
            title={payload.monthSmall.title}
            weekdayLabels={payload.monthSmall.weekdayLabels}
            cells={payload.monthSmall.cells}
            scheme="light"
          />
        ),
        dark: (
          <MonthSmallAndroidWidget
            title={payload.monthSmall.title}
            weekdayLabels={payload.monthSmall.weekdayLabels}
            cells={payload.monthSmall.cells}
            scheme="dark"
          />
        ),
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
        light: (
          <ComboAndroidWidget
            monthLabel={payload.combo.monthLabel}
            day={payload.combo.day}
            weekdayName={payload.combo.weekdayName}
            lunarShort={payload.combo.lunarShort}
            weekdayLabels={payload.combo.weekdayLabels}
            cells={payload.combo.cells}
            scheme="light"
          />
        ),
        dark: (
          <ComboAndroidWidget
            monthLabel={payload.combo.monthLabel}
            day={payload.combo.day}
            weekdayName={payload.combo.weekdayName}
            lunarShort={payload.combo.lunarShort}
            weekdayLabels={payload.combo.weekdayLabels}
            cells={payload.combo.cells}
            scheme="dark"
          />
        ),
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
