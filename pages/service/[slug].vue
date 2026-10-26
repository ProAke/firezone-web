<template>
  <div v-if="data?.service">
    <PageBanner
      :title="data.service.title"
      :subtitle="data.service.type === 'equipment' ? 'EQUIPMENT & SYSTEMS' : 'OUR SERVICES'"
      :breadcrumbs="[
        { label: 'บริการของเรา', to: '/services' },
        { label: data.service.title }
      ]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main Content -->
        <article class="lg:col-span-8 space-y-6">
          <div class="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <SmartImage
              :src="data.service.image"
              :alt="data.service.title"
              img-class="w-full max-h-[420px] object-cover"
            />
          </div>

          <h2 class="text-2xl font-extrabold text-firezone-navy">
            {{ data.service.title }}
          </h2>

          <RichContent
            class="text-gray-700 leading-relaxed text-base bg-firezone-light p-6 rounded-lg border border-gray-200"
            :content="data.service.content"
          />

          <div class="bg-firezone-navy text-white rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="font-bold text-lg">สนใจรับบริการหรือปรึกษาหน้างาน</h3>
              <p class="text-xs text-gray-300 mt-1">
                ทีมวิศวกรและช่างเทคนิคพร้อมให้คำแนะนำและประเมินราคาฟรี
              </p>
            </div>
            <NuxtLink
              :to="`/contact?subject=${encodeURIComponent(data.service.title)}#quote`"
              class="btn-firezone shrink-0 text-sm"
            >
              ติดต่อสอบถามบริการนี้
            </NuxtLink>
          </div>
        </article>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-firezone-light border border-gray-200 rounded-lg p-5">
            <h3 class="font-bold text-firezone-navy text-base mb-3 flex items-center gap-2">
              <span class="w-1.5 h-5 bg-firezone-red rounded-full" />
              บริการและระบบทั้งหมด
            </h3>
            <ul class="space-y-1.5 text-sm">
              <li v-for="item in data.allServices || []" :key="item.id">
                <NuxtLink
                  :to="`/service/${encodeURIComponent(item.slug)}`"
                  class="block px-3 py-2.5 rounded transition-colors"
                  :class="
                    item.id === data.service.id
                      ? 'bg-firezone-red text-white font-semibold'
                      : 'bg-white text-gray-700 hover:text-firezone-red border border-gray-200'
                  "
                >
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useAsyncData(`service-${slug.value}`, () =>
  $fetch(`/api/services/${encodeURIComponent(slug.value)}`)
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบบริการที่ต้องการ' })
}

useHead({
  title: computed(() =>
    data.value?.service?.title
      ? `${data.value.service.title} | บริการ FIRESZONE`
      : 'บริการของเรา | FIRESZONE'
  )
})
</script>
