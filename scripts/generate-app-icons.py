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

# Launcher mipmap sizes
DENSITIES = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}

# Android 12+ splash animated icon ~240dp; generate with padding so circular crop fits
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


def draw_calendar(size: int, day: int, *, pad_ratio: float = 0.0) -> Image.Image:
    """Full-bleed (or padded) rounded-rect calendar.

    For round launchers: use pad_ratio=0 — the OS applies the circular mask.
    Do NOT pre-draw a circle (that makes a tiny logo inside another circle).
    """
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    inset = int(size * pad_ratio)
    left, top = inset, inset
    right, bottom = size - inset - 1, size - inset - 1
    # Milder radius so circular OEM masks don't eat the header/day
    radius = max(4, int((right - left) * (0.12 if pad_ratio else 0.18)))
    header_h = max(8, int((bottom - top) * 0.28))

    draw.rounded_rectangle((left, top, right, bottom), radius=radius, fill=PAPER)

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
    font_day = load_font(max(14, int(size * (0.34 if pad_ratio else 0.40))), bold=True)
    _draw_day_centered(draw, day_text, font_day, cx, top + header_h, bottom)
    return img


def draw_splash_logo(size: int, day: int, *, tile_ratio: float = 0.52) -> Image.Image:
    """Calendar centered with transparent padding for Android 12 splash circle crop."""
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    tile_size = max(16, int(size * tile_ratio))
    tile = draw_calendar(tile_size, day)
    offset = (size - tile_size) // 2
    img.paste(tile, (offset, offset), tile)
    return img


def save_assets(day: int = 15) -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    draw_calendar(1024, day).save(ASSETS / "icon.png")
    # Adaptive FG: content in safe zone (~66%); OS masks circle/squircle
    draw_calendar(1024, day, pad_ratio=0.18).save(ASSETS / "adaptive-icon.png")
    # Expo splash: logo on dark canvas, not full-bleed (avoids looking zoomed)
    splash = Image.new("RGBA", (1024, 1024), SPLASH_BG)
    tile = draw_calendar(420, day)
    splash.paste(tile, ((1024 - 420) // 2, (1024 - 420) // 2), tile)
    splash.save(ASSETS / "splash-icon.png")
    draw_calendar(48, day).save(ASSETS / "favicon.png")
    print(f"Wrote Expo assets (day {day})")


def save_android_days() -> None:
    for density, size in DENSITIES.items():
        folder = ANDROID_RES / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        for legacy in folder.glob("ic_launcher*.webp"):
            legacy.unlink()
        for day in range(1, 31):
            # Same full-bleed art for icon + roundIcon — launcher applies the mask
            tile = draw_calendar(size, day)
            tile.save(folder / f"ic_launcher_day_{day:02d}.png")
            tile.save(folder / f"ic_launcher_day_{day:02d}_round.png")
        draw_calendar(size, 15).save(folder / "ic_launcher.png")
        draw_calendar(size, 15).save(folder / "ic_launcher_round.png")
        draw_calendar(size, 15, pad_ratio=0.18).save(folder / "ic_launcher_foreground.png")

    for density, size in SPLASH_DENSITIES.items():
        drawable = ANDROID_RES / f"drawable-{density}"
        drawable.mkdir(parents=True, exist_ok=True)
        draw_splash_logo(size, 15, tile_ratio=0.50).save(
            drawable / "splashscreen_logo.png"
        )
    print("Wrote Android mipmaps + padded splash logos")


def main() -> None:
    save_assets(15)
    save_android_days()


if __name__ == "__main__":
    main()
