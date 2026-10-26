<template>
  <div v-if="data?.post">
    <PageBanner
      :title="data.post.title"
      subtitle="KNOWLEDGE ARTICLE"
      :breadcrumbs="[
        { label: 'ข่าวสาร', to: '/news' },
        { label: data.post.title }
      ]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article class="lg:col-span-8 space-y-6">
          <div class="text-xs text-gray-500 flex items-center gap-2">
            <Calendar class="w-4 h-4 text-firezone-red" />
            <span>อัปเดตเมื่อ {{ formatThaiDate(data.post.publishedAt) }}</span>
          </div>

          <div class="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <SmartImage
              :src="data.post.image"
              :alt="data.post.title"
              img-class="w-full max-h-[420px] object-cover"
            />
          </div>

          <h2 class="text-2xl font-extrabold text-firezone-navy">
            {{ data.post.title }}
          </h2>

          <RichContent
            class="text-gray-700 leading-relaxed text-base bg-firezone-light p-6 md:p-8 rounded-lg border border-gray-200"
            :content="data.post.content"
          />
        </article>

        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-firezone-light border border-gray-200 rounded-lg p-5">
            <h3 class="font-bold text-firezone-navy text-base mb-4 flex items-center gap-2">
              <span class="w-1.5 h-5 bg-firezone-red rounded-full" />
              บทความอื่นๆ ที่น่าสนใจ
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="rec in data.recent || []"
                :key="rec.id"
                :to="`/news/${encodeURIComponent(rec.slug)}`"
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

const { data, error } = await useAsyncData(`news-${slug.value}`, () =>
  $fetch(`/api/posts/${encodeURIComponent(slug.value)}`)
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบบทความที่ต้องการ' })
}

useHead({
  title: computed(() =>
    data.value?.post?.title
      ? `${data.value.post.title} | ข่าวสาร FIRESZONE`
      : 'ข่าวสาร | FIRESZONE'
  )
})
</script>
