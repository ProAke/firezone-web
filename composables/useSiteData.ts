export interface CategoryItem {
  id: number
  name: string
  slug: string
  parentId: number | null
  sortOrder: number
  description: string
  productCount: number
  children?: CategoryItem[]
}

export function useSiteData() {
  const { data, refresh } = useAsyncData('site-global-data', () => $fetch('/api/site'))

  const settings = computed<Record<string, string>>(() => data.value?.settings || {})
  const categories = computed<CategoryItem[]>(() => (data.value?.categories as CategoryItem[]) || [])
  const brands = computed<Array<{ name: string; logo: string }>>(() => data.value?.brands || [])
  const clients = computed<Array<{ name: string; logo: string }>>(() => data.value?.clients || [])

  const categoryTree = computed<CategoryItem[]>(() => {
    const all = categories.value.map((c) => ({ ...c, children: [] as CategoryItem[] }))
    const byId = new Map<number, CategoryItem>()
    for (const c of all) byId.set(c.id, c)

    const roots: CategoryItem[] = []
    for (const c of all) {
      if (c.parentId && byId.has(c.parentId)) {
        byId.get(c.parentId)!.children!.push(c)
      } else {
        roots.push(c)
      }
    }
    return roots
  })

  return {
    settings,
    categories,
    categoryTree,
    brands,
    clients,
    refreshSiteData: refresh
  }
}

export function formatThaiDate(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
