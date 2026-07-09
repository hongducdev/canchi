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
import type { MonthSmallWidgetProps, WidgetMonthCell } from './types';

const MonthSmallWidgetView = (
  props: MonthSmallWidgetProps,
  environment: WidgetEnvironment
) => {
  'widget';
  const dark = environment.colorScheme !== 'light';
  const bg = dark ? '#121820' : '#F7F4EE';
  const text = dark ? '#F1EDE6' : '#121820';
  const muted = dark ? '#7A8899' : '#6B7A8C';
  const accent = dark ? '#E85A42' : '#C23B22';
  const weekend = dark ? '#E85A42' : '#B91C1C';
  const todayBg = dark ? '#E85A42' : '#C23B22';
  const todayText = '#FFFFFF';

  const rows: WidgetMonthCell[][] = [];
  for (let i = 0; i < props.cells.length; i += 7) {
    rows.push(props.cells.slice(i, i + 7));
  }

  return (
    <VStack
      spacing={4}
      modifiers={[
        containerBackground(bg, 'widget'),
        padding({ all: 10 }),
        frame({ maxWidth: 9999, maxHeight: 9999 }),
        widgetURL('licham:///(tabs)/calendar'),
      ]}
    >
      <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(accent)]}>
        {props.title}
      </Text>
      <HStack spacing={0}>
        {props.weekdayLabels.map((label, idx) => (
          <Text
            key={`w-${idx}`}
            modifiers={[
              font({ size: 9, weight: 'medium' }),
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
                  modifiers={[frame({ maxWidth: 9999, alignment: 'center' }), font({ size: 11 })]}
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
                    ? [background(todayBg, shapes.circle()), padding({ all: 2 })]
                    : []),
                ]}
              >
                <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(color)]}>
                  {String(cell.day)}
                </Text>
              </VStack>
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
};

export default createWidget('MonthSmallWidget', MonthSmallWidgetView);
