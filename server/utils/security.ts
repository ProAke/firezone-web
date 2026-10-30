import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'
import { extname } from 'node:path'
import type { H3Event } from 'h3'

// ---------------------------------------------------------------------------
// 1. Sliding-Window IP Rate Limiter (In-Memory)
// ---------------------------------------------------------------------------
interface RateBucket {
  timestamps: number[]
}
const rateBuckets = new Map<string, RateBucket>()

export function getClientIp(event: H3Event): string {
  const xff = getHeader(event, 'x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = getHeader(event, 'x-real-ip')
  if (realIp) return realIp.trim()
  return event.node.req.socket?.remoteAddress || '127.0.0.1'
}

export function enforceRateLimit(
  event: H3Event,
  namespace: string,
  maxRequests: number,
  windowMs: number
) {
  const ip = getClientIp(event)
  const key = `${namespace}:${ip}`
  const now = Date.now()
  const cutoff = now - windowMs

  // Periodic cleanup
  if (rateBuckets.size > 5000) {
    for (const [k, b] of rateBuckets.entries()) {
      b.timestamps = b.timestamps.filter((t) => t > cutoff)
      if (!b.timestamps.length) rateBuckets.delete(k)
    }
  }

  const bucket = rateBuckets.get(key) || { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff)

  if (bucket.timestamps.length >= maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'คุณส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง'
    })
  }

  bucket.timestamps.push(now)
  rateBuckets.set(key, bucket)
}

// ---------------------------------------------------------------------------
// 2. Stateless HMAC Anti-Spam Challenge + Replay Nonce Guard
// ---------------------------------------------------------------------------
const usedChallengeNonces = new Map<string, number>()
const CHALLENGE_TTL_MS = 1000 * 60 * 30 // 30 minutes
const MIN_HUMAN_FILL_MS = 1200 // Minimum 1.2s between challenge issue & submit

export function createSpamChallenge(secret: string) {
  const a = randomInt(2, 15)
  const b = randomInt(2, 12)
  const op = randomInt(0, 2) === 0 ? '+' : '+'
  const answer = String(a + b)
  const iat = Date.now()
  const nonce = randomBytes(8).toString('hex')

  const payload = Buffer.from(JSON.stringify({ ans: answer, iat, nonce })).toString('base64url')
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')

  return {
    question: `${a} ${op} ${b} = ?`,
    challengeToken: `${payload}.${sig}`,
    issuedAt: iat
  }
}

export function verifySpamChallenge(
  challengeToken: string,
  userAnswer: string,
  secret: string
): { valid: boolean; reason?: string } {
  if (!challengeToken || !challengeToken.includes('.')) {
    return { valid: false, reason: 'ไม่พบข้อมูลยืนยันป้องกันสแปม กรุณารีเฟรชหน้าเว็บ' }
  }
  const [payload, sig] = challengeToken.split('.')
  if (!payload || !sig) {
    return { valid: false, reason: 'โทเคนยืนยันไม่ถูกต้อง' }
  }

  const expectedSig = createHmac('sha256', secret).update(payload).digest('base64url')
  const bufA = Buffer.from(sig)
  const bufB = Buffer.from(expectedSig)
  if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) {
    return { valid: false, reason: 'ลายเซ็นโทเคนไม่ถูกต้อง' }
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      ans: string
      iat: number
      nonce: string
    }
    const now = Date.now()
    if (!parsed.iat || now - parsed.iat > CHALLENGE_TTL_MS) {
      return { valid: false, reason: 'คำถามป้องกันสแปมหมดอายุ กรุณากดสุ่มคำถามใหม่' }
    }
    if (now - parsed.iat < MIN_HUMAN_FILL_MS) {
      return { valid: false, reason: 'ตรวจพบการส่งฟอร์มอัตโนมัติเร็วผิดปกติ กรุณาลองอีกครั้ง' }
    }

    // Prune expired nonces
    if (usedChallengeNonces.size > 2000) {
      for (const [n, exp] of usedChallengeNonces.entries()) {
        if (now > exp) usedChallengeNonces.delete(n)
      }
    }
    if (usedChallengeNonces.has(parsed.nonce)) {
      return { valid: false, reason: 'คำถามนี้ถูกใช้งานไปแล้ว กรุณากดสุ่มคำถามใหม่' }
    }

    if (String(userAnswer || '').trim() !== String(parsed.ans)) {
      return { valid: false, reason: 'คำตอบยืนยันป้องกันสแปมไม่ถูกต้อง กรุณาบวกเลขใหม่อีกครั้ง' }
    }

    usedChallengeNonces.set(parsed.nonce, now + CHALLENGE_TTL_MS)
    return { valid: true }
  } catch {
    return { valid: false, reason: 'รูปแบบโทเคนไม่ถูกต้อง' }
  }
}

