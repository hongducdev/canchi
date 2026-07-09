'use no memo';

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { MonthSmallWidgetProps } from '../types';
import { MonthGridAndroid } from './MonthGridAndroid';
import { widgetPalette, type WidgetScheme } from './theme';

type Props = MonthSmallWidgetProps & { scheme: WidgetScheme };

export function MonthSmallAndroidWidget({
  title,
  weekdayLabels = [],
  cells = [],
  scheme,
}: Props) {
  const c = widgetPalette(scheme);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'licham:///(tabs)/calendar' }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: c.bg,
        padding: 8,
        flexDirection: 'column',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text={title}
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: c.accent,
          marginBottom: 4,
        }}
      />
      <MonthGridAndroid
        weekdayLabels={weekdayLabels}
        cells={cells}
        scheme={scheme}
      />
    </FlexWidget>
  );
}
