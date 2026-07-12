"use no memo";

import { FlexWidget } from "react-native-android-widget";
import type { WidgetMonthCell } from "../types";
import { widgetPalette, type WidgetScheme } from "./theme";
import { getCompactMonthGridMetrics } from "./widgetLayout";
import { WidgetText } from "./WidgetText";

type Props = {
    weekdayLabels: string[];
    cells: WidgetMonthCell[];
    scheme: WidgetScheme;
    compact?: boolean;
    showLunar?: boolean;
    centerCompactRows?: boolean;
    roomyTypography?: boolean;
};

/**
 * Equal 7-column grid. RemoteViews LinearLayout needs width:0 + flex:1
 * for columns to share space evenly (classic Android weight pattern).
 */
export function MonthGridAndroid({
    weekdayLabels = [],
    cells = [],
    scheme,
    compact = false,
    showLunar = true,
    centerCompactRows = false,
    roomyTypography = false,
}: Props) {
    const c = widgetPalette(scheme);
    const labelSize = compact ? 7 : 9;
    const cellPadV = compact ? 0 : 1;
    const safeCells = Array.isArray(cells) ? cells : [];
    const safeLabels = Array.isArray(weekdayLabels) ? weekdayLabels : [];
    const rows: WidgetMonthCell[][] = [];
    for (let i = 0; i < safeCells.length; i += 7) {
        rows.push(safeCells.slice(i, i + 7));
    }
    const compactMetrics = getCompactMonthGridMetrics(
        rows.length,
        roomyTypography,
    );
    const daySize = compact ? compactMetrics.dayFontSize : 12;
    const lunarSize = compact ? compactMetrics.lunarFontSize : 8;

    const colStyle = {
        width: 0 as const,
        flex: 1,
        alignItems: "center" as const,
        justifyContent: "center" as const,
    };

    return (
        <FlexWidget
            style={{
                flex: 1,
                width: "match_parent",
                flexDirection: "column",
                justifyContent:
                    compact && centerCompactRows ? "center" : "flex-start",
                overflow: "hidden",
            }}
        >
            {!compact ? (
                <FlexWidget
                    style={{
                        height: 0,
                        flex: 0.8,
                        flexDirection: "row",
                        width: "match_parent",
                    }}
                >
                    {safeLabels.map((label, idx) => (
                        <FlexWidget key={`w-${idx}`} style={colStyle}>
                            <WidgetText
                                text={label}
                                style={{
                                    fontSize: labelSize,
                                    fontWeight: "600",
                                    color: idx >= 5 ? c.weekend : c.muted,
                                    textAlign: "center",
                                }}
                                maxLines={1}
                            />
                        </FlexWidget>
                    ))}
                </FlexWidget>
            ) : null}

            {rows.map((row, rIdx) => (
                <FlexWidget
                    key={`r-${rIdx}`}
                    style={{
                        height: compact ? compactMetrics.rowHeight : 0,
                        ...(compact ? {} : { flex: 1 }),
                        flexDirection: "row",
                        width: "match_parent",
                    }}
                >
                    {row.map((cell, cIdx) => {
                        if (cell.day == null) {
                            return (
                                <FlexWidget
                                    key={`e-${rIdx}-${cIdx}`}
                                    style={colStyle}
                                >
                                    <WidgetText
                                        text=" "
                                        style={{ fontSize: daySize }}
                                        maxLines={1}
                                    />
                                </FlexWidget>
                            );
                        }

                        // Priority: today → festival → note → weekend → default
                        let solarColor = c.text;
                        if (cell.isToday) solarColor = c.todayText;
                        else if (cell.isFestival) solarColor = c.festival;
                        else if (cell.hasNote) solarColor = c.note;
                        else if (cell.isWeekend) solarColor = c.weekend;

                        let lunarColor = c.muted;
                        if (cell.isToday) lunarColor = c.todayText;
                        else if (cell.isFestival) lunarColor = c.festival;
                        else if (cell.hasNote) lunarColor = c.note;

                        return (
                            <FlexWidget
                                key={`d-${rIdx}-${cIdx}`}
                                style={{
                                    ...colStyle,
                                    paddingVertical: cellPadV,
                                    ...(cell.isToday
                                        ? {
                                              backgroundColor: c.todayBg,
                                              borderRadius: compact ? 6 : 8,
                                          }
                                        : {}),
                                }}
                            >
                                <WidgetText
                                    text={String(cell.day)}
                                    style={{
                                        fontSize: daySize,
                                        fontWeight: "700",
                                        color: solarColor,
                                        textAlign: "center",
                                        ...(compact
                                            ? {
                                                  height: compactMetrics.dayHeight,
                                                  width: "match_parent" as const,
                                                  adjustsFontSizeToFit: true,
                                              }
                                            : {}),
                                    }}
                                    maxLines={1}
                                />
                                {showLunar && cell.lunarLabel != null ? (
                                    <WidgetText
                                        text={cell.lunarLabel}
                                        style={{
                                            fontSize: lunarSize,
                                            fontWeight: "500",
                                            color: lunarColor,
                                            textAlign: "center",
                                            ...(compact
                                                ? {
                                                      height: compactMetrics.lunarHeight,
                                                      width: "match_parent" as const,
                                                      adjustsFontSizeToFit: true,
                                                  }
                                                : {}),
                                        }}
                                        maxLines={1}
                                        truncate="END"
                                    />
                                ) : null}
                            </FlexWidget>
                        );
                    })}
                </FlexWidget>
            ))}
        </FlexWidget>
    );
}
