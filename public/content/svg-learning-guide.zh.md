# SVG 从入门到放弃再到超神：万字干货带你彻底征服矢量世界

*本文旨在用最硬核、最接地气的语言，带你扒光 SVG 的底裤。*

如果你是一个前端开发，或者是一个有点代码洁癖的设计师，你一定对 SVG（Scalable Vector Graphics）又爱又恨。
爱它，是因为它清晰、锐利、体积小、还能用 CSS 和 JS 随意蹂躏；
恨它，是因为当你打开一个 SVG 文件，满屏的 `<path d="M... C... Z">` 就像是火星文，看一眼就让人掉头发。

<div align="center">
  <img src="/content/images/angry-typing.gif" alt="SVG Headache" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

但是，今天，我们要终结这种恐惧！我们要用最直观的代码和真实的浏览器渲染效果，带你一步步征服 SVG。

## 第一章：什么是 SVG？（为什么我们不直接用 PNG？）

SVG 并不是什么神秘的高科技，它本质上就是一个 **XML 文件**。
对，就像 HTML 一样，你可以用任何文本编辑器打开它，用标签来描述图形。

**为什么不用 PNG？**
PNG 是像素图（位图）。当你放大一张 PNG 时，它就像是一个马赛克组成的拼图，放得越大，马赛克越明显。
而 SVG 是矢量图。它记录的是数学公式：“在坐标(10,10)画一个半径为5的圆”。所以，无论你怎么放大，浏览器都会重新计算并渲染这个圆，永远不会模糊！

我们来看一个最直观的例子。

### 1.1 你的第一个 SVG

让我们先徒手写一个最简单的 SVG 出来。我们需要一个画布。

```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <!-- 我们会在这里画画 -->
</svg>
```

**【前端直接渲染效果】**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;"></svg>

这就是一个空白的画布。什么都没有，但它代表了无尽的可能。

---

## 第二章：基本形状 —— 成为几何大师

SVG 提供了一些预设的“画笔”，可以让你轻松画出基本的几何图形。

### 2.1 矩形 `<rect>`

`<rect>` 标签用来画矩形。你需要告诉它：
- `x`, `y`：左上角的坐标（在 SVG 中，左上角是 (0,0)）
- `width`, `height`：宽度和高度
- `fill`：填充颜色
- `rx`, `ry`：圆角半径

```html
<svg width="300" height="150" style="background: #f0f4f8; border-radius: 12px;">
  <rect x="50" y="25" width="200" height="100" rx="20" fill="#FF7F50" />
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="150" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <rect x="50" y="25" width="200" height="100" rx="20" fill="#FF7F50" />
</svg>

看！你只用了一行代码，就画出了一个带圆角的橙色矩形！是不是比用 Canvas 简单多了？

### 2.2 圆形 `<circle>`

画圆更简单。你需要指定：
- `cx`, `cy`：圆心坐标 (Center X, Center Y)
- `r`：半径 (Radius)

```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <circle cx="100" cy="100" r="60" fill="#4169E1" stroke="#FFD700" stroke-width="10" />
</svg>
```

*注意这里我加了 `stroke` (描边) 和 `stroke-width` (描边宽度)。*

**【前端直接渲染效果】**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <circle cx="100" cy="100" r="60" fill="#4169E1" stroke="#FFD700" stroke-width="10" />
</svg>

当你第一次靠自己手写代码画出一个完美的圆时，那种感觉简直要升仙了！

<div align="center">
  <img src="/content/images/spongebob-rainbow.gif" alt="SVG Success" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>


### 2.3 椭圆 `<ellipse>`、多边形 `<polygon>` 和线条 `<line>`

这几个兄弟也大同小异：
- `ellipse` 只是把半径拆成了水平的 `rx` 和垂直的 `ry`。
- `line` 就是指定起点 `(x1, y1)` 和终点 `(x2, y2)`。
- `polygon` 接收一堆 `points="x,y x,y x,y"`，把它们连成闭合图形。

让我们把它们凑在一起开个会：

```html
<svg width="400" height="200" style="background: #1e1e2f; border-radius: 12px;">
  <!-- 椭圆 -->
  <ellipse cx="80" cy="100" rx="50" ry="80" fill="#00FF7F" />
  
  <!-- 线条 -->
  <line x1="160" y1="20" x2="240" y2="180" stroke="#FF1493" stroke-width="8" stroke-linecap="round" />
  
  <!-- 多边形 (画个三角形) -->
  <polygon points="320,20 270,180 370,180" fill="#00BFFF" />
