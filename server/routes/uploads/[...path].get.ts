import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { sendStream } from 'h3'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
}

export default defineEventHandler((event) => {
  const rawPath = getRouterParam(event, 'path') || ''
  const safeRel = normalize(rawPath).replace(/^(\.\.(\/|\\|$))+/, '')
  const uploadsRoot = join(process.cwd(), 'data', 'uploads')
  const fullPath = join(uploadsRoot, safeRel)

  if (!fullPath.startsWith(uploadsRoot) || !existsSync(fullPath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const stat = statSync(fullPath)
  if (!stat.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Not a file' })
  }

  const ext = extname(fullPath).toLowerCase()
  const contentType = MIME_MAP[ext] || 'application/octet-stream'
  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return sendStream(event, createReadStream(fullPath))
})
