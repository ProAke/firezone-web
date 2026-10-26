<template>
  <div>
    <PageBanner
      title="บริการและอุปกรณ์ของเรา"
      subtitle="SERVICES & SOLUTIONS"
      :breadcrumbs="[{ label: 'บริการของเรา' }]"
    />

    <!-- Work Services -->
    <section class="py-16 bg-white">
      <div class="container-classic">
        <div class="mb-10">
          <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">ENGINEERING SERVICES</span>
          <h2 class="section-heading mt-1">งานบริการติดตั้ง ตรวจเช็ค และพัฒนาระบบ</h2>
          <div class="section-divider" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NuxtLink
            v-for="svc in workServices"
            :key="svc.id"
            :to="`/service/${encodeURIComponent(svc.slug)}`"
            class="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-firezone-red transition-all flex flex-col sm:flex-row"
          >
            <div class="sm:w-56 h-52 sm:h-auto shrink-0 bg-gray-100 overflow-hidden">
              <SmartImage
                :src="svc.image"
                :alt="svc.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <h3 class="font-bold text-lg text-firezone-navy group-hover:text-firezone-red transition-colors">
                {{ svc.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-2 line-clamp-3 flex-1 leading-relaxed">
                {{ svc.excerpt }}
              </p>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-firezone-red">
                <span>อ่านรายละเอียดบริการ</span>
                <ArrowRight class="w-4 h-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Equipment Categories -->
    <section class="py-16 bg-firezone-light border-t border-gray-200">
      <div class="container-classic">
        <div class="mb-10">
          <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">SYSTEM SOLUTIONS</span>
          <h2 class="section-heading mt-1">กลุ่มอุปกรณ์และระบบที่เราให้บริการ</h2>
          <div class="section-divider" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="eq in equipmentServices"
            :key="eq.id"
            :to="`/service/${encodeURIComponent(eq.slug)}`"
            class="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-firezone-red transition-all flex flex-col"
          >
            <div class="h-52 bg-gray-100 overflow-hidden">
              <SmartImage
                :src="eq.image"
                :alt="eq.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <h3 class="font-bold text-lg text-firezone-navy group-hover:text-firezone-red transition-colors">
                {{ eq.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-2 line-clamp-3 flex-1 leading-relaxed">
                {{ eq.excerpt }}
              </p>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-firezone-red">
                <span>ดูข้อมูลระบบเพิ่มเติม</span>
                <ArrowRight class="w-4 h-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { data } = await useAsyncData('all-services-page', () => $fetch('/api/services'))

const workServices = computed(() =>
  (data.value?.items || []).filter((s: any) => s.type === 'service')
)
const equipmentServices = computed(() =>
  (data.value?.items || []).filter((s: any) => s.type === 'equipment')
)

useHead({
  title: 'บริการของเรา | บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด'
})
</script>
