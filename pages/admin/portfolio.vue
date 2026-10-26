<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ผลงานการติดตั้ง (Portfolio)</h1>
        <p class="text-xs text-gray-500 mt-1">เพิ่มหรือแก้ไขโครงการอ้างอิง พร้อมอัลบั้มภาพหน้างานหลายรูป</p>
      </div>
      <button type="button" class="btn-firezone text-xs py-2.5 px-4" @click="openCreate">
        + เพิ่มผลงานใหม่
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="item in data?.items || []"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col"
      >
        <div class="h-44 bg-gray-100 relative">
          <SmartImage :src="item.image" :alt="item.title" img-class="w-full h-full object-cover" />
          <span class="absolute top-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded">
            {{ (item.gallery || []).length }} รูป
          </span>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <div class="text-[11px] text-gray-400">{{ item.publishedAt }}</div>
          <h3 class="font-bold text-sm text-gray-900 mt-0.5 line-clamp-2">{{ item.title }}</h3>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2 flex-1">{{ item.excerpt }}</p>
          <div class="mt-3 pt-3 border-t flex justify-end gap-2 text-xs">
            <button
              type="button"
              class="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold"
              @click="openEdit(item)"
            >
              แก้ไข
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold"
              @click="removePost(item)"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 class="text-lg font-extrabold text-firezone-navy">
          {{ editingId ? 'แก้ไขผลงานโครงการ' : 'เพิ่มผลงานโครงการใหม่' }}
        </h2>

        <form class="space-y-3 text-xs" @submit.prevent="savePost">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-bold mb-1">ชื่อโครงการ / ผลงาน *</label>
              <input v-model="form.title" type="text" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block font-bold mb-1">วันที่ดำเนินงาน</label>
              <input v-model="form.publishedAt" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <AdminFileUpload v-model="form.image" label="รูปภาพปกหลัก" accept="image/*" :show-preview="true" />

          <div>
            <label class="block font-bold mb-1">อัลบั้มรูปภาพเพิ่มเติม (บรรทัดละ 1 ลิงก์ หรือกดอัปโหลดเพิ่ม)</label>
            <textarea
              v-model="galleryText"
              rows="4"
              placeholder="วาง URL รูปภาพบรรทัดละ 1 รูป"
              class="w-full px-3 py-2 border rounded font-mono text-[11px]"
            />
            <div class="mt-1">
              <AdminFileUpload
                model-value=""
                placeholder="อัปโหลดรูปเข้าอัลบั้มเพิ่มทีละรูป..."
                accept="image/*"
                @update:model-value="appendGalleryImage"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold mb-1">คำอธิบายสั้น (Excerpt)</label>
            <input v-model="form.excerpt" type="text" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block font-bold mb-1">รายละเอียดการติดตั้ง / อุปกรณ์ที่ใช้</label>
            <textarea v-model="form.content" rows="4" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" class="px-4 py-2 border rounded font-semibold" @click="modalOpen = false">
              ยกเลิก
            </button>
            <button type="submit" class="btn-firezone text-xs py-2 px-5">บันทึกผลงาน</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { data, refresh } = await useAsyncData('admin-portfolio-list', () =>
  $fetch('/api/posts', { query: { type: 'portfolio', perPage: 100, includeInactive: '1' } })
)

const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const galleryText = ref('')

const form = reactive({
  title: '',
  slug: '',
  type: 'portfolio',
  excerpt: '',
  content: '',
  image: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  isActive: true
})

function appendGalleryImage(url: string) {
  if (!url) return
  galleryText.value = galleryText.value ? `${galleryText.value.trim()}\n${url}` : url
  if (!form.image) form.image = url
}

function openCreate() {
  editingId.value = null
  form.title = ''
  form.slug = ''
  form.excerpt = ''
  form.content = ''
  form.image = ''
  form.publishedAt = new Date().toISOString().slice(0, 10)
  galleryText.value = ''
  modalOpen.value = true
}

function openEdit(item: any) {
  editingId.value = item.id
  form.title = item.title
  form.slug = item.slug
  form.excerpt = item.excerpt || ''
  form.content = item.content || ''
  form.image = item.image || ''
  form.publishedAt = (item.publishedAt || '').slice(0, 10)
  galleryText.value = Array.isArray(item.gallery) ? item.gallery.join('\n') : ''
  modalOpen.value = true
}

async function savePost() {
  const gallery = galleryText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  if (form.image && !gallery.includes(form.image)) {
    gallery.unshift(form.image)
  }

  const payload = { ...form, type: 'portfolio', gallery }
  if (editingId.value) {
    await $fetch(`/api/admin/posts/${editingId.value}`, { method: 'PUT', body: payload })
  } else {
    await $fetch('/api/admin/posts', { method: 'POST', body: payload })
  }
  modalOpen.value = false
  await refresh()
}

async function removePost(item: any) {
  if (!confirm(`ยืนยันการลบผลงาน "${item.title}" ?`)) return
  await $fetch(`/api/admin/posts/${item.id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'จัดการผลงานการติดตั้ง | FIRESZONE CMS' })
</script>
