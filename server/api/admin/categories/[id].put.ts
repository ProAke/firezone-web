import { requireAdmin } from '../../../utils/auth'
import { getDb, slugifyText } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสหมวดหมู่ไม่ถูกต้อง' })

  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อหมวดหมู่' })

  const db = getDb()
  let slug = slugifyText(body?.slug || name)
  if (db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(slug, id)) {
    slug = `${slug}-${id}`
  }

  const parentId = body?.parentId && Number(body.parentId) !== id ? Number(body.parentId) : null
  const sortOrder = Number(body?.sortOrder) || 0
  const description = String(body?.description || '').trim()

  db.prepare(
    'UPDATE categories SET name = ?, slug = ?, parent_id = ?, sort_order = ?, description = ? WHERE id = ?'
  ).run(name, slug, parentId, sortOrder, description, id)

  return { ok: true, id, slug }
})
