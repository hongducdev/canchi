import { describe, expect, it, vi } from "vitest";
import { WidgetText } from "./WidgetText";

vi.mock("react-native-android-widget", () => ({
    TextWidget: () => null,
}));

describe("WidgetText", () => {
    it("disables Android font scaling to keep widget bounds stable", () => {
        const element = WidgetText({ text: "Ngày âm" });

        expect(element.props.allowFontScaling).toBe(false);
    });
});
