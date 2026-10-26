import { requireAdmin } from '../../../utils/auth'
import { getDb, slugifyText } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสสินค้าไม่ถูกต้อง' })

  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อสินค้า' })

  const db = getDb()
  let slug = slugifyText(body?.slug || name)
  const conflict = db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(slug, id)
  if (conflict) {
    slug = `${slug}-${id}`
  }

  const brand = String(body?.brand || '').trim()
  const excerpt = String(body?.excerpt || '').trim()
  const description = String(body?.description || '').trim()
  const image = String(body?.image || '').trim()
  const datasheetUrl = String(body?.datasheetUrl || '').trim()
  const isActive = body?.isActive === false || body?.isActive === 0 ? 0 : 1
  const categoryIds: number[] = Array.isArray(body?.categoryIds)
    ? body.categoryIds.map(Number).filter(Boolean)
    : []

  const now = new Date().toISOString()
  db.prepare(`
    UPDATE products
    SET slug = ?, name = ?, brand = ?, excerpt = ?, description = ?, image = ?, datasheet_url = ?, is_active = ?, updated_at = ?
    WHERE id = ?
  `).run(slug, name, brand, excerpt, description, image, datasheetUrl, isActive, now, id)

  db.prepare('DELETE FROM product_categories WHERE product_id = ?').run(id)
  const insertCat = db.prepare(
    'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)'
  )
  for (const cid of categoryIds) {
    insertCat.run(id, cid)
  }

  return { ok: true, id, slug }
})
