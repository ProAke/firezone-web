import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'รหัสรายการไม่ถูกต้อง' })

  const db = getDb()
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
        is_active as isActive,
        seo_title as seoTitle,
        seo_description as seoDescription,
        seo_keywords as seoKeywords
      FROM posts
      WHERE id = ?
    `)
    .get(id) as Record<string, any> | undefined

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบข้อมูลที่ต้องการแก้ไข' })
  }

  let gallery: string[] = []
  try {
    gallery = JSON.parse(post.galleryJson || '[]')
    if (!Array.isArray(gallery)) gallery = []
  } catch {
    gallery = []
  }

  return {
    post: {
      ...post,
      gallery
    }
  }
})
