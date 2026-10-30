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
  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุหัวข้อ' })

  const db = getDb()
  let slug = slugifyText(body?.slug || title)
  if (db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  const type = body?.type === 'news' ? 'news' : 'portfolio'
  const content = sanitizeRichHtmlForStorage(body?.content)
  const excerpt = String(body?.excerpt || '').trim() || autoExcerpt('', content, title, 180)
  const gallery = Array.isArray(body?.gallery) ? body.gallery.map(String).filter(Boolean) : []
  const image =
    String(body?.image || '').trim() ||
    gallery[0] ||
    extractFirstImageFromHtml(content)
  const publishedAt = String(body?.publishedAt || new Date().toISOString().slice(0, 10))
  const isActive = body?.isActive === false || body?.isActive === 0 ? 0 : 1
  const seoTitle = String(body?.seoTitle || '').trim()
  const seoDescription = String(body?.seoDescription || '').trim()
  const seoKeywords = String(body?.seoKeywords || '').trim()

  const res = db
    .prepare(
      `INSERT INTO posts (
         slug, legacy_slug, type, title, excerpt, content, image, gallery_json,
         published_at, is_active, seo_title, seo_description, seo_keywords
       )
       VALUES (?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      slug,
      type,
      title,
      excerpt,
      content,
      image,
      JSON.stringify(gallery),
      publishedAt,
      isActive,
      seoTitle,
      seoDescription,
      seoKeywords
    )

  return { ok: true, id: Number(res.lastInsertRowid), slug }
})
