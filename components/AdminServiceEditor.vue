<template>
  <form class="space-y-6" @submit.prevent="saveService">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
      <div class="space-y-1">
        <NuxtLink
          to="/admin/services"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-firezone-red"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>กลับหน้ารายการบริการและระบบอุปกรณ์</span>
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-extrabold text-firezone-navy">
          {{ isEdit ? `แก้ไขข้อมูลบริการ #${serviceId}` : 'เพิ่มบริการ / ระบบอุปกรณ์ใหม่' }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          v-if="isEdit && form.slug"
          :to="`/service/${encodeURIComponent(form.slug)}`"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded border border-gray-300 bg-white hover:border-firezone-red text-xs font-semibold text-gray-700"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>ดูหน้าบริการจริง</span>
        </NuxtLink>

        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-5">
          <Save class="w-4 h-4 mr-1.5" />
          <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลบริการ' }}</span>
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
            <label class="block font-bold text-gray-800 mb-1.5">ชื่อบริการ / ระบบอุปกรณ์ *</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="เช่น บริการตรวจสอบและบำรุงรักษาระบบแจ้งเหตุเพลิงไหม้ประจำปี"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red font-semibold"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1.5">
              รายละเอียดเนื้อหา รูปประกอบหน้างาน และคลิปวิดีโอ YouTube (CKEditor 5)
            </label>
            <AdminCkEditor
              v-model="form.content"
              placeholder="เขียนรายละเอียดขอบเขตงานบริการ ขั้นตอนการตรวจเช็ค แทรกรูปหน้างาน หรือวางลิงก์คลิป YouTube..."
              :min-height="380"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1">
              คำโปรยสั้น (Excerpt — เว้นว่างเพื่อให้ระบบดึงสรุปจากเนื้อหาให้อัตโนมัติ)
            </label>
            <input
              v-model="form.excerpt"
              type="text"
              placeholder="เว้นว่างเพื่อให้ระบบสรุปคำโปรยและ Meta Description อัตโนมัติ"
              class="w-full px-3.5 py-2 border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
            />
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">ประเภทและลำดับการแสดงผล</h3>

          <div>
            <label class="block font-bold text-gray-700 mb-1">หมวดการแสดงผล</label>
            <select v-model="form.type" class="w-full px-3 py-2 border border-gray-300 rounded bg-white">
              <option value="service">บริการของเรา (Services)</option>
              <option value="equipment">อุปกรณ์ของเรา (Equipment หมวดหน้าแรก)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">ลำดับแสดงผล (Sort Order)</label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <button type="submit" :disabled="saving" class="btn-firezone w-full text-xs py-2.5">
              {{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลบริการ' }}
            </button>
            <button
              v-if="isEdit"
              type="button"
              class="w-full py-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
              @click="handleDelete"
            >
              ลบบริการนี้
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">รูปภาพปกบริการ</h3>
          <div v-if="form.image" class="rounded overflow-hidden border border-gray-200">
            <SmartImage :src="form.image" :alt="form.title" img-class="w-full h-44 object-cover" />
          </div>
          <div v-else class="h-32 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
            ยังไม่ได้เลือกรูปปก
          </div>

          <label class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-firezone-navy hover:bg-slate-800 text-white rounded cursor-pointer font-semibold transition-colors">
            <Upload class="w-3.5 h-3.5" />
            <span>{{ uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปปกบริการ' }}</span>
            <input type="file" accept="image/*" class="hidden" @change="handleUpload" />
          </label>

          <input
            v-model="form.image"
            type="text"
            placeholder="หรือระบุ URL รูปภาพ..."
            class="w-full px-3 py-1.5 border border-gray-300 rounded text-[11px]"
          />
        </div>

        <AdminSeoBox
          v-model:slug="form.slug"
          v-model:seo-title="form.seoTitle"
          v-model:seo-description="form.seoDescription"
          v-model:seo-keywords="form.seoKeywords"
          :item-title="form.title"
          :excerpt="form.excerpt"
          :html-content="form.content"
          :image="form.image"
          path-prefix="/service"
          title-suffix="บริการ FIRESZONE"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ArrowLeft, ExternalLink, Save, Upload } from 'lucide-vue-next'

const props = defineProps<{
  serviceId?: number
}>()

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => Boolean(props.serviceId))
const saving = ref(false)
const uploading = ref(false)
const savedNotice = ref('')
const errorNotice = ref('')

const form = reactive({
  title: '',
  slug: '',
  type: 'service',
  excerpt: '',
  content: '',
  image: '',
  sortOrder: 10,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

if (props.serviceId) {
  const reqFetch = useRequestFetch()
  const { data, error } = await useAsyncData(`admin-service-${props.serviceId}`, () =>
    reqFetch<{ service: any }>(`/api/admin/services/${props.serviceId}`)
  )
  if (error.value || !data.value?.service) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบบริการที่ต้องการแก้ไข' })
  }
  const s = data.value.service
  form.title = s.title || ''
  form.slug = s.slug || ''
  form.type = s.type || 'service'
  form.excerpt = s.excerpt || ''
  form.content = s.content || ''
  form.image = s.image || ''
  form.sortOrder = s.sortOrder || 0
  form.seoTitle = s.seoTitle || ''
  form.seoDescription = s.seoDescription || ''
  form.seoKeywords = s.seoKeywords || ''
}

async function handleUpload(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })
    form.image = res.url
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'อัปโหลดรูปภาพไม่สำเร็จ'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function saveService() {
  saving.value = true
  errorNotice.value = ''
  savedNotice.value = ''
  try {
    if (props.serviceId) {
      const res = await $fetch<{ id: number; slug: string }>(`/api/admin/services/${props.serviceId}`, {
        method: 'PUT',
        body: { ...form }
      })
      form.slug = res.slug
      savedNotice.value = 'บันทึกข้อมูลบริการและอัปเดต SEO อัตโนมัติเรียบร้อยแล้ว'
    } else {
      const res = await $fetch<{ id: number; slug: string }>('/api/admin/services', {
        method: 'POST',
        body: { ...form }
      })
      await router.push(`/admin/services/${res.id}?created=1`)
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'ไม่สามารถบันทึกบริการได้'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.serviceId) return
  if (!confirm(`ยืนยันการลบ "${form.title}"?`)) return
  await $fetch(`/api/admin/services/${props.serviceId}`, { method: 'DELETE' })
  await router.push('/admin/services')
}

onMounted(() => {
  if (route.query.created === '1') {
    savedNotice.value = 'สร้างบริการใหม่เรียบร้อยแล้ว'
  }
})
</script>
