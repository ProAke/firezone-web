<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ภาพรวมระบบจัดการเว็บไซต์</h1>
        <p class="text-xs text-gray-500 mt-1">
          จัดการสินค้า ผลงาน ข่าวสาร บริการ และข้อความติดต่อลูกค้าได้ในที่เดียว (ปลอดสแปม 100%)
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/admin/products/new" class="btn-firezone text-xs py-2 px-4">
          + เพิ่มสินค้าใหม่
        </NuxtLink>
        <NuxtLink to="/admin/portfolio/new" class="btn-outline-firezone text-xs py-2 px-4">
          + เพิ่มผลงานใหม่
        </NuxtLink>
        <NuxtLink to="/admin/pages" class="px-4 py-2 rounded border border-gray-300 bg-white hover:border-firezone-red text-xs font-semibold text-gray-700">
          จัดการหน้าเว็บไซต์
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink to="/admin/products" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-firezone-red transition-colors">
        <div class="text-xs text-gray-500 font-medium">สินค้าทั้งหมด</div>
        <div class="text-3xl font-extrabold text-firezone-navy mt-1">{{ stats?.counts?.products || 0 }}</div>
        <div class="text-[11px] text-gray-400 mt-1">ใน {{ stats?.counts?.categories || 0 }} หมวดหมู่</div>
      </NuxtLink>

      <NuxtLink to="/admin/portfolio" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-firezone-red transition-colors">
        <div class="text-xs text-gray-500 font-medium">ผลงานการติดตั้ง</div>
        <div class="text-3xl font-extrabold text-firezone-navy mt-1">{{ stats?.counts?.portfolio || 0 }}</div>
        <div class="text-[11px] text-gray-400 mt-1">โครงการอ้างอิง</div>
      </NuxtLink>

      <NuxtLink to="/admin/services" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-firezone-red transition-colors">
        <div class="text-xs text-gray-500 font-medium">บริการ &amp; บทความ</div>
        <div class="text-3xl font-extrabold text-firezone-navy mt-1">
          {{ (stats?.counts?.services || 0) + (stats?.counts?.news || 0) }}
        </div>
        <div class="text-[11px] text-gray-400 mt-1">
          {{ stats?.counts?.services || 0 }} บริการ • {{ stats?.counts?.news || 0 }} ข่าวสาร
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/inquiries" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-firezone-red transition-colors">
        <div class="text-xs text-gray-500 font-medium">ข้อความติดต่อใหม่</div>
        <div class="text-3xl font-extrabold text-firezone-red mt-1">{{ stats?.counts?.newInquiries || 0 }}</div>
        <div class="text-[11px] text-gray-400 mt-1">จากทั้งหมด {{ stats?.counts?.totalInquiries || 0 }} ข้อความ</div>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Inquiries -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold text-sm text-firezone-navy">ข้อความขอใบเสนอราคาล่าสุด</h2>
          <NuxtLink to="/admin/inquiries" class="text-xs text-firezone-red font-semibold hover:underline">
            ดูทั้งหมด →
          </NuxtLink>
        </div>

        <div v-if="(stats?.recentInquiries || []).length" class="divide-y divide-gray-100">
          <div v-for="inq in stats.recentInquiries" :key="inq.id" class="p-4 text-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900">{{ inq.name }} ({{ inq.phone }})</span>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold"
                :class="inq.status === 'new' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ inq.status === 'new' ? 'ใหม่' : inq.status }}
              </span>
            </div>
            <p class="text-gray-600 line-clamp-2">{{ inq.message }}</p>
          </div>
        </div>
        <div v-else class="p-8 text-center text-xs text-gray-400">
          ยังไม่มีข้อความติดต่อใหม่
        </div>
      </div>

      <!-- Recent Products -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold text-sm text-firezone-navy">รายการสินค้าล่าสุดในระบบ</h2>
          <NuxtLink to="/admin/products" class="text-xs text-firezone-red font-semibold hover:underline">
            จัดการสินค้าทั้งหมด →
          </NuxtLink>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="prod in stats?.recentProducts || []"
            :key="prod.id"
            class="px-5 py-3 flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <SmartImage :src="prod.image" :alt="prod.name" img-class="w-10 h-10 object-contain rounded border p-0.5 shrink-0" />
              <div class="min-w-0">
                <NuxtLink
                  :to="`/admin/products/${prod.id}`"
                  class="font-bold text-gray-900 hover:text-firezone-red truncate block"
                >
                  {{ prod.name }}
                </NuxtLink>
                <div class="text-gray-400">{{ prod.brand || 'ไม่ระบุแบรนด์' }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 shrink-0">
              <NuxtLink
                :to="`/admin/products/${prod.id}`"
                class="px-2.5 py-1 rounded bg-firezone-navy text-white font-semibold hover:bg-slate-800"
              >
                แก้ไข
              </NuxtLink>
              <NuxtLink
                :to="`/product/${encodeURIComponent(prod.slug)}`"
                target="_blank"
                class="text-firezone-red hover:underline"
              >
                ดูหน้าเว็บ
              </NuxtLink>
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
const { data: stats } = await useAsyncData('admin-dashboard-stats', () =>
  reqFetch('/api/admin/stats')
)

useHead({ title: 'แดชบอร์ดผู้ดูแล | FIRESZONE CMS' })
</script>
