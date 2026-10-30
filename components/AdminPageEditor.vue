<template>
  <form class="space-y-6" @submit.prevent="savePage">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
      <div class="space-y-1">
        <NuxtLink
          to="/admin/pages"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-firezone-red"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>กลับหน้ารายการหน้าเว็บไซต์ทั้งหมด</span>
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-extrabold text-firezone-navy">
          {{ isEdit ? `แก้ไขเนื้อหาหน้าเว็บไซต์: ${form.title}` : 'สร้างหน้าเว็บไซต์ใหม่' }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          v-if="isEdit && publicUrl"
          :to="publicUrl"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded border border-gray-300 bg-white hover:border-firezone-red text-xs font-semibold text-gray-700"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>ดูหน้าเว็บไซต์จริง</span>
        </NuxtLink>

        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-5">
          <Save class="w-4 h-4 mr-1.5" />
          <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกหน้าเว็บไซต์' }}</span>
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
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label class="block font-bold text-gray-800 mb-1.5">หัวข้อหลักของหน้า (Page Title) *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="เช่น เกี่ยวกับเรา หรือ มาตรฐานการติดตั้งระบบแจ้งเหตุเพลิงไหม้"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red font-semibold"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-800 mb-1.5">คำโปรยแบนเนอร์ (Subtitle)</label>
              <input
                v-model="form.subtitle"
                type="text"
                placeholder="เช่น ABOUT FIRESZONE"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1.5">
              เนื้อหาหน้าเว็บไซต์ รูปประกอบ และคลิปวิดีโอ YouTube (CKEditor 5)
            </label>
            <AdminCkEditor
              v-model="form.content"
              placeholder="พิมพ์เนื้อหาหน้าเว็บ จัดย่อหน้า แทรกรูปภาพ ตารางข้อมูล หรือแทรกคลิป YouTube ได้ที่นี่..."
              :min-height="420"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1">
              คำสรุปย่อของหน้า (Excerpt — เว้นว่างเพื่อให้ระบบสรุปจากเนื้อหาให้อัตโนมัติ)
            </label>
            <input
              v-model="form.excerpt"
              type="text"
              placeholder="เว้นว่างเพื่อให้ระบบดึงสรุปเนื้อหาและทำ SEO อัตโนมัติ"
              class="w-full px-3.5 py-2 border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
            />
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">สถานะหน้าเว็บไซต์</h3>

          <div v-if="form.isSystem" class="bg-slate-50 border border-slate-200 rounded p-3 text-gray-600 leading-relaxed">
            หน้านี้เป็น<strong>หน้าหลักของระบบ</strong> ({{ publicUrl }}) เปิดใช้งานตลอดเวลาและเชื่อมต่อกับเมนูหลักของเว็บไซต์โดยตรง
          </div>

          <label v-else class="flex items-center gap-2.5 cursor-pointer font-semibold text-gray-800">
            <input v-model="form.isActive" type="checkbox" class="w-4 h-4 accent-red-600 rounded" />
            <span>เปิดแสดงหน้าเว็บไซต์นี้</span>
          </label>

          <div class="pt-1 flex flex-col gap-2">
            <button type="submit" :disabled="saving" class="btn-firezone w-full text-xs py-2.5">
              {{ saving ? 'กำลังบันทึก...' : 'บันทึกเนื้อหาหน้าเว็บไซต์' }}
            </button>
            <button
              v-if="isEdit && !form.isSystem"
              type="button"
              class="w-full py-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
              @click="handleDelete"
            >
              ลบหน้าเว็บนี้
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">รูปภาพหลักประจำหน้า</h3>
          <div v-if="form.image" class="rounded overflow-hidden border border-gray-200">
            <SmartImage :src="form.image" :alt="form.title" img-class="w-full h-44 object-cover" />
          </div>
          <div v-else class="h-28 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
            ไม่มีรูปหลักแยกต่างหาก
          </div>

          <label class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-firezone-navy hover:bg-slate-800 text-white rounded cursor-pointer font-semibold transition-colors">
            <Upload class="w-3.5 h-3.5" />
            <span>{{ uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพประจำหน้า' }}</span>
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
          :lock-slug="form.isSystem"
          :item-title="form.title"
          :excerpt="form.excerpt"
          :html-content="form.content"
          :image="form.image"
          :path-prefix="form.isSystem ? '' : '/page'"
          title-suffix="บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ArrowLeft, ExternalLink, Save, Upload } from 'lucide-vue-next'

const props = defineProps<{
  pageSlug?: string
}>()

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => Boolean(props.pageSlug))
const saving = ref(false)
const uploading = ref(false)
const savedNotice = ref('')
const errorNotice = ref('')

const form = reactive({
  title: '',
  subtitle: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  isSystem: false,
  isActive: true,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

if (props.pageSlug) {
  const reqFetch = useRequestFetch()
  const { data, error } = await useAsyncData(`admin-page-${props.pageSlug}`, () =>
    reqFetch<{ page: any }>(`/api/admin/pages/${encodeURIComponent(props.pageSlug!)}`)
  )
  if (error.value || !data.value?.page) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบหน้าเว็บไซต์ที่ต้องการแก้ไข' })
  }
  const pg = data.value.page
  form.title = pg.title || ''
  form.subtitle = pg.subtitle || ''
  form.slug = pg.slug || ''
  form.excerpt = pg.excerpt || ''
  form.content = pg.content || ''
  form.image = pg.image || ''
  form.isSystem = Boolean(pg.isSystem)
  form.isActive = Boolean(pg.isActive)
  form.seoTitle = pg.seoTitle || ''
  form.seoDescription = pg.seoDescription || ''
  form.seoKeywords = pg.seoKeywords || ''
}

const publicUrl = computed(() => {
  if (!form.slug) return ''
  if (form.isSystem) {
    return form.slug === 'home' ? '/' : `/${form.slug}`
  }
  return `/page/${encodeURIComponent(form.slug)}`
})

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

async function savePage() {
  saving.value = true
  errorNotice.value = ''
  savedNotice.value = ''
  try {
    if (props.pageSlug) {
      const res = await $fetch<{ id: number; slug: string }>(
        `/api/admin/pages/${encodeURIComponent(props.pageSlug)}`,
        {
          method: 'PUT',
          body: { ...form }
        }
      )
      form.slug = res.slug
      savedNotice.value = 'บันทึกเนื้อหาหน้าเว็บไซต์และอัปเดต SEO อัตโนมัติเรียบร้อยแล้ว'
      if (res.slug !== props.pageSlug) {
        await router.replace(`/admin/pages/${encodeURIComponent(res.slug)}`)
      }
    } else {
      const res = await $fetch<{ id: number; slug: string }>('/api/admin/pages', {
        method: 'POST',
        body: { ...form }
      })
      await router.push(`/admin/pages/${encodeURIComponent(res.slug)}?created=1`)
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'ไม่สามารถบันทึกหน้าเว็บไซต์ได้'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.pageSlug || form.isSystem) return
  if (!confirm(`ยืนยันการลบหน้า "${form.title}"?`)) return
  await $fetch(`/api/admin/pages/${encodeURIComponent(props.pageSlug)}`, { method: 'DELETE' })
  await router.push('/admin/pages')
}

onMounted(() => {
  if (route.query.created === '1') {
    savedNotice.value = 'สร้างหน้าเว็บไซต์ใหม่เรียบร้อยแล้ว'
  }
})
</script>
