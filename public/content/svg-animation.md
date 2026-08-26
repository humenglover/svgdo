---

# The Blood, Sweat, and Tears of SVG Animations: From Beginner to Almost Smashing My Keyboard

Honestly, as I'm writing this article, I'm literally in the middle of fixing another SVG animation bug in a legacy codebase. I'm staring at the screen where a loading circle, which was supposed to spin quietly in place, is instead orbiting the top-left corner of the browser in some bizarre centrifugal motion, flying completely off the screen.

My exact mood right now is perfectly captured by the GIF below.

![My mood watching my SVG icon fly off the screen](/content/images/this-is-fine-css.gif)
*(This is literally the daily life of a frontend engineer. The world is burning, and I'm still tweaking CSS.)*

I don't know how many of you are like me, but when I first started learning frontend, I thought CSS animations were just slapping on a few `@keyframes`. Who doesn't know how to write `transform: rotate(360deg)`? Animating a regular HTML `div` or `span` is something you can do with your eyes closed. But! The second you touch the nodes inside an SVG, like trying to make a specific `<path>` or `<circle>` animate independently, the absolute nightmare begins.

Today, I have absolutely had enough of the frustration of having to scour StackOverflow for half the day just for a simple animation. I decided to manually dump out every single pitfall I've encountered with SVG animations over the years. No fluff, no rigid "firstly, secondly, finally" structures. Let's just talk about the pain.

If you are still using JavaScript to aggressively manipulate the DOM to create SVG animations, I urge you to stop immediately. That garbage will not only choke your main thread to death, but the code you write will be long and stinky. What year is it? Even phone screens have a 120Hz refresh rate. We need GPU hardware acceleration; we need ultimate smoothness. Therefore, driving inline SVGs with pure CSS is absolutely the only serious and non-laggy solution right now.

But, just as I was complaining earlier, the moment you add a rotation animation to an SVG node, it will fly out of control 100% of the time. Why?

Because in the regular HTML world we usually write in, the `transform-origin` (the center point around which it deforms or rotates) of an element defaults to its exact center, i.e., `50% 50%`.
But the SVG world has an incredibly bizarre coordinate system. In most browsers (especially Safari, calling you out specifically), the transformation origin of internal SVG nodes defaults to being anchored at the top-left corner `(0, 0)` of the massive SVG canvas!

How stupid is this? It's like you wanting to spin around in place, but the system forces you to run a lap around the city hall plaza three miles away!

I once stayed up until 3 AM the night before a project launch researching this issue. In the end, I discovered that the lifesaver was actually a ridiculously obscure CSS property that even many veterans hadn't heard of.
All you need to do is add these two lines of code under the class name of the SVG node that needs to rotate:

```css
.spin-gear {
  transform-origin: center center;
  /* PAY ATTENTION! This is the god-tier lifesaver property */
  transform-box: fill-box;
  animation: spin 2s linear infinite;
}
```

After adding `transform-box: fill-box;`, the browser is finally no longer stupid. It understands: "Oh, the boss wants me to use the actual Bounding Box of this graphic itself as the baseline to calculate the center point, not that damn massive canvas."
This single line of code has saved God knows how much hair for frontend programmers that was about to fall out.

Besides rotation, another flashy trick you can use to brag in interviews is the "Line Drawing Animation".
You've definitely seen it on Apple's official website or those extremely pretentious minimalist websites. As you scroll your mouse, a curve on the screen slowly draws itself as if an invisible pen is tracing it.

Many people think this must be written using some badass Canvas library or WebGL. But actually, you can get this animation in SVG purely using CSS for free.
The underlying mechanism is so sneaky it's outrageous. It utilizes the dashed line property of SVG.

Imagine you have a line that is 1000 pixels long.
First step, you use `stroke-dasharray: 1000;` to turn this line into a massive dashed line where "the solid part is 1000 pixels long, and the empty gap is also 1000 pixels long".
Second step, you aggressively use `stroke-dashoffset: 1000;` to offset this dashed line 1000 pixels to the left. By doing this, what falls into your screen's viewport is exactly that 1000-pixel "empty gap". The line, magically, disappears.
Third step, write an extremely simple CSS animation to slowly transition this offset from 1000 back to 0.

The code looks like this; it's so simple it's hard to believe:

```css
.magic-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 3s ease-in-out forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}
```
The solid part that was originally hiding outside the viewport gets slowly pulled back in, visually looking exactly as if it's being drawn right then and there. If you master this trick, you can single-handedly handle all the cool loading animations in your company from now on.

But then again, writing code is just writing code. If the SVG you receive is garbage in the first place, with a messy coordinate system and seven or eight layers of meaningless `<g>` tags nested inside, then no matter how badass your CSS is, it's useless. The animation will definitely stutter and lag.

Therefore, before throwing SVGs into your project to write animations, you absolutely must wash the code first!

Stop using those garbage online compression sites plastered with ads. You can just open our own SVG Editor and take a look. We built an entire completely localized workflow. Look at the animated GIF below, I just recorded this specifically for you, purely rendered locally without any fake visual effects:

![Process your garbage SVGs directly in the editor](/content/images/icon-workflow-demo.webp)
*(It's this smooth. Operate on the left, instantly get pure code on the right, without having to endure any network latency.)*

Throw in those SVGs with all sorts of dirty and messy coordinates that the designers tossed at you. Under the Split View, directly delete that useless metadata and clean up the viewBox. Only when the underlying structure is clean can the interactive animations you write with CSS truly achieve 60-FPS smoothness.

Alright, enough complaining, I just got a new requirement. The product manager says the heart icon needs to not only bounce when clicked but also explode with a ring of particles. I have to go battle the SVG coordinate system again. Remember that incantation: `transform-box: fill-box;`. May you all get off work early and never encounter errors!
