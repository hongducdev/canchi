import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import {
  background,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  padding,
  shapes,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type { ComboWidgetProps, WidgetMonthCell } from './types';

const ComboWidgetView = (
  props: ComboWidgetProps,
  environment: WidgetEnvironment
) => {
  'widget';
  const dark = environment.colorScheme !== 'light';
  const bg = dark ? '#121820' : '#F7F4EE';
  const text = dark ? '#F1EDE6' : '#121820';
  const muted = dark ? '#7A8899' : '#6B7A8C';
  const accent = dark ? '#C9A227' : '#A88B2E';
  const weekend = dark ? '#E85A42' : '#B91C1C';
  const todayBg = dark ? '#E85A42' : '#C23B22';
  const todayText = '#FFFFFF';

  const rows: WidgetMonthCell[][] = [];
  for (let i = 0; i < props.cells.length; i += 7) {
    rows.push(props.cells.slice(i, i + 7));
  }

  return (
    <HStack
      spacing={10}
      modifiers={[
        containerBackground(bg, 'widget'),
        padding({ all: 12 }),
        frame({ maxWidth: 9999, maxHeight: 9999 }),
        widgetURL('licham:///(tabs)/calendar'),
      ]}
    >
      <VStack spacing={2} alignment="leading" modifiers={[frame({ maxWidth: 9999 })]}>
        <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(muted)]}>
          {props.monthLabel}
        </Text>
        <Text modifiers={[font({ size: 40, weight: 'ultraLight' }), foregroundStyle(text)]}>
          {String(props.day)}
        </Text>
        <Text modifiers={[font({ size: 12, weight: 'medium' }), foregroundStyle(text)]}>
          {props.weekdayName}
        </Text>
        <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(accent)]}>
          {`☾ ${props.lunarShort}`}
        </Text>
      </VStack>

      <VStack spacing={2} modifiers={[frame({ maxWidth: 9999 })]}>
        <HStack spacing={0}>
          {props.weekdayLabels.map((label, idx) => (
            <Text
              key={`w-${idx}`}
              modifiers={[
                font({ size: 8, weight: 'medium' }),
                foregroundStyle(idx >= 5 ? weekend : muted),
                frame({ maxWidth: 9999, alignment: 'center' }),
              ]}
            >
              {label}
            </Text>
          ))}
        </HStack>
        {rows.map((row, rIdx) => (
          <HStack key={`r-${rIdx}`} spacing={0}>
            {row.map((cell, cIdx) => {
              if (cell.day == null) {
                return (
                  <Text
                    key={`e-${rIdx}-${cIdx}`}
                    modifiers={[frame({ maxWidth: 9999, alignment: 'center' }), font({ size: 9 })]}
                  >
                    {' '}
                  </Text>
                );
              }
              const color = cell.isToday ? todayText : cell.isWeekend ? weekend : text;
              return (
                <VStack
                  key={`d-${rIdx}-${cIdx}`}
                  alignment="center"
                  spacing={0}
                  modifiers={[
                    frame({ maxWidth: 9999, alignment: 'center' }),
                    ...(cell.isToday
                      ? [background(todayBg, shapes.circle()), padding({ all: 1 })]
                      : []),
                  ]}
                >
                  <Text
                    modifiers={[font({ size: 9, weight: 'semibold' }), foregroundStyle(color)]}
                  >
                    {String(cell.day)}
                  </Text>
                </VStack>
              );
            })}
          </HStack>
        ))}
      </VStack>
    </HStack>
  );
};

export default createWidget('ComboWidget', ComboWidgetView);
