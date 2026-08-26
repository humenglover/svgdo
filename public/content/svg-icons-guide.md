---

# Icon Design Guide: The Complete Workflow Starting with SVG (Stop Drawing Random Lines)

Honestly, after taking over so many legacy codebases, the thing that drives me the craziest isn't just the abuse of `<img>` tags, but the SVG icons that lack any sort of standardization.

Sometimes you open a project's assets folder, and the icons inside are a chaotic mess: some are 24x24, some are 200x200; some have a line width of 1px, some 1.5px; some have colors hardcoded to `#333` in the `fill`, while others are wrapped in eight layers of `<g>` groups. Every time the product manager says, "Add a dark mode to these icons," frontend engineers want to quit on the spot.

SVG is the bridge between design and code. A truly excellent icon set is not just about "looking good"; it must be rigorous and controllable on an engineering level. Today, we won't talk about elusive aesthetic design. We will start directly from the most hardcore underlying specifications and discuss how an enterprise-grade SVG icon should actually be drawn, managed, and used.

---

## 1. Throw Away Your Artboard, Build a "Pixel Grid" First

I don't know how many designers like to just drag a box casually in Figma and start drawing icons. This is an absolute taboo.

Excellent UI icons must be based on an absolutely rigorous pixel grid. The most universal standard in the industry right now is a **24x24** viewBox. Whether you are drawing a needle or an elephant, the final generated code must be:

```html
<svg viewBox="0 0 24 24" width="24" height="24">
```

### Keylines and Padding
Within a 24x24 artboard, absolutely do not stuff the content to the edges! You need to leave at least 2px of safe padding, so the actual drawing area is only 20x20.
Why? Because when you place a rounded rectangle next to a circle, given the same pixel area, the circle will appear visually smaller. You need to use this 2px safe zone to slightly enlarge the circle (breaking the 20x20 limit to reach 22x22) so they look the same size on the screen. This is what we call "optical balance."

![Checking the viewBox and SVG source code in real-time under Split View](/content/images/icon-split-view.png)

*When using our SVG editor, directly switch to the code split view mode, and your first glance should check if the `viewBox` is strictly 0 0 24 24. If not, send it back for a redo early on.*

---

## 2. Stroke Specifications: The Devil is in the Details

If your system icons are linear, then the **stroke width must be uniform**.

For 24x24 icons, a **2px stroke** is the golden ratio recognized by almost all major tech companies (Apple, Google, Microsoft). 1px looks too faint on non-retina screens, and 1.5px causes sub-pixel rendering issues (blurriness) on certain low-resolution displays.

```html
<path d="..." stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
```

Additionally, it is strongly recommended to use rounded caps (`stroke-linecap="round"`) and rounded joins (`stroke-linejoin="round"`). They significantly offset the jaggedness vector graphics tend to exhibit at lower resolutions, making icons look much smoother and friendlier.

Most importantly: **Do not mix and match!** Your project cannot simultaneously have a 1.5px search icon and a 2px home icon. This visual discontinuity will instantly downgrade the premium feel of the entire application.

---

## 3. Color Management: currentColor is the Only True God

This is a major conflict zone between frontend developers and designers. SVGs exported by designers often come with `#000000` or even weirder color values.

If the color in the SVG is hardcoded, it becomes extremely painful for frontend devs to control hover states or dark mode via CSS (usually forcing the use of ugly CSS Filters for brute-force color changing).

**The ONLY best practice: Replace the main color with `currentColor`.**

```html
<!-- WRONG -->
<svg fill="none" stroke="#333333">

<!-- RIGHT -->
<svg fill="none" stroke="currentColor">
```

By using `currentColor`, the SVG acts like text, automatically inheriting the `color` property of its parent element. If you write `color: red;` on the outer wrapper, the icon turns red. In dark mode, if the text turns white, the icon automatically turns white. Clean, elegant, and zero performance overhead.

---

## 4. Thoroughly Experience the Smooth "WYSIWYG" Workflow

Talk is cheap. Often, it's hard to force designers without a technical background to fully comply with code-level specifications. This requires frontend developers to have an extremely handy workflow to "cleanse" and "preview" these SVGs.

We've built an incredibly powerful workflow directly into the SVG Editor. You can watch this purely locally-recorded real-time demonstration animation below (this is not a hotlinked network image; it's smoothly loaded right from your local environment):

![A complete workflow demonstration of importing, code cleaning, and ultra-fast exporting of SVG icons](/content/images/icon-workflow-demo.webp)

As demonstrated in the animation, you can extract standard-compliant icons from the library with one click, or toss your messy source files in. Using the controls on the left panel, switch directly to **Split View**. You can watch the visual preview while ruthlessly deleting those redundant `<g>` tags, useless `<defs>`, and garbage code with hardcoded colors. Once verified, hit Export with one click.

No need to constantly tab between your IDE and the browser. This is the efficiency a modern frontend developer should have when handling vector assets.

---

## Conclusion: Build Your Checklist

Next time you receive a batch of SVG icons, don't rush to throw them into your code. Run through this checklist:

1. **Uniform Dimensions:** Are all viewBoxes `0 0 24 24`?
2. **Consistent Stroke:** Is the stroke width uniformly `2px` (or whatever standard you set)?
3. **Color Inheritance:** Have all hardcoded colors been replaced with `currentColor`?
4. **Code Purity:** Have redundant tags and garbage code generated by Figma been compressed and cleaned?

If they all pass, congratulations, your application has already surpassed 80% of poorly made projects in terms of detail. Standards might be tedious, but they are the only foundation that allows engineering to evolve sustainably.
