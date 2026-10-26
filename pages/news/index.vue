<template>
  <div>
    <PageBanner
      title="ข่าวสารและเกร็ดความรู้"
      subtitle="NEWS & KNOWLEDGE"
      :breadcrumbs="[{ label: 'ข่าวสาร' }]"
    />

    <section class="py-14 bg-firezone-light min-h-[55vh]">
      <div class="container-classic">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in data?.items || []"
            :key="article.id"
            :to="`/news/${encodeURIComponent(article.slug)}`"
            class="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-firezone-red transition-all flex flex-col"
          >
            <div class="h-52 bg-gray-100 overflow-hidden">
              <SmartImage
                :src="article.image"
                :alt="article.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <div class="text-xs text-gray-400 mb-2">{{ formatThaiDate(article.publishedAt) }}</div>
              <h2 class="font-bold text-lg text-firezone-navy group-hover:text-firezone-red transition-colors line-clamp-2">
                {{ article.title }}
              </h2>
              <p class="text-sm text-gray-600 mt-2 line-clamp-3 flex-1 leading-relaxed">
                {{ article.excerpt }}
              </p>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-firezone-red">
                <span>อ่านบทความฉบับเต็ม</span>
                <ArrowRight class="w-4 h-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { formatThaiDate } from '~/composables/useSiteData'

const { data } = await useAsyncData('news-list-page', () =>
  $fetch('/api/posts', { query: { type: 'news', perPage: 20 } })
)

useHead({
  title: 'ข่าวสารและเกร็ดความรู้ระบบอัคคีภัย | FIRESZONE'
})
</script>
