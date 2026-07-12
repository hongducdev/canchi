"use no memo";

import { buildWidgetPayload } from "../buildWidgetPayload";
import type { WidgetPayload } from "../types";
import { ComboAndroidWidget } from "./ComboAndroidWidget";
import { DateMinimalAndroidWidget } from "./DateMinimalAndroidWidget";
import { DayDetailAndroidWidget } from "./DayDetailAndroidWidget";
import { DayLoreAndroidWidget } from "./DayLoreAndroidWidget";
import { MonthSmallAndroidWidget } from "./MonthSmallAndroidWidget";
import { getWidgetLayout, type AndroidWidgetSize } from "./widgetLayout";

type RenderAndroidWidgetOptions = {
    now?: Date;
    size?: AndroidWidgetSize;
};

const FALLBACK_SIZE: AndroidWidgetSize = { width: 0, height: 0 };

function familyFromPayload(
    widgetName: string,
    payload: WidgetPayload,
    size: AndroidWidgetSize,
) {
    switch (widgetName) {
        case "DayLore": {
            const layout = getWidgetLayout("DayLore", size);
            return {
                light: (
                    <DayLoreAndroidWidget
                        {...payload.dayLore}
                        scheme="light"
                        layout={layout}
                    />
                ),
                dark: (
                    <DayLoreAndroidWidget
                        {...payload.dayLore}
                        scheme="dark"
                        layout={layout}
                    />
                ),
            };
        }
        case "MonthSmall": {
            const layout = getWidgetLayout("MonthSmall", size);
            return {
                light: (
                    <MonthSmallAndroidWidget
                        title={payload.monthSmall.title}
                        weekdayLabels={payload.monthSmall.weekdayLabels}
                        cells={payload.monthSmall.cells}
                        scheme="light"
                        layout={layout}
                    />
                ),
                dark: (
                    <MonthSmallAndroidWidget
                        title={payload.monthSmall.title}
                        weekdayLabels={payload.monthSmall.weekdayLabels}
                        cells={payload.monthSmall.cells}
                        scheme="dark"
                        layout={layout}
                    />
                ),
            };
        }
        case "DateMinimal": {
            const layout = getWidgetLayout("DateMinimal", size);
            return {
                light: (
                    <DateMinimalAndroidWidget
                        {...payload.dateMinimal}
                        scheme="light"
                        layout={layout}
                    />
                ),
                dark: (
                    <DateMinimalAndroidWidget
                        {...payload.dateMinimal}
                        scheme="dark"
                        layout={layout}
                    />
                ),
            };
        }
        case "Combo": {
            const layout = getWidgetLayout("Combo", size);
            return {
                light: (
                    <ComboAndroidWidget
                        monthLabel={payload.combo.monthLabel}
                        day={payload.combo.day}
                        weekdayName={payload.combo.weekdayName}
                        lunarShort={payload.combo.lunarShort}
                        weekdayLabels={payload.combo.weekdayLabels}
                        cells={payload.combo.cells}
                        scheme="light"
                        layout={layout}
                    />
                ),
                dark: (
                    <ComboAndroidWidget
                        monthLabel={payload.combo.monthLabel}
                        day={payload.combo.day}
                        weekdayName={payload.combo.weekdayName}
                        lunarShort={payload.combo.lunarShort}
                        weekdayLabels={payload.combo.weekdayLabels}
                        cells={payload.combo.cells}
                        scheme="dark"
                        layout={layout}
                    />
                ),
            };
        }
        case "DayDetail": {
            const layout = getWidgetLayout("DayDetail", size);
            return {
                light: (
                    <DayDetailAndroidWidget
                        {...payload.dayDetail}
                        scheme="light"
                        layout={layout}
                    />
                ),
                dark: (
                    <DayDetailAndroidWidget
                        {...payload.dayDetail}
                        scheme="dark"
                        layout={layout}
                    />
                ),
            };
        }
        default:
            return {
                light: (
                    <DayLoreAndroidWidget
                        {...payload.dayLore}
                        scheme="light"
                        layout={getWidgetLayout("DayLore", size)}
                    />
                ),
                dark: (
                    <DayLoreAndroidWidget
                        {...payload.dayLore}
                        scheme="dark"
                        layout={getWidgetLayout("DayLore", size)}
                    />
                ),
            };
    }
}

export async function renderAndroidWidgetFamily(
    widgetName: string,
    options: RenderAndroidWidgetOptions = {},
) {
    const payload = await buildWidgetPayload(options.now ?? new Date());
    return familyFromPayload(
        widgetName,
        payload,
        options.size ?? FALLBACK_SIZE,
    );
}

export const ANDROID_WIDGET_NAMES = [
    "DayLore",
    "MonthSmall",
    "DateMinimal",
    "Combo",
    "DayDetail",
] as const;
