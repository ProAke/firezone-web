<template>
  <div>
    <PageBanner
      title="ผลงานการติดตั้งและตรวจเช็คระบบ"
      subtitle="PROJECT REFERENCES"
      :breadcrumbs="[{ label: 'ผลงานที่ผ่านมา' }]"
    />

    <section class="py-14 bg-firezone-light min-h-[60vh]">
      <div class="container-classic space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in data?.items || []"
            :key="item.id"
            :to="`/portfolio/${encodeURIComponent(item.slug)}`"
            class="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-firezone-red transition-all flex flex-col"
          >
            <div class="h-56 bg-gray-100 overflow-hidden relative">
              <SmartImage
                :src="item.image"
                :alt="item.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span class="absolute bottom-3 left-3 bg-firezone-navy/85 text-white text-xs px-3 py-1 rounded">
                {{ formatThaiDate(item.publishedAt) }}
              </span>
              <span
                v-if="item.gallery?.length > 1"
                class="absolute top-3 right-3 bg-black/70 text-white text-[11px] px-2.5 py-0.5 rounded"
              >
                {{ item.gallery.length }} รูปภาพ
              </span>
            </div>

            <div class="p-5 flex-1 flex flex-col">
              <h2 class="font-bold text-lg text-firezone-navy group-hover:text-firezone-red transition-colors line-clamp-2">
                {{ item.title }}
              </h2>
              <p class="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">
                {{ item.excerpt }}
              </p>
              <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-firezone-red">
                <span>ดูภาพและรายละเอียดโครงการ</span>
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div
          v-if="(data?.pagination?.totalPages || 1) > 1"
          class="flex items-center justify-center gap-2 pt-4"
        >
          <button
            v-for="p in data?.pagination?.totalPages || 1"
            :key="p"
            type="button"
            class="w-9 h-9 rounded border text-xs font-bold"
            :class="
              p === page
                ? 'bg-firezone-red text-white border-firezone-red'
                : 'bg-white text-gray-700 border-gray-200 hover:border-firezone-red'
            "
            @click="router.push({ path: '/portfolio', query: p > 1 ? { page: p } : {} })"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { formatThaiDate } from '~/composables/useSiteData'

const route = useRoute()
const router = useRouter()
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data } = await useAsyncData(
  () => `portfolio-list-${page.value}`,
  () =>
    $fetch('/api/posts', {
      query: { type: 'portfolio', page: page.value, perPage: 9 }
    }),
  { watch: [page] }
)

usePageSeo({
  title: 'ผลงานการติดตั้งและตรวจเช็คระบบ Fire Alarm | FIRESZONE',
  description:
    'ตัวอย่างผลงานการติดตั้ง ตรวจเช็ค และซ่อมบำรุงระบบสัญญาณเตือนอัคคีภัย Fire Alarm อาคารสำนักงาน คอนโดมิเนียม โรงพยาบาล โรงงาน และหน่วยงานราชการ',
  path: '/portfolio'
})
</script>
