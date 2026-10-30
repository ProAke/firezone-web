import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { getEffectiveSessionSecret } from './auth'

const LINE_COOKIE = 'fz_line_profile'
const TTL_MS = 1000 * 60 * 60 * 24 * 3 // 3 days

export interface VerifiedLineSession {
  userId: string
  lineId: string
  displayName: string
  pictureUrl: string
  verified: number // 1 = LINE OAuth 2.0 verified, 2 = Quick LINE ID confirmed
}

export function setLineProfileCookie(event: H3Event, data: VerifiedLineSession) {
  const secret = getEffectiveSessionSecret(event)
  const exp = Date.now() + TTL_MS
  const payload = Buffer.from(JSON.stringify({ ...data, exp })).toString('base64url')
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  const isHttps = getRequestProtocol(event, { xForwardedProto: true }) === 'https'

  setCookie(event, LINE_COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
    maxAge: 60 * 60 * 24 * 3
  })
}

export function getLineProfileCookie(event: H3Event): VerifiedLineSession | null {
  const secret = getEffectiveSessionSecret(event)
  const raw = getCookie(event, LINE_COOKIE)
  if (!raw || !raw.includes('.')) return null
  const [payload, sig] = raw.split('.')
  if (!payload || !sig) return null

  const expected = createHmac('sha256', secret).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!parsed || typeof parsed.exp !== 'number' || Date.now() > parsed.exp) return null
    return {
      userId: String(parsed.userId || ''),
      lineId: String(parsed.lineId || ''),
      displayName: String(parsed.displayName || ''),
      pictureUrl: String(parsed.pictureUrl || ''),
      verified: Number(parsed.verified || 0)
    }
  } catch {
    return null
  }
}

export function clearLineProfileCookie(event: H3Event) {
  const isHttps = getRequestProtocol(event, { xForwardedProto: true }) === 'https'
  deleteCookie(event, LINE_COOKIE, {
    path: '/',
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps
  })
}
