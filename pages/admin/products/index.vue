<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">จัดการสินค้า (Products)</h1>
        <p class="text-xs text-gray-500 mt-1">
          เปิดหน้าแก้ไขเต็มจอ (Full-Page Editor) พร้อม CKEditor 5 และระบบทำ SEO อัตโนมัติครบทุกรายการ ({{ data?.pagination?.total || 0 }} รุ่น)
        </p>
      </div>
      <NuxtLink to="/admin/products/new" class="btn-firezone text-xs py-2.5 px-4">
        + เพิ่มสินค้าใหม่
      </NuxtLink>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-3">
      <input
        v-model="search"
        type="search"
        placeholder="ค้นหาชื่อรุ่น หรือยี่ห้อสินค้า..."
        class="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
      />
      <select v-model="categoryFilter" class="px-3.5 py-2 text-sm border border-gray-300 rounded bg-white">
        <option value="">ทุกหมวดหมู่สินค้า</option>
        <option v-for="c in categories" :key="c.id" :value="c.slug">
          {{ c.parentId ? `— ${c.name}` : c.name }}
        </option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
          <tr>
            <th class="px-4 py-3">รูป</th>
            <th class="px-4 py-3">ชื่อรุ่นสินค้า</th>
            <th class="px-4 py-3">แบรนด์</th>
            <th class="px-4 py-3">หมวดหมู่</th>
            <th class="px-4 py-3">SEO</th>
            <th class="px-4 py-3">สถานะ</th>
            <th class="px-4 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="p in data?.items || []" :key="p.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <SmartImage :src="p.image" :alt="p.name" img-class="w-11 h-11 object-contain border rounded p-0.5 bg-white" />
            </td>
            <td class="px-4 py-3">
              <NuxtLink
                :to="`/admin/products/${p.id}`"
                class="font-bold text-gray-900 hover:text-firezone-red transition-colors block"
              >
                {{ p.name }}
              </NuxtLink>
              <div class="text-[11px] text-gray-400 font-mono">/product/{{ p.slug }}</div>
            </td>
            <td class="px-4 py-3 font-medium text-gray-700">{{ p.brand || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">
              <span
                v-for="cat in p.categories || []"
                :key="cat.id"
                class="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-1 mb-1 text-[11px]"
              >
                {{ cat.name }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Auto-SEO
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-semibold"
                :class="p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ p.isActive ? 'แสดงผล' : 'ซ่อน' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
              <NuxtLink
                :to="`/product/${encodeURIComponent(p.slug)}`"
                target="_blank"
                class="inline-block px-2.5 py-1 rounded border border-gray-200 hover:border-firezone-red text-gray-600 hover:text-firezone-red font-medium"
              >
                ดูหน้าเว็บ
              </NuxtLink>
              <NuxtLink
                :to="`/admin/products/${p.id}`"
                class="inline-block px-3 py-1 rounded bg-firezone-navy hover:bg-slate-800 text-white font-semibold"
              >
                แก้ไขเต็มหน้า
              </NuxtLink>
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                @click="deleteProduct(p)"
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
const search = ref('')
const categoryFilter = ref('')

const reqFetch = useRequestFetch()
const { data, refresh } = await useAsyncData(
  () => `admin-products-list-${search.value}-${categoryFilter.value}`,
  () =>
    reqFetch('/api/products', {
      query: {
        search: search.value,
        category: categoryFilter.value,
        perPage: 100,
        includeInactive: '1'
      }
    }),
  { watch: [search, categoryFilter] }
)

async function deleteProduct(p: any) {
  if (!confirm(`ยืนยันการลบสินค้า "${p.name}"?`)) return
  await $fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
  await Promise.all([refresh(), refreshSiteData()])
}

useHead({ title: 'จัดการสินค้า | FIRESZONE CMS' })
</script>
