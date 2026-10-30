import { requireAdmin } from '../../utils/auth'
import { getDb, slugifyText } from '../../utils/db'
import {
  autoExcerpt,
  extractFirstImageFromHtml,
  sanitizeRichHtmlForStorage
} from '../../../utils/seo'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  const name = String(body?.name || '').trim()
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อสินค้า' })
  }

  const db = getDb()
  let slug = slugifyText(body?.slug || name)
  const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  const brand = String(body?.brand || '').trim()
  const description = sanitizeRichHtmlForStorage(body?.description)
  const excerpt = String(body?.excerpt || '').trim() || autoExcerpt('', description, name, 180)
  const image = String(body?.image || '').trim() || extractFirstImageFromHtml(description)
  const datasheetUrl = String(body?.datasheetUrl || '').trim()
  const isActive = body?.isActive === false || body?.isActive === 0 ? 0 : 1
  const seoTitle = String(body?.seoTitle || '').trim()
  const seoDescription = String(body?.seoDescription || '').trim()
  const seoKeywords = String(body?.seoKeywords || '').trim()
  const categoryIds: number[] = Array.isArray(body?.categoryIds)
    ? body.categoryIds.map(Number).filter(Boolean)
    : []

  const now = new Date().toISOString()
  const res = db
    .prepare(`
      INSERT INTO products (
        slug, name, brand, excerpt, description, image, datasheet_url, is_active,
        seo_title, seo_description, seo_keywords, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      slug,
      name,
      brand,
      excerpt,
      description,
      image,
      datasheetUrl,
      isActive,
      seoTitle,
      seoDescription,
      seoKeywords,
      now,
      now
    )

  const productId = Number(res.lastInsertRowid)
  const insertCat = db.prepare(
    'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)'
  )
  for (const cid of categoryIds) {
    insertCat.run(productId, cid)
  }

  return { ok: true, id: productId, slug }
})
