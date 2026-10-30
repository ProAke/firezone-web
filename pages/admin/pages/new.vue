<template>
  <AdminPageEditor />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'สร้างหน้าเว็บไซต์ใหม่ | FIRESZONE CMS' })
</script>
