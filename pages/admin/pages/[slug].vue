<template>
  <AdminPageEditor :page-slug="pageSlug" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const pageSlug = computed(() => String(route.params.slug || ''))

useHead({ title: 'แก้ไขเนื้อหาหน้าเว็บไซต์ | FIRESZONE CMS' })
</script>
