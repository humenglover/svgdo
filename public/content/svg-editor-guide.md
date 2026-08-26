![SVG Editor Main Interface](/content/images/editor-hero.png)

Welcome to **SVG do.** — a truly "zero cloud upload", local-first online SVG editor tailored for modern frontend developers and designers.

In our daily development workflow, we constantly need to make minor tweaks to SVGs: changing a color, removing a border, or minifying a bloated SVG we found online. However, most online tools are either plastered with ads, force you to upload your confidential design files to their servers, or even require you to register and log in.

This completely violates the original intention of frontend tools: **minimalism, security, and efficiency**.

The core philosophy behind our editor is simple: everything happens locally in your browser. Close the page, and the data is destroyed. Now, let's dive into the hardcore features of this powerful tool.

---

## Core Feature 1: The "Plug and Play" Infinite Icon Library

Still scouring the web for open-source icon libraries, downloading them, and then manually importing them? We've directly integrated a super-arsenal of over 3,500+ high-quality, open-source icons right into the editor.

![Step 1](/content/images/editor-icon-library.png)

![Step 2](/content/images/editor-split-view.png)

![Step 3](/content/images/editor-optimize-panel.png)

As demonstrated in the animation above, you simply need to click the <strong>Icon Library</strong> (图标库) in the left sidebar. Browse through the modal, or type a keyword (like `apple`, `user`, `settings`). Once you find the perfect icon, just a single click will instantly inject its source code straight into your editing panel.

If you already have your own design assets, we support those too:
1. <strong>Drag and drop</strong> any `.svg` file directly into the webpage.
2. <strong>Click "Upload"</strong> to select a local file from your computer.
3. <strong>Paste a public SVG URL</strong>, and the editor will automatically fetch the code for you.

---

## Core Feature 2: WYSIWYG "Split Screen" Immersive Editing

More often than not, we need to make code-level adjustments to our SVGs. Maybe you need to modify the `fill` color, or add a specific CSS class to a particular `<path>` so you can control it in your Vue/React project.

Click the <strong>Split View</strong> (分屏) mode in the top left, and your screen will be perfectly divided into two halves:
- The left side features a blazing-fast XML code editor with <strong>syntax highlighting</strong> and <strong>auto-indentation</strong>.
- The right side is a real-time rendering preview area with millisecond response times.

Every character you type and every `stroke-width` pixel you modify in the code will instantly redraw on the right canvas. For developers, this intuitive "code-is-picture" feedback is irreplaceable by any purely visual tool.

> <strong>Dark Mode Preview:</strong> If your SVG is white or lightly colored, it might be completely invisible against a standard white canvas. Don't worry! Just click the <strong>Dark Mode Toggle Button</strong> in the top right corner of the canvas to instantly lay down a dark background, perfectly simulating how it will look in a Dark UI environment.

---

## Core Feature 3: The "Deep Compress Engine" to Squeeze Out Bloat

SVGs exported from Illustrator or Figma by designers often carry a massive amount of "contraband": a pile of useless `<defs>`, design-software-specific `<metadata>`, and completely meaningless hidden layers. This garbage code not only slows down your web page loading speed but also makes your HTML look incredibly ugly.

Expand the <strong>Optimize</strong> (优化) panel on the left, and you will see two killer options:

1. <strong>Safe Mode</strong>: The safest option. It merely strips out comments, redundant spaces, line breaks, and useless metadata. It absolutely will not alter the visual appearance of the SVG. This is the safest way to slim down your file.
2. <strong>Deep Compress</strong>: This is the real black magic! Beyond cleaning up garbage code, it uses underlying mathematical algorithms to merge Bezier curves, remove invisible hidden elements, and wipe out empty attributes. A 10KB design file, after a deep compress, can often be reduced directly to 2KB—a massive 80% reduction in file size!

Once compression is complete, we instantly display the <strong>byte difference before and after optimization</strong>. You can visually see exactly how much bandwidth you've saved your project. If you're not satisfied with the compressed result (in very rare cases, extreme compression might slightly warp complex shapes), just click <strong>Restore Original</strong>, and everything rolls back.

---

## Core Feature 4: The "Cross-Dimensional Strike" of One-Click Exporting

We are not just an editor; we are your personal format converter. When you've polished a perfect SVG, but the Product Manager suddenly runs over and says, "Give me a high-res PNG," you never have to pull your hair out again.

In the <strong>Export</strong> (导出) panel, you can experience true one-click cross-dimensional conversion:
- <strong>Multiplier Scaling (1x / 2x / 4x)</strong>: If you need an ultra-clear image for printing or Retina displays, select 4x directly. The editor will first losslessly enlarge the vector graphic in memory before rasterizing it. The exported PNG will have edges sharp enough to cut fruit.
- <strong>Smart Background Fill</strong>: Exported PNGs have a transparent background by default. But if you need to place it in a dark document, you can select to fill it with <strong>Black</strong> or <strong>White</strong> with one click, completely solving the awkward problem of "invisible" images in presentations.

Whether you want to simply <strong>Copy SVG Code</strong> to paste into your project, <strong>Download the SVG file</strong>, or <strong>Export a High-Res PNG</strong>, everything is ready and waiting for you here.

Open the code panel now, drag in an icon, and start your SVG magic journey!
