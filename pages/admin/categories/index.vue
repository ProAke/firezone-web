<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">จัดการหมวดหมู่สินค้า (Categories)</h1>
        <p class="text-xs text-gray-500 mt-1">
          โครงสร้างหมวดหมู่หลักและย่อยสำหรับแสดงบนหน้าแคตตาล็อก พร้อมแก้ไขคำอธิบายด้วย CKEditor 5 แบบเต็มหน้า
        </p>
      </div>
      <NuxtLink to="/admin/categories/new" class="btn-firezone text-xs py-2.5 px-4">
        + เพิ่มหมวดหมู่ใหม่
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
          <tr>
            <th class="px-4 py-3">ชื่อหมวดหมู่</th>
            <th class="px-4 py-3">Slug (URL)</th>
            <th class="px-4 py-3">จำนวนสินค้า</th>
            <th class="px-4 py-3">ลำดับ</th>
            <th class="px-4 py-3">SEO</th>
            <th class="px-4 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <NuxtLink
                :to="`/admin/categories/${cat.id}`"
                class="hover:text-firezone-red transition-colors"
                :class="cat.parentId ? 'pl-5 text-gray-700 font-medium' : 'font-extrabold text-firezone-navy'"
              >
                {{ cat.parentId ? `↳ ${cat.name}` : cat.name }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 font-mono text-gray-500">/shop/category/{{ cat.slug }}</td>
            <td class="px-4 py-3 font-semibold">{{ cat.productCount || 0 }} รายการ</td>
            <td class="px-4 py-3">{{ cat.sortOrder }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Auto-SEO
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
              <NuxtLink
                :to="`/shop/category/${encodeURIComponent(cat.slug)}`"
                target="_blank"
                class="inline-block px-2.5 py-1 rounded border border-gray-200 hover:border-firezone-red text-gray-600 hover:text-firezone-red font-medium"
              >
                ดูหน้าเว็บ
              </NuxtLink>
              <NuxtLink
                :to="`/admin/categories/${cat.id}`"
                class="inline-block px-3 py-1 rounded bg-firezone-navy hover:bg-slate-800 text-white font-semibold"
              >
                แก้ไขเต็มหน้า
              </NuxtLink>
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                @click="deleteCat(cat)"
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

const { categories, refreshSiteData } = useSiteData()

async function deleteCat(cat: any) {
  if (!confirm(`ยืนยันการลบหมวดหมู่ "${cat.name}"?`)) return
  await $fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
  await refreshSiteData()
}

useHead({ title: 'หมวดหมู่สินค้า | FIRESZONE CMS' })
</script>
