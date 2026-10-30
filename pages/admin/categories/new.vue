<template>
  <AdminCategoryEditor />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'เพิ่มหมวดหมู่สินค้าใหม่ | FIRESZONE CMS' })
</script>
