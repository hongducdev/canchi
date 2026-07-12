"use no memo";

import { FlexWidget } from "react-native-android-widget";
import type { DateMinimalWidgetProps } from "../types";
import {
    WIDGET_PAD,
    WIDGET_RADIUS,
    widgetPalette,
    type WidgetScheme,
} from "./theme";
import type { AndroidWidgetLayout } from "./widgetLayout";
import { WidgetText } from "./WidgetText";

type Props = DateMinimalWidgetProps & {
    scheme: WidgetScheme;
    layout: AndroidWidgetLayout;
};

export function DateMinimalAndroidWidget({
    monthLabel,
    day,
    lunarShort,
    dateKey,
    scheme,
    layout,
}: Props) {
    const c = widgetPalette(scheme);
    const { compact } = layout;

    return (
        <FlexWidget
            clickAction="OPEN_URI"
            clickActionData={{ uri: `licham://day/${dateKey}` }}
            style={{
                height: "match_parent",
                width: "match_parent",
                backgroundColor: c.bg,
                padding: compact ? 8 : WIDGET_PAD,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: WIDGET_RADIUS,
                overflow: "hidden",
            }}
        >
            <WidgetText
                text={monthLabel}
                style={{
                    fontSize: compact ? 11 : 13,
                    fontWeight: "700",
                    color: c.accent,
                    letterSpacing: compact ? 0.8 : 1.2,
                }}
                maxLines={1}
                truncate="END"
            />
            <WidgetText
                text={String(day)}
                style={{
                    fontSize: compact ? 42 : 64,
                    fontWeight: "200",
                    color: c.text,
                    marginVertical: compact ? 0 : 2,
                }}
                maxLines={1}
            />
            <WidgetText
                text="Âm lịch"
                style={{
                    fontSize: compact ? 9 : 11,
                    fontWeight: "500",
                    color: c.muted,
                }}
                maxLines={1}
            />
            <WidgetText
                text={lunarShort}
                style={{
                    fontSize: compact ? 12 : 15,
                    fontWeight: "700",
                    color: c.accent,
                }}
                maxLines={1}
                truncate="END"
            />
        </FlexWidget>
    );
}
