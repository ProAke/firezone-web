import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสรายการไม่ถูกต้อง' })

  const db = getDb()
  db.prepare('DELETE FROM posts WHERE id = ?').run(id)
  return { ok: true }
})
