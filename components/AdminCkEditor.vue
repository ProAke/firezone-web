<template>
  <div
    class="fz-ckeditor-card bg-white border border-[#dce1e7] rounded-[10px] shadow-sm transition-shadow"
    :class="{ 'fz-ckeditor-fullscreen': isFullscreen }"
  >
    <!-- Tabler / Laem-Chabang Inspired Quick Action Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#f8fafc] border-b border-[#e6ebf1] rounded-t-[10px]">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Quick Multi-Image Upload -->
        <label
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#eef5fc] hover:bg-[#dceafb] border border-[#c5dcf7] text-[#1d5fb8] text-xs font-semibold cursor-pointer transition-colors select-none"
          :class="{ 'opacity-60 pointer-events-none': uploading }"
        >
          <ImagePlus class="w-3.5 h-3.5" />
          <span>{{ uploading ? 'กำลังอัปโหลดรูป...' : 'อัปโหลดรูปภาพ' }}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            class="hidden"
            :disabled="uploading"
            @change="handleQuickImageSelect"
          />
        </label>

        <!-- Quick YouTube Embed Drawer Toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors"
          :class="
            youtubeDrawerOpen
              ? 'bg-red-600 border-red-600 text-white shadow-sm'
              : 'bg-red-50/80 hover:bg-red-100/80 border-red-200 text-firezone-red'
          "
          @click="toggleYoutubeDrawer"
        >
          <Youtube class="w-3.5 h-3.5" />
          <span>แทรกคลิป YouTube</span>
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-[11px]">
        <!-- Status Pill -->
        <span
          v-if="uploading"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#206bc4] border border-blue-200 font-semibold"
        >
          <span class="w-2 h-2 rounded-full bg-[#206bc4] animate-ping" />
          กำลังอัปโหลดรูปภาพ...
        </span>
        <span
          v-else-if="editorReady && !rawHtmlMode"
          class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          CKEditor พร้อมใช้งาน
        </span>

        <span class="hidden md:inline text-slate-400 font-medium">
          {{ plainCharCount.toLocaleString() }} ตัวอักษร
        </span>

        <!-- Raw HTML Fallback / Code View Toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors"
          :class="
            rawHtmlMode
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
          "
          @click="toggleRawHtmlMode"
        >
          <Code2 class="w-3.5 h-3.5" />
          <span>{{ rawHtmlMode ? 'กลับโหมดปกติ' : 'HTML' }}</span>
        </button>

        <!-- Distraction-free Fullscreen Toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold transition-colors"
          :title="isFullscreen ? 'ย่อขนาดกลับ (Esc)' : 'ขยายเต็มหน้าจอ'"
          @click="isFullscreen = !isFullscreen"
        >
          <Minimize2 v-if="isFullscreen" class="w-3.5 h-3.5" />
          <Maximize2 v-else class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ isFullscreen ? 'ย่อกลับ' : 'ขยายเต็มจอ' }}</span>
        </button>
      </div>
    </div>

    <!-- Sleek Inline YouTube Embed Drawer (with Live Video Thumbnail Preview) -->
    <div
      v-if="youtubeDrawerOpen"
      class="px-4 py-3 bg-slate-50 border-b border-[#e6ebf1] space-y-2.5"
    >
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          ref="youtubeInputEl"
          v-model="youtubeUrlInput"
          type="url"
          placeholder="วางลิงก์ YouTube เช่น https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
          class="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#206bc4]"
          @keydown.enter.prevent="confirmYoutubeInsert"
        />
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            :disabled="!detectedYoutubeId"
            class="px-4 py-2 rounded-md bg-firezone-red hover:bg-firezone-darkred disabled:opacity-40 text-white text-xs font-semibold transition-colors"
            @click="confirmYoutubeInsert"
          >
            แทรกวิดีโอลงเนื้อหา
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 text-xs font-semibold"
            @click="youtubeDrawerOpen = false"
          >
            ปิด
          </button>
        </div>
      </div>

      <div
        v-if="detectedYoutubeId"
        class="flex items-center gap-3 p-2 bg-white rounded-md border border-slate-200"
      >
        <img
          :src="`https://i.ytimg.com/vi/${detectedYoutubeId}/mqdefault.jpg`"
          alt="YouTube preview"
          class="w-24 h-14 object-cover rounded border border-slate-200 shrink-0"
        />
        <div class="text-xs text-slate-600">
          <div class="font-bold text-emerald-700">✓ ตรวจพบวิดีโอ YouTube รหัส: {{ detectedYoutubeId }}</div>
          <div class="text-[11px] text-slate-500">
            กดปุ่ม "แทรกวิดีโอลงเนื้อหา" เพื่อแสดงเครื่องเล่น 16:9 และสร้าง Schema SEO วิดีโออัตโนมัติ
          </div>
        </div>
      </div>
      <div v-else-if="youtubeUrlInput.trim()" class="text-[11px] text-amber-700 font-medium">
        กรุณาวางลิงก์จาก YouTube ที่ถูกต้อง (เช่น youtube.com/watch?v=... หรือ youtu.be/...)
      </div>
    </div>

    <!-- Error / Retry Notice (Never freezes the editor!) -->
    <div
      v-if="uploadError"
      class="px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center justify-between gap-2"
    >
      <span>{{ uploadError }}</span>
      <button type="button" class="font-bold px-1 hover:text-red-900" @click="uploadError = ''">×</button>
    </div>

    <div
      v-if="initError"
      class="px-4 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-2"
    >
      <span>{{ initError }} — คุณยังสามารถพิมพ์แก้ไขเนื้อหาได้ทันทีในช่องด้านล่าง</span>
      <button
        type="button"
        class="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold shrink-0"
        @click="mountClassicEditor"
      >
        ลองโหลด CKEditor อีกครั้ง
      </button>
    </div>

    <!-- Raw HTML Code Mode -->
    <div v-if="rawHtmlMode" class="p-3 bg-slate-900">
      <textarea
        :value="modelValue"
        :style="{ minHeight: `${minHeight}px` }"
        placeholder="วางหรือแก้ไขโค้ด HTML โดยตรง..."
        class="w-full p-3.5 rounded-md bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed border border-slate-700 focus:outline-none focus:border-[#206bc4]"
        @input="handleRawTextareaInput"
      />
    </div>

    <!-- Progressive CKEditor 5 Classic Host (Exact Laem Chabang <textarea> upgrade pattern — NEVER hidden!) -->
    <div
      v-show="!rawHtmlMode"
      class="fz-ckeditor-host"
      :style="{ '--fz-ck-min-height': `${minHeight}px` }"
    >
      <textarea
        ref="textareaEl"
        :value="modelValue"
        :placeholder="placeholder"
        :style="{ minHeight: `${minHeight}px` }"
        class="w-full p-4 text-sm text-slate-800 leading-relaxed focus:outline-none border-0 resize-y"
        @input="handleFallbackTextareaInput"
      />
    </div>

    <!-- Clean Helper Footer -->
    <div class="px-3.5 py-2 bg-[#f8fafc] border-t border-[#e6ebf1] rounded-b-[10px] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
      <span>
        💡 ลากรูปภาพมาวางในเนื้อหา หรือกด <strong class="text-slate-700">Ctrl+V</strong> วางภาพแคปหน้าจอได้ทันที • คลิกที่รูปเพื่อจัดตำแหน่ง ซ้าย/กลาง/ขวา และย่อขยาย 25%–100%
      </span>
      <span class="text-slate-400">วางลิงก์ YouTube ในเนื้อหาเพื่อฝังคลิปอัตโนมัติ</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Code2, ImagePlus, Maximize2, Minimize2, Youtube } from 'lucide-vue-next'
