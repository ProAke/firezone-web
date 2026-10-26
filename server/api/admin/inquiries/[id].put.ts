import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสข้อความไม่ถูกต้อง' })

  const body = await readBody(event)
  const status = ['new', 'read', 'contacted', 'archived'].includes(body?.status) ? body.status : 'read'
  const adminNote = String(body?.adminNote ?? '').trim()

  const db = getDb()
  db.prepare('UPDATE inquiries SET status = ?, admin_note = ? WHERE id = ?').run(status, adminNote, id)
  return { ok: true }
})
