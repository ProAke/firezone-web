import { createReadStream, existsSync, statSync } from 'node:fs'
import { basename, extname, resolve, sep } from 'node:path'
import { sendStream } from 'h3'
import { getAdminUser, getEffectiveSessionSecret } from '../../utils/auth'
import { verifyInquiryAttachmentSignature } from '../../utils/security'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
}

export default defineEventHandler((event) => {
  let rawPath = ''
  try {
    rawPath = decodeURIComponent(getRouterParam(event, 'path') || '').replace(/^\/+/, '')
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path encoding' })
  }

  if (!rawPath || rawPath.includes('\0')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  // Private customer inquiry attachments (PDPA): allow ONLY authenticated Admin or HMAC-signed staff notification link
  if (rawPath.toLowerCase().startsWith('inquiries/')) {
    const admin = getAdminUser(event)
    if (!admin) {
      const query = getQuery(event)
      const validSig = verifyInquiryAttachmentSignature(
        rawPath,
        typeof query.exp === 'string' ? query.exp : undefined,
        typeof query.sig === 'string' ? query.sig : undefined,
        getEffectiveSessionSecret(event)
      )
      if (!validSig) {
        throw createError({
          statusCode: 403,
          statusMessage: 'ไม่อนุญาตให้เข้าถึงไฟล์แนบข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต'
        })
      }
    }
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
    setHeader(
      event,
      'Content-Disposition',
      `inline; filename="${basename(fullPath).replace(/[^a-zA-Z0-9._-]/g, '_')}"`
    )
  }

  if (rawPath.toLowerCase().startsWith('inquiries/')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')
    setHeader(event, 'Cache-Control', 'private, no-store')
  } else {
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
  }

  return sendStream(event, createReadStream(fullPath))
})
