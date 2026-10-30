<template>
  <div class="fz-ckeditor-shell rounded-lg border border-gray-300 bg-white overflow-hidden shadow-sm">
    <!-- Quick Action Strip (Direct Image Attachment + YouTube Clip Embed, inline — no popup modal) -->
    <div class="bg-slate-50 border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div class="flex flex-wrap items-center gap-2">
        <label
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-red-50 text-gray-700 hover:text-firezone-red border border-gray-300 hover:border-firezone-red font-semibold cursor-pointer transition-colors"
        >
          <ImagePlus class="w-3.5 h-3.5 text-firezone-red" />
          <span>{{ uploadingImage ? 'กำลังอัปโหลดรูป...' : 'แนบรูปภาพเข้าเนื้อหา' }}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            :disabled="uploadingImage || !editorReady"
            @change="handleQuickImageSelect"
          />
        </label>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border font-semibold transition-colors"
          :class="
            ytBarOpen
              ? 'bg-firezone-red text-white border-firezone-red'
              : 'bg-white hover:bg-red-50 text-gray-700 hover:text-firezone-red border-gray-300 hover:border-firezone-red'
          "
          :disabled="!editorReady"
          @click="ytBarOpen = !ytBarOpen"
        >
          <Youtube class="w-3.5 h-3.5" :class="ytBarOpen ? 'text-white' : 'text-red-600'" />
          <span>แทรกคลิป YouTube</span>
        </button>
      </div>

      <span class="text-[11px] text-gray-400 hidden sm:inline">
        CKEditor 5 • ลากวางรูปภาพ, จัดกึ่งกลาง/ชิดซ้ายขวา, ปรับขนาดรูป และวางลิงก์ YouTube ได้ทันที
      </span>
    </div>

    <!-- Inline YouTube URL Bar (no modal) -->
    <div
      v-if="ytBarOpen"
      class="bg-red-50/60 border-b border-red-200 px-3 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
    >
      <input
        v-model="ytUrlInput"
        type="url"
        placeholder="วางลิงก์ YouTube เช่น https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
        class="flex-1 px-3 py-1.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
        @keydown.enter.prevent="insertYoutubeUrl"
      />
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="px-3.5 py-1.5 rounded bg-firezone-red hover:bg-firezone-darkred text-white font-bold"
          @click="insertYoutubeUrl"
        >
          แทรกคลิปลงเนื้อหา
        </button>
        <button
          type="button"
          class="px-2.5 py-1.5 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
          @click="ytBarOpen = false"
        >
          ปิด
        </button>
      </div>
      <span v-if="ytError" class="text-red-600 font-semibold">{{ ytError }}</span>
    </div>

    <!-- Upload Error Notice -->
    <div
      v-if="uploadError"
      class="bg-red-50 border-b border-red-200 px-3 py-2 text-xs text-red-700 flex items-center justify-between"
    >
      <span>{{ uploadError }}</span>
      <button type="button" class="font-bold ml-2" @click="uploadError = ''">×</button>
    </div>

    <!-- Loading Skeleton prior to Client Mount -->
    <div
      v-if="!editorReady"
      class="p-5 bg-gray-50 text-xs text-gray-400 flex items-center gap-2"
      :style="{ minHeight: `${minHeight}px` }"
    >
      <span class="inline-block w-3.5 h-3.5 border-2 border-firezone-red border-t-transparent rounded-full animate-spin" />
      <span>กำลังโหลดเครื่องมือแก้ไขเนื้อหา CKEditor 5...</span>
    </div>

    <!-- CKEditor 5 Mount Host -->
    <div v-show="editorReady" class="fz-ckeditor-host" :style="{ '--fz-ck-min-height': `${minHeight}px` }">
      <div ref="editorEl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import 'ckeditor5/ckeditor5.css'
import { ImagePlus, Youtube } from 'lucide-vue-next'
import { extractYouTubeVideoId } from '~/utils/seo'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    minHeight?: number
  }>(),
  {
    modelValue: '',
    placeholder: 'พิมพ์รายละเอียดเนื้อหา จัดรูปแบบข้อความ แทรกรูปภาพ หรือวางลิงก์คลิป YouTube ที่นี่...',
    minHeight: 320
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorEl = ref<HTMLElement | null>(null)
const editorReady = ref(false)
const uploadingImage = ref(false)
const uploadError = ref('')
const ytBarOpen = ref(false)
const ytUrlInput = ref('')
const ytError = ref('')

let editorInstance: any = null
let syncingFromEditor = false

async function uploadFileToServer(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await $fetch<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    body: fd
  })
  return res.url
}

class FirezoneUploadAdapter {
  private loader: any
  private aborted = false

  constructor(loader: any) {
    this.loader = loader
  }

  async upload() {
    const file: File = await this.loader.file
    if (this.aborted) return {}
    try {
      const url = await uploadFileToServer(file)
      return { default: url }
    } catch (err: any) {
      const msg = err?.data?.statusMessage || err?.message || 'อัปโหลดรูปภาพไม่สำเร็จ'
      uploadError.value = msg
      throw new Error(msg)
    }
  }

  abort() {
    this.aborted = true
  }
}

function FirezoneUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new FirezoneUploadAdapter(loader)
  }
}

