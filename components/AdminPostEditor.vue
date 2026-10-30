<template>
  <form class="space-y-6" @submit.prevent="savePost">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
      <div class="space-y-1">
        <NuxtLink
          :to="listPath"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-firezone-red"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>กลับหน้ารายการ{{ sectionLabel }}ทั้งหมด</span>
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-extrabold text-firezone-navy">
          {{ isEdit ? `แก้ไข${sectionLabel} #${postId}` : `เพิ่ม${sectionLabel}ใหม่` }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          v-if="isEdit && form.slug"
          :to="`${publicPrefix}/${encodeURIComponent(form.slug)}`"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded border border-gray-300 bg-white hover:border-firezone-red text-xs font-semibold text-gray-700"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>ดูบนหน้าเว็บจริง</span>
        </NuxtLink>

        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-5">
          <Save class="w-4 h-4 mr-1.5" />
          <span>{{ saving ? 'กำลังบันทึก...' : `บันทึก${sectionLabel}` }}</span>
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
      <!-- Left Main Column -->
      <div class="lg:col-span-8 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-5 text-xs">
          <div>
            <label class="block font-bold text-gray-800 mb-1.5">
              {{ postType === 'portfolio' ? 'ชื่อโครงการ / สถานที่ติดตั้ง *' : 'หัวข้อข่าวสาร / บทความ *' }}
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              :placeholder="
                postType === 'portfolio'
                  ? 'เช่น งานติดตั้งและทดสอบระบบ Fire Alarm อาคารสำนักงาน...'
                  : 'เช่น แนวทางการตรวจเช็คระบบแจ้งเหตุเพลิงไหม้ประจำปีตามมาตรฐาน...'
              "
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red font-semibold"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1.5">
              เนื้อหา{{ sectionLabel }} รูปประกอบ และคลิปวิดีโอ YouTube (CKEditor 5)
            </label>
            <AdminCkEditor
              v-model="form.content"
              placeholder="เขียนรายละเอียดเนื้อหา จัดตำแหน่งข้อความ แทรกรูปภาพหน้างาน หรือวางลิงก์คลิป YouTube ได้ทันที..."
              :min-height="400"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-800 mb-1">
              คำโปรยสั้น (Excerpt — เว้นว่างได้ ระบบจะดึงจากเนื้อหาด้านบนให้อัตโนมัติ)
            </label>
            <input
              v-model="form.excerpt"
              type="text"
              placeholder="เว้นว่างเพื่อให้ระบบสรุปคำโปรยและ Meta Description อัตโนมัติ"
              class="w-full px-3.5 py-2 border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
            />
          </div>
        </div>

        <!-- Multi-photo Gallery Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h3 class="font-bold text-sm text-firezone-navy">
                อัลบั้มภาพบรรยากาศหน้างาน ({{ form.gallery.length }} ภาพ)
              </h3>
              <p class="text-[11px] text-gray-500 mt-0.5">
                สามารถเลือกอัปโหลดพร้อมกันหลายรูปเพื่อแสดงเป็นแกลเลอรีใต้ภาพปก
              </p>
            </div>

            <label class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-firezone-navy hover:bg-slate-800 text-white rounded cursor-pointer font-semibold shrink-0">
              <Upload class="w-3.5 h-3.5" />
              <span>{{ uploadingGallery ? 'กำลังอัปโหลด...' : '+ เพิ่มรูปแกลเลอรี (เลือกได้หลายรูป)' }}</span>
              <input type="file" accept="image/*" multiple class="hidden" @change="handleGalleryUpload" />
            </label>
          </div>

          <div v-if="form.gallery.length" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <div
              v-for="(gUrl, idx) in form.gallery"
              :key="idx"
              class="relative group rounded-md overflow-hidden border border-gray-200 h-24 bg-gray-50"
            >
              <SmartImage :src="gUrl" alt="" img-class="w-full h-full object-cover" />
              <div class="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] px-2 py-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  class="hover:underline"
                  @click="form.image = gUrl"
                >
                  ตั้งเป็นปก
                </button>
                <button
                  type="button"
                  class="text-red-300 hover:text-red-100 font-bold"
                  @click="form.gallery.splice(idx, 1)"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 border border-dashed border-gray-200 rounded text-gray-400">
            ยังไม่มีรูปในอัลบั้มแกลเลอรีเพิ่มเติม (สามารถแทรกรูปใน CKEditor หรืออัปโหลดที่นี่ได้)
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">การเผยแพร่และวันที่</h3>

          <div>
            <label class="block font-bold text-gray-700 mb-1">วันที่เผยแพร่</label>
            <input
              v-model="form.publishedAt"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <label class="flex items-center gap-2.5 cursor-pointer font-semibold text-gray-800">
            <input v-model="form.isActive" type="checkbox" class="w-4 h-4 accent-red-600 rounded" />
            <span>เปิดแสดงบนหน้าเว็บไซต์สาธารณะ</span>
          </label>

          <div class="pt-2 flex flex-col gap-2">
            <button type="submit" :disabled="saving" class="btn-firezone w-full text-xs py-2.5">
              {{ saving ? 'กำลังบันทึก...' : `บันทึก${sectionLabel}` }}
            </button>
            <button
              v-if="isEdit"
              type="button"
              class="w-full py-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
              @click="handleDelete"
            >
              ลบรายการนี้ออกจากระบบ
            </button>
          </div>
        </div>

        <!-- Cover Image Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3 text-xs">
          <h3 class="font-bold text-sm text-firezone-navy border-b pb-2.5">รูปภาพปก (Cover Image)</h3>
          <AdminImageDropzone
            v-model="form.image"
            :alt="form.title"
            label="อัปโหลดรูปภาพปก"
          />
        </div>

        <!-- Automatic SEO Card -->
        <AdminSeoBox
          v-model:slug="form.slug"
          v-model:seo-title="form.seoTitle"
          v-model:seo-description="form.seoDescription"
          v-model:seo-keywords="form.seoKeywords"
          :item-title="form.title"
          :excerpt="form.excerpt"
          :html-content="form.content"
          :image="form.image"
          :path-prefix="publicPrefix"
          :title-suffix="postType === 'portfolio' ? 'ผลงาน FIRESZONE' : 'ข่าวสาร FIRESZONE'"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ArrowLeft, ExternalLink, Save, Upload } from 'lucide-vue-next'

