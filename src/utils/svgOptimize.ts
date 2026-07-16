export function optimizeSVG(code: string, mode: 'safe' | 'aggressive'): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(code, 'image/svg+xml')
    const svgEl = doc.querySelector('svg')
    if (!svgEl) return code

    const removeComments = (node: Node) => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT)
      const comments: Node[] = []; let c
      while (c = walker.nextNode()) comments.push(c)
      comments.forEach(c => c.parentNode?.removeChild(c))
    }
    removeComments(doc)

    const optimizePath = (d: string): string => d.replace(/\s+/g, ' ').replace(/(\d)\s*-/g, '$1-').replace(/\s*,\s*/g, ',').replace(/([A-Za-z])\s*/g, '$1').replace(/\s+([A-Za-z])/g, '$1').trim()

    const processElement = (el: Element) => {
      if (mode === 'aggressive') { el.removeAttribute('id'); el.removeAttribute('data-name') }
      if (el.tagName.toLowerCase() === 'path') { const d = el.getAttribute('d'); if (d) el.setAttribute('d', optimizePath(d)) }
      Array.from(el.children).forEach(child => processElement(child))
    }
    processElement(svgEl)

    if (mode === 'aggressive') {
      const emptyGs = Array.from(doc.querySelectorAll('g')).filter(g => !g.hasAttributes() && g.children.length === 0)
      emptyGs.forEach(g => g.parentNode?.removeChild(g))
    }

    const serializer = new XMLSerializer()
    let optimized = serializer.serializeToString(doc)

    // Clean up XML serializer artifacts and self-close empty elements
    optimized = optimized.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"\s?/g, '')
    optimized = optimized.replace(/<([^>\s]+)([^>]*)>\s*<\/\1>/g, '<$1$2/>')

    if (mode === 'aggressive') {
      // Strip excessive float precision (keep max 3 decimals)
      optimized = optimized.replace(/(\.\d{3})\d+/g, '$1')
      optimized = optimized.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
    }
    return optimized
  } catch (e) { console.error('SVG optimization failed:', e); return code }
}