import { extractYouTubeVideoId, stripHtmlToPlainText } from '~/utils/seo'

declare global {
  interface Window {
    ClassicEditor?: any
    FirezoneClassicEditor?: any
    __fzCkLoadingPromise?: Promise<any>
  }
}

const CKEDITOR_SCRIPT_SRC = '/ckeditor/ckeditor.js?v=20261030'
const CKEDITOR_STYLE_HREF = '/ckeditor/ckeditor.css?v=20261030'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    minHeight?: number
  }>(),
  {
    modelValue: '',
    placeholder:
      'พิมพ์เนื้อหา จัดรูปแบบตัวอักษร จัดกึ่งกลาง/ชิดซ้าย/ชิดขวา ลากรูปภาพมาวาง หรือวางลิงก์วิดีโอ YouTube ได้เลย...',
    minHeight: 400
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaEl = ref<HTMLTextAreaElement | null>(null)
const youtubeInputEl = ref<HTMLInputElement | null>(null)
const editorReady = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const initError = ref('')
const rawHtmlMode = ref(false)
const isFullscreen = ref(false)
const youtubeDrawerOpen = ref(false)
const youtubeUrlInput = ref('')

let editorInstance: any = null
let syncingFromEditor = false
let unmounted = false

const detectedYoutubeId = computed(() => extractYouTubeVideoId(youtubeUrlInput.value))
const plainCharCount = computed(() => stripHtmlToPlainText(props.modelValue || '').length)

function ensureCkEditorStylesheet() {
  if (typeof document === 'undefined') return
  const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some((el) =>
    (el.getAttribute('href') || '').includes('/ckeditor/ckeditor.css')
  )
  if (!existing) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = CKEDITOR_STYLE_HREF
    document.head.appendChild(link)
  }
}

