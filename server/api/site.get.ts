import { getAllSettingsMap, getDb } from '../utils/db'

export default defineEventHandler(() => {
  const db = getDb()
  const settings = getAllSettingsMap(db)

  const categories = db
    .prepare(`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.parent_id as parentId,
        c.sort_order as sortOrder,
        c.description,
        (
          SELECT COUNT(DISTINCT pc.product_id)
          FROM product_categories pc
          JOIN products p ON p.id = pc.product_id
          WHERE p.is_active = 1
            AND (
              pc.category_id = c.id
              OR pc.category_id IN (SELECT child.id FROM categories child WHERE child.parent_id = c.id)
            )
        ) as productCount
      FROM categories c
      ORDER BY c.sort_order ASC, c.id ASC
    `)
    .all()

  let heroSlides = []
  let brands = []
  let clients = []
  try {
    heroSlides = JSON.parse(settings.heroSlidesJson || '[]')
  } catch {
    heroSlides = []
  }
  try {
    brands = JSON.parse(settings.brandsJson || '[]')
  } catch {
    brands = []
  }
  try {
    clients = JSON.parse(settings.clientsJson || '[]')
  } catch {
    clients = []
  }

  return {
    settings,
    heroSlides,
    brands,
    clients,
    categories
  }
})
