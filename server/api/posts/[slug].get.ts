import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const rawSlug = decodeURIComponent(getRouterParam(event, 'slug') || '')
    .trim()
    .replace(/\.htm$/i, '')

  const post = db
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
      WHERE (LOWER(slug) = LOWER(?) OR legacy_slug = ? OR CAST(id AS TEXT) = ?) AND is_active = 1
    `)
    .get(rawSlug, rawSlug, rawSlug) as Record<string, any> | undefined

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'ไม่พบบทความหรือผลงานที่ต้องการ'
    })
  }

  let gallery: string[] = []
  try {
    gallery = JSON.parse(post.galleryJson || '[]')
  } catch {
    gallery = []
  }

  const recent = db
    .prepare(`
      SELECT id, slug, type, title, image, published_at as publishedAt
      FROM posts
      WHERE type = ? AND id != ? AND is_active = 1
      ORDER BY published_at DESC, id DESC
      LIMIT 5
    `)
    .all(post.type, post.id)

  return {
    post: {
      ...post,
      gallery
    },
    recent
  }
})
