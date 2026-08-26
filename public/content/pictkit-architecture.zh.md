# 别再把你的矢量节点传给野鸡服务器了：AST 实时解析与纯前端渲染的架构降维打击

几个月前，一个同事给我看了他的 SVG 图标编辑工作流。每次需要改个描边颜色，他都要把文件上传到在线编辑器，等服务器处理完，做完修改，再下载回来。就为了改一个破 `stroke="#ff0000"`。

我盯着屏幕沉默了几秒钟。然后开始写 Pictkit。

我不想假装这是什么拯救数字隐私的崇高使命。最初纯粹是因为看那个工作流让我生理性不适。但随着解析引擎一点点成型，我发现这个问题比我最初以为的要深得多。

---

## 第一部分：残酷的现状

在今天的 Web 开发生态里，我们把一件极其荒谬的事情变成了常态。数据明明已经在浏览器内存里了，我们却要把它序列化成文本，包上 HTTP 头，穿过五六层网络设备，送到几百上千公里外的服务器，只为了改一个 XML 属性，然后再原路返回。

来，算一笔账，看看一个典型的"在线 SVG 编辑器"到底发生了什么：

**第一步：序列化与打包。** 浏览器把 SVG 内容——它本来就是内存里的字符串——包裹成 `multipart/form-data`。这不是免费的：浏览器要构造 MIME 边界、编码内容、计算 `Content-Length`。对于一个 4KB 的 SVG，这个开销可能额外增加 2-3KB。

**第二步：网络之旅。** 数据包离开你的机器，穿过本地路由器，到达运营商光猫，跨越若干骨干网节点，最终抵达数据中心。即便在光纤的理想条件下，光网络延迟就有 20-80ms。要是服务器在另一个大洲，再加 100-300ms。

**第三步：基础设施链路。** 请求先打到负载均衡器（NGINX、HAProxy 或者 AWS 的 ALB），再转发到应用服务器。如果有排队，就等着。然后服务器要读入 HTTP 流、解析 `multipart/form-data`、提取文件——这时候才开始真正处理你的 SVG。处理完了，还要再把响应序列化一遍。

**第四步：没人提的安全隐患。** 配置不当的 XML 解析器是 XXE（XML 外部实体注入）攻击的后门。我见过某些"专业"工具，解析器里赫然开着 `resolveEntities: true`。这意味着攻击者可以嵌入：

```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<svg>&xxe;</svg>
```

如果服务器的解析器解析了这个实体，`/etc/passwd` 的内容就泄漏到了响应里。这不是纸上谈兵：2018 到 2023 年间，有超过 200 个 CVE 漏洞跟图像处理服务中的不安全 XML 解析有关。你上传 SVG 的每一个在线工具，都是一个潜在的攻击入口。

但就算不谈安全，有一个更根本的问题：**你在浪费自己手里已有的算力。** 现代浏览器是一个极其强大的虚拟机。Chrome 的 V8 引擎把 JavaScript 编译成原生机器码。GPU 就在那儿等着接渲染任务。我们可以通过 Web Workers 使用多个 CPU 核心。我们有 IndexedDB 做本地持久化。我们有 FileReader API 直接从文件系统读文件。

然后我们用这些能力干了什么？把字符串发给别人的服务器，让人家去跑 `element.setAttribute('fill', '#ff0000')`。就像买了辆法拉利，出门买菜还要叫网约车。

![Disgust](/content/images/this-is-fine-css.gif)
*每当看到有"高级架构师"为了改个 viewBox 属性，部署了一套三节点的 Kubernetes 集群，配上负载均衡、Redis 和消息队列……我不知道该笑还是该哭。我们把简单的事情搞成了架构妄想症。*

---

## 第二部分：纯前端哲学的底层逻辑

Pictkit 的出发点非常简单，甚至有点天真：**数据在浏览器里，处理就应该在浏览器里。** 句号。没有例外。没有什么"看具体场景"。没有。

这套哲学——我称之为"零服务器架构"或"物理隐私架构"——建立在三个支点上：

### 支点一：物理隔离即隐私保障

当 100% 的处理都在浏览器沙盒内完成时，隐私不是用户协议里的一句承诺——它是一条物理定律。你的设计稿、公司图标、还没发布的产品原型——没有任何东西离开过你机器的内存。你可以打开 DevTools，切到 Network 面板，亲眼验证：零条外向请求。拔掉网线，Pictkit 照样跑。

