<template>
  <NuxtLink
    :to="`/product/${encodeURIComponent(product.slug)}`"
    class="group bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col hover:border-firezone-red hover:shadow-lg transition-all duration-200"
  >
    <div class="relative aspect-square bg-white p-5 flex items-center justify-center overflow-hidden border-b border-gray-100">
      <span
        v-if="product.brand"
        class="absolute top-3 left-3 z-10 bg-firezone-navy/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded"
      >
        {{ product.brand }}
      </span>
      <SmartImage
        :src="product.image"
        :alt="product.name"
        img-class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    <div class="p-4 flex-1 flex flex-col">
      <div v-if="product.categories?.length" class="text-[11px] text-firezone-red font-medium mb-1 line-clamp-1">
        {{ product.categories.map((c: any) => c.name).join(' • ') }}
      </div>
      <h3 class="font-bold text-gray-900 text-base group-hover:text-firezone-red transition-colors line-clamp-2">
        {{ product.name }}
      </h3>
      <p v-if="product.excerpt" class="text-xs text-gray-500 mt-1.5 line-clamp-2 flex-1">
        {{ product.excerpt }}
      </p>
      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
        <span class="text-gray-600 group-hover:text-firezone-red transition-colors">ดูรายละเอียดสินค้า</span>
        <span class="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-firezone-red group-hover:text-white flex items-center justify-center transition-colors">
          <ArrowRight class="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  product: {
    id: number
    slug: string
    name: string
    brand?: string
    excerpt?: string
    image?: string
    categories?: Array<{ id: number; name: string; slug: string }>
  }
}>()
</script>
