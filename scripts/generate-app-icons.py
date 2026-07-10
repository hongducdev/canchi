#!/usr/bin/env python3
"""Generate Can Chi calendar-style app icons (static + lunar days 1–30)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ANDROID_RES = ROOT / "android" / "app" / "src" / "main" / "res"

VERMILLION = (194, 59, 34, 255)
PAPER = (247, 244, 238, 255)
INK = (11, 15, 20, 255)
TRANSPARENT = (0, 0, 0, 0)
SPLASH_BG = (15, 20, 25, 255)

DENSITIES = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}


def load_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_calendar(size: int, day: int, *, pad_ratio: float = 0.0) -> Image.Image:
    """Calendar tile. pad_ratio>0 insets the tile (adaptive foreground safe zone)."""
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    inset = int(size * pad_ratio)
    left, top = inset, inset
    right, bottom = size - inset - 1, size - inset - 1
    radius = max(4, int((right - left) * 0.22))
    header_h = max(8, int((bottom - top) * 0.28))

    draw.rounded_rectangle((left, top, right, bottom), radius=radius, fill=PAPER)

    # Vermillion header with matching top corners
    header = Image.new("RGBA", (size, size), TRANSPARENT)
    hd = ImageDraw.Draw(header)
    hd.rounded_rectangle((left, top, right, bottom), radius=radius, fill=VERMILLION)
    hd.rectangle((left, top + header_h, right + 1, bottom + 1), fill=TRANSPARENT)
    img = Image.alpha_composite(img, header)
    draw = ImageDraw.Draw(img)

    width = right - left
    cx = left + width / 2

    label = "Can Chi"
    font_header = load_font(max(9, int(size * (0.09 if pad_ratio else 0.11))), bold=True)
    draw.text(
        (cx, top + header_h / 2),
        label,
        font=font_header,
        fill=PAPER,
        anchor="mm",
    )

    day_text = str(day)
    font_day = load_font(max(14, int(size * (0.36 if pad_ratio else 0.42))), bold=True)
    body_top = top + header_h
    body_h = bottom - body_top
    # Center by actual glyph ink box (not em-box / baseline)
    ink_l, ink_t, ink_r, ink_b = font_day.getbbox(day_text)
    ink_w = ink_r - ink_l
    ink_h = ink_b - ink_t
    day_x = cx - ink_w / 2 - ink_l
    day_y = body_top + (body_h - ink_h) / 2 - ink_t
    draw.text((day_x, day_y), day_text, font=font_day, fill=INK)
    return img


def save_assets(day: int = 15) -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    draw_calendar(1024, day).save(ASSETS / "icon.png")
    draw_calendar(1024, day, pad_ratio=0.12).save(ASSETS / "adaptive-icon.png")
    splash = Image.new("RGBA", (1024, 1024), SPLASH_BG)
    tile = draw_calendar(640, day)
    splash.paste(tile, ((1024 - 640) // 2, (1024 - 640) // 2), tile)
    splash.save(ASSETS / "splash-icon.png")
    draw_calendar(48, day).save(ASSETS / "favicon.png")
    print(f"Wrote Expo assets (day {day})")


def save_android_days() -> None:
    for density, size in DENSITIES.items():
        folder = ANDROID_RES / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        # Drop legacy webp launchers so PNG replacements don't duplicate resources
        for legacy in folder.glob("ic_launcher*.webp"):
            legacy.unlink()
        for day in range(1, 31):
            draw_calendar(size, day).save(folder / f"ic_launcher_day_{day:02d}.png")
        draw_calendar(size, 15).save(folder / "ic_launcher.png")
        draw_calendar(size, 15).save(folder / "ic_launcher_round.png")
        draw_calendar(size, 15, pad_ratio=0.12).save(folder / "ic_launcher_foreground.png")

        drawable = ANDROID_RES / f"drawable-{density}"
        drawable.mkdir(parents=True, exist_ok=True)
        draw_calendar(size, 15).save(drawable / "splashscreen_logo.png")
    print("Wrote Android mipmaps days 01–30 + splash logos")


def main() -> None:
    save_assets(15)
    save_android_days()


if __name__ == "__main__":
    main()