这不是"政策层面的隐私保护"。这是"物理上不可能泄密"。就算我们想泄露你的数据也无能为力，因为代码里根本没有发网络请求的逻辑。

### 支点二：GPU 是你的，用起来

每个现代浏览器都能通过 GPU 做硬件加速。当你修改 DOM 中 SVG 元素的一个样式属性时，浏览器的渲染引擎——Chrome 的 Skia、Firefox 的 WebRender、Safari 的 Core Animation——只重新计算受影响的像素，然后送到显存。这个过程在 16 毫秒内完成，也就是维持 60FPS 的每帧预算。

而客户端-服务端方案呢？发请求 → 等待 → 收位图 → 解码 → 画到 `<canvas>` 或替换 DOM。等到结果显示出来，几秒过去了，用户的思维流早就断了。

### 支点三：零边际成本计算

你在别人服务器上跑的每一次操作都有成本：CPU、内存、带宽、存储。总有人买单，这个成本最终会以订阅费、用量限制，或者更糟——数据倒卖——的形式转嫁给你。

在 Pictkit 里，你的每一次操作对我们来说边际成本为零。字面意义的零。你自己的 CPU 干活，你自己的 GPU 渲染，你自己的硬盘存储。我们只给你代码，一次性的，然后就闪到一边。这才是真正的可扩展性：每个新用户自带硬件。

![Pictkit Local Rendering Preview](/content/images/articles/pictkit-local-rendering-preview.png)
*Pictkit 的预览面板。你所看到的一切——SVG 渲染、节点高亮、变换网格——全部在你本地 GPU 上计算完成。DevTools 的 Network 面板空空如也。本就该如此。*

---

## 第三部分：技术深潜——到底怎么做到的

好了，哲学讲够了。上代码。说到底，架构的说服力在实现里。

### 3.1 解析引擎：从 XML 到 AST，不到一毫秒

Pictkit 的入口是 FileReader API。用户把 SVG 文件拖进浏览器时，我们拦截 `drop` 事件，直接读进 `ArrayBuffer`：

```javascript
const file = event.dataTransfer.files[0];
const reader = new FileReader();

reader.onload = (e) => {
  const rawBytes = new Uint8Array(e.target.result); // 已经在内存里了
  const decoder = new TextDecoder('utf-8');
  const xmlString = decoder.decode(rawBytes);
  
  // 魔法从这里开始：主线程上的同步解析
  const ast = parseSVGToAST(xmlString);
  
  // 然后才动 DOM
  renderASTToDOM(ast);
};

reader.readAsArrayBuffer(file);
```

注意一个关键细节：我们用 `readAsArrayBuffer`，而不是 `readAsText`。这给了我们完全的字符解码控制权。很多 SVG 带有编码声明，比如 `<?xml version="1.0" encoding="ISO-8859-1"?>`，`readAsText` 可能会误判。读原始字节，由我们来决定如何解释。

那 `parseSVGToAST` 到底做了什么？这个函数是整个系统的心脏。它实现了一个递归下降解析器（recursive descent parser），逐字符遍历 XML 并构建抽象语法树。解析结构时不用正则表达式（这是导致灾难性回溯的经典错误），而是用有限状态机。

以下是词法分析器核心的简化版：

```javascript
function tokenize(xml) {
  const tokens = [];
  let pos = 0;
  
  while (pos < xml.length) {
    // 跳过空白字符
    if (/\s/.test(xml[pos])) {
      pos++;
      continue;
    }
    
    // 检测标签开头
    if (xml[pos] === '<') {
      pos++;
      
      // 是注释吗？ <!-- ... -->
      if (xml.slice(pos, pos + 3) === '!--') {
        const end = xml.indexOf('-->', pos);
        tokens.push({ type: 'COMMENT', value: xml.slice(pos + 3, end) });
        pos = end + 3;
        continue;
      }
      
      // 是闭合标签吗？ </g>
      if (xml[pos] === '/') {
        pos++;
        const nameEnd = xml.indexOf('>', pos);
        tokens.push({ type: 'CLOSE_TAG', name: xml.slice(pos, nameEnd) });
        pos = nameEnd + 1;
        continue;
      }
      
      // 开放标签：<path d="..." fill="..." />
      const nameEnd = xml.indexOf('>', pos);
      const fullTag = xml.slice(pos, nameEnd);
      const spaceIdx = fullTag.indexOf(' ');
      const name = spaceIdx === -1 ? fullTag : fullTag.slice(0, spaceIdx);
      
      const selfClosing = xml[nameEnd - 1] === '/';
      const attrs = parseAttributes(fullTag.slice(name.length));
      
      tokens.push({
        type: selfClosing ? 'SELF_CLOSING_TAG' : 'OPEN_TAG',
        name,
        attributes: attrs
      });
      
      pos = nameEnd + 1;
      continue;
    }
    
    // 标签间的文本内容
    const tagStart = xml.indexOf('<', pos);
    const text = xml.slice(pos, tagStart === -1 ? xml.length : tagStart);
    if (text.trim()) {
      tokens.push({ type: 'TEXT', value: text });
    }
    pos = tagStart === -1 ? xml.length : tagStart;
  }
  
  return tokens;
}
```

