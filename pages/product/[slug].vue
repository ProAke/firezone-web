<template>
  <div v-if="data?.product">
    <PageBanner
      :title="data.product.name"
      subtitle="PRODUCT SPECIFICATION"
      :breadcrumbs="[
        { label: 'สินค้า', to: '/shop' },
        ...(data.product.categories?.[0]
          ? [{ label: data.product.categories[0].name, to: `/shop?category=${encodeURIComponent(data.product.categories[0].slug)}` }]
          : []),
        { label: data.product.name }
      ]"
    />

    <section class="py-12 bg-white">
      <div class="container-classic">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Product Image -->
          <div class="lg:col-span-5">
            <div class="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center aspect-square shadow-sm">
              <SmartImage
                :src="data.product.image"
                :alt="data.product.name"
                img-class="w-full h-full object-contain max-h-[380px]"
              />
            </div>
          </div>

          <!-- Product Info & Inquiry CTA -->
          <div class="lg:col-span-7 space-y-6">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span
                  v-if="data.product.brand"
                  class="bg-firezone-navy text-white text-xs font-bold px-3 py-1 rounded"
                >
                  {{ data.product.brand }}
                </span>
                <NuxtLink
                  v-for="cat in data.product.categories || []"
                  :key="cat.id"
                  :to="`/shop?category=${encodeURIComponent(cat.slug)}`"
                  class="bg-red-50 text-firezone-red hover:bg-red-100 text-xs font-semibold px-3 py-1 rounded transition-colors"
                >
                  {{ cat.name }}
                </NuxtLink>
              </div>

              <h1 class="text-2xl md:text-3xl font-extrabold text-firezone-navy">
                {{ data.product.name }}
              </h1>
              <p v-if="data.product.excerpt" class="text-base text-gray-600 font-medium mt-2">
                {{ data.product.excerpt }}
              </p>
            </div>

            <!-- Specification Box -->
            <div class="bg-firezone-light border border-gray-200 rounded-lg p-6">
              <h2 class="font-bold text-firezone-navy text-base mb-3 flex items-center gap-2">
                <FileText class="w-4 h-4 text-firezone-red" />
                <span>รายละเอียดและคุณสมบัติทางเทคนิค</span>
              </h2>
              <RichContent
                class="text-sm text-gray-700 leading-relaxed"
                :content="data.product.description || data.product.excerpt"
              />

              <div v-if="data.product.datasheetUrl" class="mt-5 pt-4 border-t border-gray-200">
                <a
                  :href="data.product.datasheetUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-semibold text-firezone-red hover:underline"
                >
                  <Download class="w-4 h-4" />
                  <span>ดาวน์โหลดเอกสาร Datasheet (PDF)</span>
                </a>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <NuxtLink
                :to="`/contact?product=${encodeURIComponent(data.product.name)}#quote`"
                class="btn-firezone"
              >
                <Send class="w-4 h-4 mr-2" />
                <span>ขอใบเสนอราคารุ่น {{ data.product.name }}</span>
              </NuxtLink>

              <a
                :href="`tel:${(settings.phone1 || '0863635495').replace(/[^0-9+]/g, '')}`"
                class="btn-outline-firezone"
              >
                <Phone class="w-4 h-4 mr-2" />
                <span>โทรสอบถาม {{ settings.phone1 || '086-363-5495' }}</span>
              </a>

              <a
                v-if="settings.lineUrl"
                :href="settings.lineUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center px-5 py-3 rounded font-semibold bg-[#06C755] hover:bg-[#05b04b] text-white transition-colors"
              >
                สอบถามทาง LINE
              </a>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="(data.related || []).length" class="mt-16 pt-12 border-t border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-firezone-navy">สินค้าในหมวดหมู่เดียวกัน</h2>
            <NuxtLink to="/shop" class="text-sm font-semibold text-firezone-red hover:underline">
              ดูสินค้าทั้งหมด →
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard v-for="rel in data.related" :key="rel.id" :product="rel" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Download, FileText, Phone, Send } from 'lucide-vue-next'

const route = useRoute()
const { settings } = useSiteData()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(`product-${slug.value}`, () =>
  $fetch(`/api/products/${encodeURIComponent(slug.value)}`)
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบสินค้าที่ต้องการ' })
}

useHead({
  title: computed(() =>
    data.value?.product?.name
      ? `${data.value.product.name} | สินค้า FIRESZONE`
      : 'รายละเอียดสินค้า | FIRESZONE'
  )
})
</script>