const props = defineProps<{
  postType: 'portfolio' | 'news'
  postId?: number
}>()

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => Boolean(props.postId))
const sectionLabel = computed(() =>
  props.postType === 'portfolio' ? 'ผลงานการติดตั้ง' : 'ข่าวสารและบทความ'
)
const listPath = computed(() =>
  props.postType === 'portfolio' ? '/admin/portfolio' : '/admin/news'
)
const publicPrefix = computed(() =>
  props.postType === 'portfolio' ? '/portfolio' : '/news'
)

const saving = ref(false)
const uploadingCover = ref(false)
const uploadingGallery = ref(false)
const savedNotice = ref('')
const errorNotice = ref('')

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  gallery: [] as string[],
  publishedAt: new Date().toISOString().slice(0, 10),
  isActive: true,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

if (props.postId) {
  const reqFetch = useRequestFetch()
  const { data, error } = await useAsyncData(`admin-post-${props.postId}`, () =>
    reqFetch<{ post: any }>(`/api/admin/posts/${props.postId}`)
  )
  if (error.value || !data.value?.post) {
    throw createError({ statusCode: 404, statusMessage: 'ไม่พบรายการที่ต้องการแก้ไข' })
  }
  const p = data.value.post
  form.title = p.title || ''
  form.slug = p.slug || ''
  form.excerpt = p.excerpt || ''
  form.content = p.content || ''
  form.image = p.image || ''
  form.gallery = [...(p.gallery || [])]
  form.publishedAt = (p.publishedAt || new Date().toISOString()).slice(0, 10)
  form.isActive = Boolean(p.isActive)
  form.seoTitle = p.seoTitle || ''
  form.seoDescription = p.seoDescription || ''
  form.seoKeywords = p.seoKeywords || ''
}

async function handleCoverUpload(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })
    form.image = res.url
    if (!form.gallery.includes(res.url)) {
      form.gallery.unshift(res.url)
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'อัปโหลดรูปปกไม่สำเร็จ'
  } finally {
    uploadingCover.value = false
    input.value = ''
  }
}

async function handleGalleryUpload(ev: Event) {
  const input = ev.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return
  uploadingGallery.value = true
  try {
    for (const f of files) {
      const fd = new FormData()
      fd.append('file', f)
      const res = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })
      form.gallery.push(res.url)
      if (!form.image) form.image = res.url
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'อัปโหลดรูปแกลเลอรีไม่สำเร็จ'
  } finally {
    uploadingGallery.value = false
    input.value = ''
  }
}

async function savePost() {
  saving.value = true
  errorNotice.value = ''
  savedNotice.value = ''
  const payload = { ...form, type: props.postType }

  try {
    if (props.postId) {
      const res = await $fetch<{ id: number; slug: string }>(`/api/admin/posts/${props.postId}`, {
        method: 'PUT',
        body: payload
      })
      form.slug = res.slug
      savedNotice.value = `บันทึก${sectionLabel.value}และอัปเดต SEO อัตโนมัติเรียบร้อยแล้ว`
    } else {
      const res = await $fetch<{ id: number; slug: string }>('/api/admin/posts', {
        method: 'POST',
        body: payload
      })
      await router.push(`${listPath.value}/${res.id}?created=1`)
    }
  } catch (err: any) {
    errorNotice.value = err?.data?.statusMessage || 'ไม่สามารถบันทึกข้อมูลได้'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.postId) return
  if (!confirm(`ยืนยันการลบ "${form.title}"?`)) return
  await $fetch(`/api/admin/posts/${props.postId}`, { method: 'DELETE' })
  await router.push(listPath.value)
}

onMounted(() => {
  if (route.query.created === '1') {
    savedNotice.value = `สร้าง${sectionLabel.value}ใหม่เรียบร้อยแล้ว`
  }
})
</script>
