<template>
  <form class="space-y-6" @submit.prevent="saveProduct">
    <!-- Full-Page Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
      <div class="space-y-1">
        <NuxtLink
          to="/admin/products"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-firezone-red"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>กลับหน้ารายการสินค้าทั้งหมด</span>
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-extrabold text-firezone-navy">
          {{ isEdit ? `แก้ไขข้อมูลสินค้า #${productId}` : 'เพิ่มรายการสินค้าใหม่' }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          v-if="isEdit && form.slug"
          :to="`/product/${encodeURIComponent(form.slug)}`"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded border border-gray-300 bg-white hover:border-firezone-red text-xs font-semibold text-gray-700"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>ดูหน้าสินค้าจริง</span>
        </NuxtLink>

        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-5">
          <Save class="w-4 h-4 mr-1.5" />
          <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลสินค้า' }}</span>
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

    <!-- Main 2-Column Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Content Column -->
      <div class="lg:col-span-8 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-5 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label class="block font-bold text-gray-800 mb-1.5">ชื่อรุ่น / ชื่อสินค้า *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="เช่น ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้ NOHMI รุ่น FAPN202-R-5L"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red font-semibold"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-800 mb-1.5">ยี่ห้อ / แบรนด์สินค้า</label>
              <input
                v-model="form.brand"
                type="text"
                placeholder="เช่น NOHMI, SYSTEM SENSOR, NOTIFIER"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1.5">
              รายละเอียดสเปคสินค้า รูปประกอบ และคลิปสาธิต (CKEditor 5)
            </label>
            <AdminCkEditor
              v-model="form.description"
              placeholder="พิมพ์สเปคทางเทคนิค ตารางเปรียบเทียบ แนบรูปภาพอุปกรณ์ หรือแทรกคลิปสาธิตจาก YouTube..."
              :min-height="380"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1">
              คำโปรยสั้น (Short Excerpt — เว้นว่างได้ ระบบจะดึงจากเนื้อหาด้านบนให้อัตโนมัติ)
            </label>
            <input
              v-model="form.excerpt"
              type="text"
              placeholder="เว้นว่างเพื่อให้ระบบสรุปคำโปรยและ Meta Description อัตโนมัติ"
              class="w-full px-3.5 py-2 border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
            />
          </div>

          <div class="pt-2 border-t border-gray-100">
            <label class="block font-bold text-gray-800 mb-1.5">เอกสารสเปค Datasheet (ไฟล์ PDF)</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="form.datasheetUrl"
                type="text"
                placeholder="/uploads/datasheet.pdf หรือวางลิงก์เอกสาร PDF"
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
              />
              <label class="inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-gray-300 rounded cursor-pointer font-semibold shrink-0">
                <span>{{ uploadingPdf ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์ PDF' }}</span>
                <input type="file" accept=".pdf,application/pdf" class="hidden" @change="handleUpload($event, 'datasheetUrl')" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Publish Status Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">สถานะการเผยแพร่</h3>
          <label class="flex items-center gap-2.5 cursor-pointer font-semibold text-gray-800">
            <input v-model="form.isActive" type="checkbox" class="w-4 h-4 accent-red-600 rounded" />
            <span>เปิดแสดงสินค้านี้บนหน้าเว็บไซต์</span>
          </label>

          <div class="pt-2 flex flex-col gap-2">
            <button type="submit" :disabled="saving" class="btn-firezone w-full text-xs py-2.5">
              {{ saving ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไขสินค้า' : 'บันทึกและเผยแพร่สินค้า' }}
            </button>
            <button
              v-if="isEdit"
              type="button"
              class="w-full py-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
              @click="handleDelete"
            >
              ลบสินค้านี้ออกจากระบบ
            </button>
          </div>
        </div>

        <!-- Cover Image Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">รูปภาพหลักของสินค้า</h3>
          <AdminImageDropzone
            v-model="form.image"
            :alt="form.name"
            label="อัปโหลดรูปภาพหลักของสินค้า"
          />
        </div>

        <!-- Product Categories Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3 text-xs">
          <div class="flex items-center justify-between border-b pb-2.5">
            <h3 class="font-bold text-sm text-firezone-navy">หมวดหมู่สินค้า</h3>
            <NuxtLink to="/admin/categories/new" class="text-[11px] text-firezone-red font-semibold hover:underline">
              + เพิ่มหมวดหมู่
            </NuxtLink>
          </div>
          <div class="max-h-56 overflow-y-auto space-y-2 pr-1">
            <label
              v-for="cat in categories"
              :key="cat.id"
              class="flex items-center gap-2 text-gray-700 cursor-pointer"
              :class="cat.parentId ? 'pl-4 text-[11px]' : 'font-semibold'"
            >
              <input v-model="form.categoryIds" type="checkbox" :value="cat.id" class="accent-red-600 rounded" />
              <span>{{ cat.name }}</span>
            </label>
          </div>
        </div>

        <!-- Automatic SEO Card -->
        <AdminSeoBox
          v-model:slug="form.slug"
          v-model:seo-title="form.seoTitle"
          v-model:seo-description="form.seoDescription"
          v-model:seo-keywords="form.seoKeywords"
          :item-title="form.name"
          :excerpt="form.excerpt"
          :html-content="form.description"
          :image="form.image"
          path-prefix="/product"
          title-suffix="สินค้า FIRESZONE"
          :keyword-hints="selectedCategoryNames"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ArrowLeft, ExternalLink, Save, Upload } from 'lucide-vue-next'

const props = defineProps<{
  productId?: number
}>()

const router = useRouter()
const { categories, refreshSiteData } = useSiteData()

const isEdit = computed(() => Boolean(props.productId))
const saving = ref(false)
const uploadingImg = ref(false)
const uploadingPdf = ref(false)
const savedNotice = ref('')
const errorNotice = ref('')

const form = reactive({
  name: '',
  slug: '',
  brand: '',
  excerpt: '',
  description: '',
  image: '',
  datasheetUrl: '',
  categoryIds: [] as number[],
  isActive: true,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

if (props.productId) {
  const reqFetch = useRequestFetch()
  const { data, error } = await useAsyncData(`admin-product-${props.productId}`, () =>
    reqFetch<{ product: any }>(`/api/admin/products/${props.productId}`)
  )
  if (error.value || !data.value?.product) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบสินค้าที่ต้องการแก้ไข' })
  }
  const p = data.value.product
  form.name = p.name || ''
  form.slug = p.slug || ''
  form.brand = p.brand || ''
  form.excerpt = p.excerpt || ''
  form.description = p.description || ''
  form.image = p.image || ''
  form.datasheetUrl = p.datasheetUrl || ''
  form.categoryIds = [...(p.categoryIds || [])]
  form.isActive = Boolean(p.isActive)
  form.seoTitle = p.seoTitle || ''
  form.seoDescription = p.seoDescription || ''
  form.seoKeywords = p.seoKeywords || ''
}

const selectedCategoryNames = computed(() => {
  const list = categories.value
    .filter((c: any) => form.categoryIds.includes(c.id))
    .map((c: any) => c.name)
  return form.brand ? [form.brand, ...list] : list
})

async function handleUpload(ev: Event, field: 'image' | 'datasheetUrl') {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (field === 'image') uploadingImg.value = true
  else uploadingPdf.value = true
  errorNotice.value = ''

  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body: fd
    })
    form[field] = res.url
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'อัปโหลดไฟล์ไม่สำเร็จ'
  } finally {
    uploadingImg.value = false
    uploadingPdf.value = false
    input.value = ''
  }
}

async function saveProduct() {
  saving.value = true
  errorNotice.value = ''
  savedNotice.value = ''
  try {
    if (props.productId) {
      const res = await $fetch<{ id: number; slug: string }>(`/api/admin/products/${props.productId}`, {
        method: 'PUT',
        body: { ...form }
      })
      form.slug = res.slug
      savedNotice.value = 'บันทึกการแก้ไขข้อมูลสินค้าและอัปเดต SEO อัตโนมัติเรียบร้อยแล้ว'
      await refreshSiteData()
    } else {
      const res = await $fetch<{ id: number; slug: string }>('/api/admin/products', {
        method: 'POST',
        body: { ...form }
      })
      await refreshSiteData()
      await router.push(`/admin/products/${res.id}?created=1`)
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'ไม่สามารถบันทึกสินค้าได้'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.productId) return
  if (!confirm(`ยืนยันการลบสินค้า "${form.name}"?`)) return
  await $fetch(`/api/admin/products/${props.productId}`, { method: 'DELETE' })
  await refreshSiteData()
  await router.push('/admin/products')
}

const route = useRoute()
onMounted(() => {
  if (route.query.created === '1') {
    savedNotice.value = 'สร้างรายการสินค้าใหม่และตั้งค่า SEO อัตโนมัติเรียบร้อยแล้ว'
  }
})
</script>
