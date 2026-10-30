import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '').trim()

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
      WHERE LOWER(slug) = LOWER(?) AND is_active = 1
    `)
    .get(rawSlug) as Record<string, any> | undefined

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหน้าเว็บไซต์ที่ต้องการ' })
  }

  return { page }
})