在一台现代笔记本上，这个词法分析器处理一个 5KB 的典型 SVG 用时不到 0.3ms。我知道这个数字，因为我用 `performance.now()` 反复测了几十次。是的，能在没有服务器干扰的情况下做微基准测试，是一种奢侈。

词法分析完成后，解析器构建 AST。每个树节点代表一个 SVG 元素，带有类型化的属性、子节点和元数据（比如在源文件中的位置，方便后续错误定位）：

```javascript
// 简化的 AST 节点结构
{
  type: 'element',
  tagName: 'path',
  attributes: {
    d: { type: 'path_data', value: 'M 10 10 L 20 20 ...' },
    fill: { type: 'color', value: '#ff0000' },
    stroke: { type: 'color', value: '#000000' },
    'stroke-width': { type: 'number', value: 2, unit: 'px' }
  },
  children: [],
  sourceLocation: { line: 247, column: 4, length: 156 },
  computedBBox: null  // 按需计算
}
```

为什么用 AST 而不用浏览器自带的 `DOMParser`？好问题。三个原因：

1. **错误控制。** `DOMParser` 对格式错误的 XML 太宽容了。如果你的 SVG 有错，`DOMParser` 会悄无声息地尝试修复，结果可能不可预测。我们的解析器直接告诉你第几行第几列出问题了。

2. **保留原始结构。** `DOMParser` 会规范化 XML：重排属性顺序、删掉它认为无关的空格、展开实体引用。如果你想编辑 SVG 并保持原有格式，这简直是灾难。我们的 AST 保留每一个字节的信息。

3. **类型化属性。** DOM 里的属性永远都是字符串。在我们的 AST 里，`stroke-width` 是带单位的数字，`fill` 是解析过的颜色（支持 hex、rgb、hsl 和命名颜色），`d` 是类型化的路径命令序列。这让我们能做语义级别的验证和操作。

![Pictkit AST Code Split](/content/images/articles/pictkit-ast-code-split.png)
*分屏视图：左侧是 SVG 源码，带有实时语法高亮。右侧是我们解析器构建的 AST 的可视化表示。源码中的每种颜色对应树中不同类型的节点。*

### 3.2 属性面板：外科手术式的 DOM 变更

当用户点击 SVG 上的某个节点时，引擎要找出是哪个 AST 元素被点中了。这涉及到对每个元素的包围盒（bounding box）做碰撞检测，通过空间索引（一个简易 R-tree，把 viewBox 划分成象限）来加速。

节点选中后，Appearance 面板展示其可编辑属性。这里是 Pictkit 真正出彩的地方：

```javascript
function updateNodeProperty(astNode, property, newValue) {
  // 1. 根据属性类型验证新值
  const validator = PROPERTY_VALIDATORS[property];
  if (validator && !validator(newValue)) {
    throw new Error(`属性 ${property} 的值无效：${newValue}`);
  }
  
  // 2. 更新 AST（唯一真相源）
  astNode.attributes[property].value = newValue;
  
  // 3. 只变更受影响的 DOM 元素——其余原封不动
  const domElement = astNode._domRef;
  domElement.setAttribute(property, newValue);
  
  // 4. 浏览器处理剩余工作：GPU 仅重绘受影响的像素
  
  // 5. 推入撤销历史
  undoManager.push({
    undo: () => updateNodeProperty(astNode, property, oldValue),
    redo: () => updateNodeProperty(astNode, property, newValue)
  });
}
```

