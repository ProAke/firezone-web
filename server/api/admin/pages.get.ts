import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = getDb()

  const items = db
    .prepare(`
      SELECT
        id,
        slug,
        title,
        subtitle,
        excerpt,
        image,
        is_system as isSystem,
        is_active as isActive,
        seo_title as seoTitle,
        seo_description as seoDescription,
        updated_at as updatedAt
      FROM pages
      ORDER BY is_system DESC, id ASC
    `)
    .all()

  return { items }
})
