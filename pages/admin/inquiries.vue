<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ข้อความติดต่อลูกค้า &amp; ขอใบเสนอราคา</h1>
        <p class="text-xs text-gray-500 mt-1">รายการที่ลูกค้าส่งผ่านแบบฟอร์มหน้าติดต่อเราและหน้าสินค้า</p>
      </div>

      <select v-model="statusFilter" class="px-3 py-2 text-xs border border-gray-300 rounded bg-white">
        <option value="">ทุกสถานะ</option>
        <option value="new">ข้อความใหม่ (New)</option>
        <option value="read">อ่านแล้ว (Read)</option>
        <option value="contacted">ติดต่อกลับแล้ว (Contacted)</option>
      </select>
    </div>

    <div v-if="(data?.items || []).length" class="space-y-4">
      <div
        v-for="inq in data.items"
        :key="inq.id"
        class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base text-firezone-navy">{{ inq.name }}</span>
              <span v-if="inq.company" class="text-xs text-gray-500">({{ inq.company }})</span>
              <span
                class="px-2 py-0.5 rounded text-[11px] font-bold"
                :class="{
                  'bg-red-100 text-red-700': inq.status === 'new',
                  'bg-blue-100 text-blue-700': inq.status === 'read',
                  'bg-green-100 text-green-700': inq.status === 'contacted'
                }"
              >
                {{ inq.status }}
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-1 flex flex-wrap gap-4">
              <span>โทร: <strong class="text-gray-800">{{ inq.phone }}</strong></span>
              <span v-if="inq.email">อีเมล: {{ inq.email }}</span>
              <span>ส่งเมื่อ: {{ new Date(inq.createdAt).toLocaleString('th-TH') }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <select
              :value="inq.status"
              class="border rounded px-2.5 py-1 bg-white"
              @change="updateStatus(inq, ($event.target as HTMLSelectElement).value)"
            >
              <option value="new">ข้อความใหม่</option>
              <option value="read">อ่านแล้ว</option>
              <option value="contacted">ติดต่อกลับแล้ว</option>
            </select>
            <button
              type="button"
              class="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold"
              @click="deleteInq(inq.id)"
            >
              ลบ
            </button>
          </div>
        </div>

        <div v-if="inq.subject || inq.productName" class="text-xs text-firezone-red font-semibold">
          <span v-if="inq.subject">หัวข้อ: {{ inq.subject }}</span>
          <span v-if="inq.productName" class="ml-3">สินค้าที่สนใจ: {{ inq.productName }}</span>
        </div>

        <div class="bg-gray-50 p-3.5 rounded border border-gray-100 text-sm text-gray-800 whitespace-pre-line">
          {{ inq.message }}
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-400">
      ยังไม่มีข้อความในหมวดสถานะนี้
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const statusFilter = ref('')

const { data, refresh } = await useAsyncData(
  () => `admin-inquiries-${statusFilter.value}`,
  () => $fetch('/api/admin/inquiries', { query: { status: statusFilter.value } }),
  { watch: [statusFilter] }
)

async function updateStatus(inq: any, status: string) {
  await $fetch(`/api/admin/inquiries/${inq.id}`, {
    method: 'PUT',
    body: { status, adminNote: inq.adminNote || '' }
  })
  await refresh()
}

async function deleteInq(id: number) {
  if (!confirm('ยืนยันการลบข้อความนี้?')) return
  await $fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'ข้อความติดต่อลูกค้า | FIRESZONE CMS' })
</script>
