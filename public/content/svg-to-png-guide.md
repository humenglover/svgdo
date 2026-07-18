---

## Why Convert SVG to PNG?

![Article Illustration](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80)

SVG is great, but it's not the right format for every scenario. Here's when you need PNG:

- **Email signatures**: Most email clients don't support SVG
- **Social media avatars**: Some platforms reject SVG uploads
- **Presentations and documents**: Microsoft Office has limited SVG support
- **App store screenshots**: Require fixed-resolution PNG
- **Thumbnail previews**: File managers usually can't preview SVG

---

## Three Things to Confirm Before Converting

### 1. Is the Resolution Sufficient?

PNG is raster — the resolution is fixed. If you need a larger size later, you'll have to re-export.

Recommended strategy: **export at 2x or 4x** to accommodate high-DPI screens.

### 2. Do You Need Transparency?

SVG is transparent by default. When converting to PNG, choose:
- **Transparent**: Great for overlaying icons on other elements
- **White background**: Good for printing or document embedding
- **Black background**: Good for dark UI environments

### 3. Are Colors Correct?

`currentColor` in SVG may be lost when exporting to PNG. Replace `currentColor` with concrete color values before exporting.

---

## Converting to PNG with an Online Tool

### Step 1: Load SVG
Upload an SVG file, pick from the icon library, or paste SVG code.

### Step 2: Choose Export Settings

- **Scale**: 1x (original), 2x (HD), 4x (ultra HD)
- **Background**: Transparent / White / Black

### Step 3: Export
Click "Export PNG" — the browser renders and downloads the PNG locally.

**The entire process happens in your browser. SVG code is never uploaded to any server.**

---

## Batch Conversion

Need to convert many SVGs? Use command-line tools:

```bash
# Install librsvg (macOS)
brew install librsvg

# Batch convert
for f in *.svg; do
  rsvg-convert -w 512 -h 512 "$f" -o "${f%.svg}.png"
done
```

Or with ImageMagick:

```bash
for f in *.svg; do
  convert -background none -density 300 "$f" "${f%.svg}.png"
done
```

---

## SVG → PNG Quality Comparison

| Scale | Use Case | File Size |
|-------|----------|-----------|
| 1x (24px) | Web favicons, small icons | Smallest |
| 2x (48px) | General UI, button icons | Medium |
| 4x (96px) | Avatars, HD display | Larger |

---

Try it now in our SVG editor: load an icon, set the scale and background in the export panel, and export as PNG with one click.
