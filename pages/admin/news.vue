<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ข่าวสาร &amp; บทความความรู้ (News)</h1>
        <p class="text-xs text-gray-500 mt-1">จัดการบทความสาระความรู้ด้านระบบแจ้งเหตุเพลิงไหม้และข่าวประชาสัมพันธ์</p>
      </div>
      <button type="button" class="btn-firezone text-xs py-2.5 px-4" @click="openCreate">
        + เขียนบทความใหม่
      </button>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 shadow-sm">
      <div
        v-for="item in data?.items || []"
        :key="item.id"
        class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4 min-w-0">
          <SmartImage :src="item.image" :alt="item.title" img-class="w-20 h-16 object-cover rounded border shrink-0" />
          <div class="min-w-0">
            <div class="text-[11px] text-gray-400">{{ item.publishedAt }}</div>
            <h3 class="font-bold text-sm text-gray-900 truncate">{{ item.title }}</h3>
            <p class="text-xs text-gray-500 line-clamp-1">{{ item.excerpt }}</p>
          </div>
        </div>
        <div class="flex gap-2 text-xs shrink-0">
          <button
            type="button"
            class="px-3 py-1.5 rounded bg-blue-50 text-blue-700 font-semibold"
            @click="openEdit(item)"
          >
            แก้ไข
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded bg-red-50 text-red-600 font-semibold"
            @click="removeNews(item)"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 class="text-lg font-extrabold text-firezone-navy">
          {{ editingId ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่' }}
        </h2>
        <form class="space-y-3 text-xs" @submit.prevent="saveNews">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-bold mb-1">หัวข้อบทความ *</label>
              <input v-model="form.title" type="text" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block font-bold mb-1">วันที่เผยแพร่</label>
              <input v-model="form.publishedAt" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <AdminFileUpload v-model="form.image" label="รูปภาพปกบทความ" accept="image/*" :show-preview="true" />

          <div>
            <label class="block font-bold mb-1">คำโปรยย่อ (Excerpt)</label>
            <textarea v-model="form.excerpt" rows="2" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block font-bold mb-1">เนื้อหาบทความฉบับเต็ม</label>
            <textarea v-model="form.content" rows="8" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" class="px-4 py-2 border rounded font-semibold" @click="modalOpen = false">
              ยกเลิก
            </button>
            <button type="submit" class="btn-firezone text-xs py-2 px-5">บันทึกบทความ</button>
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

const { data, refresh } = await useAsyncData('admin-news-list', () =>
  $fetch('/api/posts', { query: { type: 'news', perPage: 100, includeInactive: '1' } })
)

const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  title: '',
  slug: '',
  type: 'news',
  excerpt: '',
  content: '',
  image: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  isActive: true
})

function openCreate() {
  editingId.value = null
  form.title = ''
  form.slug = ''
  form.excerpt = ''
  form.content = ''
  form.image = ''
  form.publishedAt = new Date().toISOString().slice(0, 10)
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
  modalOpen.value = true
}

async function saveNews() {
  const payload = { ...form, type: 'news', gallery: form.image ? [form.image] : [] }
  if (editingId.value) {
    await $fetch(`/api/admin/posts/${editingId.value}`, { method: 'PUT', body: payload })
  } else {
    await $fetch('/api/admin/posts', { method: 'POST', body: payload })
  }
  modalOpen.value = false
  await refresh()
}

async function removeNews(item: any) {
  if (!confirm(`ยืนยันการลบบทความ "${item.title}" ?`)) return
  await $fetch(`/api/admin/posts/${item.id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'จัดการข่าวสารและบทความ | FIRESZONE CMS' })
</script>
