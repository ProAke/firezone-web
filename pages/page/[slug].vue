<template>
  <div v-if="data?.page">
    <PageBanner
      :title="data.page.title"
      :subtitle="data.page.subtitle || 'FIRESZONE INFORMATION'"
      :breadcrumbs="[{ label: data.page.title }]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic max-w-4xl space-y-6">
        <div
          v-if="data.page.image"
          class="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
        >
          <SmartImage
            :src="data.page.image"
            :alt="data.page.title"
            img-class="w-full max-h-[440px] object-cover"
          />
        </div>

        <RichContent
          class="bg-firezone-light p-6 md:p-8 rounded-lg border border-gray-200 text-gray-700 leading-relaxed"
          :content="data.page.content"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(`custom-page-${slug.value}`, () =>
  $fetch(`/api/pages/${encodeURIComponent(slug.value)}`)
)

if (error.value || !data.value?.page) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบหน้าเว็บไซต์ที่ต้องการ' })
}

usePageSeo({
  title: computed(() => `${data.value?.page?.title || 'ข้อมูล'} | FIRESZONE`),
  seoTitle: computed(() => data.value?.page?.seoTitle || ''),
  description: computed(() => data.value?.page?.excerpt || ''),
  seoDescription: computed(() => data.value?.page?.seoDescription || ''),
  seoKeywords: computed(() => data.value?.page?.seoKeywords || ''),
  htmlContent: computed(() => data.value?.page?.content || ''),
  publishedAt: computed(() => data.value?.page?.updatedAt || ''),
  image: computed(() => data.value?.page?.image || ''),
  path: computed(() => `/page/${encodeURIComponent(data.value?.page?.slug || slug.value)}`)
})
</script>