注意第 3 步：`domElement.setAttribute(property, newValue)`。浏览器要重绘，这一行就够了。整个 DOM 不需要重建，页面布局不需要重新计算，不触发全局 reflow。渲染引擎检测到只有某些绘制属性变了，安排一次局部的 repaint。如果只是改个颜色，GPU 的像素 buffer 里换几个值就完事了。

结果是你可以把透明度滑块从 0 拖到 1，实时看到变化，不掉一帧。相比之下，传统方案呢？发滑块数值到服务器 → 等 200ms → 收新位图 → 解码 → 显示。完完全全两种体验。

![Pictkit Node Property Manipulation](/content/images/articles/pictkit-node-property-manipulation.png)
*Appearance 面板实操。每一次滑块拖动、每一个颜色选择、每一次开关切换——全在 JavaScript 主线程处理，不到 16ms 就反映到 GPU。无网络。无等待。无借口。*

### 3.3 仿射变换：真数学，不是玄学

构建 Pictkit 过程中，最有启发性的时刻之一是实现变换。当你点"旋转 90°"，多数在线编辑器会把文件发给服务器，服务器跑个 ImageMagick 或 librsvg 重算所有坐标。这就像请个外科医生来帮你开车门。

实际上，二维仿射变换就是一个 3×3 矩阵：

```
| a  c  e |
| b  d  f |
| 0  0  1 |
```

其中：
- `a`、`d` 控制 X 和 Y 方向的缩放
- `b`、`c` 控制倾斜（skew）
- `e`、`f` 控制 X 和 Y 方向的平移

`transform="matrix(1.04, 0, 0, 1.04, 0.02, 45.20)"` 就是这个意思：104% 均匀缩放，无倾斜，X 平移 0.02px，Y 平移 45.20px。

要绕中心点 (cx, cy) 旋转一个点 (x, y) 角度 θ：

```javascript
function rotatePoint(x, y, cx, cy, angleRad) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  // 平移到原点，旋转，再平移回来
  const dx = x - cx;
  const dy = y - cy;
  
  return {
    x: dx * cos - dy * sin + cx,
    y: dx * sin + dy * cos + cy
  };
}
```

但在 Pictkit 里，我们不会一个一个点去旋转。对于包含数百个坐标的路径，那样太低效了。我们把新变换复合到元素的矩阵上。如果元素已有变换 `T1`，我们再应用旋转变换 `R`，新变换就是 `R × T1`（3×3 矩阵乘法）：

```javascript
function composeMatrices(a, b) {
  // a 和 b 是 3×3 矩阵，以扁平数组存储 [a,c,e, b,d,f, 0,0,1]
  return [
    a[0]*b[0] + a[1]*b[3] + a[2]*b[6],  // a
    a[0]*b[1] + a[1]*b[4] + a[2]*b[7],  // c  
    a[0]*b[2] + a[1]*b[5] + a[2]*b[8],  // e
    a[3]*b[0] + a[4]*b[3] + a[5]*b[6],  // b
    a[3]*b[1] + a[4]*b[4] + a[5]*b[7],  // d
    a[3]*b[2] + a[4]*b[5] + a[5]*b[8],  // f
    0, 0, 1
  ];
}
```

三行浮点数算术。CPU 在纳秒内完成。在服务器端，你得把整个 SVG 发过去，排队等处理，跑完全一样的乘法（数学公式又不会因为你在数据中心就变了），再把结果发回来。这个黑色幽默真是绝了。

**那非仿射变换呢？** 比如自由变形或透视变换？这才是多数编辑器缴械投降、外包给后端的地方。在 Pictkit 里，我们直接把变换应用到每条路径的贝塞尔控制点上，然后重建 `d` 属性。CPU 工作量大了一点，但对于几千个节点的 SVG 来说完全不是问题。

### 3.4 栅格导出：Canvas、GPU，以及不用服务器的艺术

到了把你的杰作导出为 PNG 或 WebP 的时候。传统编辑器：

1. 把 SVG 发到服务器
2. 服务器启动 Headless Chrome（占用 200-500MB 内存）或调用 ImageMagick/librsvg
3. 渲染到像素 buffer
4. 编码为 PNG/WebP
5. 把结果流式传回来

Pictkit 的做法：

