---

## SVG Is Not Just Static

![Article Illustration](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80)

Most people think of SVG as "a PNG that doesn't blur." But SVG can move.

With CSS animation, you can make an icon spin, change color, bounce, or morph — no GIF or video required. Just a few lines of CSS.

---

## Three Ways to Animate SVG

### 1. CSS Animation (Easiest)

The most recommended approach. Apply CSS animation directly to SVG elements:

```css
.icon {
  animation: spin 2s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 2. CSS Transition (Interactive Effects)

Perfect for hover-triggered and click-triggered effects:

```css
.icon:hover {
  fill: #3b82f6;
  transform: scale(1.2);
  transition: all 0.3s ease;
}
```

### 3. SMIL Animation (Native but Deprecated)

```html
<animate attributeName="r" from="10" to="20" dur="1s" repeatCount="indefinite" />
```

SMIL is SVG's native animation tag, but Chrome once planned to deprecate it and support remains inconsistent. Avoid for new projects.

---

## Real Example: A Spinning Loader

```html
<svg class="spinner" viewBox="0 0 24 24" width="48" height="48">
  <circle cx="12" cy="12" r="10" fill="none"
          stroke="#3b82f6" stroke-width="3"
          stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
</svg>
```

```css
.spinner {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  100% { transform: rotate(360deg); }
}
```

That's it.

---

## Animation Performance Tips

- **Prioritize `transform` and `opacity`.** They only trigger compositing, not layout
- **Avoid animating `width`/`height`.** They trigger full layout recalculations
- **Use `will-change`** to hint the browser for optimization
- **For complex animations, use `requestAnimationFrame`** with JavaScript

---

## When NOT to Use SVG Animation?

- Very complex particle effects (use Canvas instead)
- Frame-by-frame controlled animation (use Lottie or video)
- Full-screen background animations (Canvas performs better)

For 90% of icon-level animation needs — spinning, color changes, bouncing, loading — CSS + SVG is the best combination.

Try it in our SVG editor: load an icon, add some CSS animation in code view, and switch to preview to see the result.
