<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="fz-prose" v-html="renderedHtml" />
</template>

<script setup lang="ts">
const props = defineProps<{
  content?: string
}>()

function sanitizeHtml(input: string): string {
  return input
    .replace(/<(script|iframe|object|embed|form|meta|link|style|base)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|form|meta|link|style|base)\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*(['"])\s*(javascript:|vbscript:|data:text\/html)[\s\S]*?\2/gi, '$1="#"')
}

const renderedHtml = computed(() => {
  const raw = (props.content || '').trim()
  if (!raw) return ''
  if (/<(p|ul|ol|li|div|h[1-6]|br|strong|table)\b/i.test(raw)) {
    return sanitizeHtml(raw)
  }
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />')
})
</script>
