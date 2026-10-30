<template>
  <div>
    <PageBanner
      :title="productsData?.selectedCategory?.name || 'สินค้าและอุปกรณ์ทั้งหมด'"
      subtitle="PRODUCTS CATALOG"
      :breadcrumbs="
        productsData?.selectedCategory
          ? [{ label: 'สินค้า', to: '/shop' }, { label: productsData.selectedCategory.name }]
          : [{ label: 'สินค้าทั้งหมด' }]
      "
    />

    <section class="py-12 bg-firezone-light min-h-[60vh]">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Sidebar: Categories & Search -->
        <aside class="lg:col-span-3 space-y-6">
          <!-- Search Widget -->
          <div class="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <h2 class="font-bold text-firezone-navy text-sm mb-3 flex items-center gap-2">
              <span class="w-1 h-4 bg-firezone-red rounded-full" />
              ค้นหาสินค้า
            </h2>
            <form class="flex gap-1.5" @submit.prevent="applySearch">
              <input
                v-model="searchInput"
                type="search"
                placeholder="รุ่น / ยี่ห้อสินค้า..."
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
              />
              <button
                type="submit"
                class="px-3 py-2 bg-firezone-red hover:bg-firezone-darkred text-white rounded"
                aria-label="ค้นหา"
              >
                <Search class="w-4 h-4" />
              </button>
            </form>
          </div>

          <!-- Category Tree Widget (URL-Friendly /shop/category/[slug] Links) -->
          <div class="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <h2 class="font-bold text-firezone-navy text-sm mb-3 flex items-center gap-2">
              <span class="w-1 h-4 bg-firezone-red rounded-full" />
              หมวดหมู่สินค้า
            </h2>
            <ul class="space-y-1 text-sm">
              <li>
                <NuxtLink
                  to="/shop"
                  class="w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors"
                  :class="!activeCategory ? 'bg-red-50 text-firezone-red font-bold' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <span>สินค้าทั้งหมด</span>
                  <span class="text-xs opacity-70">48</span>
                </NuxtLink>
              </li>

              <li v-for="cat in categoryTree" :key="cat.id" class="space-y-1">
                <NuxtLink
                  :to="`/shop/category/${encodeURIComponent(cat.slug)}`"
                  class="w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors"
                  :class="
                    activeCategory === cat.slug
                      ? 'bg-red-50 text-firezone-red font-bold'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  "
                >
                  <span>{{ cat.name }}</span>
                  <span class="text-xs text-gray-400">({{ cat.productCount }})</span>
                </NuxtLink>

                <ul v-if="cat.children?.length" class="pl-4 border-l-2 border-gray-100 ml-2.5 space-y-0.5">
                  <li v-for="sub in cat.children" :key="sub.id">
                    <NuxtLink
                      :to="`/shop/category/${encodeURIComponent(sub.slug)}`"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left text-xs transition-colors"
                      :class="
                        activeCategory === sub.slug
                          ? 'bg-red-50 text-firezone-red font-bold'
                          : 'text-gray-600 hover:text-firezone-red'
                      "
                    >
                      <span>{{ sub.name }}</span>
                      <span class="text-[11px] text-gray-400">({{ sub.productCount }})</span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Need Quote Box -->
          <div class="bg-firezone-navy text-white rounded-md p-5 space-y-3">
            <h3 class="font-bold text-base">ต้องการใบเสนอราคา?</h3>
            <p class="text-xs text-gray-300 leading-relaxed">
              สอบถามสเปคสินค้า ราคาส่งโครงการ หรือแนบไฟล์แบบแปลน PDF ให้ทีมงานประเมินราคาฟรี
            </p>
            <NuxtLink
              to="/contact#quote"
              class="block text-center bg-firezone-red hover:bg-firezone-darkred text-white text-xs font-semibold py-2.5 rounded transition-colors"
            >
              ขอใบเสนอราคาออนไลน์
            </NuxtLink>
          </div>
        </aside>

        <!-- Right Main Catalog Grid -->
        <div class="lg:col-span-9 space-y-6">
          <!-- Category Description Box for SEO & ASEO -->
          <div
            v-if="productsData?.selectedCategory?.description"
            class="bg-white border-l-4 border-firezone-red rounded-md px-5 py-4 shadow-sm text-sm text-gray-700"
          >
            <div class="font-bold text-firezone-navy mb-1">{{ productsData.selectedCategory.name }}</div>
            <RichContent :content="productsData.selectedCategory.description" />
          </div>

          <!-- Toolbar -->
          <div class="bg-white border border-gray-200 rounded-md px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div class="text-sm text-gray-600">
              พบสินค้าทั้งหมด <strong class="text-firezone-navy">{{ productsData?.pagination?.total || 0 }}</strong> รายการ
              <span v-if="activeSearch" class="ml-2 inline-flex items-center gap-1 bg-red-50 text-firezone-red text-xs px-2.5 py-0.5 rounded-full">
                คำค้นหา: "{{ activeSearch }}"
                <button type="button" class="font-bold ml-1" @click="clearSearch">×</button>
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <label for="sort-select" class="text-gray-500 text-xs">เรียงลำดับ:</label>
              <select
                id="sort-select"
                :value="activeSort"
                class="border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-firezone-red"
                @change="onSortChange(($event.target as HTMLSelectElement).value)"
              >
                <option value="name_asc">ชื่อสินค้า (A - Z)</option>
                <option value="name_desc">ชื่อสินค้า (Z - A)</option>
                <option value="latest">รายการอัปเดตล่าสุด</option>
              </select>
            </div>
          </div>

          <!-- Grid -->
          <div
            v-if="(productsData?.items || []).length"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <ProductCard
              v-for="prod in productsData?.items || []"
              :key="prod.id"
              :product="prod"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white border border-gray-200 rounded-md p-12 text-center space-y-3">
            <p class="text-gray-600 font-medium">ไม่พบรายการสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
            <NuxtLink to="/shop" class="btn-outline-firezone text-xs py-2 px-4">
              แสดงสินค้าทั้งหมด
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div
            v-if="(productsData?.pagination?.totalPages || 1) > 1"
            class="flex items-center justify-center gap-1.5 pt-4"
          >
            <button
              type="button"
              :disabled="activePage <= 1"
              class="px-3 py-2 rounded border text-xs font-medium bg-white disabled:opacity-40 hover:border-firezone-red"
              @click="goToPage(activePage - 1)"
            >
              ก่อนหน้า
            </button>
            <button
              v-for="p in productsData?.pagination?.totalPages || 1"
              :key="p"
              type="button"
              class="w-9 h-9 rounded border text-xs font-semibold transition-colors"
              :class="
                p === activePage
                  ? 'bg-firezone-red text-white border-firezone-red'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-firezone-red'
              "
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
            <button
              type="button"
              :disabled="activePage >= (productsData?.pagination?.totalPages || 1)"
              class="px-3 py-2 rounded border text-xs font-medium bg-white disabled:opacity-40 hover:border-firezone-red"
              @click="goToPage(activePage + 1)"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  categorySlug?: string
}>()

