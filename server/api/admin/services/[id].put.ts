import { requireAdmin } from '../../../utils/auth'
import { getDb, slugifyText } from '../../../utils/db'

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
  const excerpt = String(body?.excerpt || '').trim()
  const content = String(body?.content || '').trim()
  const image = String(body?.image || '').trim()
  const sortOrder = Number(body?.sortOrder) || 0

  db.prepare(
    'UPDATE services SET slug = ?, type = ?, title = ?, excerpt = ?, content = ?, image = ?, sort_order = ? WHERE id = ?'
  ).run(slug, type, title, excerpt, content, image, sortOrder, id)

  return { ok: true, id, slug }
})
