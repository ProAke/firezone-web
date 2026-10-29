export default defineEventHandler((event) => {
  const path = event.path || ''

  // Core OWASP HTTP Security Headers
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'X-Permitted-Cross-Domain-Policies', 'none')
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Prevent browser caching of sensitive Admin API responses
  if (path.startsWith('/api/admin')) {
    setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, private')
  }

  // Isolate user-uploaded files so no active script can ever execute under /uploads/
  if (path.startsWith('/uploads/')) {
    setHeader(
      event,
      'Content-Security-Policy',
      "default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; sandbox"
    )
  } else {
    // Baseline CSP blocking Flash/Java/object embeds & <base> hijacking while keeping GA4/GTM/Pixels & iframe preview working
    setHeader(
      event,
      'Content-Security-Policy',
      "base-uri 'self'; object-src 'none'; form-action 'self' https://access.line.me"
    )
  }
})
