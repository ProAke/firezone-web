import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '').trim()
  const db = getDb()

  const existing = db
    .prepare('SELECT id, is_system as isSystem FROM pages WHERE slug = ? OR CAST(id AS TEXT) = ?')
    .get(rawSlug, rawSlug) as { id: number; isSystem: number } | undefined

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหน้าเว็บ' })
  }
  if (existing.isSystem) {
    throw createError({ statusCode: 400, statusMessage: 'ไม่สามารถลบหน้าหลักของระบบได้' })
  }

  db.prepare('DELETE FROM pages WHERE id = ?').run(existing.id)
  return { ok: true }
})
