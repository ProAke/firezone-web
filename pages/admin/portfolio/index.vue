<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">จัดการผลงานการติดตั้ง (Portfolio)</h1>
        <p class="text-xs text-gray-500 mt-1">
          โครงการอ้างอิง อัลบั้มภาพบรรยากาศหน้างาน และคลิปวิดีโอ YouTube แก้ไขแบบเต็มหน้าพร้อม Auto-SEO ({{ data?.pagination?.total || 0 }} โครงการ)
        </p>
      </div>
      <NuxtLink to="/admin/portfolio/new" class="btn-firezone text-xs py-2.5 px-4">
        + เพิ่มผลงานใหม่
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="item in data?.items || []"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col"
      >
        <NuxtLink :to="`/admin/portfolio/${item.id}`" class="h-44 bg-gray-100 relative block group">
          <SmartImage :src="item.image" :alt="item.title" img-class="w-full h-full object-cover" />
          <span class="absolute top-2.5 right-2.5 bg-firezone-navy/85 text-white text-[11px] px-2.5 py-0.5 rounded">
            {{ (item.gallery || []).length }} ภาพ
          </span>
          <span
            v-if="!item.isActive"
            class="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded"
          >
            ซ่อนอยู่
          </span>
        </NuxtLink>
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between text-[11px] text-gray-400">
            <span>{{ item.publishedAt }}</span>
            <span class="text-emerald-700 font-semibold">✓ Auto-SEO</span>
          </div>
          <NuxtLink
            :to="`/admin/portfolio/${item.id}`"
            class="font-bold text-sm text-gray-900 hover:text-firezone-red mt-1 line-clamp-2"
          >
            {{ item.title }}
          </NuxtLink>
          <p class="text-xs text-gray-500 mt-1.5 line-clamp-2 flex-1">{{ item.excerpt }}</p>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <NuxtLink
              :to="`/portfolio/${encodeURIComponent(item.slug)}`"
              target="_blank"
              class="text-gray-500 hover:text-firezone-red"
            >
              ดูหน้าเว็บ ↗
            </NuxtLink>
            <div class="space-x-1.5">
              <NuxtLink
                :to="`/admin/portfolio/${item.id}`"
                class="inline-block px-3 py-1 rounded bg-firezone-navy hover:bg-slate-800 text-white font-semibold"
              >
                แก้ไขเต็มหน้า
              </NuxtLink>
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                @click="deleteItem(item)"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const reqFetch = useRequestFetch()
const { data, refresh } = await useAsyncData('admin-portfolio-list', () =>
  reqFetch('/api/posts', { query: { type: 'portfolio', perPage: 100, includeInactive: '1' } })
)

async function deleteItem(item: any) {
  if (!confirm(`ยืนยันการลบผลงาน "${item.title}"?`)) return
  await $fetch(`/api/admin/posts/${item.id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'จัดการผลงาน | FIRESZONE CMS' })
</script>
