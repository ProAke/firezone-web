<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">จัดการสินค้า (Products)</h1>
        <p class="text-xs text-gray-500 mt-1">เพิ่ม แก้ไข อัปโหลดรูปภาพ Datasheet และกำหนดหมวดหมู่สินค้า</p>
      </div>
      <button type="button" class="btn-firezone text-xs py-2.5 px-4" @click="openCreateModal">
        + เพิ่มสินค้าใหม่
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3 items-center">
      <input
        v-model="search"
        type="search"
        placeholder="ค้นหาชื่อรุ่น หรือยี่ห้อ..."
        class="flex-1 min-w-[200px] px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
      />
      <select
        v-model="categoryFilter"
        class="px-3 py-2 text-xs border border-gray-300 rounded bg-white"
      >
        <option value="">ทุกหมวดหมู่</option>
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
            <th class="px-4 py-3">รูปภาพ</th>
            <th class="px-4 py-3">ชื่อรุ่นสินค้า</th>
            <th class="px-4 py-3">ยี่ห้อ</th>
            <th class="px-4 py-3">หมวดหมู่</th>
            <th class="px-4 py-3">สถานะ</th>
            <th class="px-4 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in productsData?.items || []" :key="item.id" class="hover:bg-gray-50/70">
            <td class="px-4 py-2.5">
              <SmartImage :src="item.image" :alt="item.name" img-class="w-12 h-12 object-contain border rounded bg-white p-1" />
            </td>
            <td class="px-4 py-2.5">
              <div class="font-bold text-gray-900 text-sm">{{ item.name }}</div>
              <div class="text-gray-400 line-clamp-1 max-w-xs">{{ item.excerpt }}</div>
            </td>
            <td class="px-4 py-2.5 font-medium text-gray-700">{{ item.brand || '-' }}</td>
            <td class="px-4 py-2.5">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cat in item.categories || []"
                  :key="cat.id"
                  class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px]"
                >
                  {{ cat.name }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2.5">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-semibold"
                :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
              >
                {{ item.isActive ? 'แสดงผล' : 'ซ่อน' }}
              </span>
            </td>
            <td class="px-4 py-2.5 text-right space-x-2 whitespace-nowrap">
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                @click="openEditModal(item)"
              >
                แก้ไข
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
                @click="deleteProduct(item)"
              >
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create / Edit -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h2 class="text-lg font-extrabold text-firezone-navy">
            {{ editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
          </h2>
          <button type="button" class="text-gray-400 hover:text-gray-700 text-xl font-bold" @click="modalOpen = false">
            ×
          </button>
        </div>

        <form class="space-y-4 text-xs" @submit.prevent="saveProduct">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">ชื่อรุ่นสินค้า *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">ยี่ห้อ (Brand)</label>
              <input
                v-model="form.brand"
                type="text"
                placeholder="เช่น Notifier, Nohmi, GST, Simplex"
                class="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">URL Slug (เว้นว่างเพื่อสร้างอัตโนมัติ)</label>
              <input
                v-model="form.slug"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div class="flex items-center pt-5">
              <label class="inline-flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                <input v-model="form.isActive" type="checkbox" class="rounded text-firezone-red" />
                <span>เปิดแสดงสินค้าบนหน้าเว็บไซต์</span>
              </label>
            </div>
          </div>

          <AdminFileUpload
            v-model="form.image"
            label="รูปภาพสินค้า"
            accept="image/*"
            :show-preview="true"
          />

          <AdminFileUpload
            v-model="form.datasheetUrl"
            label="ไฟล์เอกสาร Datasheet PDF (ถ้ามี)"
            accept=".pdf,image/*"
            placeholder="ลิงก์ไฟล์ .pdf หรือกดอัปโหลด"
          />

          <div>
            <label class="block font-bold text-gray-700 mb-1">คำอธิบายสั้น (Excerpt)</label>
            <input
              v-model="form.excerpt"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">รายละเอียดและสเปคสินค้า</label>
            <textarea
              v-model="form.description"
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-2">หมวดหมู่สินค้า (เลือกได้มากกว่า 1 หมวด)</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded border border-gray-200 max-h-44 overflow-y-auto">
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="inline-flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
              >
                <input
                  v-model="form.categoryIds"
                  type="checkbox"
                  :value="cat.id"
                  class="rounded text-firezone-red"
                />
                <span>{{ cat.parentId ? `— ${cat.name}` : cat.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              class="px-4 py-2 rounded border border-gray-300 text-gray-700 font-semibold"
              @click="modalOpen = false"
            >
              ยกเลิก
            </button>
            <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2 px-5">
              {{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลสินค้า' }}
            </button>
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
const search = ref('')
const categoryFilter = ref('')

const { data: productsData, refresh } = await useAsyncData(
  () => `admin-products-${search.value}-${categoryFilter.value}`,
  () =>
    $fetch('/api/products', {
      query: {
        search: search.value,
        category: categoryFilter.value,
        perPage: 100,
        includeInactive: '1'
      }
    }),
  { watch: [search, categoryFilter] }
)

const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  name: '',
  slug: '',
  brand: '',
  excerpt: '',
  description: '',
  image: '',
  datasheetUrl: '',
  isActive: true,
  categoryIds: [] as number[]
})

function openCreateModal() {
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.brand = ''
  form.excerpt = ''
  form.description = ''
  form.image = ''
  form.datasheetUrl = ''
  form.isActive = true
  form.categoryIds = []
  modalOpen.value = true
}

function openEditModal(item: any) {
  editingId.value = item.id
  form.name = item.name || ''
  form.slug = item.slug || ''
  form.brand = item.brand || ''
  form.excerpt = item.excerpt || ''
  form.description = item.description || ''
  form.image = item.image || ''
  form.datasheetUrl = item.datasheetUrl || ''
  form.isActive = Boolean(item.isActive)
  form.categoryIds = Array.isArray(item.categoryIds) ? [...item.categoryIds] : []
  modalOpen.value = true
}

async function saveProduct() {
  saving.value = true
  try {
    if (editingId.value) {
      await $fetch(`/api/admin/products/${editingId.value}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/admin/products', {
        method: 'POST',
        body: form
      })
    }
    modalOpen.value = false
    await Promise.all([refresh(), refreshSiteData()])
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'บันทึกไม่สำเร็จ')
  } finally {
    saving.value = false
  }
}

async function deleteProduct(item: any) {
  if (!confirm(`ยืนยันการลบสินค้า "${item.name}" ?`)) return
  await $fetch(`/api/admin/products/${item.id}`, { method: 'DELETE' })
  await Promise.all([refresh(), refreshSiteData()])
}

useHead({ title: 'จัดการสินค้า | FIRESZONE CMS' })
</script>
