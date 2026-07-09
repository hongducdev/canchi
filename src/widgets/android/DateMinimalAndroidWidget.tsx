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
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: c.accent,
      }}
    >
      <TextWidget
        text={monthLabel}
        style={{ fontSize: 11, fontWeight: '600', color: c.accent, letterSpacing: 1 }}
      />
      <TextWidget
        text={String(day)}
        style={{
          fontSize: 48,
          fontWeight: '200',
          color: c.text,
          marginVertical: 4,
        }}
      />
      <TextWidget
        text="Âm lịch"
        style={{ fontSize: 11, fontWeight: '500', color: c.accent }}
      />
      <TextWidget
        text={lunarShort}
        style={{ fontSize: 12, fontWeight: '600', color: c.accent }}
      />
    </FlexWidget>
  );
}
