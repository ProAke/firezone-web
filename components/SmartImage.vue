<template>
  <img
    v-if="activeSrc && !failedAll"
    :src="activeSrc"
    :alt="alt"
    :class="imgClass"
    loading="lazy"
    @error="handleImageError"
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

const config = useRuntimeConfig()
const fallbackIndex = ref(0)

const candidateSources = computed<string[]>(() => {
  const raw = (props.src || '').trim()
  if (!raw) return []

  const list: string[] = []
  const backupBase = (
    config.public?.wpBackupUploadsUrl || 'https://fz.uarea.in/uploads'
  ).replace(/\/+$/, '')

  // Normalize legacy fireszone.com/wp-content/uploads/<rel> -> /wp-content/uploads/<rel>
  const wpMatch = raw.match(/^(?:https?:\/\/fireszone\.com)?\/wp-content\/uploads\/(.+)$/i)
  if (wpMatch && wpMatch[1]) {
    const rel = wpMatch[1]
    list.push(`/wp-content/uploads/${rel}`)
    list.push(`${backupBase}/${rel}`)
  } else {
    list.push(raw)
  }

  return Array.from(new Set(list))
})

const activeSrc = computed(() => candidateSources.value[fallbackIndex.value] || '')
const failedAll = computed(
  () => candidateSources.value.length === 0 || fallbackIndex.value >= candidateSources.value.length
)

function handleImageError() {
  fallbackIndex.value += 1
}

watch(
  () => props.src,
  () => {
    fallbackIndex.value = 0
  }
)
</script>
