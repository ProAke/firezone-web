import { requireAdmin } from '../../utils/auth'
import { getDb, slugifyText } from '../../utils/db'
import {
  autoExcerpt,
  extractFirstImageFromHtml,
  sanitizeRichHtmlForStorage
} from '../../../utils/seo'

const RESERVED_SYSTEM_SLUGS = new Set(['home', 'about-us', 'contact', 'privacy-policy'])

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const title = String(body?.title || '').trim()
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อหน้าเว็บ' })
  }

  const db = getDb()
  let slug = slugifyText(body?.slug || title)
  if (RESERVED_SYSTEM_SLUGS.has(slug) || db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  const subtitle = String(body?.subtitle || '').trim()
  const content = sanitizeRichHtmlForStorage(body?.content)
  const excerpt = String(body?.excerpt || '').trim() || autoExcerpt('', content, title, 180)
  const image = String(body?.image || '').trim() || extractFirstImageFromHtml(content)
  const isActive = body?.isActive === false || body?.isActive === 0 ? 0 : 1
  const seoTitle = String(body?.seoTitle || '').trim()
  const seoDescription = String(body?.seoDescription || '').trim()
  const seoKeywords = String(body?.seoKeywords || '').trim()
  const now = new Date().toISOString()

  const res = db
    .prepare(`
      INSERT INTO pages (
        slug, title, subtitle, excerpt, content, image, is_system, is_active,
        seo_title, seo_description, seo_keywords, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)
    `)
    .run(slug, title, subtitle, excerpt, content, image, isActive, seoTitle, seoDescription, seoKeywords, now)

  return { ok: true, id: Number(res.lastInsertRowid), slug }
})
