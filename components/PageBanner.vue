<template>
  <section class="relative bg-firezone-navy text-white overflow-hidden">
    <div
      class="absolute inset-0 opacity-20 bg-cover bg-center"
      :style="{
        backgroundImage: `url('https://fireszone.com/wp-content/uploads/2021/01/banner1.png')`
      }"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-[#151922] via-[#151922]/90 to-[#151922]/75" />

    <div class="container-classic relative z-10 py-12 md:py-16">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-1 bg-firezone-red rounded-full" />
            <span v-if="subtitle" class="text-xs uppercase tracking-widest text-red-400 font-semibold">
              {{ subtitle }}
            </span>
          </div>
          <h1 class="text-2xl md:text-4xl font-bold tracking-tight text-white">
            {{ title }}
          </h1>
        </div>

        <nav aria-label="Breadcrumb" class="flex items-center flex-wrap gap-2 text-xs md:text-sm text-gray-300">
          <NuxtLink to="/" class="hover:text-white transition-colors">หน้าหลัก</NuxtLink>
          <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
            <ChevronRight class="w-4 h-4 text-firezone-red shrink-0" />
            <NuxtLink
              v-if="crumb.to"
              :to="crumb.to"
              class="hover:text-white transition-colors"
            >
              {{ crumb.label }}
            </NuxtLink>
            <span v-else class="text-white font-medium line-clamp-1 max-w-[240px]">
              {{ crumb.label }}
            </span>
          </template>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; to?: string }>
}>()
</script>
