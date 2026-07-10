#!/usr/bin/env python3
"""Generate Can Chi calendar-style app icons (squircle + round-mask + splash)."""

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

SPLASH_DENSITIES = {
    "mdpi": 240,
    "hdpi": 360,
    "xhdpi": 480,
    "xxhdpi": 720,
    "xxxhdpi": 960,
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


def _draw_day_centered(
    draw: ImageDraw.ImageDraw,
    day_text: str,
    font: ImageFont.ImageFont,
    cx: float,
    body_top: float,
    body_bottom: float,
) -> None:
    ink_l, ink_t, ink_r, ink_b = font.getbbox(day_text)
    ink_w = ink_r - ink_l
    ink_h = ink_b - ink_t
    body_h = body_bottom - body_top
    day_x = cx - ink_w / 2 - ink_l
    day_y = body_top + (body_h - ink_h) / 2 - ink_t
    draw.text((day_x, day_y), day_text, font=font, fill=INK)


def draw_calendar_tile(size: int, day: int, *, radius_ratio: float = 0.18) -> Image.Image:
    """Rounded calendar on transparent — for store icon / favicon / splash tile only."""
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    left, top, right, bottom = 0, 0, size - 1, size - 1
    radius = max(4, int(size * radius_ratio))
    header_h = max(8, int(size * 0.28))

    draw.rounded_rectangle((left, top, right, bottom), radius=radius, fill=PAPER)
    header = Image.new("RGBA", (size, size), TRANSPARENT)
    hd = ImageDraw.Draw(header)
    hd.rounded_rectangle((left, top, right, bottom), radius=radius, fill=VERMILLION)
    hd.rectangle((left, top + header_h, right + 1, bottom + 1), fill=TRANSPARENT)
    img = Image.alpha_composite(img, header)
    draw = ImageDraw.Draw(img)

    cx = size / 2
    font_header = load_font(max(9, int(size * 0.11)), bold=True)
    draw.text((cx, header_h / 2), "Can Chi", font=font_header, fill=PAPER, anchor="mm")

    day_text = str(day)
    font_day = load_font(max(14, int(size * 0.40)), bold=True)
    _draw_day_centered(draw, day_text, font_day, cx, header_h, bottom)
    return img


def draw_calendar_bleed(size: int, day: int) -> Image.Image:
    """Opaque full-square calendar (no rounded corners, no transparent edges).

    Required for round / adaptive launchers: the OS masks a circle/squircle.
    Any transparent margin becomes an empty ring → logo looks tiny in the middle.
    """
    img = Image.new("RGBA", (size, size), PAPER)
    draw = ImageDraw.Draw(img)
    header_h = max(8, int(size * 0.28))
    draw.rectangle((0, 0, size, header_h), fill=VERMILLION)

    cx = size / 2
    font_header = load_font(max(9, int(size * 0.11)), bold=True)
    draw.text((cx, header_h / 2), "Can Chi", font=font_header, fill=PAPER, anchor="mm")

    day_text = str(day)
    font_day = load_font(max(14, int(size * 0.40)), bold=True)
    _draw_day_centered(draw, day_text, font_day, cx, header_h, size - 1)
    return img


def draw_splash_logo(size: int, day: int, *, tile_ratio: float = 0.50) -> Image.Image:
    """Calendar tile centered with transparent padding for Android 12 splash crop."""
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    tile_size = max(16, int(size * tile_ratio))
    tile = draw_calendar_tile(tile_size, day)
    offset = (size - tile_size) // 2
    img.paste(tile, (offset, offset), tile)
    return img


def save_assets(day: int = 15) -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    draw_calendar_tile(1024, day).save(ASSETS / "icon.png")
    # Adaptive FG must be opaque full-bleed so circular masks fill the shape
    draw_calendar_bleed(1024, day).save(ASSETS / "adaptive-icon.png")
    splash = Image.new("RGBA", (1024, 1024), SPLASH_BG)
    tile = draw_calendar_tile(420, day)
    splash.paste(tile, ((1024 - 420) // 2, (1024 - 420) // 2), tile)
    splash.save(ASSETS / "splash-icon.png")
    draw_calendar_tile(48, day).save(ASSETS / "favicon.png")
    print(f"Wrote Expo assets (day {day})")


def save_android_days() -> None:
    for density, size in DENSITIES.items():
        folder = ANDROID_RES / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        for legacy in folder.glob("ic_launcher*.webp"):
            legacy.unlink()
        for day in range(1, 31):
            # Opaque bleed for both — circle/squircle masks fill completely
            bleed = draw_calendar_bleed(size, day)
            bleed.save(folder / f"ic_launcher_day_{day:02d}.png")
            bleed.save(folder / f"ic_launcher_day_{day:02d}_round.png")
        draw_calendar_bleed(size, 15).save(folder / "ic_launcher.png")
        draw_calendar_bleed(size, 15).save(folder / "ic_launcher_round.png")
        draw_calendar_bleed(size, 15).save(folder / "ic_launcher_foreground.png")

    for density, size in SPLASH_DENSITIES.items():
        drawable = ANDROID_RES / f"drawable-{density}"
        drawable.mkdir(parents=True, exist_ok=True)
        draw_splash_logo(size, 15, tile_ratio=0.50).save(
            drawable / "splashscreen_logo.png"
        )
    print("Wrote Android opaque bleed mipmaps + padded splash")


def main() -> None:
    save_assets(15)
    save_android_days()


if __name__ == "__main__":
    main()
