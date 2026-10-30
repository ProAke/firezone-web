import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { getDb, getOrCreateInternalSessionSecret } from './db'
import { verifySameOriginRequest } from './security'

const COOKIE_NAME = 'fz_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days
const INSECURE_PLACEHOLDER_SECRETS = new Set([
  '',
  'fz-nuxt-cms-secret-key-2026-secure',
  'firezone-cms-change-this-secret-in-production'
])
const DUMMY_SALT = randomBytes(16).toString('hex')
const DUMMY_KEY = scryptSync('dummy-constant-time-guard', DUMMY_SALT, 64)

export function getEffectiveSessionSecret(event?: H3Event): string {
  const fromConfig = event ? String(useRuntimeConfig(event).sessionSecret || '').trim() : ''
  const fromEnv = String(process.env.SESSION_SECRET || '').trim()
  const candidate = fromEnv || fromConfig
  if (candidate && candidate.length >= 24 && !INSECURE_PLACEHOLDER_SECRETS.has(candidate)) {
    return candidate
  }
  return getOrCreateInternalSessionSecret()
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) {
    // Perform constant-work dummy scrypt to prevent username enumeration timing side-channels
    const derivedDummy = scryptSync(password.slice(0, 256), DUMMY_SALT, 64)
    timingSafeEqual(DUMMY_KEY, derivedDummy)
    return false
  }
  const [salt, key] = storedHash.split(':')
  if (!salt || !key) return false
  const keyBuffer = Buffer.from(key, 'hex')
  const derivedKey = scryptSync(password.slice(0, 256), salt, 64)
  if (keyBuffer.length !== derivedKey.length) return false
  return timingSafeEqual(keyBuffer, derivedKey)
}

function computePasswordHashFingerprint(passwordHash: string, secret: string): string {
  return createHmac('sha256', secret).update(`pwfp:${passwordHash}`).digest('base64url').slice(0, 16)
}

export function createSessionToken(
  username: string,
  secret: string,
  passwordHash?: string
): string {
  const exp = Date.now() + SESSION_TTL_MS
  const ph = passwordHash ? computePasswordHashFingerprint(passwordHash, secret) : ''
  const payload = Buffer.from(JSON.stringify({ u: username, exp, ph })).toString('base64url')
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifySessionToken(
  token: string | undefined,
  secret: string
): { username: string; ph: string } | null {
  if (!token || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expectedSig = createHmac('sha256', secret).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data?.u || typeof data.exp !== 'number' || Date.now() > data.exp) {
      return null
    }
    return { username: String(data.u), ph: String(data.ph || '') }
  } catch {
    return null
  }
}

export function setAdminSessionCookie(
  event: H3Event,
  username: string,
  passwordHash?: string
) {
  const secret = getEffectiveSessionSecret(event)
  let resolvedHash = passwordHash
  if (!resolvedHash) {
    const db = getDb()
    const row = db
      .prepare('SELECT password_hash as passwordHash FROM admins WHERE username = ?')
      .get(username) as { passwordHash: string } | undefined
    resolvedHash = row?.passwordHash || ''
  }

  const token = createSessionToken(username, secret, resolvedHash)
  const isHttps = getRequestProtocol(event, { xForwardedProto: true }) === 'https'
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearAdminSessionCookie(event: H3Event) {
  const isHttps = getRequestProtocol(event, { xForwardedProto: true }) === 'https'
  deleteCookie(event, COOKIE_NAME, {
    path: '/',
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps
  })
}

export function getAdminUser(event: H3Event): { username: string } | null {
  const secret = getEffectiveSessionSecret(event)
  const token = getCookie(event, COOKIE_NAME)
  const verified = verifySessionToken(token, secret)
  if (!verified) return null

  const db = getDb()
  const admin = db
    .prepare('SELECT username, password_hash as passwordHash FROM admins WHERE username = ?')
    .get(verified.username) as { username: string; passwordHash: string } | undefined
  if (!admin) return null

  const expectedPh = computePasswordHashFingerprint(admin.passwordHash, secret)
  const a = Buffer.from(verified.ph)
  const b = Buffer.from(expectedPh)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null
  }

  return { username: admin.username }
}

export function requireAdmin(event: H3Event): { username: string } {
  verifySameOriginRequest(event)
  const user = getAdminUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'กรุณาเข้าสู่ระบบผู้ดูแลก่อนดำเนินการ'
    })
  }
  return user
}
