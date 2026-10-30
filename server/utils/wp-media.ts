import { existsSync, mkdirSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve, sep } from 'node:path'
import type { DatabaseSync } from 'node:sqlite'
import { isSafeExternalHttpUrl } from './security'

const MAX_REMOTE_MEDIA_BYTES = 20 * 1024 * 1024 // 20 MB cap

export const DEFAULT_WP_BACKUP_UPLOADS_URL = 'https://fz.uarea.in/uploads'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
}

const inFlightDownloads = new Map<string, Promise<FetchMediaOutcome>>()

export interface FetchMediaOutcome {
  status: 'cached' | 'not_found' | 'network_error'
  localPath?: string
  remoteUrl: string
}

export function getWpMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  return MIME_MAP[ext] || 'application/octet-stream'
}

export function sanitizeWpRelPath(rawRelPath: string): string | null {
  if (!rawRelPath || rawRelPath.includes('\0')) return null
  const decoded = rawRelPath
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      try {
        return decodeURIComponent(seg)
      } catch {
        return seg
      }
    })
    .join('/')

  if (!decoded || decoded.includes('..') || decoded.startsWith('/')) {
    return null
  }
  return decoded
}

export function encodeWpRelPathForUrl(cleanRelPath: string): string {
  return cleanRelPath
    .split('/')
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}

export function resolveLocalWpMediaPath(cleanRelPath: string): {
  cacheTarget: string
  existingPath: string | null
} | null {
  const wpCacheRoot = resolve(process.cwd(), 'data', 'uploads', 'wp')
  const publicWpRoot = resolve(process.cwd(), 'public', 'wp-content', 'uploads')

  const cacheTarget = resolve(wpCacheRoot, cleanRelPath)
  if (!cacheTarget.startsWith(wpCacheRoot + sep)) {
    return null
  }

  if (existsSync(cacheTarget) && statSync(cacheTarget).isFile()) {
    return { cacheTarget, existingPath: cacheTarget }
  }

  const publicTarget = resolve(publicWpRoot, cleanRelPath)
  if (
    publicTarget.startsWith(publicWpRoot + sep) &&
    existsSync(publicTarget) &&
    statSync(publicTarget).isFile()
  ) {
    return { cacheTarget, existingPath: publicTarget }
  }

  return { cacheTarget, existingPath: null }
}

function isValidMediaBuffer(buf: Buffer): boolean {
  if (!buf || buf.length < 8) return false
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return true
  }
  // GIF: GIF87a / GIF89a
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true
  // WEBP: RIFF....WEBP
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return true
  }
  // PDF: %PDF-
  if (
    buf[0] === 0x25 &&
    buf[1] === 0x50 &&
    buf[2] === 0x44 &&
    buf[3] === 0x46 &&
    buf[4] === 0x2d
  ) {
    return true
  }
  return false
}

export async function fetchAndCacheWpMedia(
  cleanRelPath: string,
  backupBaseUrl?: string
): Promise<FetchMediaOutcome> {
  const rawBase = (
    backupBaseUrl ||
    process.env.WP_BACKUP_UPLOADS_URL ||
    DEFAULT_WP_BACKUP_UPLOADS_URL
  ).replace(/\/+$/, '')

  const base = isSafeExternalHttpUrl(rawBase) ? rawBase : DEFAULT_WP_BACKUP_UPLOADS_URL

  const encodedRel = encodeWpRelPathForUrl(cleanRelPath)
  const primaryRemoteUrl = `${base}/${encodedRel}`

  const resolved = resolveLocalWpMediaPath(cleanRelPath)
  if (!resolved) {
    return { status: 'not_found', remoteUrl: primaryRemoteUrl }
  }
  if (resolved.existingPath) {
    return { status: 'cached', localPath: resolved.existingPath, remoteUrl: primaryRemoteUrl }
  }

  const existingPromise = inFlightDownloads.get(cleanRelPath)
  if (existingPromise) return existingPromise

  const job = (async (): Promise<FetchMediaOutcome> => {
    const candidateUrls = [primaryRemoteUrl]
    // Also try /wp-content/uploads/ on the same backup origin if base ends with /uploads
    if (base.endsWith('/uploads')) {
      const originOnly = base.slice(0, -'/uploads'.length)
      candidateUrls.push(`${originOnly}/wp-content/uploads/${encodedRel}`)
    }

    let hadNetworkFailure = false

    for (const url of candidateUrls) {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(12_000),
          headers: {
            Accept: 'image/*,application/pdf,*/*;q=0.8',
            'User-Agent': 'Fireszone-Nuxt-MediaSync/1.0'
          }
        })

        if (!res.ok) continue

        const contentType = (res.headers.get('content-type') || '').toLowerCase()
        if (contentType.includes('text/html')) continue

        const contentLength = Number(res.headers.get('content-length') || 0)
        if (contentLength > MAX_REMOTE_MEDIA_BYTES) continue

        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length > MAX_REMOTE_MEDIA_BYTES || !isValidMediaBuffer(buf)) continue

        mkdirSync(dirname(resolved.cacheTarget), { recursive: true })
        const tmpFile = `${resolved.cacheTarget}.${process.pid}.${Date.now()}.tmp`
        writeFileSync(tmpFile, buf)
        renameSync(tmpFile, resolved.cacheTarget)

        return {
          status: 'cached',
          localPath: resolved.cacheTarget,
          remoteUrl: url
        }
      } catch {
        hadNetworkFailure = true
      }
    }

    return {
      status: hadNetworkFailure ? 'network_error' : 'not_found',
      remoteUrl: primaryRemoteUrl
    }
  })()

  inFlightDownloads.set(cleanRelPath, job)
  try {
    return await job
  } finally {
    inFlightDownloads.delete(cleanRelPath)
  }
}

