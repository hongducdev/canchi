/** Serializable props for expo-widgets (isolated widget runtime). */

export type WidgetMonthCell = {
  day: number | null;
  /** Preformatted lunar label: `d` normally, `d/m` (or `d/mN` leap) on lunar 1 & 15 */
  lunarLabel: string | null;
  isToday: boolean;
  isWeekend: boolean;
  /** Traditional / national festival (tet, le, quoc-gia) */
  isFestival: boolean;
  /** User has at least one local note on this solar day */
  hasNote: boolean;
};

export type DayLoreWidgetProps = {
  headerDate: string;
  lunarShort: string;
  bodyText: string;
  footerText: string;
  dateKey: string;
};

export type DateMinimalWidgetProps = {
  monthLabel: string;
  day: number;
  lunarShort: string;
  dateKey: string;
};

export type MonthSmallWidgetProps = {
  title: string;
  weekdayLabels: string[];
  cells: WidgetMonthCell[];
};

export type ComboWidgetProps = {
  monthLabel: string;
  day: number;
  weekdayName: string;
  lunarShort: string;
  weekdayLabels: string[];
  cells: WidgetMonthCell[];
};

export type WidgetPayload = {
  dayLore: DayLoreWidgetProps;
  monthSmall: MonthSmallWidgetProps;
  dateMinimal: DateMinimalWidgetProps;
  combo: ComboWidgetProps;
  /** Local midnight of the next calendar day — schedule timeline refresh */
  nextMidnight: Date;
};
