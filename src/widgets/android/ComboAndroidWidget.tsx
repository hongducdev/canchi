'use no memo';

import React from 'react';
import { FlexWidget } from 'react-native-android-widget';
import type { ComboWidgetProps } from '../types';
import { MonthGridAndroid } from './MonthGridAndroid';
import { WIDGET_PAD, WIDGET_RADIUS, widgetPalette, type WidgetScheme } from './theme';
import { WidgetText } from './WidgetText';
import type { AndroidWidgetLayout } from './widgetLayout';

type Props = ComboWidgetProps & {
  scheme: WidgetScheme;
  layout: AndroidWidgetLayout;
};

export function ComboAndroidWidget({
  monthLabel,
  day,
  weekdayName,
  lunarShort,
  weekdayLabels = [],
  cells = [],
  scheme,
  layout,
}: Props) {
  const c = widgetPalette(scheme);
  const { compact, roomyTypography, showLunarGrid } = layout;

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'licham:///(tabs)/calendar' }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: c.bg,
        padding: compact ? 8 : WIDGET_PAD,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: WIDGET_RADIUS,
        overflow: 'hidden',
      }}
    >
      <FlexWidget
        style={{
          width: 0,
          flex: 2,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: compact ? 5 : 8,
        }}
      >
        <WidgetText
          text={monthLabel}
          style={{
            fontSize: compact && !roomyTypography ? 9 : 16,
            fontWeight: '600',
            color: c.muted,
          }}
          maxLines={1}
          truncate="END"
        />
        <WidgetText
          text={String(day)}
          style={{
            fontSize: compact && !roomyTypography ? 34 : 50,
            fontWeight: '200',
            color: c.text,
          }}
          maxLines={1}
        />
        <WidgetText
          text={weekdayName}
          style={{
            fontSize: compact && !roomyTypography ? 10 : 17,
            fontWeight: '600',
            color: c.text,
          }}
          maxLines={1}
          truncate="END"
        />
        <WidgetText
          text={lunarShort}
          style={{
            fontSize: compact && !roomyTypography ? 10 : 16,
            fontWeight: '700',
            color: c.accent,
            marginTop: compact ? 1 : 4,
          }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>

      <FlexWidget
        style={{
          width: 0,
          flex: 3,
          flexDirection: 'column',
          height: 'match_parent',
        }}
      >
        <MonthGridAndroid
          weekdayLabels={weekdayLabels}
          cells={cells}
          scheme={scheme}
          compact={compact}
          showLunar={showLunarGrid}
          centerCompactRows
          roomyTypography={roomyTypography}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
