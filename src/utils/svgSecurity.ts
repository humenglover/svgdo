import DOMPurify from 'dompurify'

export const sanitizeSVG = (svgCode: string): string => {
  let code = svgCode;
  
  // DOMPurify in svg profile often strips the <svg> root tag if it lacks the proper xmlns namespace.
  // We inject it automatically if missing to ensure the preview renders.
  if (code && !code.includes('xmlns=') && code.includes('<svg')) {
    code = code.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const clean = DOMPurify.sanitize(code, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'symbol', 'defs', 'clipPath', 'mask', 'pattern', 'linearGradient', 'radialGradient'],
    ADD_ATTR: ['xmlns', 'xmlns:xlink', 'xlink:href', 'viewBox', 'preserveAspectRatio', 'width', 'height', 'fill', 'stroke'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'foreignObject'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });

  return clean;
}

export const validateURL = (url: string): { valid: boolean; error?: string } => {
  try {
    const parsedURL = new URL(url)
    if (parsedURL.protocol !== 'https:' && !(parsedURL.protocol === 'http:' && parsedURL.hostname === 'localhost')) {
      return { valid: false, error: 'Only HTTPS URLs are allowed' }
    }
    const hostname = parsedURL.hostname.toLowerCase()
    const blacklist = ['localhost', '127.0.0.1', '0.0.0.0', '::1']
    if (parsedURL.protocol === 'https:' && blacklist.includes(hostname)) {
      return { valid: false, error: 'Invalid hostname' }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

export const checkSVGContentType = (contentType: string | null): boolean => {
  if (!contentType) return false
  return contentType.includes('image/svg+xml') || contentType.includes('text/xml')
}

export const loadRemoteSVG = async (url: string, maxSize = 5 * 1024 * 1024): Promise<{ success: boolean; data?: string; error?: string }> => {
  const urlValidation = validateURL(url)
  if (!urlValidation.valid) return { success: false, error: urlValidation.error }

  try {
    const headResponse = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    if (!headResponse.ok) return { success: false, error: `HTTP ${headResponse.status}` }

    const contentType = headResponse.headers.get('content-type')
    if (!checkSVGContentType(contentType)) return { success: false, error: `Invalid Content-Type: ${contentType || 'unknown'}` }

    const contentLength = headResponse.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > maxSize) return { success: false, error: 'File too large' }

    const getResponse = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!getResponse.ok) return { success: false, error: 'Failed to fetch' }

    const text = await getResponse.text()
    if (text.length > maxSize) return { success: false, error: 'File too large' }
    if (!text.includes('<svg')) return { success: false, error: 'Not a valid SVG' }

    return { success: true, data: sanitizeSVG(text) }
  } catch (error: any) {
    if (error.name === 'TimeoutError') return { success: false, error: 'Request timeout' }
    return { success: false, error: error.message || 'Unknown error' }
  }
}

export const parseSVGDimension = (value: string | null): number => {
  if (!value) return 0
  const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''))
  if (isNaN(numericValue)) return 0
  if (value.includes('%')) return 0
  return numericValue
}

export const getSVGDimensions = (svgElement: SVGSVGElement): { width: number; height: number } => {
  let width = parseSVGDimension(svgElement.getAttribute('width'))
  let height = parseSVGDimension(svgElement.getAttribute('height'))
  if (!width || !height) {
    const viewBox = svgElement.getAttribute('viewBox')
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/).map(parseFloat)
      if (parts.length === 4) {
        width = width || parts[2]
        height = height || parts[3]
      }
    }
  }
  if (!width) width = 1024
  if (!height) height = 1024
  return { width, height }
}