// ---------------------------------------------------------------------------
// 3. Spam Content & Casino/Bot Payload Filter
// ---------------------------------------------------------------------------
const SPAM_PATTERNS = [
  /สล็อตเว็บตรง/i,
  /บาคาร่า/i,
  /คาสิโนออนไลน์/i,
  /ufabet/i,
  /pgslot/i,
  /เว็บพนัน/i,
  /\[url=/i,
  /<script\b/i,
  /javascript:/i
]

export function detectSpamText(text: string): string | null {
  for (const pat of SPAM_PATTERNS) {
    if (pat.test(text)) {
      return 'ระบบปฏิเสธข้อความเนื่องจากตรวจพบคำหรือรูปแบบที่เข้าข่ายสแปม'
    }
  }
  const urlMatches = text.match(/https?:\/\//gi)
  if (urlMatches && urlMatches.length > 4) {
    return 'ไม่อนุญาตให้แนบลิงก์ภายนอกเกิน 4 ลิงก์ในข้อความ'
  }
  return null
}

// ---------------------------------------------------------------------------
// 4. Binary Magic-Byte Validator for Inquiry Attachments (PDF + Photos, max 5)
// ---------------------------------------------------------------------------
export const MAX_INQUIRY_FILES = 5
export const MAX_INQUIRY_FILE_BYTES = 5 * 1024 * 1024 // 5 MB per file

export interface ValidatedAttachment {
  safeExt: string
  detectedMime: string
  originalName: string
  size: number
  data: Buffer
}

export function validateInquiryFile(
  filename: string,
  data: Buffer,
  maxBytes: number = MAX_INQUIRY_FILE_BYTES
): ValidatedAttachment {
  if (!filename || !data || data.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'ไฟล์แนบว่างเปล่าหรือไม่สมบูรณ์' })
  }

  if (data.length > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024))
    throw createError({
      statusCode: 400,
      statusMessage: `ไฟล์ "${filename}" มีขนาดเกิน ${mb}MB`
    })
  }

  const ext = extname(filename).toLowerCase()

  // Verify real binary magic bytes (prevents disguised .php/.html/.exe/.svg XSS)
  // PDF: 25 50 44 46 2D (%PDF-)
  const isPdf =
    data.length >= 5 &&
    data[0] === 0x25 &&
    data[1] === 0x50 &&
    data[2] === 0x44 &&
    data[3] === 0x46 &&
    data[4] === 0x2d

  // JPEG: FF D8 FF
  const isJpeg = data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    data.length >= 8 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47 &&
    data[4] === 0x0d &&
    data[5] === 0x0a &&
    data[6] === 0x1a &&
    data[7] === 0x0a

  // GIF: GIF87a / GIF89a
  const isGif =
    data.length >= 6 &&
    data[0] === 0x47 &&
    data[1] === 0x49 &&
    data[2] === 0x46 &&
    data[3] === 0x38 &&
    (data[4] === 0x37 || data[4] === 0x39) &&
    data[5] === 0x61

  // WEBP: RIFF....WEBP
  const isWebp =
    data.length >= 12 &&
    data.subarray(0, 4).toString('ascii') === 'RIFF' &&
    data.subarray(8, 12).toString('ascii') === 'WEBP'

  let detectedMime = ''
  let safeExt = ''

  if (isPdf && ext === '.pdf') {
    detectedMime = 'application/pdf'
    safeExt = '.pdf'
  } else if (isJpeg && (ext === '.jpg' || ext === '.jpeg' || ext === '.jfif' || ext === '')) {
    detectedMime = 'image/jpeg'
    safeExt = '.jpg'
  } else if (isPng && (ext === '.png' || ext === '')) {
    detectedMime = 'image/png'
    safeExt = '.png'
  } else if (isGif && (ext === '.gif' || ext === '')) {
    detectedMime = 'image/gif'
    safeExt = '.gif'
  } else if (isWebp && (ext === '.webp' || ext === '')) {
    detectedMime = 'image/webp'
    safeExt = '.webp'
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: `ไฟล์ "${filename}" ไม่ได้รับอนุญาต (รองรับเฉพาะรูปภาพ JPG, PNG, WEBP, GIF และเอกสาร PDF แท้เท่านั้น)`
    })
  }

  const cleanOriginalName = filename
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9._\- ]/g, '_')
    .slice(0, 100)

  return {
    safeExt,
    detectedMime,
    originalName: cleanOriginalName,
    size: data.length,
    data
  }
}

