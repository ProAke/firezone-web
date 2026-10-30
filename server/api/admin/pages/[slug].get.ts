import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '').trim()
  if (!rawSlug) throw createError({ statusCode: 400, statusMessage: 'ไม่พบรหัสหน้าเว็บ' })

  const db = getDb()
  const page = db
    .prepare(`
      SELECT
        id,
        slug,
        title,
        subtitle,
        excerpt,
        content,
        image,
        is_system as isSystem,
        is_active as isActive,
        seo_title as seoTitle,
        seo_description as seoDescription,
        seo_keywords as seoKeywords,
        updated_at as updatedAt
      FROM pages
      WHERE slug = ? OR CAST(id AS TEXT) = ?
    `)
    .get(rawSlug, rawSlug) as Record<string, any> | undefined

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหน้าเว็บที่ต้องการแก้ไข' })
  }

  return { page }
})
