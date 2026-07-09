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

/**
 * Equal 7-column grid. RemoteViews LinearLayout needs width:0 + flex:1
 * for columns to share space evenly (classic Android weight pattern).
 */
export function MonthGridAndroid({
  weekdayLabels,
  cells,
  scheme,
  compact = false,
}: Props) {
  const c = widgetPalette(scheme);
  const daySize = compact ? 11 : 13;
  const lunarSize = compact ? 8 : 9;
  const labelSize = compact ? 9 : 10;
  const cellPadV = compact ? 1 : 2;
  const rows: WidgetMonthCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const colStyle = {
    width: 0 as const,
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <FlexWidget
      style={{
        flex: 1,
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', width: 'match_parent' }}>
        {weekdayLabels.map((label, idx) => (
          <FlexWidget key={`w-${idx}`} style={colStyle}>
            <TextWidget
              text={label}
              style={{
                fontSize: labelSize,
                fontWeight: '600',
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
                <FlexWidget key={`e-${rIdx}-${cIdx}`} style={colStyle}>
                  <TextWidget text=" " style={{ fontSize: daySize }} />
                </FlexWidget>
              );
            }

            // Priority: today → festival → note → weekend → default
            let solarColor = c.text;
            if (cell.isToday) solarColor = c.todayText;
            else if (cell.isFestival) solarColor = c.festival;
            else if (cell.hasNote) solarColor = c.note;
            else if (cell.isWeekend) solarColor = c.weekend;

            let lunarColor = c.muted;
            if (cell.isToday) lunarColor = c.todayText;
            else if (cell.isFestival) lunarColor = c.festival;
            else if (cell.hasNote) lunarColor = c.note;

            return (
              <FlexWidget
                key={`d-${rIdx}-${cIdx}`}
                style={{
                  ...colStyle,
                  paddingVertical: cellPadV,
                  ...(cell.isToday
                    ? {
                        backgroundColor: c.todayBg,
                        borderRadius: compact ? 6 : 8,
                      }
                    : {}),
                }}
              >
                <TextWidget
                  text={String(cell.day)}
                  style={{
                    fontSize: daySize,
                    fontWeight: '700',
                    color: solarColor,
                    textAlign: 'center',
                  }}
                />
                {cell.lunarLabel != null ? (
                  <TextWidget
                    text={cell.lunarLabel}
                    style={{
                      fontSize: lunarSize,
                      fontWeight: '500',
                      color: lunarColor,
                      textAlign: 'center',
                    }}
                  />
                ) : null}
              </FlexWidget>
            );
          })}
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}