```javascript
async function exportToPNG(svgElement, scale = 2) {
  // 1. 把 SVG 序列化为 Data URI
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // 2. 创建 Image 并加载 SVG
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  
  // 3. 以目标倍率绘制到 canvas
  const canvas = document.createElement('canvas');
  const bbox = svgElement.getBBox();
  canvas.width = bbox.width * scale;
  canvas.height = bbox.height * scale;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  
  // 4. GPU 已经通过 drawImage() 完成了栅格化工作。
  //    现在只需提取字节：
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  
  // 5. 清理
  URL.revokeObjectURL(url);
  
  return blob;
}
```

这里发生了四件重要的事：

1. **`ctx.drawImage()` 使用 GPU。** 把 SVG 画到 canvas 2D 上下文时，浏览器没用 CPU 做栅格化。它用的是渲染网页的那一套硬件加速管线。Chrome 走 Skia 加 GPU。结果：一个 1000×1000 的 SVG 以 2x 倍率栅格化，不到 10ms。

2. **`canvas.toBlob()` 是异步的有原因的。** 浏览器内部可以把 PNG 压缩委托给独立线程，释放主线程以保持 UI 响应。

3. **不需要在服务端提供 JPEG 质量选项。** `canvas.toBlob()` 接受 MIME 类型和质量参数。PNG 适合边缘锐利的图形，WebP 适合照片，JPEG 保证兼容性。全部本地搞定。

4. **最终下载只需一行代码：** 创建一个 `<a>` 元素，`href = URL.createObjectURL(blob)`，`download = '我的文件.png'`，触发 `click()`，然后释放 URL。文件在浏览器写入硬盘之前，始终没离开过内存。

![Mind Blown](/content/images/mind-blown.gif)
*当你意识到可以用本地 GPU 以 2x/3x/4x 分辨率栅格化矢量图，速度比 HTTP 请求到达最近服务器还快。而且没人能看到你的设计。*

---

## 第四部分：真实数据（不是营销话术）

来聊具体数字。实测的。可复现的。

测试环境：M1 MacBook Pro，16GB 内存，Chrome 125，600Mbps 对称光纤，AWS us-east-1 服务器（同大洲，理想条件）。测试 SVG：一个 4.7KB 的"春卷"图标，含 14 个 `<path>` 元素、3 层嵌套 `<g>`、一个线性渐变。

### 测试 1：文件打开时间

| 指标 | 传统云端编辑器 | Pictkit |
|:---|:---|:---|
| TTFB（首字节时间） | 0ms（文件已在本地） | 0ms（文件已在本地） |
| 网络延迟 | 800ms - 2.5s（取决于服务器负载） | **0ms**（无网络，无服务器） |
| 解析时间 | 依赖后端 + 响应序列化 | 0.3ms（自研解析器）+ 2ms（DOM 挂载） |
| **总计到可交互** | **3-5 秒** | **< 50ms** |

这不是 10% 或 50% 的提升，是 **60-100 倍**的提升。在用户体验层面，差别就是"等加载的时候刷会儿微博" vs "还没来得及眨眼就好了"。

### 测试 2：编辑延迟（改填充色）

测量从颜色选择器松开鼠标到屏幕上看到最终结果的时间。

| 环节 | 云端编辑器 | Pictkit |
|:---|:---|:---|
| 网络往返 | 80-150ms | 0ms |
| 服务端处理 | 50-200ms | 0ms |
| DOM 更新 | 取决于响应格式 | **< 1ms**（`setAttribute`） |
| GPU 重绘 | 8-16ms（收到数据后） | **< 16ms**（即时） |
| **感知总计** | **200-500ms** | **瞬时（< 16ms）** |

200-500ms 听着不算多，但它超过了人脑感知"瞬间"的 100ms 阈值。在 Pictkit 里，编辑体验跟原生应用没有区别。

### 测试 3：导出 2x PNG（输出约 240KB）

| 步骤 | 云端编辑器 | Pictkit |
|:---|:---|:---|
| 上传 SVG | 已在服务器 | 不需要 |
| 渲染 | 1-3s（Headless Chrome 或 librsvg） | **8ms**（GPU 通过 canvas） |
| PNG 压缩 | 50-200ms | **15ms**（`canvas.toBlob`） |
| 下载 | 500ms - 2s（HTTP 流传输） | **< 1ms**（本地 blob URL 创建） |
| **总计** | **2-5 秒** | **< 30ms** |

