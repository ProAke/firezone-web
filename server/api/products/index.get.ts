import { getAdminUser } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const query = getQuery(event)

  const categoryParam = (query.category as string | undefined)?.trim() || ''
  const search = (query.search as string | undefined)?.trim() || ''
  const brand = (query.brand as string | undefined)?.trim() || ''
  const sort = (query.sort as string | undefined) || 'name_asc'
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 12))
  const includeInactive = query.includeInactive === '1' && Boolean(getAdminUser(event))

  const whereClauses: string[] = []
  const params: Array<string | number> = []

  if (!includeInactive) {
    whereClauses.push('p.is_active = 1')
  }

  let selectedCategory: Record<string, any> | null = null
  if (categoryParam) {
    const catRow = db
      .prepare(
        `SELECT id, name, slug, parent_id as parentId, description,
                seo_title as seoTitle, seo_description as seoDescription, seo_keywords as seoKeywords
         FROM categories WHERE slug = ? OR CAST(id AS TEXT) = ?`
      )
      .get(categoryParam, categoryParam) as Record<string, any> | undefined

    if (catRow) {
      selectedCategory = catRow
      whereClauses.push(`
        EXISTS (
          SELECT 1 FROM product_categories pc
          WHERE pc.product_id = p.id
            AND (
              pc.category_id = ?
              OR pc.category_id IN (SELECT id FROM categories WHERE parent_id = ?)
            )
        )
      `)
      params.push(catRow.id, catRow.id)
    } else {
      whereClauses.push('1 = 0')
    }
  }

  if (brand) {
    whereClauses.push('LOWER(p.brand) = LOWER(?)')
    params.push(brand)
  }

  if (search) {
    whereClauses.push('(p.name LIKE ? OR p.brand LIKE ? OR p.excerpt LIKE ? OR p.description LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like, like)
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

  let orderBySql = 'ORDER BY p.name ASC'
  if (sort === 'name_desc') orderBySql = 'ORDER BY p.name DESC'
  else if (sort === 'latest') orderBySql = 'ORDER BY p.id DESC'

  const totalRow = db
    .prepare(`SELECT COUNT(*) as total FROM products p ${whereSql}`)
    .get(...params) as { total: number }

  const offset = (page - 1) * perPage
  const rows = db
    .prepare(`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.brand,
        p.excerpt,
        p.description,
        p.image,
        p.datasheet_url as datasheetUrl,
        p.is_active as isActive,
        p.seo_title as seoTitle,
        p.seo_description as seoDescription,
        p.seo_keywords as seoKeywords,
        p.updated_at as updatedAt
      FROM products p
      ${whereSql}
      ${orderBySql}
      LIMIT ? OFFSET ?
    `)
    .all(...params, perPage, offset) as Array<Record<string, any>>

  const getProdCats = db.prepare(`
    SELECT c.id, c.name, c.slug, c.parent_id as parentId
    FROM categories c
    JOIN product_categories pc ON pc.category_id = c.id
    WHERE pc.product_id = ?
    ORDER BY c.sort_order ASC
  `)

  const items = rows.map((row) => {
    const cats = getProdCats.all(row.id) as Array<{ id: number; name: string; slug: string; parentId: number | null }>
    return {
      ...row,
      categories: cats,
      categoryIds: cats.map((c) => c.id)
    }
  })

  return {
    items,
    selectedCategory,
    pagination: {
      page,
      perPage,
      total: totalRow.total,
      totalPages: Math.max(1, Math.ceil(totalRow.total / perPage))
    }
  }
})
