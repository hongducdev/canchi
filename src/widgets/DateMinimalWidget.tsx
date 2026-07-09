import { Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  frame,
  padding,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type { DateMinimalWidgetProps } from './types';

const DateMinimalWidgetView = (
  props: DateMinimalWidgetProps,
  environment: WidgetEnvironment
) => {
  'widget';
  const dark = environment.colorScheme !== 'light';
  const bg = dark ? '#0B0F14' : '#F7F4EE';
  const text = dark ? '#F1EDE6' : '#121820';
  const accent = dark ? '#C9A227' : '#A88B2E';

  return (
    <VStack
      spacing={6}
      alignment="center"
      modifiers={[
        containerBackground(bg, 'widget'),
        padding({ all: 12 }),
        frame({ maxWidth: 9999, maxHeight: 9999 }),
        widgetURL(`licham://day/${props.dateKey}`),
      ]}
    >
      <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(accent)]}>
        {props.monthLabel}
      </Text>
      <Text modifiers={[font({ size: 48, weight: 'ultraLight' }), foregroundStyle(text)]}>
        {String(props.day)}
      </Text>
      <VStack spacing={2} alignment="center">
        <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(accent)]}>
          Âm lịch
        </Text>
        <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(accent)]}>
          {props.lunarShort}
        </Text>
      </VStack>
    </VStack>
  );
};

export default createWidget('DateMinimalWidget', DateMinimalWidgetView);
