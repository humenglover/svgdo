/**
 * SVG DOM 工具 — 元素标识注入与信息提取
 */

export interface ElementInfo {
  id: string
  tagName: string
  attributes: Record<string, string>
}

const SUPPORTED_TAGS = new Set(['path', 'rect', 'circle', 'ellipse', 'polygon', 'line', 'g'])

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

  // 确保 SVG 根元素不会捕获点击
  svgEl.style.pointerEvents = 'none'

  const elements: ElementInfo[] = []

  const walk = (el: Element) => {
    if (SUPPORTED_TAGS.has(el.tagName.toLowerCase())) {
      const id = nextId()
      el.setAttribute('data-editor-id', id)
      // 恢复元素可点击
      el.setAttribute('style', (el.getAttribute('style') || '') + ';pointer-events:auto;cursor:pointer')

      const attrs: Record<string, string> = {}
      for (const attr of Array.from(el.attributes)) {
        if (attr.name !== 'data-editor-id' && attr.name !== 'style') {
          attrs[attr.name] = attr.value
        }
      }

      elements.push({ id, tagName: el.tagName.toLowerCase(), attributes: attrs })
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
 * 更新 SVG 代码中指定元素的属性
 * @returns 修改后的完整 SVG 代码
 */
export function updateElementAttribute(
  svgCode: string,
  editorId: string,
  attrName: string,
  attrValue: string
): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgCode, 'image/svg+xml')
  const el = doc.querySelector(`[data-editor-id="${editorId}"]`)
  if (!el) return svgCode

  if (attrValue === '' || attrValue === null || attrValue === undefined) {
    el.removeAttribute(attrName)
  } else {
    el.setAttribute(attrName, attrValue)
  }

  const serializer = new XMLSerializer()
  return serializer.serializeToString(doc.querySelector('svg') || doc.documentElement)
}

/**
 * 从 SVG 代码中读取指定元素的单个属性值
 */
export function getElementAttribute(svgCode: string, editorId: string, attrName: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgCode, 'image/svg+xml')
  const el = doc.querySelector(`[data-editor-id="${editorId}"]`)
  return el?.getAttribute(attrName) || ''
}
