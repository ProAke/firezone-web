<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">หมวดหมู่สินค้า (Categories)</h1>
        <p class="text-xs text-gray-500 mt-1">จัดการหมวดหมู่หลักและหมวดหมู่ย่อย (เช่น ยี่ห้อภายใต้ Control Panels)</p>
      </div>
      <button type="button" class="btn-firezone text-xs py-2.5 px-4" @click="openCreate">
        + เพิ่มหมวดหมู่
      </button>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
          <tr>
            <th class="px-4 py-3">ชื่อหมวดหมู่</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3">จำนวนสินค้า</th>
            <th class="px-4 py-3">ลำดับ</th>
            <th class="px-4 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-bold text-gray-900">
              <span v-if="cat.parentId" class="text-gray-400 mr-1.5">↳</span>
              {{ cat.name }}
            </td>
            <td class="px-4 py-3 text-gray-500">{{ cat.slug }}</td>
            <td class="px-4 py-3">{{ cat.productCount }} รายการ</td>
            <td class="px-4 py-3">{{ cat.sortOrder }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold"
                @click="openEdit(cat)"
              >
                แก้ไข
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold"
                @click="removeCat(cat)"
              >
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
        <h2 class="text-lg font-extrabold text-firezone-navy">
          {{ editingId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}
        </h2>
        <form class="space-y-3 text-xs" @submit.prevent="saveCat">
          <div>
            <label class="block font-bold mb-1">ชื่อหมวดหมู่ *</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">Slug</label>
            <input v-model="form.slug" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">หมวดหมู่หลัก (ถ้าเป็นหมวดย่อย)</label>
            <select v-model="form.parentId" class="w-full px-3 py-2 border rounded bg-white">
              <option :value="null">-- เป็นหมวดหมู่หลัก --</option>
              <option
                v-for="root in categories.filter((c) => !c.parentId && c.id !== editingId)"
                :key="root.id"
                :value="root.id"
              >
                {{ root.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block font-bold mb-1">ลำดับการแสดงผล</label>
            <input v-model.number="form.sortOrder" type="number" class="w-full px-3 py-2 border rounded" />
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" class="px-4 py-2 border rounded font-semibold" @click="modalOpen = false">
              ยกเลิก
            </button>
            <button type="submit" class="btn-firezone text-xs py-2 px-5">บันทึก</button>
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

const { categories, refreshSiteData } = useSiteData()
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  name: '',
  slug: '',
  parentId: null as number | null,
  sortOrder: 0,
  description: ''
})

function openCreate() {
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.parentId = null
  form.sortOrder = 10
  form.description = ''
  modalOpen.value = true
}

function openEdit(cat: any) {
  editingId.value = cat.id
  form.name = cat.name
  form.slug = cat.slug
  form.parentId = cat.parentId || null
  form.sortOrder = cat.sortOrder || 0
  form.description = cat.description || ''
  modalOpen.value = true
}

async function saveCat() {
  if (editingId.value) {
    await $fetch(`/api/admin/categories/${editingId.value}`, { method: 'PUT', body: form })
  } else {
    await $fetch('/api/admin/categories', { method: 'POST', body: form })
  }
  modalOpen.value = false
  await refreshSiteData()
}

async function removeCat(cat: any) {
  if (!confirm(`ยืนยันการลบหมวดหมู่ "${cat.name}" ?`)) return
  await $fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
  await refreshSiteData()
}

useHead({ title: 'จัดการหมวดหมู่สินค้า | FIRESZONE CMS' })
</script>
