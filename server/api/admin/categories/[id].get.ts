import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสหมวดหมู่ไม่ถูกต้อง' })

  const db = getDb()
  const category = db
    .prepare(`
      SELECT
        id,
        name,
        slug,
        parent_id as parentId,
        sort_order as sortOrder,
        description,
        seo_title as seoTitle,
        seo_description as seoDescription,
        seo_keywords as seoKeywords
      FROM categories
      WHERE id = ?
    `)
    .get(id) as Record<string, any> | undefined

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข' })
  }

  return { category }
})
