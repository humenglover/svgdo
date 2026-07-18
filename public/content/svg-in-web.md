---

## Why Embedding Method Matters

![Article Illustration](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80)

The same SVG icon can behave completely differently depending on how you embed it.

Use an `<img>` tag and it's simple, but you can't change its color. Use inline SVG and you have full control, but your HTML gets bloated. Every approach has trade-offs.

---

## 5 Embedding Methods Compared

### 1. Inline SVG

Write SVG code directly in your HTML:

```html
<button>
  <svg viewBox="0 0 24 24"><path d="..."/></svg>
  Save
</button>
```

**Pros**: CSS-controllable color and size, supports animation, no extra HTTP requests
**Cons**: Bloated HTML, can't be cached by browser, reduced code readability

### 2. `<img>` Tag

```html
<img src="icon.svg" alt="Save icon" />
```

**Pros**: Simplest, cacheable, supports lazy loading
**Cons**: Can't change color with CSS, can't interact

### 3. CSS Background

```css
.icon { background: url('icon.svg') center/contain no-repeat; }
```

**Pros**: Great for decorative icons, natural CSS integration
**Cons**: No interaction, color not controllable (unless using CSS mask)

### 4. Data URI

```html
<img src="data:image/svg+xml;base64,..." />
```

**Pros**: No extra requests, good for tiny icons
**Cons**: Not cached, long URLs, hard to maintain

### 5. SVG Sprite

```html
<svg><use href="/icons.svg#icon-name"></use></svg>
```

**Pros**: One request for all icons, cacheable
**Cons**: Requires build tools, IE incompatible (moot now)

---

## Best Practice Recommendations

### Website logos and core UI icons → Inline SVG
They need to be interactive and styleable. Inline gives maximum flexibility.

### Decorative icons → CSS Background
Non-interactive decorative elements are cleanest as backgrounds.

### Large icon libraries → SVG Sprite
When you have dozens or hundreds of icons, sprite is most efficient — one request loads all.

### Content images → `<img>` Tag
If the SVG is content (e.g., an illustration in an article), `<img>` has the best compatibility.

---

## Performance Notes

- **Too many inline SVGs slow first paint.** Consider symbol + use for reuse
- **Data URIs aren't cached.** Only use for icons under 1KB
- **Sprites work best with HTTP/2**
- **Gzip compression is extremely effective** on SVG text

Open an icon in our SVG editor's code view — you'll see the complete inline code, ready to copy-paste into your HTML.
