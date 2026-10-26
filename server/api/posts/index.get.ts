import { getAdminUser } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const query = getQuery(event)

  const type = (query.type as string | undefined)?.trim() || ''
  const search = (query.search as string | undefined)?.trim() || ''
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 9))
  const includeInactive = query.includeInactive === '1' && Boolean(getAdminUser(event))

  const whereClauses: string[] = []
  const params: Array<string | number> = []

  if (!includeInactive) {
    whereClauses.push('is_active = 1')
  }
  if (type) {
    whereClauses.push('type = ?')
    params.push(type)
  }
  if (search) {
    whereClauses.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''
  const totalRow = db
    .prepare(`SELECT COUNT(*) as total FROM posts ${whereSql}`)
    .get(...params) as { total: number }

  const offset = (page - 1) * perPage
  const rows = db
    .prepare(`
      SELECT
        id,
        slug,
        legacy_slug as legacySlug,
        type,
        title,
        excerpt,
        content,
        image,
        gallery_json as galleryJson,
        published_at as publishedAt,
        is_active as isActive
      FROM posts
      ${whereSql}
      ORDER BY published_at DESC, id DESC
      LIMIT ? OFFSET ?
    `)
    .all(...params, perPage, offset) as Array<Record<string, any>>

  const items = rows.map((r) => ({
    ...r,
    gallery: safeParseArray(r.galleryJson)
  }))

  return {
    items,
    pagination: {
      page,
      perPage,
      total: totalRow.total,
      totalPages: Math.max(1, Math.ceil(totalRow.total / perPage))
    }
  }
})

function safeParseArray(raw: string | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
