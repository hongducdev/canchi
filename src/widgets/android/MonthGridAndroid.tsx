import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { WidgetMonthCell } from '../types';
import { widgetPalette, type WidgetScheme } from './theme';

type Props = {
  weekdayLabels: string[];
  cells: WidgetMonthCell[];
  scheme: WidgetScheme;
  compact?: boolean;
};

export function MonthGridAndroid({
  weekdayLabels,
  cells,
  scheme,
  compact = false,
}: Props) {
  const c = widgetPalette(scheme);
  const daySize = compact ? 9 : 11;
  const labelSize = compact ? 8 : 9;
  const rows: WidgetMonthCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <FlexWidget style={{ flex: 1, flexDirection: 'column', flexGap: 2 }}>
      <FlexWidget style={{ flexDirection: 'row', width: 'match_parent' }}>
        {weekdayLabels.map((label, idx) => (
          <FlexWidget key={`w-${idx}`} style={{ flex: 1, alignItems: 'center' }}>
            <TextWidget
              text={label}
              style={{
                fontSize: labelSize,
                fontWeight: '500',
                color: idx >= 5 ? c.weekend : c.muted,
                textAlign: 'center',
              }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
      {rows.map((row, rIdx) => (
        <FlexWidget
          key={`r-${rIdx}`}
          style={{ flexDirection: 'row', width: 'match_parent' }}
        >
          {row.map((cell, cIdx) => {
            if (cell.day == null) {
              return (
                <FlexWidget
                  key={`e-${rIdx}-${cIdx}`}
                  style={{ flex: 1, alignItems: 'center' }}
                >
                  <TextWidget
                    text=" "
                    style={{ fontSize: daySize, textAlign: 'center' }}
                  />
                </FlexWidget>
              );
            }
            const color = cell.isToday
              ? c.todayText
              : cell.isWeekend
                ? c.weekend
                : c.text;
            return (
              <FlexWidget
                key={`d-${rIdx}-${cIdx}`}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(cell.isToday
                    ? {
                        backgroundColor: c.todayBg,
                        borderRadius: 999,
                        height: compact ? 16 : 20,
                      }
                    : {}),
                }}
              >
                <TextWidget
                  text={String(cell.day)}
                  style={{
                    fontSize: daySize,
                    fontWeight: '600',
                    color,
                    textAlign: 'center',
                  }}
                />
              </FlexWidget>
            );
          })}
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}
