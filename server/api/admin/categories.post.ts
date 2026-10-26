import { requireAdmin } from '../../utils/auth'
import { getDb, slugifyText } from '../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อหมวดหมู่' })

  const db = getDb()
  let slug = slugifyText(body?.slug || name)
  if (db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  const parentId = body?.parentId ? Number(body.parentId) : null
  const sortOrder = Number(body?.sortOrder) || 0
  const description = String(body?.description || '').trim()

  const res = db
    .prepare('INSERT INTO categories (name, slug, parent_id, sort_order, description) VALUES (?, ?, ?, ?, ?)')
    .run(name, slug, parentId, sortOrder, description)

  return { ok: true, id: Number(res.lastInsertRowid), slug }
})
