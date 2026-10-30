<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div class="px-5 py-3.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-emerald-600" />
        <h3 class="font-bold text-sm text-firezone-navy">ระบบ SEO อัตโนมัติ (Auto-SEO)</h3>
      </div>
      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
        ทำงานอัตโนมัติ
      </span>
    </div>

    <div class="p-5 space-y-4 text-xs">
      <!-- Live Google Search Snippet Preview -->
      <div class="rounded-lg border border-gray-200 bg-gray-50/70 p-4 space-y-1.5">
        <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          ตัวอย่างการแสดงผลบน Google Search &amp; AI Search
        </div>
        <div class="text-[12px] text-emerald-700 truncate font-mono">
          {{ previewUrl }}
        </div>
        <div class="text-sm font-bold text-[#1a0dab] leading-snug line-clamp-2">
          {{ previewTitle }}
        </div>
        <div class="text-xs text-gray-600 leading-relaxed line-clamp-3">
          {{ previewDescription }}
        </div>
      </div>

      <!-- Auto-detected SEO signals -->
      <div class="flex flex-wrap gap-1.5 text-[11px]">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
          ✓ Meta Title &amp; Description อัตโนมัติ
        </span>
        <span
          v-if="effectiveOgImage"
          class="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium"
        >
          ✓ รูปแชร์โซเชียล (OG Image) พร้อมใช้งาน
        </span>
        <span
          v-if="youtubeCount > 0"
          class="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-firezone-red border border-red-200 font-semibold"
        >
          ✓ พบคลิป YouTube ({{ youtubeCount }}) • สร้าง VideoObject Schema อัตโนมัติ
        </span>
      </div>

      <!-- Optional Manual Override Accordion (Inline, not modal) -->
      <div class="border-t border-gray-100 pt-3">
        <button
          type="button"
          class="w-full flex items-center justify-between text-left font-semibold text-gray-600 hover:text-firezone-red transition-colors"
          @click="manualOpen = !manualOpen"
        >
          <span>ปรับแต่ง URL / SEO ด้วยตนเอง (ไม่บังคับ — เว้นว่างเพื่อให้ระบบจัดการอัตโนมัติ)</span>
          <ChevronDown
            class="w-4 h-4 transition-transform"
            :class="manualOpen ? 'rotate-180 text-firezone-red' : ''"
          />
        </button>

        <div v-if="manualOpen" class="mt-3.5 space-y-3 pt-2">
          <div v-if="!lockSlug">
            <label class="block font-bold text-gray-700 mb-1">URL Slug (ภาษาอังกฤษหรือภาษาไทย เว้นว่างเพื่อสร้างอัตโนมัติ)</label>
            <input
              :value="slug"
              type="text"
              :placeholder="autoSlugPreview"
              class="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs focus:outline-none focus:border-firezone-red"
              @input="emit('update:slug', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">SEO Meta Title (เว้นว่างเพื่อใช้ "{{ autoTitleOnly }}")</label>
            <input
              :value="seoTitle"
              type="text"
              :placeholder="autoTitleOnly"
              class="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-firezone-red"
              @input="emit('update:seoTitle', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">SEO Meta Description (เว้นว่างเพื่อดึงจากเนื้อหาอัตโนมัติ)</label>
            <textarea
              :value="seoDescription"
              rows="2"
              :placeholder="autoDescOnly"
              class="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-firezone-red"
              @input="emit('update:seoDescription', ($event.target as HTMLTextAreaElement).value)"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">SEO Keywords (คั่นด้วยเครื่องหมายจุลภาค , เว้นว่างเพื่อสร้างอัตโนมัติ)</label>
            <input
              :value="seoKeywords"
              type="text"
              :placeholder="autoKeywordsPreview"
              class="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-firezone-red"
              @input="emit('update:seoKeywords', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, Sparkles } from 'lucide-vue-next'
import {
  autoSeoDescription,
  autoSeoKeywords,
  autoSeoTitle,
  extractFirstImageFromHtml,
  extractYouTubeIdsFromHtml
} from '~/utils/seo'

const props = withDefaults(
  defineProps<{
    itemTitle?: string
    excerpt?: string
    htmlContent?: string
    image?: string
    pathPrefix?: string
    titleSuffix?: string
    keywordHints?: string[]
    slug?: string
    lockSlug?: boolean
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
  }>(),
  {
    itemTitle: '',
    excerpt: '',
    htmlContent: '',
    image: '',
    pathPrefix: '/',
    titleSuffix: 'FIRESZONE',
    keywordHints: () => [],
    slug: '',
    lockSlug: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  }
)

const emit = defineEmits<{
  (e: 'update:slug', value: string): void
  (e: 'update:seoTitle', value: string): void
  (e: 'update:seoDescription', value: string): void
  (e: 'update:seoKeywords', value: string): void
}>()

const manualOpen = ref(
  Boolean(props.seoTitle?.trim() || props.seoDescription?.trim() || props.seoKeywords?.trim())
)

function clientSlugify(text: string): string {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\/_,\s]+/g, '-')
      .replace(/[^\u0E00-\u0E7Fa-z0-9\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^-|-$/g, '') || 'auto-url'
  )
}

const autoSlugPreview = computed(() => clientSlugify(props.itemTitle || 'item'))

const previewUrl = computed(() => {
  const cleanPrefix = (props.pathPrefix || '/').replace(/\/+$/, '')
  if (props.lockSlug && props.slug === 'home') {
    return 'https://fireszone.com/'
  }
  const activeSlug = props.slug?.trim() || autoSlugPreview.value
  if (!cleanPrefix) return `https://fireszone.com/${activeSlug}`
  return `https://fireszone.com${cleanPrefix}/${activeSlug}`
})

const autoTitleOnly = computed(() =>
  autoSeoTitle('', props.itemTitle || 'หัวข้อเนื้อหา', props.titleSuffix)
)

const previewTitle = computed(() =>
  autoSeoTitle(props.seoTitle, props.itemTitle || 'หัวข้อเนื้อหา', props.titleSuffix)
)

const autoDescOnly = computed(() =>
  autoSeoDescription('', props.excerpt, props.htmlContent, props.itemTitle || 'FIRESZONE')
)

const previewDescription = computed(() =>
  autoSeoDescription(
    props.seoDescription,
    props.excerpt,
    props.htmlContent,
    props.itemTitle || 'FIRESZONE'
  )
)

const autoKeywordsPreview = computed(() =>
  autoSeoKeywords('', [props.itemTitle, ...(props.keywordHints || [])])
)

const effectiveOgImage = computed(
  () => props.image?.trim() || extractFirstImageFromHtml(props.htmlContent)
)

const youtubeCount = computed(() => extractYouTubeIdsFromHtml(props.htmlContent).length)
</script>