</svg>
```

**【前端直接渲染效果】**
<svg width="400" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <ellipse cx="80" cy="100" rx="50" ry="80" fill="#00FF7F" />
  <line x1="160" y1="20" x2="240" y2="180" stroke="#FF1493" stroke-width="8" stroke-linecap="round" />
  <polygon points="320,20 270,180 370,180" fill="#00BFFF" />
</svg>

恭喜你，你已经掌握了 SVG 80% 的日常用法！
但是，真正让开发者掉头发的，是那个传说中的大魔王—— `<path>`。

---

## 第三章：大魔王 `<path>` 彻底解密

当你从 Figma 导出一个复杂的图标时，你几乎看不到 rect 或者 circle，满眼都是 `<path>`。
`<path>` 是 SVG 里的万能画笔，它可以画出任何形状。它的核心是 `d` 属性（data 的意思）。

`d` 属性里的一串乱码，其实是一系列绘图指令。记住以下规则：
- **大写字母**：绝对坐标（相对于整个画布的起点 `0,0`）
- **小写字母**：相对坐标（相对于当前画笔所在的位置）

### 3.1 移动 (M/m) 和 直线 (L/l)

- `M x y` (Move to)：把画笔抬起来，移动到坐标 `(x,y)`，不留下痕迹。
- `L x y` (Line to)：从当前点画一条直线到坐标 `(x,y)`。
- `H x` / `V y`：水平画直线 / 垂直画直线。
- `Z` / `z` (Close path)：把当前点和起点连起来，闭合图形。

咱们来手写一个“房子”图标：
```html
<svg width="200" height="200" style="background: #282c34; border-radius: 12px;">
  <!--
    1. M 100 30 -> 移动到顶点
    2. L 170 100 -> 画线到右边屋檐
    3. L 150 100 -> 退回一点到右墙角
    4. L 150 170 -> 往下画右墙壁
    5. L 50 170 -> 往左画地板
    6. L 50 100 -> 往上画左墙壁
    7. L 30 100 -> 往外挑出左屋檐
    8. Z -> 闭合连回顶点
  -->
  <path d="M 100 30 L 170 100 L 150 100 L 150 170 L 50 170 L 50 100 L 30 100 Z" 
        fill="#E06C75" stroke="#ABB2BF" stroke-width="4" stroke-linejoin="round" />
</svg>
```

**【前端直接渲染效果】**
<svg width="200" height="200" style="background: #282c34; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 100 30 L 170 100 L 150 100 L 150 170 L 50 170 L 50 100 L 30 100 Z" 
        fill="#E06C75" stroke="#ABB2BF" stroke-width="4" stroke-linejoin="round" />
</svg>

哇！这简直是在用代码写生！

### 3.2 贝塞尔曲线 (C/Q) 和 圆弧 (A)

直线太生硬了，我们需要优美的曲线。这时候你需要了解贝塞尔曲线。
- `C x1 y1, x2 y2, x y` (三次贝塞尔曲线)：需要两个控制点。
- `Q x1 y1, x y` (二次贝塞尔曲线)：只需要一个控制点。
- `A rx ry x-axis-rotation large-arc-flag sweep-flag x y` (圆弧)：这个参数极其复杂。

我们用 `Q`（二次贝塞尔）画一片叶子：
```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <!--
    M 50 150: 起点在左下
    Q 50 50, 150 50: 控制点在左上 (50,50)，终点在右上 (150,50)
    Q 150 150, 50 150: 控制点在右下 (150,150)，终点回起点 (50,150)
  -->
  <path d="M 50 150 Q 50 50, 150 50 Q 150 150, 50 150" 
        fill="#98C379" stroke="#3E4451" stroke-width="4" />
</svg>
```

**【前端直接渲染效果】**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 50 150 Q 50 50, 150 50 Q 150 150, 50 150" 
        fill="#98C379" stroke="#3E4451" stroke-width="4" />
</svg>

### 3.3 实战：画一个完整的 Logo

结合前面的路径、图形和变换（Transform），我们来看一个稍复杂的实战：画出我们网站的精美 Logo！

```html
<svg width="120" height="120" viewBox="0 0 120 120" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 主连接线 (贝塞尔曲线) -->
  <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"></path>
  
  <!-- 橙色中心模块 -->
  <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="#1e293b" stroke-width="3"></rect>
  
  <!-- 两端的蓝色节点 -->
  <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  
  <!-- 鼠标指针图标 (组合与旋转) -->
  <g transform="translate(68, 48) scale(2.4) rotate(-8)">
    <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="#1e293b" stroke-width="1.8" stroke-linejoin="round"></path>
  </g>
