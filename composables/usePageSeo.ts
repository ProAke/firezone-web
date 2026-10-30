import {
  autoSeoDescription,
  autoSeoKeywords,
  buildVideoObjectsJsonLd,
  extractFirstImageFromHtml
} from '~/utils/seo'

export interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  seoTitle?: MaybeRefOrGetter<string | undefined>
  description?: MaybeRefOrGetter<string>
  seoDescription?: MaybeRefOrGetter<string | undefined>
  seoKeywords?: MaybeRefOrGetter<string | undefined>
  keywordParts?: MaybeRefOrGetter<Array<string | undefined | null> | undefined>
  htmlContent?: MaybeRefOrGetter<string | undefined>
  publishedAt?: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | undefined>
  path?: MaybeRefOrGetter<string | undefined>
  type?: 'website' | 'article' | 'product'
  jsonLd?: MaybeRefOrGetter<Record<string, any> | Array<Record<string, any>> | null | undefined>
}

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute()
  const { settings } = useSiteData()

  const baseUrl = computed(() =>
    (settings.value.siteUrl || 'https://fireszone.com').replace(/\/+$/, '')
  )

  const canonicalUrl = computed(() => {
    const p = toValue(options.path) || route.path || '/'
    return `${baseUrl.value}${p.startsWith('/') ? p : `/${p}`}`
  })

  const resolvedTitle = computed(() => {
    const custom = toValue(options.seoTitle)?.trim()
    if (custom) return custom
    return toValue(options.title) || settings.value.seoDefaultTitle || 'FIRESZONE'
  })

  const resolvedDesc = computed(() => {
    const custom = toValue(options.seoDescription)?.trim()
    const rawDesc = toValue(options.description) || ''
    const html = toValue(options.htmlContent) || ''
    const computedDesc = autoSeoDescription(custom, rawDesc, html, resolvedTitle.value)
    if (computedDesc) return computedDesc
    return (settings.value.seoDefaultDescription || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 260)
  })

  const resolvedKeywords = computed(() => {
    const custom = toValue(options.seoKeywords)?.trim()
    if (custom) return custom
    const parts = toValue(options.keywordParts) || []
    if (parts.length) {
      return autoSeoKeywords('', parts)
    }
    return settings.value.seoKeywords || autoSeoKeywords('', [resolvedTitle.value])
  })

  const resolvedImage = computed(() => {
    const explicitImg = toValue(options.image)?.trim()
    const contentImg = extractFirstImageFromHtml(toValue(options.htmlContent))
    const img = explicitImg || contentImg || settings.value.seoOgImage || '/logo-fz.jpg'
    if (img.startsWith('http://') || img.startsWith('https://')) return img
    return `${baseUrl.value}${img.startsWith('/') ? img : `/${img}`}`
  })

  useHead(() => {
    const ld = toValue(options.jsonLd)
    const html = toValue(options.htmlContent) || ''
    const videoLd = buildVideoObjectsJsonLd(html, {
      title: resolvedTitle.value,
      description: resolvedDesc.value,
      pageUrl: canonicalUrl.value,
      uploadDate: toValue(options.publishedAt)
    })

    const scripts: Array<{ type: string; innerHTML: string; key: string }> = []
    const allLd: Array<Record<string, any>> = []
    if (ld) {
      if (Array.isArray(ld)) allLd.push(...ld)
      else allLd.push(ld)
    }
    if (videoLd.length) {
      allLd.push(...videoLd)
    }

    allLd.forEach((obj, idx) => {
      scripts.push({
        key: `jsonld-${idx}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(obj)
      })
    })

    return {
      title: resolvedTitle.value,
      link: [{ rel: 'canonical', href: canonicalUrl.value }],
      meta: [
        { name: 'description', content: resolvedDesc.value },
        { name: 'keywords', content: resolvedKeywords.value },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
        { property: 'og:title', content: resolvedTitle.value },
        { property: 'og:description', content: resolvedDesc.value },
        { property: 'og:url', content: canonicalUrl.value },
        { property: 'og:image', content: resolvedImage.value },
        { property: 'og:type', content: options.type || 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: resolvedTitle.value },
        { name: 'twitter:description', content: resolvedDesc.value },
        { name: 'twitter:image', content: resolvedImage.value }
      ],
      script: scripts
    }
  })
}
