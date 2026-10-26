export default defineNuxtRouteMiddleware((to) => {
  const decodedPath = decodeURIComponent(to.path).replace(/\/+$/, '') || '/'

  // Legacy WordPress admin URLs -> new Nuxt CMS admin
  if (decodedPath === '/wp-admin' || decodedPath === '/wp-login.php') {
    return navigateTo('/admin', { redirectCode: 301 })
  }

  // Legacy WordPress pages from fireszone.com
  if (decodedPath === '/blog-page') {
    return navigateTo('/portfolio', { redirectCode: 301 })
  }
  if (decodedPath === '/ติดต่อเรา' || decodedPath === '/contact-us') {
    return navigateTo('/contact', { redirectCode: 301 })
  }
  if (decodedPath === '/category/ข่าวสาร') {
    return navigateTo('/news', { redirectCode: 301 })
  }
  if (decodedPath === '/service-category/บริการของเรา' || decodedPath === '/our-services') {
    return navigateTo('/services', { redirectCode: 301 })
  }

  // Legacy WooCommerce category URLs: /product-category/control-panels/notifier
  if (decodedPath.startsWith('/product-category/')) {
    const segments = decodedPath.split('/').filter(Boolean)
    const lastSlug = segments[segments.length - 1]
    if (lastSlug) {
      return navigateTo(`/shop?category=${encodeURIComponent(lastSlug)}`, { redirectCode: 301 })
    }
  }

  // Legacy WordPress post permalink ending in .htm
  if (decodedPath.endsWith('.htm')) {
    const cleanSlug = decodedPath.replace(/^\//, '').replace(/\.htm$/i, '')
    if (cleanSlug) {
      return navigateTo(`/portfolio/${encodeURIComponent(cleanSlug)}`, { redirectCode: 301 })
    }
  }
})
