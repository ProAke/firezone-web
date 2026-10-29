import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '').trim()

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
        is_active as isActive
      FROM products
      WHERE (LOWER(slug) = LOWER(?) OR LOWER(legacy_slug) = LOWER(?) OR CAST(id AS TEXT) = ?)
        AND is_active = 1
    `)
    .get(rawSlug, rawSlug, rawSlug) as Record<string, any> | undefined

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'ไม่พบสินค้าที่ต้องการ'
    })
  }

  const categories = db
    .prepare(`
      SELECT c.id, c.name, c.slug, c.parent_id as parentId
      FROM categories c
      JOIN product_categories pc ON pc.category_id = c.id
      WHERE pc.product_id = ?
      ORDER BY c.sort_order ASC
    `)
    .all(product.id) as Array<{ id: number; name: string; slug: string; parentId: number | null }>

  const firstCatId = categories[0]?.id
  const related = firstCatId
    ? db
        .prepare(`
          SELECT DISTINCT p.id, p.slug, p.name, p.brand, p.excerpt, p.image
          FROM products p
          JOIN product_categories pc ON pc.product_id = p.id
          WHERE pc.category_id = ? AND p.id != ? AND p.is_active = 1
          ORDER BY p.name ASC
          LIMIT 4
        `)
        .all(firstCatId, product.id)
    : []

  return {
    product: {
      ...product,
      categories
    },
    related
  }
})
