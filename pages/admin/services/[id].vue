<template>
  <AdminServiceEditor :service-id="serviceId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const serviceId = computed(() => Number(route.params.id))

useHead({ title: 'แก้ไขข้อมูลบริการ | FIRESZONE CMS' })
</script>
