<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="fz-prose" v-html="renderedHtml" />
</template>

<script setup lang="ts">
const props = defineProps<{
  content?: string
}>()

const renderedHtml = computed(() => {
  const raw = (props.content || '').trim()
  if (!raw) return ''
  // If already contains HTML block tags, render directly; otherwise preserve newlines
  if (/<(p|ul|ol|li|div|h[1-6]|br|strong|table)\b/i.test(raw)) {
    return raw
  }
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />')
})
</script>
