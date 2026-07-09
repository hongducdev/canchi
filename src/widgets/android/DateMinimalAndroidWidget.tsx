import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { DateMinimalWidgetProps } from '../types';
import { widgetPalette, type WidgetScheme } from './theme';

type Props = DateMinimalWidgetProps & { scheme: WidgetScheme };

export function DateMinimalAndroidWidget({
  monthLabel,
  day,
  lunarShort,
  dateKey,
  scheme,
}: Props) {
  const c = widgetPalette(scheme);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `licham://day/${dateKey}` }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: c.bg,
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text={monthLabel}
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: c.accent,
          letterSpacing: 1.2,
        }}
      />
      <TextWidget
        text={String(day)}
        style={{
          fontSize: 64,
          fontWeight: '200',
          color: c.text,
          marginVertical: 2,
        }}
      />
      <TextWidget
        text="Âm lịch"
        style={{ fontSize: 13, fontWeight: '500', color: c.accent }}
      />
      <TextWidget
        text={lunarShort}
        style={{ fontSize: 16, fontWeight: '700', color: c.accent }}
      />
    </FlexWidget>
  );
}
