---

## SVG Is Not an Image

![Article Illustration](https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80)

Too many people treat SVG as an image, dropping it into an img tag and calling it a day. But an SVG inside an img is dead. You can't access its elements, let alone attach a click handler to a path. To bring an SVG to life, you need it inline in the HTML.

Once inline, every SVG element is a real DOM node. You can querySelector it, addEventListener on it, setAttribute on it. That's your foundation for interaction.

## Step 1: Give Every Element an ID

SVGs you download or receive from a designer typically have no IDs, or worse, IDs like "Layer 1 copy 3" that repeat everywhere. Before any interaction, give each element a unique identifier.

Parse the SVG, walk the DOM tree, inject a data-editor-id onto every renderable element (path, rect, circle, ellipse, polygon, line, and g). At the same time, collect each element's attributes (fill, stroke, d) into an array for the properties panel later.

Don't touch elements inside defs, clipPath, or mask — those are rendering definitions, not user-manipulable shapes. Include g elements though. Many SVGs attach transform to g rather than individual shapes. Without tracking g, dragging breaks.

## Step 2: Click to Select, Harder Than You'd Think

Inline SVG elements support click events natively. Just attach a handler. The trap is event bubbling.

Click a path, and the event fires on the path first, then bubbles to its parent g, then to the outer svg. If you also attached a click handler to the svg for deselection, the path click bubbles up and immediately deselects what you just selected.

Fix: call stopPropagation in the element handler. Don't put selection logic at the svg level. Let each element decide whether it gets selected.

Also: thin paths are hard to click. A path with stroke-width of 1 is almost impossible to hit reliably. Add an invisible buffer zone around selected elements — about 10px.

## Step 3: Dragging Is All About Coordinates

Drag mechanics are straightforward: pointerdown records the start, pointermove calculates the delta, pointerup commits. The hard part is coordinates.

Your mouse position is in screen space. SVG elements live in SVG coordinate space. The relationship depends on the viewBox, current zoom level, and every parent group's transform. Use raw screen deltas as SVG deltas, and elements fly off in random directions.

The fix: on every pointermove, call getScreenCTM to get the current transformation matrix, convert mouse screen coordinates to SVG local coordinates, then compute the delta.

Nested groups are where I lost hours. A path might be inside three levels of g, each with its own transform. Use the immediate parent's CTM. If the element is inside a g, call getScreenCTM on that g, not on the svg root.

## Step 4: Three Ways to Highlight

**Change colors.** Select an element, flip its stroke from black to blue. Instant visual feedback. The problem: you can't restore the original color because you didn't save it.

**Use CSS filter.** Apply filter: drop-shadow to the selected element for a glow effect. No attribute changes needed. Deselect, remove the filter. Clean.

**Use an overlay.** Place an absolutely positioned div above the SVG. When an element is selected, draw a dashed rectangle in the overlay based on getBoundingClientRect. Since the overlay lives outside the SVG coordinate system, zooming and panning don't affect it. Update the box position on every drag frame.

## Step 5: Editing Attributes, and Why Style Wins

Users want to change fill or stroke after selection. A naive setAttribute seems obvious. But many SVGs (especially from Figma) store styles in the style attribute rather than standalone attributes. And style takes priority.

So if you setAttribute('fill', 'blue') on an element that already has style="fill: red", nothing visibly changes. The style attribute overrides your setAttribute.

Fix: check the style attribute first. If the property you're modifying exists in style, remove it from style, then setAttribute. This way the edited property is clean at the attribute level and won't cause conflicts later.

## Step 6: Building an Interactive Flowchart

With selection, dragging, and attribute editing in place, an interactive flowchart is mostly business logic on top.

Nodes are rects or circles. Edges are paths. Node dragging is solved. Edges need to follow nodes: maintain a node-edge mapping, and after each drag, recompute the d attribute of connected paths.

Nodes also need ports — small circles for dragging out new connections. Place these inside the node's g so they move with the node.

Edge clicking is tricky. A path's clickable area at 1px stroke-width is nearly impossible to hit. Solution: two layers per edge. A transparent thick path (stroke-width: 10, pointer-events: stroke) handles clicks. A visible thin path handles display.

Stack all of this together and you have a working SVG editor. The editor at svgdo.com is built exactly this way. Open source on GitHub — grab the code and start building.
