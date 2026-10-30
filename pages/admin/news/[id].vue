<template>
  <AdminPostEditor post-type="news" :post-id="postId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const postId = computed(() => Number(route.params.id))

useHead({ title: 'แก้ไขข่าวสาร / บทความ | FIRESZONE CMS' })
</script>
