export interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
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

  const resolvedTitle = computed(
    () => toValue(options.title) || settings.value.seoDefaultTitle || 'FIRESZONE'
  )

  const resolvedDesc = computed(() => {
    const raw = toValue(options.description) || settings.value.seoDefaultDescription || ''
    return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 260)
  })

  const resolvedImage = computed(() => {
    const img = toValue(options.image) || settings.value.seoOgImage || '/logo-fz.jpg'
    if (img.startsWith('http://') || img.startsWith('https://')) return img
    return `${baseUrl.value}${img.startsWith('/') ? img : `/${img}`}`
  })

  useHead(() => {
    const ld = toValue(options.jsonLd)
    const scripts: Array<{ type: string; innerHTML: string; key: string }> = []
    if (ld) {
      const items = Array.isArray(ld) ? ld : [ld]
      items.forEach((obj, idx) => {
        scripts.push({
          key: `jsonld-${idx}`,
          type: 'application/ld+json',
          innerHTML: JSON.stringify(obj)
        })
      })
    }

    return {
      title: resolvedTitle.value,
      link: [{ rel: 'canonical', href: canonicalUrl.value }],
      meta: [
        { name: 'description', content: resolvedDesc.value },
        { name: 'keywords', content: settings.value.seoKeywords || '' },
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