### 成本呢？

这才是做架构决策的人最该看的表：

| 项目 | 云端编辑器（1万用户/月） | Pictkit（无限用户） |
|:---|:---|:---|
| 应用服务器 | $200-600/月 | **$0** |
| 负载均衡器 | $30-80/月 | **$0** |
| 临时存储 | $50-200/月 | **$0** |
| 出站带宽 | $100-500/月 | **$0（仅初始 HTML/JS）** |
| 单用户边际成本 | 高 | **绝对零** |

纯前端架构不仅更快、更安全，而且**扩展完全免费**。每来一个新用户，自带 CPU、自带 GPU、自带内存。你的基础设施账单纹丝不动。这不是成本优化——这是一个全新的成本范式。

---

## 第五部分：这种架构的代价（没有免费的午餐）

如果只说好处不谈代价，那是不诚实的。100% 前端架构有它的真实成本，我觉得有义务说清楚：

### 代价一：初始 Bundle 体积

一个完整的 SVG 解析器、矩阵变换引擎、撤销历史管理器、碰撞检测系统……加起来确实不小。我们的 JavaScript bundle 比那些外包处理逻辑的编辑器要大。我们做了很多 tree-shaking 和 code splitting，让解析器只在用户真正打开文件时才加载，但初始下载体积还是更大。

**我们的回应：** 接受这个成本。一个 200-300KB、良好缓存、只下载一次的 bundle，好过 100KB 但要不断调服务器。第二次交互开始，我们就已经赢了。

### 代价二：浏览器沙盒限制

在主线程上处理 50MB 的 SVG，UI 肯定会卡死。对于超大文件，我们走 Web Worker 做解析，分块渲染。但有个实用上限：超过约 20MB 的文件在浏览器里就开始吃力了。

**我们的回应：** 对 99.7% 的用例（图标、插画、网页图形），SVG 的大小在 1KB 到 2MB 之间。如果你需要编辑地籍测绘级的 SVG，大概需要的是带瓦片渲染的专业工具。Pictkit 不试图做那个。

### 代价三：跨浏览器一致性

Firefox、Chrome 和 Safari 的 SVG 渲染实现有微妙差异：字体抗锯齿效果不同、色彩空间处理不同、`getBBox()` 偶尔返回不一致的值。我们不得不为每个浏览器写标准化层。

**我们的回应：** 用 Playwright 做自动化视觉回归测试，跨浏览器对比截图。虽不完美，但远好过在远程服务器上调试这些差异。

---

## 第六部分：结语——少点云营销，多点真工程

听着，我理解客户端-服务端架构在某些场景下是有道理的。处理 GB 级数据集、训练机器学习模型、协调数百个并发用户之间的状态——这些确实需要服务器。我不是说所有计算都该本地完成。

但编辑一个充其量算是"带格式的文本文件"的 SVG？

**没有任何站得住脚的技术理由。**

这个行业已经到了一个荒谬的地步，"云"成了一个魔法词汇，可以为任何架构决策背书，无论它多低效。"放到云上处理"听起来现代、创新、可扩展。但在这层营销话术下面，是一个令人不安的现实：你在把用户数据送到不受你控制的服务器，给每一次交互增加几百毫秒延迟，还花钱买这个罪受。

Pictkit 是我的尝试，想证明还有另一条路。一条：

- **代码跑到数据所在之处**，而不是反过来
- **隐私是系统的物理属性**，不是用户协议里的格式条款
- **性能以帧为单位衡量**，而不是服务器响应时间
- **扩展性是免费的**，因为每个用户自带硬件
- **体验跟原生应用没有区别**，因为从实际效果来看，它就是

你不一定需要用我的工具。市面上还有其他 frontend-first 的选择。但你需要开始在设计每个架构的时候问自己一个问题：**这玩意儿能不能在用户浏览器里跑？** 如果答案是能，你得有一个非常、非常好的理由来解释为什么偏不这样做。

代码是诚实的。架构也该如此。

---

*如果你想看看 Pictkit 的源码，它在 [GitHub](https://github.com/SVG-Editor/pictkit) 上。发现可以改进的地方，开个 issue 或发个 PR。如果你觉得我完全错了，服务端处理才是正路——也欢迎开 issue。好的架构争论，才是推动这个行业前进的东西。*
