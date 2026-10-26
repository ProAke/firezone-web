<template>
  <img
    v-if="src && !hasError"
    :src="src"
    :alt="alt"
    :class="imgClass"
    loading="lazy"
    @error="hasError = true"
  />
  <div
    v-else
    :class="[
      'flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 select-none p-4 text-center',
      imgClass
    ]"
  >
    <ShieldAlert class="w-10 h-10 text-firezone-red/70 mb-1.5" />
    <span class="text-xs font-medium line-clamp-2 max-w-[180px]">{{ alt || 'FIRESZONE' }}</span>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next'

const props = defineProps<{
  src?: string
  alt?: string
  imgClass?: string
}>()

const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  }
)
</script>
