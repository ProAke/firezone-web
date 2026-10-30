<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ข้อความติดต่อลูกค้า &amp; ใบเสนอราคา</h1>
        <p class="text-xs text-gray-500 mt-1">
          บันทึกลงฐานข้อมูลอัตโนมัติ พร้อมแสดงสถานะยืนยันตัวตน LINE, ความยินยอม PDPA, สถานะแจ้งเตือน และไฟล์แนบ PDF/รูปภาพ
        </p>
      </div>

      <select v-model="statusFilter" class="px-3 py-2 text-xs border border-gray-300 rounded bg-white">
        <option value="">ทุกสถานะ ({{ (data?.items || []).length }})</option>
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
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-mono text-gray-400">#{{ inq.id }}</span>
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

              <!-- Verified LINE Badge -->
              <span
                v-if="Number(inq.lineVerified) > 0"
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#06C755]/15 text-[#048839] border border-[#06C755]/30"
              >
                <img
                  v-if="inq.linePictureUrl"
                  :src="inq.linePictureUrl"
                  alt=""
                  class="w-3.5 h-3.5 rounded-full object-cover"
                />
                <span>
                  ✓ {{ Number(inq.lineVerified) === 1 ? 'LINE OAuth Verified' : 'LINE Connected' }}:
                  {{ inq.lineDisplayName || inq.lineId }}
                </span>
              </span>
              <span
                v-else-if="inq.lineId"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700"
              >
                LINE ID: {{ inq.lineId }}
              </span>

              <!-- PDPA Badge -->
              <span
                v-if="inq.pdpaConsent"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600"
              >
                ✓ ยินยอม PDPA
              </span>
            </div>

            <div class="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-4">
              <span>โทร: <strong class="text-gray-800">{{ inq.phone }}</strong></span>
              <span v-if="inq.email">อีเมล: <strong class="text-gray-800">{{ inq.email }}</strong></span>
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
              class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
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

        <!-- Attached Photos & PDFs -->
        <div v-if="(inq.attachments || []).length" class="pt-1 space-y-2">
          <div class="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Paperclip class="w-3.5 h-3.5 text-firezone-red" />
            <span>ไฟล์แนบจากลูกค้า ({{ inq.attachments.length }} ไฟล์):</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <a
              v-for="(att, idx) in inq.attachments"
              :key="idx"
              :href="att.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-2.5 rounded-md border border-gray-200 hover:border-firezone-red bg-white transition-colors group"
            >
              <img
                v-if="(att.mimeType || att.mime || '').startsWith('image/')"
                :src="att.url"
                :alt="att.name || att.originalName"
                class="w-11 h-11 rounded object-cover border border-gray-100 shrink-0"
              />
              <div
                v-else
                class="w-11 h-11 rounded bg-red-50 text-firezone-red flex items-center justify-center font-extrabold text-[11px] shrink-0"
              >
                PDF
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-semibold text-gray-800 group-hover:text-firezone-red truncate">
                  {{ att.name || att.originalName }}
                </div>
                <div class="text-[11px] text-gray-400">
                  {{ formatBytes(att.size || 0) }} • คลิกเปิดดู/ดาวน์โหลด
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Notification Dispatch Log -->
        <div class="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
          <span>
            แจ้งเตือน Email:
            <strong :class="inq.notifyEmailStatus === 'sent' ? 'text-green-700' : 'text-gray-600'">
              {{ inq.notifyEmailStatus || 'disabled' }}
            </strong>
          </span>
          <span>
            แจ้งเตือน LINE OA:
            <strong :class="inq.notifyLineStatus?.startsWith('sent') ? 'text-green-700' : 'text-gray-600'">
              {{ inq.notifyLineStatus || 'disabled' }}
            </strong>
          </span>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-400">
      ยังไม่มีข้อความในหมวดสถานะนี้
    </div>
  </div>
</template>

<script setup lang="ts">
import { Paperclip } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const statusFilter = ref('')

const reqFetch = useRequestFetch()
const { data, refresh } = await useAsyncData(
  () => `admin-inquiries-${statusFilter.value}`,
  () => reqFetch('/api/admin/inquiries', { query: { status: statusFilter.value } }),
  { watch: [statusFilter] }
)

function formatBytes(bytes: number) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

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
