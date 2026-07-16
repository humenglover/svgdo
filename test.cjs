const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('');
const DOMParser = dom.window.DOMParser;
const XMLSerializer = dom.window.XMLSerializer;

const SUPPORTED_TAGS = new Set(['path', 'rect', 'circle', 'ellipse', 'polygon', 'line', 'g']);

function updateElementAttribute(svgCode, elementIndex, attrName, attrValue) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgCode, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svgCode;

  let currentIndex = 0;
  let foundEl = null;

  const walk = (el) => {
    if (foundEl) return;
    if (SUPPORTED_TAGS.has(el.tagName.toLowerCase())) {
      if (currentIndex === elementIndex) {
        foundEl = el;
        return;
      }
      currentIndex++;
    }
    for (const child of Array.from(el.children)) {
      walk(child);
    }
  };

  walk(svgEl);
  
  if (!foundEl) {
    console.log('Not found! target:', elementIndex);
    return svgCode;
  }

  foundEl.setAttribute(attrName, attrValue);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgEl);
}

const svg = '<svg viewBox="0 0 100 100"><path d="M10 10" fill="none"/><rect width="10" height="10"/></svg>';
console.log('Original:', svg);
console.log('Modified 0:', updateElementAttribute(svg, 0, 'fill', 'red'));
console.log('Modified 1:', updateElementAttribute(svg, 1, 'fill', 'blue'));
