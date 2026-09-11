from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / 'icons'
ICON_DIR.mkdir(exist_ok=True)

SIZE = 1024

# Plain, clean red sign. No cracked glass, no dark gradients, no extra graphic.
img = Image.new('RGBA', (SIZE, SIZE), (196, 24, 32, 255))
d = ImageDraw.Draw(img)

# Simple border to make it read as a sign while staying clean.
outer_margin = 70
inner_margin = 124
d.rounded_rectangle(
    (outer_margin, outer_margin, SIZE - outer_margin, SIZE - outer_margin),
    radius=54,
    outline=(255, 246, 225, 255),
    width=28,
)
d.rounded_rectangle(
    (inner_margin, inner_margin, SIZE - inner_margin, SIZE - inner_margin),
    radius=34,
    outline=(255, 246, 225, 255),
    width=10,
)

# Fonts
def font(size: int):
    candidates = [
        'C:/Windows/Fonts/impact.ttf',
        'C:/Windows/Fonts/arialbd.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

font_case = font(112)
font_fandom = font(150)
font_break = font(132)
font_glass = font(150)

TEXT_FILL = (255, 248, 230, 255)
TEXT_STROKE = (120, 0, 8, 255)

def centered_text(text: str, y: int, f: ImageFont.FreeTypeFont):
    bbox = d.textbbox((0, 0), text, font=f, stroke_width=4)
    x = (SIZE - (bbox[2] - bbox[0])) // 2
    d.text(
        (x, y),
        text,
        font=f,
        fill=TEXT_FILL,
        stroke_width=4,
        stroke_fill=TEXT_STROKE,
    )

centered_text('IN CASE OF', 170, font_case)
centered_text('FANDOM', 325, font_fandom)
centered_text('BREAK', 548, font_break)
centered_text('GLASS', 704, font_glass)

master = ICON_DIR / 'icon-1024.png'
img.save(master)
for s in (512, 128, 96, 48):
    resized = img.resize((s, s), Image.Resampling.LANCZOS)
    resized.save(ICON_DIR / f'icon-{s}.png')

print(master)