</svg>
```

**【前端直接渲染效果】**
<svg width="120" height="120" viewBox="0 0 120 120" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"></path>
  <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="#1e293b" stroke-width="3"></rect>
  <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <g transform="translate(68, 48) scale(2.4) rotate(-8)">
    <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="#1e293b" stroke-width="1.8" stroke-linejoin="round"></path>
  </g>
</svg>

当你掌握了 Path 和组合，你就像掌握了魔法，可以在浏览器里凭空变出任何东西！

<div align="center">
  <img src="/content/images/mind-blown.gif" alt="SVG Magic" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

---

## 第四章：SVG 的宇宙坐标系 —— viewBox 彻底图解

如果你曾经尝试把一段别人写好的 SVG 代码复制到自己的项目中，你可能会发现：**怎么图形变得超级大？怎么图形被切掉了一半？怎么全都不见了？**
这一切的罪魁祸首，都是因为你不懂 SVG 的坐标系，尤其是 `viewBox` 这个史诗级的属性。

### 4.1 width/height vs viewBox

在最外层的 `<svg>` 标签上，我们通常会写 `width` 和 `height`。这代表的是 SVG 在浏览器页面里占据的**物理空间（视口Viewport）**。
你可以把它想象成你家窗户的大小。

而 `viewBox="min-x min-y width height"` 则代表了 SVG 内部的**虚拟宇宙坐标系**。
你可以把它想象成你通过窗户看向外面的风景的缩放比例和视野范围。

```html
<!-- 物理空间是 200x200，但内部坐标系被映射到了 0 到 100 -->
<svg width="200" height="200" viewBox="0 0 100 100" style="background: #e2e8f0; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 在这个内部坐标系中，画一个长宽 50 的矩形 -->
  <!-- 因为内部最大坐标是 100，所以这个矩形会占据物理窗口的一半！ -->
  <rect x="0" y="0" width="50" height="50" fill="#3b82f6" />
</svg>
```

**【前端直接渲染效果】**
<svg width="200" height="200" viewBox="0 0 100 100" style="background: #e2e8f0; border-radius: 12px; display: block; margin: 20px auto;">
  <rect x="0" y="0" width="50" height="50" fill="#3b82f6" />
</svg>

看到了吗？虽然我们给 `rect` 设置的宽度是 50，但它在视觉上占据了 100 像素！这就是 `viewBox` 缩放的魔法。掌握了它，你的图标就能做到**真正的响应式**。

---

## 第五章：代码复用大师 —— `<g>`、`<defs>` 与 `<use>`

在写 HTML 时，我们会把重复的代码抽离成组件。在 SVG 中，同样有代码复用的机制。不要再复制粘贴一长串的 `<path>` 了！

### 5.1 `<g>` 分组标签

`<g>` 代表 Group（分组）。它不仅能让代码更整洁，更重要的是，你可以把变换（`transform`）、颜色、透明度等属性应用在整个组上。刚才画 Logo 的时候，我们就用 `<g>` 统一给指针图标加了旋转和缩放。

### 5.2 `<defs>` 与 `<use>`：SVG 里的“组件化”

`<defs>` (Definitions) 就像是一个仓库。你放在里面的任何图形都不会被直接渲染出来，直到你用 `<use>` 把它们“召唤”出来。

这在画重复图案（比如网格、星空、树林）时简直是神器！

```html
<svg width="300" height="150" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 定义一个星星组件 -->
  <defs>
    <g id="star">
      <polygon points="10,0 13,7 20,7 15,12 17,20 10,15 3,20 5,12 0,7 7,7" fill="#FCD34D" />
    </g>
  </defs>

  <!-- 疯狂召唤星星，并且放置在不同的位置 -->
  <use href="#star" x="30" y="30" transform="scale(1.5)" />
  <use href="#star" x="100" y="80" transform="scale(0.8)" />
  <use href="#star" x="150" y="20" transform="scale(2)" />
  <use href="#star" x="220" y="60" transform="scale(1.2)" />
  <use href="#star" x="260" y="100" />
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="150" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <g id="star">
      <polygon points="10,0 13,7 20,7 15,12 17,20 10,15 3,20 5,12 0,7 7,7" fill="#FCD34D" />
    </g>
  </defs>
  <use href="#star" x="30" y="30" transform="scale(1.5)" />
  <use href="#star" x="100" y="80" transform="scale(0.8)" />
  <use href="#star" x="150" y="20" transform="scale(2)" />
  <use href="#star" x="220" y="60" transform="scale(1.2)" />
  <use href="#star" x="260" y="100" />
