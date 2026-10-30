<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">บริการ &amp; อุปกรณ์ของเรา (Services &amp; Equipment)</h1>
        <p class="text-xs text-gray-500 mt-1">
          จัดการเนื้อหาส่วน "บริการของเรา" และ "อุปกรณ์ของเรา" แบบเต็มหน้าด้วย CKEditor 5 และระบบทำ SEO อัตโนมัติ
        </p>
      </div>
      <NuxtLink to="/admin/services/new" class="btn-firezone text-xs py-2.5 px-4">
        + เพิ่มบริการ / อุปกรณ์ใหม่
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
          <tr>
            <th class="px-4 py-3">รูปปก</th>
            <th class="px-4 py-3">ชื่อบริการ / อุปกรณ์</th>
            <th class="px-4 py-3">ประเภท</th>
            <th class="px-4 py-3">ลำดับ</th>
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
                :to="`/admin/services/${item.id}`"
                class="font-bold text-gray-900 hover:text-firezone-red transition-colors block"
              >
                {{ item.title }}
              </NuxtLink>
              <div class="text-[11px] text-gray-400 font-mono">/service/{{ item.slug }}</div>
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-semibold"
                :class="item.type === 'equipment' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'"
              >
                {{ item.type === 'equipment' ? 'อุปกรณ์ของเรา' : 'บริการของเรา' }}
              </span>
            </td>
            <td class="px-4 py-3">{{ item.sortOrder }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Auto-SEO
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
              <NuxtLink
                :to="`/service/${encodeURIComponent(item.slug)}`"
                target="_blank"
                class="inline-block px-2.5 py-1 rounded border border-gray-200 hover:border-firezone-red text-gray-600 hover:text-firezone-red font-medium"
              >
                ดูหน้าเว็บ
              </NuxtLink>
              <NuxtLink
                :to="`/admin/services/${item.id}`"
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

const { data, refresh } = await useAsyncData('admin-services-list', () =>
  $fetch('/api/services')
)

async function deleteItem(item: any) {
  if (!confirm(`ยืนยันการลบ "${item.title}"?`)) return
  await $fetch(`/api/admin/services/${item.id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'บริการและอุปกรณ์ | FIRESZONE CMS' })
</script>
