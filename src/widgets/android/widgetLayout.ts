export type AndroidWidgetName =
  | 'DayLore'
  | 'MonthSmall'
  | 'DateMinimal'
  | 'Combo'
  | 'CalendarWeather'
  | 'Anniversary'
  | 'DayDetail';

export type AndroidWidgetSize = {
  width: number;
  height: number;
};

export type AndroidWidgetLayout = {
  compact: boolean;
  showLunarGrid: boolean;
  roomyTypography: boolean;
};

export type CompactMonthGridMetrics = {
  rowHeight: number;
  dayFontSize: number;
  dayHeight: number;
  lunarFontSize: number;
  lunarHeight: number;
};

function isBelow(value: number, threshold: number): boolean {
  return value <= 0 || value < threshold;
}

export function getCompactMonthGridMetrics(
  rowCount: number,
  roomyTypography = false
): CompactMonthGridMetrics {
  if (roomyTypography) {
    if (rowCount < 6) {
      return {
        rowHeight: 28,
        dayFontSize: 16,
        dayHeight: 16,
        lunarFontSize: 12,
        lunarHeight: 12,
      };
    }
    return {
      rowHeight: 24,
      dayFontSize: 14,
      dayHeight: 14,
      lunarFontSize: 10,
      lunarHeight: 10,
    };
  }
  if (rowCount >= 6) {
    return {
      rowHeight: 14,
      dayFontSize: 9,
      dayHeight: 8,
      lunarFontSize: 6,
      lunarHeight: 6,
    };
  }
  return {
    rowHeight: 17,
    dayFontSize: 10,
    dayHeight: 10,
    lunarFontSize: 7,
    lunarHeight: 7,
  };
}

export function getWidgetLayout(
  widgetName: AndroidWidgetName,
  size: AndroidWidgetSize
): AndroidWidgetLayout {
  switch (widgetName) {
    case 'DayLore': {
      const compact =
        isBelow(size.width, 220) || isBelow(size.height, 135);
      return {
        compact,
        showLunarGrid: false,
        roomyTypography: !compact,
      };
    }
    case 'MonthSmall':
      return {
        compact: true,
        showLunarGrid: true,
        roomyTypography: !isBelow(size.height, 150),
      };
    case 'DateMinimal': {
      const compact =
        isBelow(size.width, 120) || isBelow(size.height, 135);
      return {
        compact,
        showLunarGrid: false,
        roomyTypography: !compact,
      };
    }
    case 'Combo':
      return {
        compact: true,
        showLunarGrid: true,
        roomyTypography: !isBelow(size.height, 150),
      };
    case 'CalendarWeather': {
      const compact = isBelow(size.width, 250) || isBelow(size.height, 125);
      return {
        compact,
        showLunarGrid: false,
        roomyTypography: !compact,
      };
    }
    case 'Anniversary': {
      const compact = isBelow(size.width, 220) || isBelow(size.height, 125);
      return {
        compact,
        showLunarGrid: false,
        roomyTypography: !compact,
      };
    }
    case 'DayDetail': {
      const compact =
        isBelow(size.width, 260) || isBelow(size.height, 300);
      return {
        compact,
        showLunarGrid: false,
        roomyTypography: !compact,
      };
    }
    default: {
      const _exhaustive: never = widgetName;
      return _exhaustive;
    }
  }
}
