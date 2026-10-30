<template>
  <div class="space-y-2.5 text-xs">
    <div
      class="relative rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden"
      :class="
        isDragging
          ? 'border-[#206bc4] bg-[#eef5fc]'
          : displaySrc
            ? 'border-slate-200 hover:border-[#206bc4]/60 bg-slate-50/70'
            : 'border-slate-300 hover:border-[#206bc4] hover:bg-[#f8fbff] bg-slate-50/60'
      "
      @click="triggerFilePicker"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputEl"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Live Image Preview -->
      <div v-if="displaySrc" class="p-3 text-center space-y-2">
        <div class="relative mx-auto flex items-center justify-center min-h-[140px] max-h-52">
          <img
            v-if="localPreviewUrl"
            :src="localPreviewUrl"
            :alt="alt || 'Preview'"
            class="max-h-48 w-auto mx-auto object-contain rounded"
          />
          <SmartImage
            v-else
            :src="displaySrc"
            :alt="alt || 'Preview'"
            img-class="max-h-48 w-auto mx-auto object-contain rounded"
          />
        </div>
        <div class="text-[11px] font-medium text-[#206bc4]">
          {{ uploading ? 'กำลังอัปโหลดรูปภาพ...' : 'คลิกหรือลากรูปใหม่มาวางเพื่อเปลี่ยนรูป' }}
        </div>
      </div>

      <!-- Empty Dropzone Prompt (Laem Chabang Tabler Style) -->
      <div v-else class="px-4 py-7 text-center space-y-1.5">
        <div class="w-10 h-10 rounded-full bg-[#eef5fc] text-[#206bc4] mx-auto flex items-center justify-center">
          <UploadCloud class="w-5 h-5" />
        </div>
        <div class="font-semibold text-slate-700">
          {{ uploading ? 'กำลังอัปโหลดรูปภาพ...' : label }}
        </div>
        <div class="text-[11px] text-slate-400">
          ลากไฟล์รูปมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (JPG, PNG, WEBP)
        </div>
      </div>

      <!-- Uploading Overlay -->
      <div
        v-if="uploading"
        class="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center"
      >
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#206bc4] text-white text-xs font-semibold shadow-sm">
          <span class="w-2 h-2 rounded-full bg-white animate-ping" />
          กำลังอัปโหลด...
        </span>
      </div>
    </div>

    <div v-if="errorMsg" class="text-[11px] text-red-600 font-semibold">
      {{ errorMsg }}
    </div>

    <div class="flex items-center gap-1.5">
      <input
        :value="modelValue"
        type="text"
        placeholder="หรือระบุ URL รูปภาพ..."
        class="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-[11px] focus:outline-none focus:border-[#206bc4]"
        @input="handleManualUrlInput"
      />
      <button
        v-if="modelValue"
        type="button"
        class="px-2.5 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold shrink-0"
        title="ลบรูปภาพออก"
        @click="clearImage"
      >
        ลบรูป
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadCloud } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    alt?: string
    label?: string
  }>(),
  {
    modelValue: '',
    alt: '',
    label: 'คลิกหรือลากรูปภาพมาวางเพื่ออัปโหลด'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInputEl = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const errorMsg = ref('')
const localPreviewUrl = ref('')

const displaySrc = computed(() => localPreviewUrl.value || props.modelValue || '')

function revokeLocalPreview() {
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
    localPreviewUrl.value = ''
  }
}

function triggerFilePicker() {
  if (uploading.value) return
  fileInputEl.value?.click()
}

async function processFile(file?: File) {
  if (!file) return
  errorMsg.value = ''
  revokeLocalPreview()

  // Instant 0ms client-side preview (Laem Chabang UX pattern)
  if (typeof URL !== 'undefined' && file.type.startsWith('image/')) {
    localPreviewUrl.value = URL.createObjectURL(file)
  }

  uploading.value = true
  try {
    const fd = new FormData()
    const safeName = file.name && /\.[a-z0-9]+$/i.test(file.name) ? file.name : 'cover-image.jpg'
    fd.append('file', file, safeName)
    const res = await $fetch<{ ok: boolean; url: string }>('/api/admin/upload', {
      method: 'POST',
      body: fd
    })
    emit('update:modelValue', res.url)
    revokeLocalPreview()
  } catch (err: any) {
    revokeLocalPreview()
    errorMsg.value =
      err?.data?.statusMessage || err?.data?.message || err?.message || 'อัปโหลดรูปภาพไม่สำเร็จ'
  } finally {
    uploading.value = false
  }
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processFile(file)
  input.value = ''
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

function handleManualUrlInput(e: Event) {
  revokeLocalPreview()
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function clearImage() {
  revokeLocalPreview()
  errorMsg.value = ''
  emit('update:modelValue', '')
}

onBeforeUnmount(() => {
  revokeLocalPreview()
})
</script>
