---

## SVG 不只是静态图

![Article Illustration](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80)

大多数人以为 SVG 就是"不会模糊的 PNG"。但实际上，SVG 是可以动起来的。

通过 CSS animation，你可以让一个图标旋转、变色、弹跳、变形——所有这些都不需要 GIF 或视频，几行 CSS 就搞定。

---

## 三种让 SVG 动起来的方式

### 1. CSS Animation（最简单）

最推荐的方式。直接对 SVG 元素应用 CSS animation：

```css
.icon {
  animation: spin 2s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 2. CSS Transition（交互动效）

适合悬停、点击等触发式动效：

```css
.icon:hover {
  fill: #3b82f6;
  transform: scale(1.2);
  transition: all 0.3s ease;
}
```

### 3. SMIL 动画（原生但已过时）

```html
<animate attributeName="r" from="10" to="20" dur="1s" repeatCount="indefinite" />
```

SMIL 是 SVG 原生的动画标签，但 Chrome 曾计划弃用它，现在支持也不稳定。新项目不建议使用。

---

## 实战示例：让加载图标转起来

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

就这么简单。

---

## 动画性能建议

- **优先用 `transform` 和 `opacity`**。它们只触发合成层，不引发重排
- **避免动画 `width`/`height`**。会触发完整的布局重计算
- **使用 `will-change`** 提示浏览器优化
- **复杂动画用 `requestAnimationFrame`** 配合 JavaScript

---

## 什么时候不该用 SVG 动画？

- 非常复杂的粒子效果（用 Canvas 更好）
- 需要逐帧控制的动画（用 Lottie 或视频）
- 全屏背景动画（Canvas 性能更好）

对于 90% 的图标级动画需求——旋转、变色、弹跳、loading——CSS + SVG 是最佳组合。

去我们的 SVG 编辑器试试：加载一个图标，在代码视图添加一段 CSS animation，切换到预览模式看看效果。