</svg>

这不仅减少了海量代码，还极大优化了渲染性能！

---

## 第六章：文本的艺术 —— `<text>` 与 `<textPath>`

你以为 SVG 只能画几何图形吗？错！SVG 对文本的支持强大到令人发指。它渲染的文本不仅能被搜索引擎爬取，能被用户选中复制，而且支持各种骚操作。

### 6.1 基础文本渲染

```html
<svg width="300" height="100" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 注意：文本的 y 坐标是文字的基线(baseline) -->
  <text x="150" y="55" font-size="32" font-family="sans-serif" font-weight="bold" fill="#ec4899" text-anchor="middle">
    Hello SVG Text!
  </text>
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="100" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <text x="150" y="55" font-size="32" font-family="sans-serif" font-weight="bold" fill="#ec4899" text-anchor="middle">
    Hello SVG Text!
  </text>
</svg>

### 6.2 路径排版文本 (Text on Path)

这是 SVG 独步武林的一项绝技！你可以让文字沿着任意复杂的 `<path>` 路径进行排版，这在 CSS 里面极其难以实现，而在 SVG 中只需两行代码！

```html
<svg width="300" height="150" style="background: #1e293b; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <!-- 定义一条曲线路径，并给它一个 ID -->
    <path id="curve" d="M 30 100 Q 150 20, 270 100" fill="transparent" stroke="#334155" />
  </defs>
  
  <!-- 把曲线画出来，方便你看到路径 -->
  <use href="#curve" />
  
  <!-- 让文字沿着曲线排布 -->
  <text font-size="18" fill="#38bdf8" font-weight="bold">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      跟着曲线起伏的性感文字
    </textPath>
  </text>
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="150" style="background: #1e293b; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <path id="curve" d="M 30 100 Q 150 20, 270 100" fill="transparent" stroke="#334155" />
  </defs>
  <use href="#curve" />
  <text font-size="18" fill="#38bdf8" font-weight="bold">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      跟着曲线起伏的性感文字
    </textPath>
  </text>
</svg>

---

## 第七章：色彩与质感 —— 渐变（Gradients）与滤镜（Filters）

只有纯色填充的 SVG 是没有灵魂的，现代网页设计要求质感、阴影、渐变。这些在 SVG 里都可以完美实现。

### 7.1 线性渐变 `<linearGradient>`

和组件类似，渐变也需要定义在 `<defs>` 标签里，然后再通过 `url(#id)` 的方式应用到图形上。

```html
<svg width="300" height="120" style="background: #f8fafc; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  
  <!-- 将渐变应用到圆角矩形的 fill 属性上 -->
  <rect x="20" y="20" width="260" height="80" rx="40" fill="url(#cyberGradient)" />
  
  <text x="150" y="65" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Cyberpunk Gradient
  </text>
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="120" style="background: #f8fafc; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="260" height="80" rx="40" fill="url(#cyberGradient)" />
  <text x="150" y="65" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Cyberpunk Gradient
  </text>
</svg>

### 7.2 高级发光滤镜 `<filter>`

这里是真正的高端局。我们使用 `<feGaussianBlur>` 和 `<feMerge>` 来实现炫酷的霓虹发光效果！

```html
<svg width="300" height="150" style="background: #0f172a; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <!-- 定义发光滤镜 -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <!-- 对图形进行高斯模糊 -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
      
      <!-- 把原图和模糊结果合并在一起 -->
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <!-- 画一个发光的文本 -->
  <text x="150" y="85" font-size="36" font-weight="900" font-family="monospace" fill="#22d3ee" text-anchor="middle" filter="url(#neonGlow)">
    NEON
  </text>
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="150" style="background: #0f172a; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <text x="150" y="85" font-size="36" font-weight="900" font-family="monospace" fill="#22d3ee" text-anchor="middle" filter="url(#neonGlow)">
    NEON
  </text>
</svg>


---

## 第八章：让 SVG 活起来 —— SMIL 动画进阶

