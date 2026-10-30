import { getDb, getPublicSettingsMap } from '../utils/db'

export default defineEventHandler(() => {
  const db = getDb()
  const settings = getPublicSettingsMap(db)

  const equipmentItems = db
    .prepare(
      `SELECT id, slug, legacy_slug as legacySlug, type, title, excerpt, image, sort_order as sortOrder
       FROM services WHERE type = 'equipment' ORDER BY sort_order ASC, id ASC`
    )
    .all()

  const serviceItems = db
    .prepare(
      `SELECT id, slug, legacy_slug as legacySlug, type, title, excerpt, image, sort_order as sortOrder
       FROM services WHERE type = 'service' ORDER BY sort_order ASC, id ASC`
    )
    .all()

  const portfolioRaw = db
    .prepare(
      `SELECT id, slug, legacy_slug as legacySlug, type, title, excerpt, image, gallery_json as galleryJson, published_at as publishedAt
       FROM posts WHERE type = 'portfolio' AND is_active = 1
       ORDER BY published_at DESC, id DESC LIMIT 6`
    )
    .all() as Array<Record<string, any>>

  const portfolio = portfolioRaw.map((p) => ({
    ...p,
    gallery: safeParseJson(p.galleryJson, [])
  }))

  const newsRaw = db
    .prepare(
      `SELECT id, slug, legacy_slug as legacySlug, type, title, excerpt, image, published_at as publishedAt
       FROM posts WHERE type = 'news' AND is_active = 1
       ORDER BY published_at DESC, id DESC LIMIT 3`
    )
    .all()

  const featuredProducts = db
    .prepare(
      `SELECT p.id, p.slug, p.name, p.brand, p.excerpt, p.image
       FROM products p
       WHERE p.is_active = 1
       ORDER BY p.id ASC LIMIT 8`
    )
    .all()

  return {
    settings,
    heroSlides: safeParseJson(settings.heroSlidesJson, []),
    brands: safeParseJson(settings.brandsJson, []),
    clients: safeParseJson(settings.clientsJson, []),
    equipmentItems,
    serviceItems,
    portfolio,
    news: newsRaw,
    featuredProducts
  }
})

function safeParseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
