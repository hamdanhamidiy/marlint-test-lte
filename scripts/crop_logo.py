import os
from PIL import Image

input_path = r"C:\Users\hamda\.gemini\antigravity-ide\brain\3014dec4-436a-4129-bbff-c7a7f9767b6c\.user_uploaded\media_1787654874830.png"
out_dir = r"d:\Marlin Test\marlin-web\public\images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(input_path).convert("RGBA")
width, height = img.size

# Precise canvas bounding area (avoiding Canva top toolbars y>200, bottom footer y<height-80, left sidebar x>150, right scrollbar x<width-80)
canvas = img.crop((int(width * 0.2), int(height * 0.22), int(width * 0.8), int(height * 0.82)))

# Find the bounding box of non-white pixels
pixels = canvas.load()
w, h = canvas.size

min_x, min_y, max_x, max_y = w, h, 0, 0

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Detect actual logo content (blue ship, cyan wave, black text)
        if not (r > 240 and g > 240 and b > 240):
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

pad = 10
min_x = max(0, min_x - pad)
min_y = max(0, min_y - pad)
max_x = min(w, max_x + pad)
max_y = min(h, max_y + pad)

logo = canvas.crop((min_x, min_y, max_x, max_y))

# Make background transparent
logo_rgba = logo.convert("RGBA")
px = logo_rgba.load()
lw, lh = logo_rgba.size

for y in range(lh):
    for x in range(lw):
        r, g, b, a = px[x, y]
        if r > 240 and g > 240 and b > 240:
            px[x, y] = (255, 255, 255, 0)
        elif r > 225 and g > 225 and b > 225:
            alpha = int(255 * (1 - (min(r, g, b) - 225) / 25.0))
            px[x, y] = (r, g, b, max(0, min(255, alpha)))

logo_rgba.save(os.path.join(out_dir, "lte-cruise-logo.png"), "PNG")
logo_rgba.save(r"d:\Marlin Test\marlin-web\public\logo.png", "PNG")
print(f"Clean logo extracted: {logo_rgba.size}")
