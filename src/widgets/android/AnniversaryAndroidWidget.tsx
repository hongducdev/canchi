'use no memo';

import React from 'react';
import { FlexWidget } from 'react-native-android-widget';
import type { AnniversaryWidgetProps } from '../anniversaryConfig';
import { WIDGET_RADIUS, widgetPalette, type WidgetScheme } from './theme';
import type { AndroidWidgetLayout } from './widgetLayout';
import { WidgetText } from './WidgetText';

type Props = AnniversaryWidgetProps & {
  scheme: WidgetScheme;
  layout: AndroidWidgetLayout;
};

export function AnniversaryAndroidWidget({
  title,
  displayMode,
  primaryValue,
  primaryUnit,
  ymdValue,
  startLabel,
  openUri,
  scheme,
  layout,
}: Props) {
  const c = widgetPalette(scheme);
  const compact = layout.compact;

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: openUri }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: c.bg,
        borderRadius: WIDGET_RADIUS,
        overflow: 'hidden',
        paddingHorizontal: compact ? 13 : 18,
        paddingVertical: compact ? 10 : 14,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <WidgetText
        text={title}
        style={{
          color: c.text,
          fontSize: compact ? 11 : 13,
          fontWeight: '700',
          textAlign: 'center',
        }}
        maxLines={1}
        truncate="END"
      />

      {displayMode === 'ymd' ? (
        <WidgetText
          text={ymdValue}
          style={{
            color: c.text,
            fontSize: compact ? 14 : 24,
            fontWeight: '500',
            textAlign: 'center',
          }}
          maxLines={1}
          truncate="END"
        />
      ) : (
        <FlexWidget
          style={{
            width: 'match_parent',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WidgetText
            text={primaryValue}
            style={{
              color: c.text,
              fontSize: compact ? 38 : 48,
              fontWeight: '300',
            }}
            maxLines={1}
          />
          <WidgetText
            text={primaryUnit}
            style={{
              color: c.accent,
              fontSize: compact ? 9 : 11,
              fontWeight: '700',
              marginTop: compact ? -3 : -4,
            }}
            maxLines={1}
          />
        </FlexWidget>
      )}

      <WidgetText
        text={startLabel}
        style={{
          color: c.muted,
          fontSize: compact ? 8 : 10,
          fontWeight: '500',
          textAlign: 'center',
        }}
        maxLines={1}
        truncate="END"
      />
    </FlexWidget>
  );
}
