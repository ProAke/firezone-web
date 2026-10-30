export function extractYouTubeVideoId(rawUrl: string): string | null {
  const input = String(rawUrl || '').trim()
  if (!input) return null

  const cleanId = (candidate: string | undefined | null): string | null => {
    if (!candidate) return null
    const id = candidate.split(/[?&#/]/)[0]?.trim() || ''
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null
  }

  try {
    const normalized = input.startsWith('//') ? `https:${input}` : input
    const u = new URL(normalized)
    const host = u.hostname.replace(/^www\./i, '').replace(/^m\./i, '').toLowerCase()

    if (host === 'youtu.be') {
      return cleanId(u.pathname.replace(/^\/+/, ''))
    }

    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') {
        return cleanId(u.searchParams.get('v'))
      }
      const match = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/i)
      if (match?.[1]) {
        return cleanId(match[1])
      }
    }
  } catch {
    // Fallback regex for partial URLs
    const m = input.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,20})/i
    )
    if (m?.[1]) return m[1]
  }

  return null
}

export function extractYouTubeIdsFromHtml(html?: string): string[] {
  const src = String(html || '')
  if (!src) return []

  const found = new Set<string>()
  const attrRegex = /(?:url|src|data-oembed-url)\s*=\s*(['"])(.*?)\1/gi
  let match: RegExpExecArray | null
  while ((match = attrRegex.exec(src)) !== null) {
    const id = extractYouTubeVideoId(match[2] || '')
    if (id) found.add(id)
  }

  return Array.from(found)
}

export function extractFirstImageFromHtml(html?: string): string {
  const src = String(html || '')
  if (!src) return ''

  const imgMatch = src.match(/<img\b[^>]*?\bsrc\s*=\s*(['"])(.*?)\1/i)
  if (imgMatch?.[2]?.trim()) {
    return imgMatch[2].trim()
  }

  const ytIds = extractYouTubeIdsFromHtml(src)
  if (ytIds[0]) {
    return `https://i.ytimg.com/vi/${ytIds[0]}/hqdefault.jpg`
  }

  return ''
}

export function stripHtmlToPlainText(html?: string): string {
  const src = String(html || '')
  if (!src) return ''

  return src
    .replace(/<(script|style|oembed|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(br|hr|\/p|\/div|\/li|\/h[1-6]|\/tr|\/blockquote)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function autoExcerpt(
  rawExcerpt?: string,
  htmlContent?: string,
  fallbackTitle?: string,
  maxLen = 165
): string {
  const explicit = stripHtmlToPlainText(rawExcerpt)
  if (explicit) {
    return explicit.length > maxLen ? `${explicit.slice(0, maxLen - 1).trim()}…` : explicit
  }

  const fromBody = stripHtmlToPlainText(htmlContent)
  if (fromBody) {
    if (fromBody.length <= maxLen) return fromBody
    const sliced = fromBody.slice(0, maxLen)
    const lastSpace = sliced.lastIndexOf(' ')
    const cut = lastSpace > maxLen * 0.65 ? sliced.slice(0, lastSpace) : sliced
    return `${cut.trim()}…`
  }

  const title = stripHtmlToPlainText(fallbackTitle)
  if (title) {
    return `${title} — จำหน่าย ติดตั้ง ตรวจสอบระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm) มาตรฐาน UL/FM โดย บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด`
  }

  return ''
}

export function autoSeoTitle(
  customSeoTitle?: string,
  itemTitle?: string,
  suffix = 'FIRESZONE'
): string {
  const custom = stripHtmlToPlainText(customSeoTitle)
  if (custom) return custom
  const base = stripHtmlToPlainText(itemTitle)
  if (!base) return suffix
  if (base.toLowerCase().includes('fireszone') || base.includes('ไฟร์โซน')) {
    return base
  }
  return `${base} | ${suffix}`
}

export function autoSeoDescription(
  customSeoDesc?: string,
  excerpt?: string,
  htmlContent?: string,
  fallbackTitle?: string
): string {
  const custom = stripHtmlToPlainText(customSeoDesc)
  if (custom) return custom.slice(0, 260)
  return autoExcerpt(excerpt, htmlContent, fallbackTitle, 165)
}

export function autoSeoKeywords(
  customKeywords?: string,
  parts: Array<string | undefined | null> = []
): string {
  const custom = stripHtmlToPlainText(customKeywords)
  if (custom) return custom

  const tokens = new Set<string>()
  for (const part of parts) {
    const cleaned = stripHtmlToPlainText(part || '')
    if (cleaned && cleaned.length <= 80) {
      tokens.add(cleaned)
    }
  }
  tokens.add('Fire Alarm')
  tokens.add('ระบบแจ้งเหตุเพลิงไหม้')
  tokens.add('FIRESZONE')
  tokens.add('ไฟร์โซน')

  return Array.from(tokens).slice(0, 10).join(', ')
}

export function sanitizeRichHtmlForStorage(input?: string): string {
  const src = String(input || '').trim()
  if (!src) return ''

  const preservedIframes: string[] = []
  let working = src.replace(
    /<iframe\b[^>]*?\bsrc\s*=\s*(['"])(.*?)\1[^>]*>(?:[\s\S]*?<\/iframe>)?/gi,
    (full, _q, iframeSrc) => {
      const vid = extractYouTubeVideoId(iframeSrc)
      if (!vid) return ''
      const idx = preservedIframes.length
      preservedIframes.push(
        `<iframe src="https://www.youtube.com/embed/${vid}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" title="YouTube video player" referrerpolicy="strict-origin-when-cross-origin" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
      )
      return `__FZ_SAFE_IFRAME_${idx}__`
    }
  )

  working = working
    .replace(/<(script|iframe|object|embed|form|meta|link|style|base)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|form|meta|link|style|base)\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*(['"])\s*(javascript:|vbscript:|data:text\/html)[\s\S]*?\2/gi, '$1="#"')

  working = working.replace(/__FZ_SAFE_IFRAME_(\d+)__/g, (_m, idx) => {
    return preservedIframes[Number(idx)] || ''
  })

  return working
}

export function buildVideoObjectsJsonLd(
  html?: string,
  opts?: {
    title?: string
    description?: string
    pageUrl?: string
    uploadDate?: string
  }
): Array<Record<string, any>> {
  const ytIds = extractYouTubeIdsFromHtml(html)
  if (!ytIds.length) return []

  const uploadIso =
    opts?.uploadDate && /^\d{4}-\d{2}-\d{2}/.test(opts.uploadDate)
      ? `${opts.uploadDate.slice(0, 10)}T00:00:00+07:00`
      : new Date().toISOString()

  return ytIds.map((vid, idx) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name:
      ytIds.length > 1
        ? `${opts?.title || 'วิดีโอสาธิต FIRESZONE'} (คลิปที่ ${idx + 1})`
        : opts?.title || 'วิดีโอสาธิต FIRESZONE',
    description:
      opts?.description || opts?.title || 'วิดีโอจาก บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
    thumbnailUrl: [`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`],
    embedUrl: `https://www.youtube.com/embed/${vid}`,
    contentUrl: `https://www.youtube.com/watch?v=${vid}`,
    uploadDate: uploadIso
  }))
}