const route = useRoute()
const router = useRouter()
const { categoryTree, settings } = useSiteData()

const activeCategory = computed(() => props.categorySlug || String(route.query.category || ''))
const activeSearch = computed(() => String(route.query.search || ''))
const activeSort = computed(() => String(route.query.sort || 'name_asc'))
const activePage = computed(() => Math.max(1, Number(route.query.page) || 1))

const searchInput = ref(activeSearch.value)
watch(activeSearch, (val) => {
  searchInput.value = val
})

const { data: productsData } = await useAsyncData(
  () => `shop-${activeCategory.value}-${activeSearch.value}-${activeSort.value}-${activePage.value}`,
  () =>
    $fetch('/api/products', {
      query: {
        category: activeCategory.value,
        search: activeSearch.value,
        sort: activeSort.value,
        page: activePage.value,
        perPage: 12
      }
    }),
  { watch: [activeCategory, activeSearch, activeSort, activePage] }
)

if (props.categorySlug && !productsData.value?.selectedCategory) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบหมวดหมู่สินค้าที่ต้องการ' })
}

const basePath = computed(() =>
  activeCategory.value
    ? `/shop/category/${encodeURIComponent(activeCategory.value)}`
    : '/shop'
)

function updateQuery(patch: Record<string, string | number | undefined>) {
  const next: Record<string, any> = { ...route.query, ...patch }
  delete next.category
  for (const k of Object.keys(next)) {
    if (!next[k]) delete next[k]
  }
  router.push({ path: basePath.value, query: next })
}

function applySearch() {
  updateQuery({ search: searchInput.value.trim() || undefined, page: undefined })
}

function clearSearch() {
  searchInput.value = ''
  updateQuery({ search: undefined, page: undefined })
}

function onSortChange(val: string) {
  updateQuery({ sort: val, page: undefined })
}

function goToPage(p: number) {
  updateQuery({ page: p > 1 ? p : undefined })
}

usePageSeo({
  title: computed(() =>
    productsData.value?.selectedCategory?.name
      ? `${productsData.value.selectedCategory.name} — อุปกรณ์ Fire Alarm | FIRESZONE`
      : 'สินค้าและอุปกรณ์แจ้งเหตุเพลิงไหม้ทั้งหมด | FIRESZONE'
  ),
  seoTitle: computed(() => productsData.value?.selectedCategory?.seoTitle || ''),
  description: computed(
    () =>
      productsData.value?.selectedCategory?.seoDescription ||
      (productsData.value?.selectedCategory
        ? ''
        : 'แคตตาล็อกสินค้าและอุปกรณ์ระบบสัญญาณเตือนอัคคีภัย Fire Alarm มาตรฐาน UL/FM ตู้ควบคุม Smoke Detector Heat Detector Manual Pull Station กระดิ่งและไฟไซเรน')
  ),
  seoKeywords: computed(() => productsData.value?.selectedCategory?.seoKeywords || ''),
  keywordParts: computed(() =>
    productsData.value?.selectedCategory?.name
      ? [productsData.value.selectedCategory.name, 'อุปกรณ์แจ้งเหตุเพลิงไหม้']
      : ['สินค้าแจ้งเหตุเพลิงไหม้', 'อุปกรณ์ Fire Alarm']
  ),
  htmlContent: computed(() => productsData.value?.selectedCategory?.description || ''),
  path: basePath,
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: productsData.value?.selectedCategory?.name || 'สินค้าและอุปกรณ์แจ้งเหตุเพลิงไหม้ทั้งหมด',
    description:
      productsData.value?.selectedCategory?.description || settings.value.seoDefaultDescription,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: productsData.value?.pagination?.total || 0,
      itemListElement: (productsData.value?.items || []).map((item: any, idx: number) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        url: `${(settings.value.siteUrl || 'https://fireszone.com').replace(/\/+$/, '')}/product/${item.slug}`
      }))
    }
  }))
})
</script>
