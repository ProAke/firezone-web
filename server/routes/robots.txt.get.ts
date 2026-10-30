import { getDb, getPublicSettingsMap } from '../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const settings = getPublicSettingsMap(db)
  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const baseUrl = (settings.siteUrl || `${proto}://${host}`).replace(/\/+$/, '')

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  // Do not advertise internal management paths in robots.txt (indexing is blocked via X-Robots-Tag headers)
  return [
    '# robots.txt for FIRESZONE & MANUFACTURING CO., LTD. (SEO + ASEO Enabled)',
    'User-agent: *',
    'Allow: /',
    '',
    '# Explicitly allow AI Search & Answer Engines (ASEO / GEO)',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    `# AI Context Index: ${baseUrl}/llms.txt`,
    `# AI Full Catalog: ${baseUrl}/llms-full.txt`
  ].join('\n')
})