function loadCkEditorConstructor(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('SSR'))
  }

  const readyCtor = window.FirezoneClassicEditor || window.ClassicEditor
  if (readyCtor) {
    return Promise.resolve(readyCtor)
  }

  if (window.__fzCkLoadingPromise) {
    return window.__fzCkLoadingPromise
  }

  ensureCkEditorStylesheet()

  window.__fzCkLoadingPromise = new Promise((resolve, reject) => {
    const resolveIfAvailable = () => {
      const ctor = window.FirezoneClassicEditor || window.ClassicEditor
      if (ctor) {
        resolve(ctor)
        return true
      }
      return false
    }

    if (resolveIfAvailable()) return

    let script = Array.from(document.querySelectorAll('script')).find((s) =>
      (s.getAttribute('src') || '').includes('/ckeditor/ckeditor.js')
    ) as HTMLScriptElement | undefined

    const timeoutId = window.setTimeout(() => {
      window.__fzCkLoadingPromise = undefined
      reject(new Error('โหลดไฟล์ CKEditor เกินเวลาที่กำหนด'))
    }, 15000)

    const cleanup = () => {
      window.clearTimeout(timeoutId)
    }

    const onLoad = () => {
      cleanup()
      if (!resolveIfAvailable()) {
        window.__fzCkLoadingPromise = undefined
        reject(new Error('ไม่พบตัวแปร ClassicEditor หลังโหลดสคริปต์'))
      }
    }

    const onError = () => {
      cleanup()
      window.__fzCkLoadingPromise = undefined
      reject(new Error('ไม่สามารถโหลดไฟล์ /ckeditor/ckeditor.js ได้'))
    }

    if (!script) {
      script = document.createElement('script')
      script.src = CKEDITOR_SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })

    // Poll briefly in case a deferred script finished between querySelectorAll and addEventListener
    const pollId = window.setInterval(() => {
      if (resolveIfAvailable()) {
        window.clearInterval(pollId)
        cleanup()
      }
    }, 40)
    window.setTimeout(() => window.clearInterval(pollId), 15000)
  })

  return window.__fzCkLoadingPromise
}

async function uploadImageToServer(file: File): Promise<string> {
  uploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    const safeName = file.name && /\.[a-z0-9]+$/i.test(file.name) ? file.name : 'upload-image.png'
    fd.append('file', file, safeName)
    const res = await $fetch<{ ok: boolean; url: string }>('/api/admin/upload', {
      method: 'POST',
      body: fd
    })
    return res.url
  } catch (err: any) {
    const msg =
      err?.data?.statusMessage || err?.data?.message || err?.message || 'อัปโหลดรูปภาพไม่สำเร็จ'
    uploadError.value = msg
    throw new Error(msg)
  } finally {
    uploading.value = false
  }
}

