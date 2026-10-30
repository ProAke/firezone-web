import { requireAdmin } from '../../../utils/auth'
import { getDb, slugifyText } from '../../../utils/db'
import {
  autoExcerpt,
  extractFirstImageFromHtml,
  sanitizeRichHtmlForStorage
} from '../../../../utils/seo'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '').trim()
  if (!rawSlug) throw createError({ statusCode: 400, statusMessage: 'ไม่พบรหัสหน้าเว็บ' })

  const db = getDb()
  const existing = db
    .prepare('SELECT id, slug, is_system as isSystem FROM pages WHERE slug = ? OR CAST(id AS TEXT) = ?')
    .get(rawSlug, rawSlug) as { id: number; slug: string; isSystem: number } | undefined

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหน้าเว็บที่ต้องการแก้ไข' })
  }

  const body = await readBody(event)
  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อหน้าเว็บ' })

  let finalSlug = existing.slug
  if (!existing.isSystem && body?.slug) {
    const candidate = slugifyText(body.slug)
    const conflict = db
      .prepare('SELECT id FROM pages WHERE slug = ? AND id != ?')
      .get(candidate, existing.id)
    finalSlug = conflict ? `${candidate}-${existing.id}` : candidate
  }

  const subtitle = String(body?.subtitle || '').trim()
  const content = sanitizeRichHtmlForStorage(body?.content)
  const excerpt = String(body?.excerpt || '').trim() || autoExcerpt('', content, title, 180)
  const image = String(body?.image || '').trim() || extractFirstImageFromHtml(content)
  const isActive = existing.isSystem
    ? 1
    : body?.isActive === false || body?.isActive === 0
      ? 0
      : 1
  const seoTitle = String(body?.seoTitle || '').trim()
  const seoDescription = String(body?.seoDescription || '').trim()
  const seoKeywords = String(body?.seoKeywords || '').trim()
  const now = new Date().toISOString()

  db.prepare(`
    UPDATE pages
    SET slug = ?, title = ?, subtitle = ?, excerpt = ?, content = ?, image = ?,
        is_active = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = ?
    WHERE id = ?
  `).run(
    finalSlug,
    title,
    subtitle,
    excerpt,
    content,
    image,
    isActive,
    seoTitle,
    seoDescription,
    seoKeywords,
    now,
    existing.id
  )

  return { ok: true, id: existing.id, slug: finalSlug }
})
