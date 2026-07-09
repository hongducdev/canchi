"""Generate DayDetail Android widget preview from shared widget palette."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 512, 640
RADIUS = 32  # ~16dp visual
HEADER_H = 56

# Dark scheme — matches src/widgets/android/theme.ts
BG = (11, 15, 20)  # #0B0F14
HEADER = (47, 107, 90)  # #2F6B5A
TEXT = (241, 237, 230)  # #F1EDE6
MUTED = (122, 136, 153)  # #7A8899
ACCENT = (201, 162, 39)  # #C9A227
JADE = (61, 139, 116)  # #3D8B74
CTA_BG = (26, 35, 48)  # #1A2330
CTA_BORDER = (201, 162, 39)
CTA_TEXT = (168, 180, 196)
DIVIDER = (255, 255, 255, 36)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main() -> None:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((0, 0, W - 1, H - 1), radius=RADIUS, fill=BG)

    header = Image.new("RGBA", (W, HEADER_H + RADIUS), (0, 0, 0, 0))
    hd = ImageDraw.Draw(header)
    hd.rounded_rectangle((0, 0, W - 1, HEADER_H + RADIUS - 1), radius=RADIUS, fill=HEADER)
    header = header.crop((0, 0, W, HEADER_H))
    img.paste(header, (0, 0), header)

    f_header = load_font(22, True)
    f_day = load_font(96, False)
    f_weekday = load_font(24, True)
    f_can = load_font(18, True)
    f_lunar_day = load_font(64, False)
    f_muted = load_font(16, False)
    f_month = load_font(20, True)
    f_star = load_font(20, True)
    f_gio = load_font(15, False)
    f_cta = load_font(18, True)

    def center_text(y: int, text: str, font: ImageFont.ImageFont, fill: tuple[int, ...]) -> None:
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) / 2, y), text, font=font, fill=fill)

    center_text(14, "Tháng 5 năm 2025", f_header, (255, 255, 255))
    center_text(HEADER_H + 18, "7", f_day, TEXT)
    center_text(HEADER_H + 118, "Thứ Năm", f_weekday, TEXT)

    y_div = HEADER_H + 160
    draw.line((40, y_div, W - 40, y_div), fill=DIVIDER, width=2)

    left_x = 40
    right_x = W // 2 + 10
    y = y_div + 18
    for line in ["Năm Ất Tỵ", "Tháng Canh Thìn", "Ngày Ất Mão"]:
        draw.text((left_x, y), line, font=f_can, fill=TEXT)
        y += 28

    lunar_y = y_div + 12
    draw.text((right_x, lunar_y), "21", font=f_lunar_day, fill=ACCENT)
    draw.text((right_x + 90, lunar_y + 18), "Âm lịch", font=f_muted, fill=MUTED)
    draw.text((right_x + 90, lunar_y + 40), "Tháng Ba", font=f_month, fill=ACCENT)

    y_star = y_div + 120
    draw.text((40, y_star), "Hoàng Đạo: Sao Minh Đường", font=f_star, fill=JADE)
    gio = (
        "Giờ Hoàng Đạo: Tý (23-1), Dần (3-5), Mão (5-7),\n"
        "Ngọ (11-13), Mùi (13-15), Dậu (17-19)"
    )
    draw.multiline_text((40, y_star + 32), gio, font=f_gio, fill=MUTED, spacing=4)

    cta_w, cta_h = 200, 44
    cta_x = (W - cta_w) // 2
    cta_y = H - 72
    draw.rounded_rectangle(
        (cta_x, cta_y, cta_x + cta_w, cta_y + cta_h),
        radius=22,
        fill=CTA_BG,
        outline=CTA_BORDER,
        width=3,
    )
    bbox = draw.textbbox((0, 0), "Xem chi tiết", font=f_cta)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(
        (cta_x + (cta_w - tw) / 2, cta_y + (cta_h - th) / 2 - 2),
        "Xem chi tiết",
        font=f_cta,
        fill=CTA_TEXT,
    )

    out = Path(__file__).resolve().parents[1] / "assets" / "widget-preview" / "day-detail.png"
    img.save(out, "PNG")
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
