<template>
  <AdminProductEditor :product-id="productId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const productId = computed(() => Number(route.params.id))

useHead({ title: 'แก้ไขข้อมูลสินค้า | FIRESZONE CMS' })
</script>
