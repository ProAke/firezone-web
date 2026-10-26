import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสหมวดหมู่ไม่ถูกต้อง' })

  const db = getDb()
  db.prepare('UPDATE categories SET parent_id = NULL WHERE parent_id = ?').run(id)
  db.prepare('DELETE FROM product_categories WHERE category_id = ?').run(id)
  db.prepare('DELETE FROM categories WHERE id = ?').run(id)
  return { ok: true }
})
