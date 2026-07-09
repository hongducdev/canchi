import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { renderAndroidWidgetFamily } from './android/renderAndroidWidget';

export async function widgetTaskHandler({
  widgetInfo,
  widgetAction,
  renderWidget,
}: WidgetTaskHandlerProps): Promise<void> {
  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      renderWidget(renderAndroidWidgetFamily(widgetInfo.widgetName));
      break;
    case 'WIDGET_DELETED':
    case 'WIDGET_CLICK':
      break;
    default: {
      const _exhaustive: never = widgetAction;
      void _exhaustive;
      break;
    }
  }
}
