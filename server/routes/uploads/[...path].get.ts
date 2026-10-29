import { createReadStream, existsSync, statSync } from 'node:fs'
import { basename, extname, join, resolve, sep } from 'node:path'
import { sendStream } from 'h3'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
}

export default defineEventHandler((event) => {
  const rawPath = decodeURIComponent(getRouterParam(event, 'path') || '')
  if (!rawPath || rawPath.includes('\0')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  const uploadsRoot = resolve(process.cwd(), 'data', 'uploads')
  const fullPath = resolve(uploadsRoot, rawPath)

  // Strict directory boundary check (blocks any path traversal)
  if (!fullPath.startsWith(uploadsRoot + sep) || !existsSync(fullPath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const stat = statSync(fullPath)
  if (!stat.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Not a file' })
  }

  const ext = extname(fullPath).toLowerCase()
  const contentType = MIME_MAP[ext] || 'application/octet-stream'

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  // Prevent any active script execution from uploaded files
  setHeader(
    event,
    'Content-Security-Policy',
    "default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; sandbox"
  )

  if (ext === '.pdf' || contentType === 'application/octet-stream') {
    setHeader(event, 'Content-Disposition', `inline; filename="${basename(fullPath).replace(/[^a-zA-Z0-9._-]/g, '_')}"`)
  }

  // Inquiry attachments should not be indexed by search engines
  if (rawPath.startsWith('inquiries/')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
    setHeader(event, 'Cache-Control', 'private, max-age=3600')
  } else {
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
  }

  return sendStream(event, createReadStream(fullPath))
})
