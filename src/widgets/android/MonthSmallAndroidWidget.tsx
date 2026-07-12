'use no memo';

import React from 'react';
import { FlexWidget } from 'react-native-android-widget';
import type { MonthSmallWidgetProps } from '../types';
import { MonthGridAndroid } from './MonthGridAndroid';
import { WIDGET_RADIUS, widgetPalette, type WidgetScheme } from './theme';
import { WidgetText } from './WidgetText';
import type { AndroidWidgetLayout } from './widgetLayout';

type Props = MonthSmallWidgetProps & {
  scheme: WidgetScheme;
  layout: AndroidWidgetLayout;
};

export function MonthSmallAndroidWidget({
  title,
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
        padding: compact ? 6 : 8,
        flexDirection: 'column',
        borderRadius: WIDGET_RADIUS,
        overflow: 'hidden',
      }}
    >
      <WidgetText
        text={title}
        style={{
          fontSize: compact && !roomyTypography ? 10 : 17,
          fontWeight: '700',
          color: c.accent,
          marginBottom: roomyTypography ? 6 : compact ? 2 : 4,
          paddingHorizontal: 2,
        }}
        maxLines={1}
        truncate="END"
      />
      <MonthGridAndroid
        weekdayLabels={weekdayLabels}
        cells={cells}
        scheme={scheme}
        compact={compact}
        showLunar={showLunarGrid}
        roomyTypography={roomyTypography}
      />
    </FlexWidget>
  );
}
