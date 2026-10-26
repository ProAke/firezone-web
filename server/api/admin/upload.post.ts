import { mkdirSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { requireAdmin } from '../../utils/auth'

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.pdf'])

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const form = await readMultipartFormData(event)
  if (!form || !form.length) {
    throw createError({ statusCode: 400, statusMessage: 'ไม่พบไฟล์ที่อัปโหลด' })
  }

  const filePart = form.find((p) => p.name === 'file' && p.filename && p.data)
  if (!filePart || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'กรุณาเลือกไฟล์' })
  }

  const ext = extname(filePart.filename).toLowerCase()
  if (!ALLOWED_EXTS.has(ext)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'รองรับเฉพาะไฟล์รูปภาพ (.jpg, .png, .webp, .gif, .svg) และเอกสาร .pdf เท่านั้น'
    })
  }

  if (filePart.data.length > 15 * 1024 * 1024) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ขนาดไฟล์ต้องไม่เกิน 15MB'
    })
  }

  const uploadsDir = join(process.cwd(), 'data', 'uploads')
  mkdirSync(uploadsDir, { recursive: true })

  const safeBase = filePart.filename
    .replace(ext, '')
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, '-')
    .replace(/\-+/g, '-')
    .slice(0, 40) || 'upload'

  const uniqueName = `${Date.now()}-${randomBytes(3).toString('hex')}-${safeBase}${ext}`
  const fullPath = join(uploadsDir, uniqueName)

  writeFileSync(fullPath, filePart.data)

  return {
    ok: true,
    url: `/uploads/${uniqueName}`,
    filename: uniqueName
  }
})
