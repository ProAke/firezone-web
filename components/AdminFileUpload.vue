<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-xs font-bold text-gray-700">{{ label }}</label>
    <div class="flex flex-col sm:flex-row gap-2">
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder || 'วางลิงก์รูปภาพ หรือกดอัปโหลดไฟล์...'"
        class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <label
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded bg-firezone-navy hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors"
      >
        <Upload class="w-3.5 h-3.5" />
        <span>{{ uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์' }}</span>
        <input
          type="file"
          :accept="accept || 'image/*,.pdf'"
          class="hidden"
          :disabled="uploading"
          @change="onFileSelected"
        />
      </label>
    </div>
    <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
    <div v-if="modelValue && showPreview && !modelValue.endsWith('.pdf')" class="pt-1">
      <SmartImage
        :src="modelValue"
        alt="Preview"
        :img-class="`h-24 w-auto rounded border border-gray-200 object-contain p-2 ${darkPreview ? 'bg-firezone-navy' : 'bg-gray-50'}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload } from 'lucide-vue-next'

defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  accept?: string
  showPreview?: boolean
  darkPreview?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const uploading = ref(false)
const uploadError = ref('')

async function onFileSelected(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body: fd
    })
    emit('update:modelValue', res.url)
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || 'อัปโหลดไฟล์ไม่สำเร็จ'
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>
