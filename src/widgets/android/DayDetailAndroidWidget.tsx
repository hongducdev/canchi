"use no memo";

import { FlexWidget } from "react-native-android-widget";
import type { DayDetailWidgetProps } from "../types";
import {
    WIDGET_PAD,
    WIDGET_RADIUS,
    widgetPalette,
    type WidgetScheme,
} from "./theme";
import type { AndroidWidgetLayout } from "./widgetLayout";
import { WidgetText } from "./WidgetText";

type Props = DayDetailWidgetProps & {
    scheme: WidgetScheme;
    layout: AndroidWidgetLayout;
};

export function DayDetailAndroidWidget({
    headerTitle,
    solarDay,
    weekdayName,
    yearCanChi,
    monthCanChi,
    dayCanChi,
    lunarDay,
    lunarMonthLabel,
    hoangDaoStar,
    gioHoangDaoLine,
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
                flexDirection: "column",
                borderRadius: WIDGET_RADIUS,
                overflow: "hidden",
            }}
        >
            <FlexWidget
                style={{
                    width: "match_parent",
                    backgroundColor: c.headerBg,
                    paddingVertical: compact ? 7 : 10,
                    paddingHorizontal: compact ? 10 : WIDGET_PAD,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <WidgetText
                    text={headerTitle}
                    style={{
                        fontSize: compact ? 12 : 14,
                        fontWeight: "700",
                        color: c.headerText,
                        textAlign: "center",
                    }}
                    maxLines={1}
                    truncate="END"
                />
            </FlexWidget>

            <FlexWidget
                style={{
                    flex: 1,
                    width: "match_parent",
                    flexDirection: "column",
                    paddingHorizontal: compact ? 10 : WIDGET_PAD,
                    paddingTop: compact ? 6 : 8,
                    paddingBottom: compact ? 8 : WIDGET_PAD,
                }}
            >
                <FlexWidget
                    style={{
                        width: "match_parent",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingBottom: compact ? 2 : 4,
                    }}
                >
                    <WidgetText
                        text={String(solarDay)}
                        style={{
                            fontSize: compact ? 44 : 56,
                            fontWeight: "200",
                            color: c.text,
                            textAlign: "center",
                        }}
                        maxLines={1}
                    />
                    <WidgetText
                        text={weekdayName}
                        style={{
                            fontSize: compact ? 13 : 15,
                            fontWeight: "600",
                            color: c.text,
                            textAlign: "center",
                            marginTop: compact ? -3 : -4,
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
                        marginVertical: compact ? 5 : 8,
                    }}
                />

                <FlexWidget
                    style={{
                        width: "match_parent",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: compact ? 5 : 8,
                    }}
                >
                    <FlexWidget
                        style={{
                            width: 0,
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingRight: 6,
                        }}
                    >
                        <WidgetText
                            text={yearCanChi}
                            style={{
                                fontSize: compact ? 10 : 12,
                                fontWeight: "600",
                                color: c.text,
                            }}
                            maxLines={1}
                            truncate="END"
                        />
                        <WidgetText
                            text={monthCanChi}
                            style={{
                                fontSize: compact ? 10 : 12,
                                fontWeight: "600",
                                color: c.text,
                                marginTop: compact ? 2 : 3,
                            }}
                            maxLines={1}
                            truncate="END"
                        />
                        <WidgetText
                            text={dayCanChi}
                            style={{
                                fontSize: compact ? 10 : 12,
                                fontWeight: "600",
                                color: c.text,
                                marginTop: compact ? 2 : 3,
                            }}
                            maxLines={1}
                            truncate="END"
                        />
                    </FlexWidget>

                    <FlexWidget
                        style={{
                            width: 0,
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <WidgetText
                            text={String(lunarDay)}
                            style={{
                                fontSize: compact ? 32 : 40,
                                fontWeight: "200",
                                color: c.accent,
                            }}
                            maxLines={1}
                        />
                        <FlexWidget
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                marginLeft: compact ? 4 : 6,
                            }}
                        >
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
                                text={lunarMonthLabel}
                                style={{
                                    fontSize: compact ? 11 : 13,
                                    fontWeight: "700",
                                    color: c.accent,
                                }}
                                maxLines={1}
                                truncate="END"
                            />
                        </FlexWidget>
                    </FlexWidget>
                </FlexWidget>

                <WidgetText
                    text={hoangDaoStar}
                    style={{
                        fontSize: compact ? 11 : 13,
                        fontWeight: "700",
                        color: c.jade,
                        marginTop: compact ? 1 : 2,
                    }}
                    maxLines={1}
                    truncate="END"
                />
                <WidgetText
                    text={gioHoangDaoLine}
                    style={{
                        fontSize: compact ? 9 : 11,
                        fontWeight: "500",
                        color: c.muted,
                        marginTop: compact ? 2 : 4,
                    }}
                    maxLines={compact ? 2 : 3}
                    truncate="END"
                />

                <FlexWidget style={{ flex: 1 }} />

                <FlexWidget
                    style={{
                        width: "match_parent",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: compact ? 4 : 8,
                    }}
                >
                    <FlexWidget
                        style={{
                            backgroundColor: c.ctaBg,
                            borderColor: c.ctaBorder,
                            borderWidth: 1.5,
                            borderRadius: 999,
                            paddingVertical: compact ? 5 : 8,
                            paddingHorizontal: compact ? 16 : 22,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <WidgetText
                            text="Xem chi tiết"
                            style={{
                                fontSize: compact ? 11 : 13,
                                fontWeight: "600",
                                color: c.ctaText,
                                textAlign: "center",
                            }}
                            maxLines={1}
                        />
                    </FlexWidget>
                </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}
