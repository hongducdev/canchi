'use no memo';

import React from 'react';
import { FlexWidget, ImageWidget, type ImageWidgetSource } from 'react-native-android-widget';
import type { WeatherVisualKind } from '../../lib/weather';
import type { CalendarWeatherWidgetProps } from '../types';
import { WIDGET_RADIUS } from './theme';
import type { AndroidWidgetLayout } from './widgetLayout';
import { WidgetText } from './WidgetText';

const WEATHER_IMAGES: Record<WeatherVisualKind, ImageWidgetSource> = {
  clear: require('../../../assets/weather-icons/clearsky_day.png'),
  fair: require('../../../assets/weather-icons/fair_day.png'),
  partlyCloudy: require('../../../assets/weather-icons/partlycloudy_day.png'),
  cloudy: require('../../../assets/weather-icons/cloudy.png'),
  fog: require('../../../assets/weather-icons/fog.png'),
  rain: require('../../../assets/weather-icons/rain.png'),
  sleet: require('../../../assets/weather-icons/sleet.png'),
  snow: require('../../../assets/weather-icons/snow.png'),
  thunder: require('../../../assets/weather-icons/rainandthunder.png'),
  unknown: require('../../../assets/weather-icons/cloudy.png'),
};

type Props = CalendarWeatherWidgetProps & {
  layout: AndroidWidgetLayout;
};

export function CalendarWeatherAndroidWidget({
  monthLabel,
  day,
  weekdayName,
  lunarShort,
  dateKey,
  temperatureC,
  humidityPercent,
  weatherLabel,
  weatherKind,
  layout,
}: Props) {
  const compact = layout.compact;
  const iconSize = compact ? 30 : 38;
  const detail = humidityPercent === null
    ? weatherLabel
    : `${weatherLabel} · Ẩm ${Math.round(humidityPercent)}%`;

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `canchi://day/${dateKey}` }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#07090C',
        borderRadius: WIDGET_RADIUS,
        overflow: 'hidden',
        paddingHorizontal: compact ? 12 : 16,
        paddingVertical: compact ? 9 : 12,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <FlexWidget
        style={{
          width: 0,
          flex: 3,
          height: 'match_parent',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: 8,
        }}
      >
        <WidgetText
          text={String(day)}
          style={{
            color: '#F7F4EE',
            fontSize: compact ? 38 : 48,
            fontWeight: '300',
          }}
          maxLines={1}
        />
        <WidgetText
          text={monthLabel}
          style={{
            color: '#A8B0BA',
            fontSize: compact ? 10 : 12,
            fontWeight: '600',
            marginTop: compact ? -1 : 1,
          }}
          maxLines={1}
          truncate="END"
        />
        <WidgetText
          text={weekdayName}
          style={{
            color: '#747E8A',
            fontSize: compact ? 9 : 11,
            fontWeight: '500',
            marginTop: 2,
          }}
          maxLines={1}
          truncate="END"
        />
        <WidgetText
          text={lunarShort}
          style={{
            color: '#F5A623',
            fontSize: compact ? 9 : 11,
            fontWeight: '700',
            marginTop: compact ? 3 : 5,
          }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>

      <FlexWidget
        style={{
          width: 0,
          flex: 2,
          height: 'match_parent',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <ImageWidget
          image={WEATHER_IMAGES[weatherKind]}
          imageWidth={iconSize}
          imageHeight={iconSize}
          style={{ width: iconSize, height: iconSize, marginBottom: compact ? 1 : 2 }}
        />
        <WidgetText
          text={temperatureC === null ? '--°' : `${Math.round(temperatureC)}°`}
          style={{
            color: '#F7F4EE',
            fontSize: compact ? 24 : 30,
            fontWeight: '700',
          }}
          maxLines={1}
        />
        <WidgetText
          text={detail}
          style={{
            color: '#A8B0BA',
            fontSize: compact ? 8 : 10,
            fontWeight: '500',
            marginTop: 1,
          }}
          maxLines={1}
          truncate="END"
        />
        <WidgetText
          text="MET Norway"
          style={{
            color: '#5F6873',
            fontSize: compact ? 7 : 8,
            fontWeight: '500',
            marginTop: 2,
          }}
          maxLines={1}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