// ---------------------------------------------------------------------------
// 5. CSRF Origin / Referer Verification for State-Changing Requests
// ---------------------------------------------------------------------------
export function verifySameOriginRequest(event: H3Event) {
  const method = (event.method || 'GET').toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return

  const reqHost = (getRequestHost(event, { xForwardedHost: true }) || '').toLowerCase()
  if (!reqHost) return

  const origin = getHeader(event, 'origin')
  if (origin) {
    try {
      const originHost = new URL(origin).host.toLowerCase()
      if (originHost !== reqHost) {
        throw createError({
          statusCode: 403,
          statusMessage: 'ปฏิเสธคำขอข้ามโดเมนเพื่อความปลอดภัย (CSRF Origin Mismatch)'
        })
      }
      return
    } catch (err: any) {
      if (err?.statusCode === 403) throw err
      throw createError({
        statusCode: 403,
        statusMessage: 'รูปแบบ Origin ไม่ถูกต้อง'
      })
    }
  }

  const referer = getHeader(event, 'referer')
  if (referer) {
    try {
      const refHost = new URL(referer).host.toLowerCase()
      if (refHost !== reqHost) {
        throw createError({
          statusCode: 403,
          statusMessage: 'ปฏิเสธคำขอข้ามโดเมนเพื่อความปลอดภัย (CSRF Referer Mismatch)'
        })
      }
      return
    } catch (err: any) {
      if (err?.statusCode === 403) throw err
      throw createError({
        statusCode: 403,
        statusMessage: 'รูปแบบ Referer ไม่ถูกต้อง'
      })
    }
  }

  const secFetchSite = (getHeader(event, 'sec-fetch-site') || '').toLowerCase()
  if (secFetchSite === 'cross-site') {
    throw createError({
      statusCode: 403,
      statusMessage: 'ปฏิเสธคำขอ Cross-Site ที่ไม่ระบุ Origin'
    })
  }
}

// ---------------------------------------------------------------------------
// 6. SSRF Guard for Outbound Media Backup URLs
// ---------------------------------------------------------------------------
export function isSafeExternalHttpUrl(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false
    const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    if (
      host === 'localhost' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
      /^(fc|fd|fe80):/i.test(host)
    ) {
      return false
    }
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// 7. Signed Access Tokens for Private Customer Inquiry Attachments (PDPA)
// ---------------------------------------------------------------------------
const INQUIRY_FILE_SIGN_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days for staff Email/LINE links

export function signInquiryAttachmentUrl(urlPath: string, secret: string): string {
  const cleanRel = urlPath.replace(/^\/uploads\//, '')
  const exp = Date.now() + INQUIRY_FILE_SIGN_TTL_MS
  const sig = createHmac('sha256', secret)
    .update(`inq-file:${cleanRel}:${exp}`)
    .digest('base64url')
    .slice(0, 24)
  const sep = urlPath.includes('?') ? '&' : '?'
  return `${urlPath}${sep}exp=${exp}&sig=${sig}`
}

export function verifyInquiryAttachmentSignature(
  cleanRelPath: string,
  expRaw: string | undefined,
  sigRaw: string | undefined,
  secret: string
): boolean {
  const exp = Number(expRaw || 0)
  if (!exp || !sigRaw || Date.now() > exp) return false
  const expected = createHmac('sha256', secret)
    .update(`inq-file:${cleanRelPath}:${exp}`)
    .digest('base64url')
    .slice(0, 24)
  const a = Buffer.from(sigRaw)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// ---------------------------------------------------------------------------
// 8. HTML Sanitizer for Content Rendering (blocks entity/SVG/MathML XSS vectors)
// ---------------------------------------------------------------------------
function decodeHtmlEntitiesForSchemeCheck(val: string): string {
  return val
    .replace(/&#x([0-9a-f]+);?/gi, (_m, hex) => String.fromCodePoint(parseInt(hex, 16) || 0))
    .replace(/&#([0-9]+);?/g, (_m, dec) => String.fromCodePoint(parseInt(dec, 10) || 0))
    .replace(/&colon;/gi, ':')
    .replace(/&tab;|&newline;/gi, '')
    .replace(/[\u0000-\u0020]+/g, '')
    .toLowerCase()
}

export function isSafeHtmlUrlAttribute(rawAttrVal: string): boolean {
  const normalized = decodeHtmlEntitiesForSchemeCheck(rawAttrVal)
  if (!normalized) return true
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('data:text/') ||
    normalized.startsWith('data:application/')
  ) {
    return false
  }
  return true
}

export function sanitizeHtmlContent(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(
      /<(script|iframe|object|embed|applet|svg|math|form|meta|link|style|base|template|textarea|button|input|select)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ''
    )
    .replace(
      /<(script|iframe|object|embed|applet|svg|math|form|meta|link|style|base|template|textarea|button|input|select)\b[^>]*\/?>/gi,
      ''
    )
    .replace(/\s(?:on[a-z]+|srcdoc|formaction)\s*=\s*(['"])[\s\S]*?\1/gi, '')
    .replace(/\s(?:on[a-z]+|srcdoc|formaction)\s*=\s*[^\s>]+/gi, '')
    .replace(/\b(href|src|xlink:href)\s*=\s*(['"])([\s\S]*?)\2/gi, (full, attr, q, val) => {
      return isSafeHtmlUrlAttribute(val) ? full : `${attr}=${q}#${q}`
    })
}
