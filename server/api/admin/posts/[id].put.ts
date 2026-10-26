import { requireAdmin } from '../../../utils/auth'
import { getDb, slugifyText } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสรายการไม่ถูกต้อง' })

  const body = await readBody(event)
  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุหัวข้อ' })

  const db = getDb()
  let slug = slugifyText(body?.slug || title)
  if (db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(slug, id)) {
    slug = `${slug}-${id}`
  }

  const type = body?.type === 'news' ? 'news' : 'portfolio'
  const excerpt = String(body?.excerpt || '').trim()
  const content = String(body?.content || '').trim()
  const image = String(body?.image || '').trim()
  const gallery = Array.isArray(body?.gallery) ? body.gallery.map(String).filter(Boolean) : []
  const publishedAt = String(body?.publishedAt || new Date().toISOString().slice(0, 10))
  const isActive = body?.isActive === false || body?.isActive === 0 ? 0 : 1

  db.prepare(
    `UPDATE posts
     SET slug = ?, type = ?, title = ?, excerpt = ?, content = ?, image = ?, gallery_json = ?, published_at = ?, is_active = ?
     WHERE id = ?`
  ).run(slug, type, title, excerpt, content, image, JSON.stringify(gallery), publishedAt, isActive, id)

  return { ok: true, id, slug }
})
