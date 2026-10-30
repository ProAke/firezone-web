import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '').trim()

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
      WHERE LOWER(slug) = LOWER(?) OR legacy_slug = ? OR CAST(id AS TEXT) = ?
    `)
    .get(rawSlug, rawSlug, rawSlug) as Record<string, any> | undefined

  if (!service) {
    throw createError({
      statusCode: 404,
      statusMessage: 'ไม่พบบริการที่ต้องการ'
    })
  }

  const allServices = db
    .prepare(`
      SELECT id, slug, type, title, image
      FROM services
      ORDER BY sort_order ASC, id ASC
    `)
    .all()

  return {
    service,
    allServices
  }
})