如果你觉得 CSS 动画不够用，SVG 原生内置的 SMIL（Synchronized Multimedia Integration Language）绝对会震撼你。

### 8.1 基础属性动画

来看个例子，我们画一个太阳，不仅会自动旋转，当鼠标放上去时还会变色！这次我们直接使用 SVG 原生的 `<animateTransform>` 和 `<set>` 标签，不需要写任何 CSS：

```html
<svg width="200" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <g>
    <path d="M 100 20 L 100 180 M 20 100 L 180 100 M 45 45 L 155 155 M 45 155 L 155 45" 
          stroke="#FFD700" stroke-width="8" stroke-linecap="round" />
    <circle cx="100" cy="100" r="40" fill="#FFD700">
      <set attributeName="fill" to="#FF4500" begin="mouseover" end="mouseout" />
    </circle>
    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
  </g>
</svg>
```

**【前端直接渲染效果 (鼠标悬停在太阳中心看看)】**
<svg width="200" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <g>
    <path d="M 100 20 L 100 180 M 20 100 L 180 100 M 45 45 L 155 155 M 45 155 L 155 45" 
          stroke="#FFD700" stroke-width="8" stroke-linecap="round" />
    <circle cx="100" cy="100" r="40" fill="#FFD700">
      <set attributeName="fill" to="#FF4500" begin="mouseover" end="mouseout" />
    </circle>
    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
  </g>
</svg>

太酷了不是吗？！完全不依赖任何外部 JS 库或 CSS 样式表，直接在 SVG 内部实现了复杂的交互状态。

### 8.2 终极装X技巧：描边动画 (Stroke Dasharray Animation)

要说 SVG 动画里最经典的，绝对是“描边动画”。它能实现一种“线条正在慢慢画出来”的极具科技感的效果。

核心原理就两个属性：
- `stroke-dasharray`: 把实线变成虚线。如果你把它设置得非常大，大到覆盖整条路径，那它就是一条全长的实线加一段全长的空白。
- `stroke-dashoffset`: 改变虚线的起始偏移量。通过动态改变这个偏移，就能形成绘制动画。

```html
<svg width="300" height="150" style="background: #000; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 一条性感的正弦曲线 -->
  <path d="M 20 75 Q 70 20, 150 75 T 280 75" fill="transparent" stroke="#00FFFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600">
    <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
  </path>
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="150" style="background: #000; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 20 75 Q 70 20, 150 75 T 280 75" fill="transparent" stroke="#00FFFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600">
    <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
  </path>
</svg>

### 8.3 路径运动动画 `<animateMotion>`

如果你想让一个物体沿着特定的轨迹运动，在以前你可能需要写几百行的 JS 计算物理运动。但是在 SVG 中，一行 `<animateMotion>` 就能搞定！

```html
<svg width="300" height="150" style="background: #f0fdf4; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 画出运动轨迹作为参考 -->
  <path id="motionPath" d="M 20 75 Q 150 -50, 280 75 Q 150 200, 20 75" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />
  
  <!-- 这个圆点将沿着轨迹运动 -->
  <circle r="8" fill="#10b981">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath" />
    </animateMotion>
  </circle>
</svg>
```

**【前端直接渲染效果】**
<svg width="300" height="150" style="background: #f0fdf4; border-radius: 12px; display: block; margin: 20px auto;">
  <path id="motionPath" d="M 20 75 Q 150 -50, 280 75 Q 150 200, 20 75" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />
  <circle r="8" fill="#10b981">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath" />
    </animateMotion>
  </circle>
</svg>


---

## 第九章：总结 —— 掌握矢量魔法

从简单的空白画布，到复杂的贝塞尔曲线；从静态的颜色填充，到酷炫的霓虹发光；从单调的形状，到无限循环的 SMIL 原生动画……如果你从头到尾认真阅读并实践了这篇文章的所有代码，毫无疑问，你已经跨越了“看不懂 SVG 火星文”的恐惧阶段。

你看，这一切的交互效果、绘制动画、光影滤镜，都没有离开最原生的 DOM API 和最基础的数学矩阵计算。抛弃那些动辄几十上百 KB 的第三方动画库吧！深入了解 SVG 的底层逻辑，你一个人就能在浏览器里纯手撸出一个小型的 Figma。

去尝试吧，你绝对会为原生 Web 技术的强大而感到深深的震撼。

<div align="center">
  <img src="/content/images/cat-typing.gif" alt="Crazy Coding" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>