onMounted(async () => {
  if (!editorEl.value) return

  const [ck, thModule] = await Promise.all([
    import('ckeditor5'),
    import('ckeditor5/translations/th.js')
  ])

  const {
    ClassicEditor,
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    FontSize,
    FontColor,
    FontBackgroundColor,
    Alignment,
    List,
    Indent,
    IndentBlock,
    Link,
    AutoLink,
    BlockQuote,
    HorizontalLine,
    Table,
    TableToolbar,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    ImageUpload,
    ImageInsert,
    ImageInsertViaUrl,
    AutoImage,
    LinkImage,
    MediaEmbed,
    AutoMediaEmbed,
    RemoveFormat,
    SourceEditing,
    PasteFromOffice,
    Autoformat,
    Fullscreen,
    GeneralHtmlSupport
  } = ck

  const thTranslations = (thModule as any).default || thModule

  editorInstance = await ClassicEditor.create(editorEl.value, {
    licenseKey: 'GPL',
    language: 'th',
    translations: [thTranslations],
    placeholder: props.placeholder,
    extraPlugins: [FirezoneUploadAdapterPlugin],
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      FontSize,
      FontColor,
      FontBackgroundColor,
      Alignment,
      List,
      Indent,
      IndentBlock,
      Link,
      AutoLink,
      BlockQuote,
      HorizontalLine,
      Table,
      TableToolbar,
      Image,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageResize,
      ImageUpload,
      ImageInsert,
      ImageInsertViaUrl,
      AutoImage,
      LinkImage,
      MediaEmbed,
      AutoMediaEmbed,
      RemoveFormat,
      SourceEditing,
      PasteFromOffice,
      Autoformat,
      Fullscreen,
      GeneralHtmlSupport
    ],
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'removeFormat',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'outdent',
        'indent',
        '|',
        'link',
        'insertImage',
        'mediaEmbed',
        'insertTable',
        'blockQuote',
        'horizontalLine',
        '|',
        'sourceEditing',
        'fullscreen'
      ],
      shouldNotGroupWhenFull: false
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'ย่อหน้าปกติ (Paragraph)', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'หัวข้อหลัก (H2)', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'หัวข้อรอง (H3)', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'หัวข้อย่อย (H4)', class: 'ck-heading_heading4' }
      ]
    },
    fontSize: {
      options: ['tiny', 'small', 'default', 'big', 'huge'],
      supportAllValues: true
    },
    alignment: {
      options: ['left', 'center', 'right', 'justify']
    },
    image: {
      resizeOptions: [
        { name: 'resizeImage:original', value: null, label: 'ขนาดจริง (100%)' },
        { name: 'resizeImage:25', value: '25', label: '25%' },
        { name: 'resizeImage:50', value: '50', label: '50%' },
        { name: 'resizeImage:75', value: '75', label: '75%' }
      ],
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'imageStyle:alignLeft',
        'imageStyle:alignCenter',
        'imageStyle:alignRight',
        '|',
        'resizeImage',
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
        'linkImage'
      ]
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    mediaEmbed: {
      previewsInData: true
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://'
    },
    htmlSupport: {
      allow: [
        {
          name: /^(div|span|p|h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|figure|figcaption|blockquote|a|img|hr)$/,
          attributes: true,
          classes: true,
          styles: true
        }
      ]
    },
    initialData: props.modelValue || ''
  })

  editorInstance.model.document.on('change:data', () => {
    syncingFromEditor = true
    emit('update:modelValue', editorInstance.getData())
    nextTick(() => {
      syncingFromEditor = false
    })
  })

  editorReady.value = true
})

watch(
  () => props.modelValue,
  (nextVal) => {
    if (!editorInstance || syncingFromEditor) return
    const current = editorInstance.getData()
    if ((nextVal || '') !== current) {
      editorInstance.setData(nextVal || '')
    }
  }
)

onBeforeUnmount(async () => {
  if (editorInstance) {
    try {
      await editorInstance.destroy()
    } catch {
      // ignore cleanup errors
    }
    editorInstance = null
  }
})

async function handleQuickImageSelect(ev: Event) {
  const input = ev.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length || !editorInstance) return

  uploadingImage.value = true
  uploadError.value = ''
  try {
    const urls: string[] = []
    for (const file of files) {
      const url = await uploadFileToServer(file)
      urls.push(url)
    }
    if (urls.length) {
      editorInstance.execute('insertImage', { source: urls })
      editorInstance.editing.view.focus()
    }
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || err?.message || 'อัปโหลดรูปภาพไม่สำเร็จ'
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

function insertYoutubeUrl() {
  ytError.value = ''
  const raw = ytUrlInput.value.trim()
  if (!raw) {
    ytError.value = 'กรุณาวางลิงก์คลิป YouTube'
    return
  }

  const vid = extractYouTubeVideoId(raw)
  if (!vid) {
    ytError.value = 'รูปแบบลิงก์ YouTube ไม่ถูกต้อง'
    return
  }

  if (editorInstance) {
    editorInstance.execute('mediaEmbed', `https://www.youtube.com/watch?v=${vid}`)
    editorInstance.editing.view.focus()
  }

  ytUrlInput.value = ''
  ytBarOpen.value = false
}
</script>

<style>
.fz-ckeditor-host .ck.ck-editor__main > .ck-editor__editable {
  min-height: var(--fz-ck-min-height, 320px);
  max-height: 760px;
  font-family: 'Prompt', 'Sarabun', sans-serif;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #1e293b;
  padding: 0.85rem 1.15rem;
}

.fz-ckeditor-host .ck.ck-toolbar {
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  border-bottom: 1px solid #e2e8f0 !important;
  background: #ffffff !important;
  padding: 2px 6px !important;
}

.fz-ckeditor-host .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
  border: 0 !important;
  box-shadow: none !important;
}

.fz-ckeditor-host .ck.ck-button {
  font-size: 13px;
}
</style>
