import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { requireAdmin } from '../../utils/auth'
import { validateInquiryFile } from '../../utils/security'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const form = await readMultipartFormData(event)
  if (!form || !form.length) {
    throw createError({ statusCode: 400, statusMessage: 'ไม่พบไฟล์ที่อัปโหลด' })
  }

  const filePart = form.find(
    (p) => (p.name === 'file' || p.name === 'upload') && p.filename && p.data
  )
  if (!filePart || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'กรุณาเลือกไฟล์' })
  }

  const validated = validateInquiryFile(
    filePart.filename,
    Buffer.from(filePart.data),
    15 * 1024 * 1024
  )

  const uploadsDir = join(process.cwd(), 'data', 'uploads')
  mkdirSync(uploadsDir, { recursive: true })

  const safeBase =
    validated.originalName
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40) || 'upload'

  const uniqueName = `${Date.now()}-${randomBytes(4).toString('hex')}-${safeBase}${validated.safeExt}`
  const fullPath = join(uploadsDir, uniqueName)

  writeFileSync(fullPath, validated.data)

  const url = `/uploads/${uniqueName}`

  return {
    ok: true,
    uploaded: 1,
    url,
    default: url,
    filename: uniqueName,
    fileName: uniqueName
  }
})
