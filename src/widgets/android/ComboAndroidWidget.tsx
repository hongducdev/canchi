import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { ComboWidgetProps } from '../types';
import { MonthGridAndroid } from './MonthGridAndroid';
import { widgetPalette, type WidgetScheme } from './theme';

type Props = ComboWidgetProps & { scheme: WidgetScheme };

export function ComboAndroidWidget({
  monthLabel,
  day,
  weekdayName,
  lunarShort,
  weekdayLabels,
  cells,
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
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
      }}
    >
      <FlexWidget
        style={{
          width: 0,
          flex: 2,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: 6,
        }}
      >
        <TextWidget
          text={monthLabel}
          style={{ fontSize: 12, fontWeight: '500', color: c.muted }}
        />
        <TextWidget
          text={String(day)}
          style={{ fontSize: 44, fontWeight: '200', color: c.text }}
        />
        <TextWidget
          text={weekdayName}
          style={{ fontSize: 13, fontWeight: '600', color: c.text }}
        />
        <TextWidget
          text={`☾ ${lunarShort}`}
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: c.accent,
            marginTop: 4,
          }}
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
          compact
        />
      </FlexWidget>
    </FlexWidget>
  );
}
