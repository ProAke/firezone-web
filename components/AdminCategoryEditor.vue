<template>
  <form class="space-y-6" @submit.prevent="saveCategory">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
      <div class="space-y-1">
        <NuxtLink
          to="/admin/categories"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-firezone-red"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>กลับหน้ารายการหมวดหมู่สินค้า</span>
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-extrabold text-firezone-navy">
          {{ isEdit ? `แก้ไขหมวดหมู่สินค้า #${categoryId}` : 'เพิ่มหมวดหมู่สินค้าใหม่' }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          v-if="isEdit && form.slug"
          :to="`/shop/category/${encodeURIComponent(form.slug)}`"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded border border-gray-300 bg-white hover:border-firezone-red text-xs font-semibold text-gray-700"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>ดูหน้าหมวดหมู่จริง</span>
        </NuxtLink>

        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-5">
          <Save class="w-4 h-4 mr-1.5" />
          <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกหมวดหมู่' }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="savedNotice"
      class="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-between"
    >
      <span>✓ {{ savedNotice }}</span>
      <button type="button" class="font-bold" @click="savedNotice = ''">×</button>
    </div>

    <div
      v-if="errorNotice"
      class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-xs font-semibold"
    >
      {{ errorNotice }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-8 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-5 text-xs">
          <div>
            <label class="block font-bold text-gray-800 mb-1.5">ชื่อหมวดหมู่สินค้า *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="เช่น ตู้ควบคุมแจ้งเหตุเพลิงไหม้ (Fire Alarm Control Panel)"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red font-semibold"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1.5">
              รายละเอียดแนะนำหมวดหมู่ รูปภาพ หรือคลิปแนะนำสินค้า (CKEditor 5)
            </label>
            <AdminCkEditor
              v-model="form.description"
              placeholder="เขียนคำอธิบายหมวดหมู่เพื่อให้แสดงบนหัวหน้าหมวดหมู่สินค้าและช่วยทำ SEO อัตโนมัติ..."
              :min-height="280"
            />
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">โครงสร้างและลำดับแสดงผล</h3>

          <div>
            <label class="block font-bold text-gray-700 mb-1">หมวดหมู่หลัก (Parent Category)</label>
            <select v-model="form.parentId" class="w-full px-3 py-2 border border-gray-300 rounded bg-white">
              <option :value="null">— เป็นหมวดหมู่หลักระดับบนสุด —</option>
              <option
                v-for="p in parentOptions"
                :key="p.id"
                :value="p.id"
              >
                {{ p.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">ลำดับการแสดงผล (Sort Order)</label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <button type="submit" :disabled="saving" class="btn-firezone w-full text-xs py-2.5">
              {{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลหมวดหมู่' }}
            </button>
            <button
              v-if="isEdit"
              type="button"
              class="w-full py-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
              @click="handleDelete"
            >
              ลบหมวดหมู่นี้
            </button>
          </div>
        </div>

        <AdminSeoBox
          v-model:slug="form.slug"
          v-model:seo-title="form.seoTitle"
          v-model:seo-description="form.seoDescription"
          v-model:seo-keywords="form.seoKeywords"
          :item-title="form.name"
          :html-content="form.description"
          path-prefix="/shop/category"
          title-suffix="อุปกรณ์ Fire Alarm | FIRESZONE"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ArrowLeft, ExternalLink, Save } from 'lucide-vue-next'

const props = defineProps<{
  categoryId?: number
}>()

const router = useRouter()
const route = useRoute()
const { categories, refreshSiteData } = useSiteData()

const isEdit = computed(() => Boolean(props.categoryId))
const saving = ref(false)
const savedNotice = ref('')
const errorNotice = ref('')

const form = reactive({
  name: '',
  slug: '',
  parentId: null as number | null,
  sortOrder: 10,
  description: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

if (props.categoryId) {
  const reqFetch = useRequestFetch()
  const { data, error } = await useAsyncData(`admin-category-${props.categoryId}`, () =>
    reqFetch<{ category: any }>(`/api/admin/categories/${props.categoryId}`)
  )
  if (error.value || !data.value?.category) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข' })
  }
  const c = data.value.category
  form.name = c.name || ''
  form.slug = c.slug || ''
  form.parentId = c.parentId || null
  form.sortOrder = c.sortOrder || 0
  form.description = c.description || ''
  form.seoTitle = c.seoTitle || ''
  form.seoDescription = c.seoDescription || ''
  form.seoKeywords = c.seoKeywords || ''
}

const parentOptions = computed(() =>
  categories.value.filter((c: any) => !c.parentId && c.id !== props.categoryId)
)

async function saveCategory() {
  saving.value = true
  errorNotice.value = ''
  savedNotice.value = ''
  try {
    if (props.categoryId) {
      const res = await $fetch<{ id: number; slug: string }>(`/api/admin/categories/${props.categoryId}`, {
        method: 'PUT',
        body: { ...form }
      })
      form.slug = res.slug
      savedNotice.value = 'บันทึกหมวดหมู่และตั้งค่า SEO อัตโนมัติเรียบร้อยแล้ว'
      await refreshSiteData()
    } else {
      const res = await $fetch<{ id: number; slug: string }>('/api/admin/categories', {
        method: 'POST',
        body: { ...form }
      })
      await refreshSiteData()
      await router.push(`/admin/categories/${res.id}?created=1`)
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'ไม่สามารถบันทึกหมวดหมู่ได้'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.categoryId) return
  if (!confirm(`ยืนยันการลบหมวดหมู่ "${form.name}"?`)) return
  await $fetch(`/api/admin/categories/${props.categoryId}`, { method: 'DELETE' })
  await refreshSiteData()
  await router.push('/admin/categories')
}

onMounted(() => {
  if (route.query.created === '1') {
    savedNotice.value = 'สร้างหมวดหมู่สินค้าใหม่เรียบร้อยแล้ว'
  }
})
</script>
