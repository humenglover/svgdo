---

# SVG + JS 交互：实现可点击、拖拽、高亮的矢量图形

当你接手一个需要做“可交互图形”的需求时，比如一个机房拓扑图、一个剧院选座系统、或者一个简单的在线海报编辑器，你的第一反应是什么？

很多人的第一反应是：上 Canvas，或者干脆引入一堆庞大的第三方图形库（比如 Fabric.js、Konva 等等）。

但实际上，如果你只是想要实现<strong>元素的点击、拖拽和高亮</strong>，原生的 SVG 配合纯纯的 JavaScript 简直是一把极其锋利的快刀。没有沉重的依赖，没有复杂的渲染上下文，因为 SVG 的本质就是 DOM。

今天，咱们就聊聊怎么纯手工撸一个能交互的 SVG 引擎。别慌，逻辑其实特别清晰。

---

## 打破认知：SVG 根本不是图片

我们太习惯于把 SVG 当作图片用了：`<img src="logo.svg" />`。如果你这么干，那这个 SVG 就是死的。浏览器把它当成了一个封闭的像素块，你拿不到里面的任何东西，更别说给某条线绑定一个鼠标点击事件了。

要让 SVG 活起来，第一法则就是：<strong>必须把它内联（Inline）到 HTML 里</strong>。

```html
<div id="editor">
  <svg viewBox="0 0 800 600">
    <circle cx="100" cy="100" r="50" fill="red" />
    <path d="M..." fill="blue" />
  </svg>
</div>
```

一旦你把代码直接嵌到 DOM 树里，魔法就发生了。那个 `<circle>` 和 `<path>` 就和普通的 `<div>` 或 `<button>` 没有任何区别。你可以用 `document.querySelector('circle')` 抓到它，可以用 `addEventListener` 监听它，甚至可以用 CSS 去 hover 它。

这就是我们做交互的唯一基石。

---

## 建立身份系统：给元素发“身份证”

假设你拿到了一份设计师从 Figma 导出的极其复杂的 SVG 文件，几百个路径缠绕在一起。这些元素大概率是没有 `id` 的，就算有，也是像 `Rectangle_12_copy` 这种让人脑溢血的名字。

如果我们要做一个编辑器，用户点击了某个元素，你的代码怎么知道他点的是哪一个？

在把 SVG 丢进容器渲染之前，我们需要写一段简单的遍历脚本，给所有真正可视化的标签（比如 `path`, `rect`, `circle`, `ellipse`, `polygon`, `line`）打上一个独一无二的标记，比如 `data-editor-id`。

![给 SVG 元素自动打上 data-editor-id 标记](/content/images/interaction-code.png)

> <strong>踩坑提示：</strong> 千万别去碰 `<defs>`, `<clipPath>`, `<mask>` 里面的元素。这些是 SVG 的渲染定义层，不是给用户在画布上直接拖拽的实体。另外，`<g>` (Group) 标签必须要小心处理，很多复杂的变形（transform）是挂在组上的，我们拖拽的时候往往是连着整个组一起拖。

---

## 点击选中：那些烦人的冒泡和隐形区域

因为 SVG 元素就是 DOM 节点，给它们绑定点击事件看起来简单得就像喝水：

```javascript
element.addEventListener('pointerdown', (e) => {
  console.log('我被选中了！', e.target);
});
```

但实操的时候，你会立刻踩到两个坑。

<strong>第一个坑是事件冒泡。</strong> 
当你点击一条路径，事件会先在这个 `<path>` 上触发，然后向上传递给它的父级 `<g>`，最后冒泡到最外层的 `<svg>`。通常我们会给 `<svg>` 绑定一个点击事件用来“取消选中”（点空白处取消）。如果不阻止冒泡（`e.stopPropagation()`），用户刚点中元素，事件冒泡到顶层，瞬间又触发了取消选中。你看着屏幕，感觉自己点了个寂寞。

<strong>第二个坑是“细线点不中”。</strong> 
如果有一根 `stroke-width="1"` 的极细的线，用户必须具备狙击手般的鼠标精度才能点到它。在 SVG 里，有一个极其优雅的解决办法：叠加一个完全透明（`stroke="transparent"`）但是极粗（比如 `stroke-width="20"`）的“幽灵路径”，专门用来捕捉鼠标事件。

![SVG 交互机制演示](/content/images/svg-interaction.png)

---

## 拖拽的核心法则：坐标才是亲爹

拖拽的逻辑大家都背得滚瓜烂熟：`pointerdown` 记录起点，`pointermove` 计算偏移量差值（delta），`pointerup` 结束动作。

但是在 SVG 里，如果你直接把鼠标在屏幕上移动的像素差（Screen Coordinate），强行塞给 SVG 元素的 `x` 和 `y` 属性，你会发现元素直接<strong>飞出太阳系</strong>。

为什么？因为屏幕坐标系和 SVG 内部的坐标系是两码事。SVG 有自己的 `viewBox`，你的网页可能被缩放了，而且元素本身可能还嵌套在好几层带有 `transform: scale(0.5)` 的 `<g>` 分组里。

<strong>唯一的正解是使用 `getScreenCTM()`。</strong> 

这是 SVG 提供的原生方法，全称是 Current Transform Matrix。通过拿到元素与其父级之间的坐标变换矩阵，你可以将鼠标的“屏幕移动量”完美映射成“SVG 内部坐标的移动量”。

```javascript
// 获取当前元素的变换矩阵
const ctm = element.getScreenCTM();
// 将屏幕移动量转换为 SVG 坐标系的真实移动量
const svgDx = screenDx / ctm.a;
const svgDy = screenDy / ctm.d;
```

这就是我们在开发 [SVG do.](/zh) 时最核心的拖拽引擎逻辑。只要矩阵算得对，不管你怎么嵌套，怎么缩放画布，元素都会死死粘着你的鼠标走。

---

## 高亮状态的优雅实现

当用户选中一个元素时，视觉上总得给点反馈吧？

![SVG 选中与高亮机制演示](/content/images/clean-highlight-demo.png)

最粗暴的做法是直接把它的 `stroke`（描边）改成亮蓝色。但这会破坏设计师原本的颜色，而且你还得费劲去记住它原来的颜色以便恢复。

<strong>更优雅的做法是：绘制包围盒（Bounding Box）。</strong>

SVG 提供了一个极其强大的 API：`getBoundingClientRect()`。当你选中元素后，动态生成一个没有任何填充色、只有亮蓝色描边的 `<rect>` 元素，盖在原有元素的最顶层即可。你甚至可以在这个包围盒的四个角画上四个小圆点，这就成了最经典的缩放控制柄。

## 结语

看到了吗？所有的交互其实都没有脱离最基础的 DOM API 和数学矩阵。抛弃那些沉重的第三方库，深入理解 SVG 的底层逻辑，你甚至可以一个人在浏览器里手搓出一个迷你的 Figma。去试试吧，你一定会惊叹于原生技术的强大。
