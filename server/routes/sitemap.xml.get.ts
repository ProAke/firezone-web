import { getDb, getPublicSettingsMap } from '../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const settings = getPublicSettingsMap(db)
  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const baseUrl = (settings.siteUrl || `${proto}://${host}`).replace(/\/+$/, '')
  const today = new Date().toISOString().slice(0, 10)

  const categories = db
    .prepare('SELECT slug FROM categories ORDER BY sort_order ASC')
    .all() as Array<{ slug: string }>

  const products = db
    .prepare('SELECT slug, updated_at as updatedAt FROM products WHERE is_active = 1 ORDER BY id ASC')
    .all() as Array<{ slug: string; updatedAt: string }>

  const services = db
    .prepare('SELECT slug FROM services ORDER BY sort_order ASC')
    .all() as Array<{ slug: string }>

  const posts = db
    .prepare('SELECT slug, type, published_at as publishedAt FROM posts WHERE is_active = 1 ORDER BY id DESC')
    .all() as Array<{ slug: string; type: string; publishedAt: string }>

  const customPages = db
    .prepare('SELECT slug, updated_at as updatedAt FROM pages WHERE is_system = 0 AND is_active = 1 ORDER BY id ASC')
    .all() as Array<{ slug: string; updatedAt: string }>

  const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
    { loc: `${baseUrl}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/shop`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/services`, lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { loc: `${baseUrl}/portfolio`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/news`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/about-us`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/privacy-policy`, lastmod: today, changefreq: 'yearly', priority: '0.4' }
  ]

  for (const pg of customPages) {
    urls.push({
      loc: `${baseUrl}/page/${encodeURIComponent(pg.slug)}`,
      lastmod: (pg.updatedAt || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7'
    })
  }

  for (const c of categories) {
    urls.push({
      loc: `${baseUrl}/shop/category/${encodeURIComponent(c.slug)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    })
  }

  for (const p of products) {
    urls.push({
      loc: `${baseUrl}/product/${encodeURIComponent(p.slug)}`,
      lastmod: (p.updatedAt || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.8'
    })
  }

  for (const s of services) {
    urls.push({
      loc: `${baseUrl}/service/${encodeURIComponent(s.slug)}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8'
    })
  }

  for (const post of posts) {
    const prefix = post.type === 'news' ? '/news/' : '/portfolio/'
    urls.push({
      loc: `${baseUrl}${prefix}${encodeURIComponent(post.slug)}`,
      lastmod: (post.publishedAt || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7'
    })
  }

  const xmlItems = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(u.lastmod || today)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`
})

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
