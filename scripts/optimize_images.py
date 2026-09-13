"""Build display-sized WebP derivatives; source photographs remain untouched."""
from pathlib import Path
from PIL import Image, ImageOps
root = Path(__file__).resolve().parents[1]
for source in (root / 'src/imports').iterdir():
    if source.suffix.lower() not in ['.jpg', '.jpeg', '.png']: continue
    target = root / 'src/media' / (source.stem + '.webp')
    im = ImageOps.exif_transpose(Image.open(source))
    im.thumbnail((1600,1600))
    if im.mode not in ('RGB','RGBA'): im=im.convert('RGBA')
    im.save(target, 'WEBP', quality=80, method=6)
