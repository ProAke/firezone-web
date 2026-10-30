<template>
  <AdminServiceEditor />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'เพิ่มบริการ / ระบบอุปกรณ์ใหม่ | FIRESZONE CMS' })
</script>
