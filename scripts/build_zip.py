from __future__ import annotations

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / 'web-ext-artifacts'
OUT_DIR.mkdir(exist_ok=True)
OUT = OUT_DIR / 'fandom-to-antifandom-0.1.1.zip'

FILES = [
    'manifest.json',
    'redirect.js',
    'README.md',
    'icons/icon-48.png',
    'icons/icon-96.png',
    'icons/icon-128.png',
    'icons/icon-512.png',
]

with ZipFile(OUT, 'w', ZIP_DEFLATED) as zf:
    for name in FILES:
        zf.write(ROOT / name, name)

print(OUT)
