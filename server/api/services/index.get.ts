import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const query = getQuery(event)
  const type = (query.type as string | undefined)?.trim() || ''

  const items = type
    ? db
        .prepare(
          `SELECT id, slug, legacy_slug as legacySlug, type, title, excerpt, content, image, sort_order as sortOrder
           FROM services WHERE type = ? ORDER BY sort_order ASC, id ASC`
        )
        .all(type)
    : db
        .prepare(
          `SELECT id, slug, legacy_slug as legacySlug, type, title, excerpt, content, image, sort_order as sortOrder
           FROM services ORDER BY sort_order ASC, id ASC`
        )
        .all()

  return { items }
})