function handleFallbackTextareaInput(e: Event) {
  if (editorReady.value) return
  const val = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', val)
}

function handleRawTextareaInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', val)
  if (editorInstance) {
    syncingFromEditor = true
    editorInstance.setData(val)
    nextTick(() => {
      syncingFromEditor = false
    })
  }
}

function toggleRawHtmlMode() {
  if (!rawHtmlMode.value && editorInstance) {
    emit('update:modelValue', editorInstance.getData())
  } else if (rawHtmlMode.value && editorInstance) {
    editorInstance.setData(props.modelValue || '')
  }
  rawHtmlMode.value = !rawHtmlMode.value
}

async function handleQuickImageSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return

  try {
    const uploadedUrls: string[] = []
    for (const file of files) {
      const url = await uploadImageToServer(file)
      uploadedUrls.push(url)
    }

    if (editorInstance && !rawHtmlMode.value) {
      editorInstance.execute('insertImage', {
        source: uploadedUrls.map((src) => ({ src }))
      })
      editorInstance.editing.view.focus()
    } else {
      const imgsHtml = uploadedUrls.map((u) => `<figure class="image"><img src="${u}" alt=""></figure>`).join('\n')
      const nextVal = `${props.modelValue || ''}\n${imgsHtml}`.trim()
      emit('update:modelValue', nextVal)
    }
  } catch {
    // uploadError banner already populated
  } finally {
    input.value = ''
  }
}

function toggleYoutubeDrawer() {
  youtubeDrawerOpen.value = !youtubeDrawerOpen.value
  if (youtubeDrawerOpen.value) {
    nextTick(() => youtubeInputEl.value?.focus())
  }
}

function confirmYoutubeInsert() {
  const videoId = detectedYoutubeId.value
  if (!videoId) return
  const cleanWatchUrl = `https://www.youtube.com/watch?v=${videoId}`

  if (editorInstance && !rawHtmlMode.value) {
    editorInstance.execute('mediaEmbed', cleanWatchUrl)
    editorInstance.editing.view.focus()
  } else {
    const embedHtml = `<figure class="media"><oembed url="${cleanWatchUrl}"></oembed></figure>`
    const nextVal = `${props.modelValue || ''}\n${embedHtml}`.trim()
    emit('update:modelValue', nextVal)
  }

  youtubeUrlInput.value = ''
  youtubeDrawerOpen.value = false
}

async function mountClassicEditor() {
  if (!textareaEl.value || editorInstance || unmounted) return
  initError.value = ''

  try {
    const ClassicEditor = await loadCkEditorConstructor()
    if (unmounted || !textareaEl.value || editorInstance) return

    // Seed initial HTML directly on the visible <textarea> (exact Laem Chabang pattern — zero initialData conflict)
    textareaEl.value.value = props.modelValue || ''

    const instance = await ClassicEditor.create(textareaEl.value, {
      placeholder: props.placeholder,
      firezoneUploadUrl: '/api/admin/upload',
      firezoneOnUploadState: (busy: boolean, errMsg: string) => {
        uploading.value = Boolean(busy)
        if (errMsg) uploadError.value = errMsg
      }
    })

    if (unmounted) {
      await instance.destroy()
      return
    }

    editorInstance = instance

    // Sync if parent async data arrived while ClassicEditor.create was resolving
    const currentPropVal = props.modelValue || ''
    if (currentPropVal && instance.getData() !== currentPropVal) {
      instance.setData(currentPropVal)
    }

    instance.model.document.on('change:data', () => {
      if (!editorInstance) return
      syncingFromEditor = true
      emit('update:modelValue', editorInstance.getData())
      queueMicrotask(() => {
        syncingFromEditor = false
      })
    })

    editorReady.value = true
  } catch (err: any) {
    console.error('[AdminCkEditor] Failed to initialize CKEditor 5:', err)
    initError.value = err?.message || 'โหลดเครื่องมือแก้ไขเนื้อหาไม่สำเร็จ'
    editorReady.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  mountClassicEditor()
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (syncingFromEditor) return
    const normalized = newVal || ''
    if (editorInstance) {
      if (editorInstance.getData() !== normalized) {
        editorInstance.setData(normalized)
      }
    } else if (textareaEl.value && textareaEl.value.value !== normalized) {
      textareaEl.value.value = normalized
    }
  }
)

