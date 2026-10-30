<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">จัดการหน้าเว็บไซต์ (Website Pages)</h1>
        <p class="text-xs text-gray-500 mt-1">
          แก้ไขเนื้อหาหน้าหลักของเว็บไซต์ (หน้าแรก, เกี่ยวกับเรา, ติดต่อเรา, นโยบาย PDPA) หรือสร้างหน้าใหม่แบบเต็มจอด้วย CKEditor 5 และ Auto-SEO
        </p>
      </div>
      <NuxtLink to="/admin/pages/new" class="btn-firezone text-xs py-2.5 px-4">
        + สร้างหน้าเว็บใหม่
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
          <tr>
            <th class="px-4 py-3">ชื่อหน้าเว็บไซต์</th>
            <th class="px-4 py-3">URL หน้าเว็บ</th>
            <th class="px-4 py-3">ประเภท</th>
            <th class="px-4 py-3">SEO</th>
            <th class="px-4 py-3">อัปเดตล่าสุด</th>
            <th class="px-4 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="pg in data?.items || []" :key="pg.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <NuxtLink
                :to="`/admin/pages/${encodeURIComponent(pg.slug)}`"
                class="font-bold text-gray-900 hover:text-firezone-red transition-colors block"
              >
                {{ pg.title }}
              </NuxtLink>
              <div v-if="pg.excerpt" class="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                {{ pg.excerpt }}
              </div>
            </td>
            <td class="px-4 py-3 font-mono text-gray-600">
              {{ getPublicUrl(pg) }}
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-semibold"
                :class="
                  pg.isSystem
                    ? 'bg-blue-100 text-blue-800'
                    : pg.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                "
              >
                {{ pg.isSystem ? 'หน้าหลักของระบบ' : pg.isActive ? 'แสดงผล' : 'ซ่อน' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                ✓ Auto-SEO
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 whitespace-nowrap">
              {{ pg.updatedAt ? new Date(pg.updatedAt).toLocaleDateString('th-TH') : '-' }}
            </td>
            <td class="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
              <NuxtLink
                :to="getPublicUrl(pg)"
                target="_blank"
                class="inline-block px-2.5 py-1 rounded border border-gray-200 hover:border-firezone-red text-gray-600 hover:text-firezone-red font-medium"
              >
                ดูหน้าเว็บ
              </NuxtLink>
              <NuxtLink
                :to="`/admin/pages/${encodeURIComponent(pg.slug)}`"
                class="inline-block px-3 py-1 rounded bg-firezone-navy hover:bg-slate-800 text-white font-semibold"
              >
                แก้ไขเต็มหน้า
              </NuxtLink>
              <button
                v-if="!pg.isSystem"
                type="button"
                class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                @click="deletePage(pg)"
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
const { data, refresh } = await useAsyncData('admin-pages-list', () =>
  reqFetch<{ items: any[] }>('/api/admin/pages')
)

function getPublicUrl(pg: any): string {
  if (pg.isSystem) {
    return pg.slug === 'home' ? '/' : `/${pg.slug}`
  }
  return `/page/${encodeURIComponent(pg.slug)}`
}

async function deletePage(pg: any) {
  if (pg.isSystem) return
  if (!confirm(`ยืนยันการลบหน้า "${pg.title}"?`)) return
  await $fetch(`/api/admin/pages/${encodeURIComponent(pg.slug)}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'จัดการหน้าเว็บไซต์ | FIRESZONE CMS' })
</script>
