import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสบริการไม่ถูกต้อง' })

  const db = getDb()
  const service = db
    .prepare(`
      SELECT
        id,
        slug,
        legacy_slug as legacySlug,
        type,
        title,
        excerpt,
        content,
        image,
        sort_order as sortOrder,
        seo_title as seoTitle,
        seo_description as seoDescription,
        seo_keywords as seoKeywords
      FROM services
      WHERE id = ?
    `)
    .get(id) as Record<string, any> | undefined

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบบริการที่ต้องการแก้ไข' })
  }

  return { service }
})
