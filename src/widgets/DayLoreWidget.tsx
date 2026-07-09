import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  frame,
  padding,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type { DayLoreWidgetProps } from './types';

const DayLoreWidgetView = (
  props: DayLoreWidgetProps,
  environment: WidgetEnvironment
) => {
  'widget';
  const dark = environment.colorScheme !== 'light';
  const bg = dark ? '#0B0F14' : '#F7F4EE';
  const text = dark ? '#F1EDE6' : '#121820';
  const muted = dark ? '#7A8899' : '#6B7A8C';
  const accent = dark ? '#C9A227' : '#A88B2E';

  return (
    <VStack
      spacing={10}
      modifiers={[
        containerBackground(bg, 'widget'),
        padding({ all: 14 }),
        frame({ maxWidth: 9999, maxHeight: 9999 }),
        widgetURL(`licham://day/${props.dateKey}`),
      ]}
    >
      <HStack spacing={8}>
        <Text
          modifiers={[
            font({ size: 12, weight: 'medium' }),
            foregroundStyle(text),
            frame({ maxWidth: 9999, alignment: 'leading' }),
          ]}
        >
          {props.headerDate}
        </Text>
        <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(accent)]}>
          {`☾ ${props.lunarShort}`}
        </Text>
      </HStack>
      <Text
        modifiers={[
          font({ size: 14, weight: 'regular' }),
          foregroundStyle(text),
          frame({ maxWidth: 9999, alignment: 'center' }),
        ]}
      >
        {`“${props.bodyText}”`}
      </Text>
      <Text
        modifiers={[
          font({ size: 11, weight: 'medium' }),
          foregroundStyle(muted),
          frame({ maxWidth: 9999, alignment: 'center' }),
        ]}
      >
        {props.footerText}
      </Text>
    </VStack>
  );
};

export default createWidget('DayLoreWidget', DayLoreWidgetView);
