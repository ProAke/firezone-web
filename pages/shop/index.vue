<template>
  <ShopCatalogView />
</template>

<script setup lang="ts">
const route = useRoute()

// Redirect legacy query URL /shop?category=slug to clean SEO-friendly /shop/category/slug
if (route.query.category && typeof route.query.category === 'string') {
  const catSlug = route.query.category
  const restQuery = { ...route.query }
  delete restQuery.category
  await navigateTo(
    { path: `/shop/category/${encodeURIComponent(catSlug)}`, query: restQuery },
    { redirectCode: 301 }
  )
}
</script>
