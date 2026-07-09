import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { DayLoreWidgetProps } from '../types';
import { widgetPalette, type WidgetScheme } from './theme';

type Props = DayLoreWidgetProps & { scheme: WidgetScheme };

export function DayLoreAndroidWidget({
  headerDate,
  lunarShort,
  bodyText,
  footerText,
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
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 16,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <FlexWidget style={{ flex: 1 }}>
          <TextWidget
            text={headerDate}
            style={{ fontSize: 12, fontWeight: '500', color: c.text }}
            maxLines={1}
            truncate="END"
          />
        </FlexWidget>
        <TextWidget
          text={`☾ ${lunarShort}`}
          style={{ fontSize: 12, fontWeight: '600', color: c.accent }}
        />
      </FlexWidget>

      <TextWidget
        text={`“${bodyText}”`}
        style={{
          fontSize: 14,
          fontWeight: '400',
          color: c.text,
          textAlign: 'center',
          marginVertical: 8,
        }}
        maxLines={3}
        truncate="END"
      />

      <TextWidget
        text={footerText}
        style={{
          fontSize: 11,
          fontWeight: '500',
          color: c.muted,
          textAlign: 'center',
        }}
        maxLines={1}
        truncate="END"
      />
    </FlexWidget>
  );
}
