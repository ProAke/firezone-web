import { requireAdmin } from '../../utils/auth'
import { getDb, slugifyText } from '../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อบริการ' })

  const db = getDb()
  let slug = slugifyText(body?.slug || title)
  if (db.prepare('SELECT id FROM services WHERE slug = ?').get(slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  const type = body?.type === 'equipment' ? 'equipment' : 'service'
  const excerpt = String(body?.excerpt || '').trim()
  const content = String(body?.content || '').trim()
  const image = String(body?.image || '').trim()
  const sortOrder = Number(body?.sortOrder) || 0

  const res = db
    .prepare(
      'INSERT INTO services (slug, legacy_slug, type, title, excerpt, content, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(slug, '', type, title, excerpt, content, image, sortOrder)

  return { ok: true, id: Number(res.lastInsertRowid), slug }
})
