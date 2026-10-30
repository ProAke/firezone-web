<template>
  <div v-if="data?.post">
    <PageBanner
      :title="data.post.title"
      subtitle="PROJECT REFERENCE"
      :breadcrumbs="[
        { label: 'ผลงานที่ผ่านมา', to: '/portfolio' },
        { label: data.post.title }
      ]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main Content -->
        <article class="lg:col-span-8 space-y-6">
          <div class="text-xs text-gray-500 flex items-center gap-2">
            <Calendar class="w-4 h-4 text-firezone-red" />
            <span>วันที่เผยแพร่: {{ formatThaiDate(data.post.publishedAt) }}</span>
          </div>

          <div class="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <SmartImage
              :src="selectedImage || data.post.image"
              :alt="data.post.title"
              img-class="w-full max-h-[480px] object-cover"
            />
          </div>

          <!-- Gallery Thumbnails -->
          <div v-if="(data.post.gallery || []).length > 1" class="space-y-2">
            <h3 class="text-sm font-bold text-firezone-navy">
              ภาพบรรยากาศหน้างาน ({{ data.post.gallery.length }} ภาพ)
            </h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <button
                v-for="(imgUrl, idx) in data.post.gallery"
                :key="idx"
                type="button"
                class="h-20 rounded overflow-hidden border-2 transition-all"
                :class="
                  (selectedImage || data.post.image) === imgUrl
                    ? 'border-firezone-red ring-2 ring-red-200'
                    : 'border-gray-200 opacity-80 hover:opacity-100'
                "
                @click="selectedImage = imgUrl"
              >
                <SmartImage :src="imgUrl" :alt="`${data.post.title} ${idx + 1}`" img-class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <RichContent
            class="bg-firezone-light p-6 rounded-lg border border-gray-200 text-gray-700 leading-relaxed"
            :content="data.post.content"
          />
        </article>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-firezone-light border border-gray-200 rounded-lg p-5">
            <h3 class="font-bold text-firezone-navy text-base mb-4 flex items-center gap-2">
              <span class="w-1.5 h-5 bg-firezone-red rounded-full" />
              ผลงานโครงการอื่นๆ
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="rec in data.recent || []"
                :key="rec.id"
                :to="`/portfolio/${encodeURIComponent(rec.slug)}`"
                class="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-200 hover:border-firezone-red transition-colors"
              >
                <SmartImage :src="rec.image" :alt="rec.title" img-class="w-16 h-14 object-cover rounded shrink-0" />
                <div class="min-w-0">
                  <div class="text-xs font-bold text-gray-800 line-clamp-2">{{ rec.title }}</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">{{ formatThaiDate(rec.publishedAt) }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <div class="bg-firezone-navy text-white rounded-lg p-6 space-y-3">
            <h4 class="font-bold text-base">ต้องการติดตั้งหรือตรวจเช็คระบบ?</h4>
            <p class="text-xs text-gray-300 leading-relaxed">
              ติดต่อทีมวิศวกร FIRESZONE เพื่อสำรวจหน้างานและเสนอราคาโครงการ
            </p>
            <NuxtLink to="/contact#quote" class="btn-firezone w-full text-xs">
              ติดต่อขอใบเสนอราคา
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
import { formatThaiDate } from '~/composables/useSiteData'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const selectedImage = ref('')

const { data, error } = await useAsyncData(`portfolio-${slug.value}`, () =>
  $fetch(`/api/posts/${encodeURIComponent(slug.value)}`)
)

if (error.value || !data.value?.post) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบข้อมูลผลงานที่ต้องการ' })
}

if (data.value.post.type === 'news') {
  await navigateTo(`/news/${encodeURIComponent(data.value.post.slug)}`, { redirectCode: 301 })
}

if (data.value.post.slug && decodeURIComponent(slug.value) !== data.value.post.slug) {
  await navigateTo(`/portfolio/${encodeURIComponent(data.value.post.slug)}`, { redirectCode: 301 })
}

usePageSeo({
  title: computed(() =>
    data.value?.post?.title
      ? `${data.value.post.title} | ผลงาน FIRESZONE`
      : 'ผลงานที่ผ่านมา | FIRESZONE'
  ),
  description: computed(() => data.value?.post?.excerpt || ''),
  path: computed(() => `/portfolio/${encodeURIComponent(data.value?.post?.slug || slug.value)}`),
  image: computed(() => data.value?.post?.image || ''),
  type: 'article',
  jsonLd: computed(() => {
    const post = data.value?.post
    if (!post) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.image ? [post.image] : undefined,
      datePublished: post.publishedAt
    }
  })
})
</script>
