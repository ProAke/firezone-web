<template>
  <AdminPostEditor post-type="portfolio" :post-id="postId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const postId = computed(() => Number(route.params.id))

useHead({ title: 'แก้ไขผลงานการติดตั้ง | FIRESZONE CMS' })
</script>
