<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ข่าวสาร &amp; บทความความรู้ (News &amp; Articles)</h1>
        <p class="text-xs text-gray-500 mt-1">
          บทความเทคนิค ข่าวสารประชาสัมพันธ์ รูปประกอบ และคลิป YouTube แก้ไขแบบเต็มหน้าพร้อม Auto-SEO ({{ data?.pagination?.total || 0 }} บทความ)
        </p>
      </div>
      <NuxtLink to="/admin/news/new" class="btn-firezone text-xs py-2.5 px-4">
        + เขียนบทความใหม่
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
          <tr>
            <th class="px-4 py-3">รูปปก</th>
            <th class="px-4 py-3">หัวข้อบทความ</th>
            <th class="px-4 py-3">วันที่เผยแพร่</th>
            <th class="px-4 py-3">สถานะ</th>
            <th class="px-4 py-3">SEO</th>
            <th class="px-4 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in data?.items || []" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <SmartImage :src="item.image" :alt="item.title" img-class="w-16 h-11 object-cover rounded border" />
            </td>
            <td class="px-4 py-3">
              <NuxtLink
                :to="`/admin/news/${item.id}`"
                class="font-bold text-gray-900 hover:text-firezone-red transition-colors block"
              >
                {{ item.title }}
              </NuxtLink>
              <div class="text-gray-500 line-clamp-1 mt-0.5">{{ item.excerpt }}</div>
            </td>
            <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ item.publishedAt }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-semibold"
                :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ item.isActive ? 'แสดงผล' : 'ซ่อน' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                ✓ Auto-SEO
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
              <NuxtLink
                :to="`/news/${encodeURIComponent(item.slug)}`"
                target="_blank"
                class="inline-block px-2.5 py-1 rounded border border-gray-200 hover:border-firezone-red text-gray-600 hover:text-firezone-red font-medium"
              >
                ดูหน้าเว็บ
              </NuxtLink>
              <NuxtLink
                :to="`/admin/news/${item.id}`"
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const reqFetch = useRequestFetch()
const { data, refresh } = await useAsyncData('admin-news-list', () =>
  reqFetch('/api/posts', { query: { type: 'news', perPage: 100, includeInactive: '1' } })
)

async function deleteItem(item: any) {
  if (!confirm(`ยืนยันการลบบทความ "${item.title}"?`)) return
  await $fetch(`/api/admin/posts/${item.id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'ข่าวสารและบทความ | FIRESZONE CMS' })
</script>