onBeforeUnmount(async () => {
  unmounted = true
  window.removeEventListener('keydown', handleKeydown)
  if (editorInstance) {
    const inst = editorInstance
    editorInstance = null
    try {
      await inst.destroy()
    } catch {
      // ignore teardown errors
    }
  }
})
</script>

<style>
/* Sleek Tabler / Laem-Chabang Inspired CKEditor 5 Classic Theme */
.fz-ckeditor-card {
  --ck-border-radius: 6px;
  --ck-color-base-border: #e2e8f0;
  --ck-color-toolbar-background: #fcfdfe;
  --ck-color-toolbar-border: #e6ebf1;
  --ck-color-button-default-hover-background: #eef2f6;
  --ck-color-button-default-active-background: #e2e8f0;
  --ck-color-button-on-background: #e8f1fc;
  --ck-color-button-on-hover-background: #d8e8fa;
  --ck-color-button-on-color: #1d5fb8;
  --ck-color-focus-border: #206bc4;
  --ck-color-focus-outer-shadow: rgba(32, 107, 196, 0.14);
}

.fz-ckeditor-card:focus-within {
  border-color: #94b8e8;
  box-shadow: 0 0 0 3px rgba(32, 107, 196, 0.1);
}

/* Fullscreen Writing Studio Mode */
.fz-ckeditor-card.fz-ckeditor-fullscreen {
  position: fixed;
  inset: 12px;
  z-index: 9950;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
}

.fz-ckeditor-card.fz-ckeditor-fullscreen .fz-ckeditor-host {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.fz-ckeditor-card.fz-ckeditor-fullscreen .ck.ck-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.fz-ckeditor-card.fz-ckeditor-fullscreen .ck.ck-editor__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.fz-ckeditor-card.fz-ckeditor-fullscreen .ck.ck-editor__main > .ck-editor__editable {
  flex: 1;
  min-height: 0 !important;
  max-height: none !important;
  overflow-y: auto;
}

/* Remove double borders so CKEditor blends seamlessly into the Tabler card */
.fz-ckeditor-host .ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content {
  border-width: 0 0 1px 0 !important;
  border-color: #e6ebf1 !important;
  box-shadow: none !important;
}

.fz-ckeditor-host .ck.ck-toolbar {
  background: #fcfdfe !important;
  border: 0 !important;
  padding: 6px 10px !important;
  border-radius: 0 !important;
}

.fz-ckeditor-host .ck.ck-toolbar .ck-toolbar__separator {
  background: #e2e8f0 !important;
  margin: 4px 5px !important;
}

.fz-ckeditor-host .ck.ck-button {
  border-radius: 6px !important;
  cursor: pointer;
}

/* Editable Canvas — matches Laem Chabang .ck-editor__editable_inline { min-height: 400px; } */
.fz-ckeditor-host .ck.ck-editor__main > .ck-editor__editable {
  min-height: var(--fz-ck-min-height, 400px);
  max-height: 760px;
  padding: 1.25rem 1.5rem !important;
  font-family: 'Sarabun', 'Prompt', sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: #1e293b;
  background: #ffffff !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.fz-ckeditor-host .ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable) {
  border: 0 !important;
  box-shadow: none !important;
}

.fz-ckeditor-host .ck-source-editing-area textarea {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 13px !important;
  line-height: 1.65 !important;
  padding: 1rem 1.25rem !important;
}

/* Ensure floating link/image/media balloons ALWAYS sit above headers & fullscreen mode */
.ck.ck-balloon-panel {
  z-index: 9999 !important;
}
</style>
