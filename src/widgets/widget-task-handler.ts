import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { renderAndroidWidgetFamily } from "./android/renderAndroidWidget";
import { deleteAnniversaryWidgetConfig } from "./anniversaryConfig";

export async function widgetTaskHandler({
    widgetInfo,
    widgetAction,
    renderWidget,
}: WidgetTaskHandlerProps): Promise<void> {
    switch (widgetAction) {
        case "WIDGET_ADDED":
        case "WIDGET_UPDATE":
        case "WIDGET_RESIZED":
            renderWidget(
                await renderAndroidWidgetFamily(widgetInfo.widgetName, {
                    size: widgetInfo,
                    widgetId: widgetInfo.widgetId,
                }),
            );
            break;
        case "WIDGET_DELETED":
            if (widgetInfo.widgetName === "Anniversary") {
                await deleteAnniversaryWidgetConfig(widgetInfo.widgetId);
            }
            break;
        case "WIDGET_CLICK":
            break;
        default: {
            const _exhaustive: never = widgetAction;
            void _exhaustive;
            break;
        }
    }
}
