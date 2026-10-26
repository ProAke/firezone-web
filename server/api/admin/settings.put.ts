import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'ข้อมูลไม่ถูกต้อง' })
  }

  const db = getDb()
  const upsert = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  )

  for (const [key, val] of Object.entries(body)) {
    if (typeof val === 'string') {
      upsert.run(key, val)
    } else if (val !== undefined && val !== null) {
      upsert.run(key, JSON.stringify(val))
    }
  }

  return { ok: true }
})
