<template>
  <AdminPostEditor post-type="portfolio" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'เพิ่มผลงานการติดตั้งใหม่ | FIRESZONE CMS' })
</script>
