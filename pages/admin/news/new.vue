<template>
  <AdminPostEditor post-type="news" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'เขียนข่าวสาร / บทความใหม่ | FIRESZONE CMS' })
</script>
