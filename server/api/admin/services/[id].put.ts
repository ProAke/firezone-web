import { requireAdmin } from '../../../utils/auth'
import { getDb, slugifyText } from '../../../utils/db'
import {
  autoExcerpt,
  extractFirstImageFromHtml,
  sanitizeRichHtmlForStorage
} from '../../../../utils/seo'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสบริการไม่ถูกต้อง' })

  const body = await readBody(event)
  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุชื่อบริการ' })

  const db = getDb()
  let slug = slugifyText(body?.slug || title)
  if (db.prepare('SELECT id FROM services WHERE slug = ? AND id != ?').get(slug, id)) {
    slug = `${slug}-${id}`
  }

  const type = body?.type === 'equipment' ? 'equipment' : 'service'
  const content = sanitizeRichHtmlForStorage(body?.content)
  const excerpt = String(body?.excerpt || '').trim() || autoExcerpt('', content, title, 180)
  const image = String(body?.image || '').trim() || extractFirstImageFromHtml(content)
  const sortOrder = Number(body?.sortOrder) || 0
  const seoTitle = String(body?.seoTitle || '').trim()
  const seoDescription = String(body?.seoDescription || '').trim()
  const seoKeywords = String(body?.seoKeywords || '').trim()

  db.prepare(
    `UPDATE services
     SET slug = ?, type = ?, title = ?, excerpt = ?, content = ?, image = ?, sort_order = ?,
         seo_title = ?, seo_description = ?, seo_keywords = ?
     WHERE id = ?`
  ).run(slug, type, title, excerpt, content, image, sortOrder, seoTitle, seoDescription, seoKeywords, id)

  return { ok: true, id, slug }
})
