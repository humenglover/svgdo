---

## 为什么要关注 SVG 的嵌入方式？

![Article Illustration](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80)

同样的 SVG 图标，你用不同的方式放进网页里，效果可能完全不同。

用 `<img>` 标签是最简单的，但你没法改颜色。用 inline SVG 你可以随意操控它，但 HTML 会变臃肿。每种方式都有 trade-off。

---

## 5 种嵌入方式对比

### 1. Inline SVG（内联）

直接把 SVG 代码写在 HTML 里：

```html
<button>
  <svg viewBox="0 0 24 24"><path d="..."/></svg>
  保存
</button>
```

**优点**：可以用 CSS 控制颜色和大小、支持动画、不产生额外 HTTP 请求
**缺点**：HTML 文件变大、不能被浏览器缓存、代码可读性下降

### 2. `<img>` 标签

```html
<img src="icon.svg" alt="保存图标" />
```

**优点**：最简单、可缓存、支持懒加载
**缺点**：无法用 CSS 改颜色、无法交互

### 3. CSS Background

```css
.icon { background: url('icon.svg') center/contain no-repeat; }
```

**优点**：适合装饰性图标、跟 CSS 样式自然结合
**缺点**：无法交互、颜色不可控（除非用 CSS mask）

### 4. Data URI

```html
<img src="data:image/svg+xml;base64,..." />
```

**优点**：无额外请求、适合非常小的图标
**缺点**：不缓存、URL 太长、维护困难

### 5. SVG Sprite（精灵图）

```html
<svg><use href="/icons.svg#icon-name"></use></svg>
```

**优点**：一次加载、多个图标、可缓存
**缺点**：需要构建工具、IE 不兼容（但已不重要）

---

## 最佳实践建议

### 对于网站 Logo 和核心 UI 图标 → Inline SVG
它们需要可交互、可变色，inline 是最灵活的选择。

### 对于装饰性图标 → CSS Background
不参与交互的装饰元素用 background 最简洁。

### 对于大型图标库 → SVG Sprite
如果有几十上百个图标，sprite 方案更高效——一个请求加载全部。

### 对于内容图片 → `<img>` 标签
如果 SVG 是内容（如文章中的插图），用 `<img>` 标签兼容性最好。

---

## 性能注意事项

- **Incline SVG 太多会拖慢首屏渲染**。考虑用 symbol + use 复用
- **Data URI 不缓存**。只用于 1KB 以下的图标
- **Sprite 配合 HTTP/2** 效果最佳
- **Gzip 压缩** 对 SVG 文本效果极好

用我们的 SVG 编辑器打开一个图标，在代码视图里就能看到它的完整 inline 代码——直接复制粘贴到你的 HTML 中即可。
