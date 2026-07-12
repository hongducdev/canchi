"use no memo";

import { FlexWidget } from "react-native-android-widget";
import type { DayLoreWidgetProps } from "../types";
import {
    WIDGET_PAD,
    WIDGET_RADIUS,
    widgetPalette,
    type WidgetScheme,
} from "./theme";
import type { AndroidWidgetLayout } from "./widgetLayout";
import { WidgetText } from "./WidgetText";

type Props = DayLoreWidgetProps & {
    scheme: WidgetScheme;
    layout: AndroidWidgetLayout;
};

export function DayLoreAndroidWidget({
    headerDate,
    lunarShort,
    bodyText,
    footerText,
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
                justifyContent: "space-between",
                borderRadius: WIDGET_RADIUS,
                overflow: "hidden",
            }}
        >
            <FlexWidget
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "match_parent",
                }}
            >
                <FlexWidget style={{ flex: 1, paddingRight: compact ? 5 : 8 }}>
                    <WidgetText
                        text={headerDate}
                        style={{
                            fontSize: compact ? 10 : 12,
                            fontWeight: "600",
                            color: c.text,
                        }}
                        maxLines={1}
                        truncate="END"
                    />
                </FlexWidget>
                <WidgetText
                    text={lunarShort}
                    style={{
                        fontSize: compact ? 10 : 12,
                        fontWeight: "700",
                        color: c.accent,
                    }}
                    maxLines={1}
                    truncate="END"
                />
            </FlexWidget>

            <FlexWidget
                style={{
                    width: "match_parent",
                    height: 1,
                    backgroundColor: c.divider,
                    marginVertical: compact ? 4 : 8,
                }}
            />

            <WidgetText
                text={`“${bodyText}”`}
                style={{
                    fontSize: compact ? 11 : 14,
                    fontWeight: "400",
                    color: c.text,
                    textAlign: "center",
                    marginVertical: compact ? 2 : 4,
                }}
                maxLines={compact ? 2 : 3}
                truncate="END"
            />

            <WidgetText
                text={footerText}
                style={{
                    fontSize: compact ? 9 : 11,
                    fontWeight: "500",
                    color: c.muted,
                    textAlign: "center",
                    marginTop: compact ? 3 : 6,
                }}
                maxLines={1}
                truncate="END"
            />
        </FlexWidget>
    );
}
