/**
 * SVG DOM 工具 — 元素标识注入与信息提取
 */

export interface ElementInfo {
  id: string
  tagName: string
  attributes: Record<string, string>
  index: number // The sequence index in a pre-order traversal of supported tags
}

const SUPPORTED_TAGS = new Set([
  'path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 
  'line', 'g', 'use', 'text', 'tspan', 'image'
])

let idCounter = 0
function nextId(): string {
  return `element-${String(++idCounter).padStart(3, '0')}`
}

/** 重置 ID 计数器（每次加载新 SVG 时调用） */
export function resetIdCounter(): void {
  idCounter = 0
}

/**
 * 给 SVG 内部元素注入唯一 data-editor-id
 * 返回处理后的 SVG 字符串 + 元素信息列表
 */
export function injectEditorIds(svgCode: string): { html: string; elements: ElementInfo[] } {
  resetIdCounter()
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgCode, 'image/svg+xml')
  const svgEl = doc.querySelector('svg')
  if (!svgEl) return { html: svgCode, elements: [] }

  const elements: ElementInfo[] = []
  let elementIndex = 0

  const walk = (el: Element) => {
    if (SUPPORTED_TAGS.has(el.tagName.toLowerCase())) {
      const id = nextId()
      el.setAttribute('data-editor-id', id)

      const attrs: Record<string, string> = {}
      for (const attr of Array.from(el.attributes)) {
        if (attr.name !== 'data-editor-id' && attr.name !== 'style') {
          attrs[attr.name] = attr.value
        }
      }
      
      // 合并内联 style 中的表现属性，使得属性面板能读到真实优先级最高的值
      const styleStr = el.getAttribute('style')
      if (styleStr) {
        const styleParts = styleStr.split(';')
        for (const part of styleParts) {
          const colonIdx = part.indexOf(':')
          if (colonIdx > 0) {
            const key = part.slice(0, colonIdx).trim()
            const val = part.slice(colonIdx + 1).trim()
            if (key && val) {
              attrs[key] = val
            }
          }
        }
      }

      elements.push({ id, tagName: el.tagName.toLowerCase(), attributes: attrs, index: elementIndex })
      elementIndex++
    }
    // 递归处理子元素
    for (const child of Array.from(el.children)) {
      walk(child)
    }
  }

  walk(svgEl)

  const serializer = new XMLSerializer()
  const html = serializer.serializeToString(svgEl)

  return { html, elements }
}

/**
 * 从元素信息中提取简要描述
 */
export function describeElement(info: ElementInfo): string {
  const { tagName, attributes } = info
  const parts: string[] = [tagName]

  if (attributes.id) parts.push(`#${attributes.id}`)
  if (attributes.class) parts.push(`.${attributes.class.split(' ')[0]}`)
  if (attributes.d && tagName === 'path') {
    const preview = attributes.d.length > 40 ? attributes.d.slice(0, 40) + '...' : attributes.d
    parts.push(`d="${preview}"`)
  }

  return parts.join(' ')
}

/**
 * Get the specific element from raw SVG code based on its traversal index
 */
function getElementByIndex(svgCode: string, targetIndex: number): Element | null {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svgCode.trim()
  const svgEl = wrapper.querySelector('svg')
  if (!svgEl) return null

  let currentIndex = 0
  let foundEl: Element | null = null

  const walk = (el: Element) => {
    if (foundEl) return
    if (SUPPORTED_TAGS.has(el.tagName.toLowerCase())) {
      if (currentIndex === targetIndex) {
        foundEl = el
        return
      }
      currentIndex++
    }
    for (const child of Array.from(el.children)) {
      walk(child)
    }
  }

  walk(svgEl)
  return foundEl
}

/**
 * 更新 SVG 代码中指定元素的属性
 * @returns 修改后的完整 SVG 代码
 */
