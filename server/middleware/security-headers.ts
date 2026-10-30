export default defineEventHandler((event) => {
  // Normalize path case-insensitively to prevent case-variant header bypasses (GHSA-vjh5-4x84-xrqp)
  const rawPath = (event.path || '').split('?')[0] || ''
  const lowerPath = rawPath.toLowerCase()
  const isHttps = getRequestProtocol(event, { xForwardedProto: true }) === 'https'

  // Core OWASP HTTP Security Headers
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'X-XSS-Protection', '0')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'X-Permitted-Cross-Domain-Policies', 'none')
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()')

  if (isHttps) {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // Prevent browser caching & search engine indexing of Admin UI and Admin API responses
  if (lowerPath === '/admin' || lowerPath.startsWith('/admin/') || lowerPath.startsWith('/api/admin')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
    setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, private')
  } else if (lowerPath.startsWith('/ckeditor/')) {
    // Aggressively cache standalone pre-built CKEditor 5 bundle & CSS for instant 0ms subsequent loads
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Isolate user-uploaded files so no active script can ever execute under /uploads/
  if (lowerPath.startsWith('/uploads/')) {
    setHeader(
      event,
      'Content-Security-Policy',
      "default-src 'none'; img-src 'self' data: blob:; media-src 'self'; style-src 'unsafe-inline'; sandbox"
    )
  } else {
    // Baseline CSP blocking Flash/Java/object embeds & <base> hijacking while permitting YouTube embeds, blob/data image previews, Maps, Turnstile & GA4
    setHeader(
      event,
      'Content-Security-Policy',
      "base-uri 'self'; object-src 'none'; img-src 'self' data: blob: https: http:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https:; form-action 'self' https://access.line.me"
    )
  }
})
