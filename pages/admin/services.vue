<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">บริการ &amp; อุปกรณ์ (Services)</h1>
        <p class="text-xs text-gray-500 mt-1">จัดการข้อมูลหน้าอุปกรณ์ของเรา 5 หมวด และงานบริการของเรา 4 หมวด</p>
      </div>
      <button type="button" class="btn-firezone text-xs py-2.5 px-4" @click="openCreate">
        + เพิ่มรายการใหม่
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in data?.items || []"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 shadow-sm"
      >
        <SmartImage :src="item.image" :alt="item.title" img-class="w-24 h-24 object-cover rounded border shrink-0" />
        <div class="flex-1 min-w-0">
          <span
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
            :class="item.type === 'equipment' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'"
          >
            {{ item.type === 'equipment' ? 'อุปกรณ์ของเรา' : 'งานบริการของเรา' }}
          </span>
          <h3 class="font-bold text-sm text-gray-900 mt-1 truncate">{{ item.title }}</h3>
          <p class="text-xs text-gray-500 line-clamp-2 mt-1">{{ item.excerpt }}</p>
          <div class="mt-3 flex gap-2 text-xs">
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
              @click="removeItem(item)"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 class="text-lg font-extrabold text-firezone-navy">
          {{ editingId ? 'แก้ไขข้อมูลบริการ / อุปกรณ์' : 'เพิ่มบริการ / อุปกรณ์ใหม่' }}
        </h2>
        <form class="space-y-3 text-xs" @submit.prevent="saveItem">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold mb-1">ประเภท *</label>
              <select v-model="form.type" class="w-full px-3 py-2 border rounded bg-white">
                <option value="service">งานบริการของเรา (Service)</option>
                <option value="equipment">อุปกรณ์ของเรา (Equipment)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold mb-1">ลำดับการแสดงผล</label>
              <input v-model.number="form.sortOrder" type="number" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div>
            <label class="block font-bold mb-1">หัวข้อ *</label>
            <input v-model="form.title" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>

          <AdminFileUpload v-model="form.image" label="รูปภาพประกอบ" accept="image/*" :show-preview="true" />

          <div>
            <label class="block font-bold mb-1">คำโปรยสั้น (Excerpt)</label>
            <textarea v-model="form.excerpt" rows="2" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block font-bold mb-1">เนื้อหารายละเอียดเต็ม</label>
            <textarea v-model="form.content" rows="6" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" class="px-4 py-2 border rounded font-semibold" @click="modalOpen = false">
              ยกเลิก
            </button>
            <button type="submit" class="btn-firezone text-xs py-2 px-5">บันทึกข้อมูล</button>
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

const { data, refresh } = await useAsyncData('admin-services-list', () => $fetch('/api/services'))

const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  title: '',
  slug: '',
  type: 'service',
  excerpt: '',
  content: '',
  image: '',
  sortOrder: 10
})

function openCreate() {
  editingId.value = null
  form.title = ''
  form.slug = ''
  form.type = 'service'
  form.excerpt = ''
  form.content = ''
  form.image = ''
  form.sortOrder = 10
  modalOpen.value = true
}

function openEdit(item: any) {
  editingId.value = item.id
  form.title = item.title
  form.slug = item.slug
  form.type = item.type
  form.excerpt = item.excerpt || ''
  form.content = item.content || ''
  form.image = item.image || ''
  form.sortOrder = item.sortOrder || 0
  modalOpen.value = true
}

async function saveItem() {
  if (editingId.value) {
    await $fetch(`/api/admin/services/${editingId.value}`, { method: 'PUT', body: form })
  } else {
    await $fetch('/api/admin/services', { method: 'POST', body: form })
  }
  modalOpen.value = false
  await refresh()
}

async function removeItem(item: any) {
  if (!confirm(`ยืนยันการลบ "${item.title}" ?`)) return
  await $fetch(`/api/admin/services/${item.id}`, { method: 'DELETE' })
  await refresh()
}

useHead({ title: 'จัดการบริการและอุปกรณ์ | FIRESZONE CMS' })
</script>
