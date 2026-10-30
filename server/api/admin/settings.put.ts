import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'ข้อมูลไม่ถูกต้อง' })
  }

  // Support both { settings: { ... } } and flat { key: value } payloads
  const payload =
    body.settings && typeof body.settings === 'object' && !Array.isArray(body.settings)
      ? body.settings
      : body

  const db = getDb()
  db.prepare("DELETE FROM settings WHERE key = 'settings'").run()

  const upsert = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  )

  for (const [key, val] of Object.entries(payload)) {
    if (key === 'settings') continue
    if (typeof val === 'string') {
      upsert.run(key, val)
    } else if (val !== undefined && val !== null) {
      upsert.run(key, JSON.stringify(val))
    }
  }

  return { ok: true }
})
