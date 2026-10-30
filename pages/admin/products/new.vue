<template>
  <AdminProductEditor />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'เพิ่มสินค้าใหม่ | FIRESZONE CMS' })
</script>
