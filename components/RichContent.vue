<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="fz-prose ck-content" v-html="renderedHtml" />
</template>

<script setup lang="ts">
import 'ckeditor5/ckeditor5-content.css'
import { extractYouTubeVideoId } from '~/utils/seo'

const props = defineProps<{
  content?: string
}>()

function buildYouTubeEmbedHtml(videoId: string): string {
  return `<div class="fz-youtube-wrapper my-5 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-black"><div class="relative w-full" style="padding-bottom:56.25%;"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" class="absolute inset-0 w-full h-full border-0" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>`
}

function sanitizeAndTransformHtml(input: string): string {
  const ytTokens: string[] = []
  const pushYtToken = (videoId: string): string => {
    const idx = ytTokens.length
    ytTokens.push(buildYouTubeEmbedHtml(videoId))
    return `__FZ_YT_TOKEN_${idx}__`
  }

  let working = input
    // Normalize any legacy absolute fireszone wp-content URLs inside HTML
    .replace(/https?:\/\/fireszone\.com\/wp-content\/uploads\//gi, '/wp-content/uploads/')

  // 1. Convert CKEditor <figure class="media">...</figure> containing YouTube URL/oembed/iframe
  working = working.replace(/<figure\b[^>]*class=(['"])[^'"]*\bmedia\b[^'"]*\1[^>]*>([\s\S]*?)<\/figure>/gi, (full, _q, inner) => {
    const attrMatch = String(inner).match(/(?:url|src|data-oembed-url)\s*=\s*(['"])(.*?)\1/i)
    const vid = attrMatch?.[2] ? extractYouTubeVideoId(attrMatch[2]) : null
    return vid ? pushYtToken(vid) : ''
  })

  // 2. Convert standalone <oembed url="..."></oembed>
  working = working.replace(/<oembed\b[^>]*?\burl\s*=\s*(['"])(.*?)\1[^>]*>(?:[\s\S]*?<\/oembed>)?/gi, (_full, _q, url) => {
    const vid = extractYouTubeVideoId(url)
    return vid ? pushYtToken(vid) : ''
  })

  // 3. Preserve legitimate YouTube <iframe> embeds while letting non-YouTube iframes get stripped below
  working = working.replace(/<iframe\b[^>]*?\bsrc\s*=\s*(['"])(.*?)\1[^>]*>(?:[\s\S]*?<\/iframe>)?/gi, (full, _q, src) => {
    const vid = extractYouTubeVideoId(src)
    return vid ? pushYtToken(vid) : full
  })

  // 4. Strip dangerous active tags & inline JS handlers
  working = working
    .replace(/<(script|iframe|object|embed|form|meta|link|style|base)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|form|meta|link|style|base)\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*(['"])\s*(javascript:|vbscript:|data:text\/html)[\s\S]*?\2/gi, '$1="#"')
    .replace(/style\s*=\s*(['"])([\s\S]*?)\1/gi, (_m, q, css) => {
      if (/(expression\s*\(|javascript:|vbscript:|-moz-binding)/i.test(css)) {
        return ''
      }
      return `style=${q}${css}${q}`
    })

  // 5. Restore verified YouTube responsive players
  working = working.replace(/__FZ_YT_TOKEN_(\d+)__/g, (_m, idxStr) => {
    return ytTokens[Number(idxStr)] || ''
  })

  return working
}

const renderedHtml = computed(() => {
  const raw = (props.content || '').trim()
  if (!raw) return ''
  if (/<(p|ul|ol|li|div|h[1-6]|br|strong|em|u|s|span|figure|oembed|iframe|img|table|blockquote|hr|a)\b/i.test(raw)) {
    return sanitizeAndTransformHtml(raw)
  }
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />')
})
</script>
