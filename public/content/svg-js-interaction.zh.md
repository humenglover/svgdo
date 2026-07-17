---

## SVG 不是图片

很多人习惯把 SVG 当图片用，丢进 img 标签就完事了。但 img 里的 SVG 是死的——你拿不到里面的元素，更别说给 path 绑 click 事件。要让 SVG 活起来，必须把它内联到 HTML 里。

内联之后，SVG 里的每个元素就是一个真实的 DOM 节点。你可以 querySelector 拿到它，可以 addEventListener 给它绑事件，可以 setAttribute 改它的属性。这就是交互的基础。

## 第一步：给元素一个身份证

从网上下载的 SVG、或者设计师从 Figma 导出给你的文件，里面的元素大概率没有 id，有 id 也是 "图层 1 拷贝 3" 这种重名货。真要做交互，第一步就是给每个元素一个唯一标识。

做法是拿到 SVG 之后先走一遍 DOM 树，给每个能交互的元素（path、rect、circle、ellipse、polygon、line 这些）注入一个 data-editor-id。同时顺手把每个元素的属性（fill、stroke、d 之类的）存到一个数组里，后面做属性面板要用。

注意：defs、clipPath、mask 里面的元素不要碰，那些是渲染用的定义，不是用户能操作的图形。g 元素（group）需要算进去，因为很多 SVG 的 transform 是挂在 g 上的，拖拽的时候会用到。

## 第二步：点击选中，说起来容易

内联 SVG 的元素本来就支持 click 事件，直接绑就行。但坑在于事件冒泡。

你点击一条 path，click 事件会先在这条 path 上触发，然后冒泡到它的父级 g，再到更外层的 svg 元素。如果你给 svg 也绑了 click（比如用来取消选择），那用户点中一个元素之后，事件冒泡到 svg 又会触发取消选择，结果就是刚选中立刻被取消。

解决办法是在元素的事件处理函数里调 stopPropagation。别在 svg 层面处理选中逻辑，让每个元素自己决定要不要被选中。

还有一个容易被忽略的问题：stroke 很细的 path（比如线宽 1px）很难点中。解决方案是给选中的元素加一个透明的大热区作为缓冲区，鼠标靠近 10px 以内就算命中。

## 第三步：拖拽，坐标才是爹

拖拽本身不复杂：pointerdown 记录起点，pointermove 算 delta，pointerup 提交结果。复杂的是坐标。

你鼠标在屏幕上的位置是屏幕坐标，但 SVG 元素活在 SVG 坐标系里。这两个坐标系之间的关系取决于 viewBox、当前的缩放比例、父级 group 的 transform。直接把屏幕坐标的 delta 当 SVG 坐标的 delta 用，元素会乱飞。

正确的做法：每次 pointermove 的时候，用 getScreenCTM 拿到当前变换矩阵，把鼠标的屏幕坐标转成 SVG 内部的坐标，再算 delta。

这里还有一个调了很久的地方：嵌套 group。一个 path 可能被套在三四层 g 里面，每层 g 都可能有自己的 transform。用哪个层级的 CTM 做转换？答案是元素直接父级的 CTM。如果元素在某个 g 里面，拿那个 g 的 getScreenCTM，而不是 svg 的。

## 第四步：高亮的三种玩法

**最简单的是改颜色。** 选中一个元素，把它的 stroke 改成蓝色，加个发光，视觉上立刻有反馈。但问题是你取消选择之后改不回来，因为不知道原来的颜色。

**更好的是 CSS filter。** 用 filter: drop-shadow 给选中的元素加一圈光晕，不改原始属性，取消选中把 filter 去掉就行。

**最好的是 overlay 模式。** 在 SVG 上面盖一层绝对定位的 div，选中元素之后在这个 div 里画出虚线矩形框。这层 overlay 不和 SVG 在同一个坐标系里，所以不受缩放影响。需要实时监听 getBoundingClientRect 更新框的位置。

## 第五步：改属性，注意 style 的优先级

选中元素之后用户要改 fill 或者 stroke，你直接 setAttribute 就行了。但 Figma 导出的 SVG 样式多数写在 style 属性里，而 style 的优先级高于 attribute。

所以改之前先检查 style 里有没有同名属性，有的话从 style 里删掉，再 setAttribute。这样改完的属性在 attribute 层面是干净的，下次打开不会有优先级冲突。

## 第六步：做个交互式流程图

有了上面的能力，做交互式流程图就是加业务逻辑。节点是 rect 或 circle，连线是 path。节点拖拽已解决。连线需要跟着节点走，做法是维护一个节点-连线映射表，拖拽结束时重新算 path 的 d 属性。

连线还有个点击问题：stroke-width 1px 的 path 基本点不到。解法是两层 path——一层透明的粗线负责点击，一层可见的细线负责显示。

收尾：这些堆在一起就是一个能用的 SVG 编辑器。svgdo.com 上面的编辑器就是这个思路实现的，开源在 GitHub，拿去直接改就行。
