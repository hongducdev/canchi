import { Platform } from "react-native";
import { requestWidgetUpdate } from "react-native-android-widget";
import {
    ANDROID_WIDGET_NAMES,
    renderAndroidWidgetFamily,
} from "./android/renderAndroidWidget";

/**
 * Push today's calendar data into Android home-screen widgets.
 * No-ops on iOS/web / when the native module is missing.
 */
export async function syncWidgets(now = new Date()): Promise<void> {
    if (Platform.OS !== "android") return;

    try {
        await Promise.all(
            ANDROID_WIDGET_NAMES.map((widgetName) =>
                requestWidgetUpdate({
                    widgetName,
                    renderWidget: async (widgetInfo) =>
                        renderAndroidWidgetFamily(widgetName, {
                            now,
                            size: widgetInfo,
                            widgetId: widgetInfo.widgetId,
                        }),
                }),
            ),
        );
    } catch {
        // Native widgets unavailable (Expo Go / missing prebuild).
    }
}