export function updateElementAttribute(
  svgCode: string,
  elementIndex: number,
  attrName: string,
  attrValue: string
): string {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svgCode.trim()
  const svgEl = wrapper.querySelector('svg')
  if (!svgEl) return svgCode

  let currentIndex = 0
  let foundEl: Element | null = null

  const walk = (el: Element) => {
    if (foundEl) return
    if (SUPPORTED_TAGS.has(el.tagName.toLowerCase())) {
      if (currentIndex === elementIndex) {
        foundEl = el
        return
      }
      currentIndex++
    }
    for (const child of Array.from(el.children)) {
      walk(child)
    }
  }

  walk(svgEl)
  
  if (!foundEl) return svgCode

  if (attrValue === '' || attrValue === null || attrValue === undefined) {
    foundEl.removeAttribute(attrName)
    if (foundEl.hasAttribute('style')) {
      const svgElNode = foundEl as SVGElement;
      if (svgElNode.style && typeof svgElNode.style.removeProperty === 'function') {
        svgElNode.style.removeProperty(attrName);
      }
    }
  } else {
    foundEl.setAttribute(attrName, attrValue)
    // 强制清除内联 style 中的同名属性，否则内联 style 优先级会压制刚修改的属性
    if (foundEl.hasAttribute('style')) {
      const svgElNode = foundEl as SVGElement;
      if (svgElNode.style && typeof svgElNode.style.removeProperty === 'function') {
        svgElNode.style.removeProperty(attrName);
      }
    }
  }

  // Uses wrapper.innerHTML which avoids XML namespace pollution from XMLSerializer
  return wrapper.innerHTML
}

/**
 * 从 SVG 代码中读取指定元素的单个属性值
 */
export function getElementAttribute(svgCode: string, elementIndex: number, attrName: string): string {
  const el = getElementByIndex(svgCode, elementIndex)
  if (!el) return ''
  
  // 1. 先去 style 里面找（优先级最高）
  const styleStr = el.getAttribute('style')
  if (styleStr) {
    const styleParts = styleStr.split(';')
    for (const part of styleParts) {
      const colonIdx = part.indexOf(':')
      if (colonIdx > 0) {
        const key = part.slice(0, colonIdx).trim()
        if (key === attrName) {
           return part.slice(colonIdx + 1).trim()
        }
      }
    }
  }
  
  // 2. 如果 style 里没有，再返回原生 attribute
  return el.getAttribute(attrName) || ''
}

export function parseTransform(str: string) {
  const res = { tx: 0, ty: 0, rotate: 0, scale: 1, scaleX: 1, scaleY: 1 }
  if (!str) return res
  const translateMatch = str.match(/translate\(([^,)]+)[, ]?([^)]*)\)/)
  if (translateMatch) { res.tx = parseFloat(translateMatch[1]) || 0; res.ty = parseFloat(translateMatch[2]) || 0 }
  const rotateMatch = str.match(/rotate\(([^)]+)\)/)
  if (rotateMatch) res.rotate = parseFloat(rotateMatch[1]) || 0
  const scaleMatch = str.match(/scale\(([^)]+)\)/)
  if (scaleMatch) {
    const parts = scaleMatch[1].trim().split(/[, ]+/)
    res.scaleX = parseFloat(parts[0]) || 1
    res.scaleY = parts.length > 1 ? parseFloat(parts[1]) || res.scaleX : res.scaleX
    res.scale = res.scaleX // for compatibility with PropertiesPanel
  }
  return res
}

export function buildTransform(t: { tx: number, ty: number, rotate: number, scale?: number, scaleX?: number, scaleY?: number }) {
  const parts = []
  if (t.tx !== 0 || t.ty !== 0) parts.push(`translate(${t.tx}, ${t.ty})`)
  if (t.rotate !== 0) parts.push(`rotate(${t.rotate})`)
  
  const sx = t.scaleX !== undefined ? t.scaleX : (t.scale !== undefined ? t.scale : 1)
  const sy = t.scaleY !== undefined ? t.scaleY : (t.scale !== undefined ? t.scale : 1)
  
  if (sx !== 1 || sy !== 1) {
    if (sx === sy) {
      parts.push(`scale(${sx})`)
    } else {
      parts.push(`scale(${sx}, ${sy})`)
    }
  }
  return parts.join(' ')
}
