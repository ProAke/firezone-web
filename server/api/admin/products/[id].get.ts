import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสสินค้าไม่ถูกต้อง' })

  const db = getDb()
  const product = db
    .prepare(`
      SELECT
        id,
        slug,
        legacy_slug as legacySlug,
        name,
        brand,
        excerpt,
        description,
        image,
        datasheet_url as datasheetUrl,
        is_active as isActive,
        seo_title as seoTitle,
        seo_description as seoDescription,
        seo_keywords as seoKeywords,
        created_at as createdAt,
        updated_at as updatedAt
      FROM products
      WHERE id = ?
    `)
    .get(id) as Record<string, any> | undefined

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบสินค้าที่ต้องการแก้ไข' })
  }

  const cats = db
    .prepare('SELECT category_id as id FROM product_categories WHERE product_id = ?')
    .all(id) as Array<{ id: number }>

  return {
    product: {
      ...product,
      categoryIds: cats.map((c) => c.id)
    }
  }
})