const EXTRA_STATIC_WP_PATHS = [
  '2021/01/banner1.png',
  '2021/02/Banner-2.jpg',
  '2021/02/Banner-3.jpg',
  '2021/02/Banner-4-2.jpg',
  '2021/01/server-2.jpg',
  '2021/02/server-3.jpg',
  '2021/01/bg-homeaboutus.png',
  '2021/01/bg-homefireszone3.png',
  '2021/01/qrcode.png'
]

export function collectAllReferencedWpRelPaths(db: DatabaseSync): string[] {
  const relSet = new Set<string>(EXTRA_STATIC_WP_PATHS)

  const extractFromText = (str: unknown) => {
    if (!str || typeof str !== 'string') return
    const regex = /(?:https?:\/\/(?:fireszone\.com|fz\.uarea\.in))?\/(?:wp-content\/)?uploads\/([^\s"'\\)\]]+)/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(str)) !== null) {
      const rawRel = match[1]
      if (!rawRel || rawRel.startsWith('inquiries/') || rawRel.startsWith('wp/')) continue
      const clean = sanitizeWpRelPath(rawRel)
      if (clean) relSet.add(clean)
    }
  }

  for (const r of db.prepare('SELECT value FROM settings').all() as Array<{ value: string }>) {
    extractFromText(r.value)
  }
  for (const r of db.prepare('SELECT image, datasheet_url FROM products').all() as Array<{
    image: string
    datasheet_url: string
  }>) {
    extractFromText(r.image)
    extractFromText(r.datasheet_url)
  }
  for (const r of db.prepare('SELECT image, content FROM services').all() as Array<{
    image: string
    content: string
  }>) {
    extractFromText(r.image)
    extractFromText(r.content)
  }
  for (const r of db.prepare('SELECT image, gallery_json, content FROM posts').all() as Array<{
    image: string
    gallery_json: string
    content: string
  }>) {
    extractFromText(r.image)
    extractFromText(r.gallery_json)
    extractFromText(r.content)
  }

  return Array.from(relSet)
}

export async function syncAllMissingWpMedia(
  db: DatabaseSync,
  backupBaseUrl?: string
): Promise<{
  total: number
  alreadyCached: number
  downloaded: number
  failed: number
  networkOffline: boolean
}> {
  const allRelPaths = collectAllReferencedWpRelPaths(db)
  let alreadyCached = 0
  const missing: string[] = []

  for (const rel of allRelPaths) {
    const resolved = resolveLocalWpMediaPath(rel)
    if (resolved?.existingPath) {
      alreadyCached++
    } else {
      missing.push(rel)
    }
  }

  if (missing.length === 0) {
    return {
      total: allRelPaths.length,
      alreadyCached,
      downloaded: 0,
      failed: 0,
      networkOffline: false
    }
  }

  // Probe the first missing item first so offline sandboxes fail fast without 100 retries
  const firstOutcome = await fetchAndCacheWpMedia(missing[0]!, backupBaseUrl)
  if (firstOutcome.status === 'network_error') {
    return {
      total: allRelPaths.length,
      alreadyCached,
      downloaded: 0,
      failed: missing.length,
      networkOffline: true
    }
  }

  let downloaded = firstOutcome.status === 'cached' ? 1 : 0
  let failed = firstOutcome.status === 'cached' ? 0 : 1

  const rest = missing.slice(1)
  const concurrency = 5
  let cursor = 0

  async function worker() {
    while (cursor < rest.length) {
      const idx = cursor++
      const rel = rest[idx]!
      const res = await fetchAndCacheWpMedia(rel, backupBaseUrl)
      if (res.status === 'cached') downloaded++
      else failed++
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, rest.length) }, () => worker()))

  return {
    total: allRelPaths.length,
    alreadyCached,
    downloaded,
    failed,
    networkOffline: false
  }
}
