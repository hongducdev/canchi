import { TextWidget, type TextWidgetProps } from "react-native-android-widget";

export function WidgetText(props: TextWidgetProps) {
    return <TextWidget {...props} allowFontScaling={false} />;
}
