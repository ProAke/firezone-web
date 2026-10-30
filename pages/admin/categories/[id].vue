<template>
  <AdminCategoryEditor :category-id="categoryId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const categoryId = computed(() => Number(route.params.id))

useHead({ title: 'แก้ไขหมวดหมู่สินค้า | FIRESZONE CMS' })
</script>
