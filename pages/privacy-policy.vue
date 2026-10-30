<template>
  <div>
    <PageBanner
      :title="pageData?.page?.title || 'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)'"
      :subtitle="pageData?.page?.subtitle || 'PRIVACY POLICY & PDPA'"
      :breadcrumbs="[{ label: pageData?.page?.title || 'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)' }]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic max-w-4xl space-y-8 text-sm md:text-base text-gray-700 leading-relaxed">
        <div class="bg-firezone-light border border-gray-200 rounded-lg p-6 md:p-8 space-y-6">
          <div v-if="pageData?.page?.image" class="rounded-lg overflow-hidden border border-gray-200">
            <SmartImage
              :src="pageData.page.image"
              :alt="pageData.page.title"
              img-class="w-full max-h-[380px] object-cover"
            />
          </div>

          <RichContent
            v-if="pageData?.page?.content"
            class="text-gray-700 leading-relaxed"
            :content="pageData.page.content"
          />

          <div class="pt-2">
            <button
              type="button"
              class="btn-outline-firezone text-xs py-2 px-4"
              @click="openPreferencesModal"
            >
              จัดการการตั้งค่าคุกกี้ (Cookie Preferences)
            </button>
          </div>

          <div class="space-y-2 border-t border-gray-200 pt-5">
            <h3 class="text-lg font-bold text-firezone-navy">ช่องทางติดต่อผู้ควบคุมข้อมูลส่วนบุคคล</h3>
            <p>
              <strong>{{ settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}</strong><br />
              ที่อยู่: {{ settings.address || '678/6 ซอยพหลโยธิน 32 แขวงจันทรเกษม เขตจตุจักร กทม. 10900' }}<br />
              โทรศัพท์: {{ settings.phone1 || '086-363-5495' }}, {{ settings.officePhone || '02-197-5275' }}<br />
              อีเมลประสานงานคุ้มครองข้อมูลส่วนบุคคล:
              <a :href="`mailto:${settings.pdpaDpoEmail || settings.email || 'fire_zone@hotmail.com'}`" class="text-firezone-red font-semibold hover:underline">
                {{ settings.pdpaDpoEmail || settings.email || 'fire_zone@hotmail.com' }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { settings } = useSiteData()
const { openPreferencesModal } = usePdpaConsent()

const { data: pageData } = await useAsyncData('page-privacy-policy', () =>
  $fetch('/api/pages/privacy-policy').catch(() => ({ page: null }))
)

usePageSeo({
  title: computed(
    () =>
      `${pageData.value?.page?.title || 'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)'} | บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด`
  ),
  seoTitle: computed(() => pageData.value?.page?.seoTitle || ''),
  description: computed(
    () =>
      pageData.value?.page?.excerpt ||
      'ประกาศนโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) และการใช้งานคุกกี้ของ บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด'
  ),
  seoDescription: computed(() => pageData.value?.page?.seoDescription || ''),
  seoKeywords: computed(() => pageData.value?.page?.seoKeywords || ''),
  htmlContent: computed(() => pageData.value?.page?.content || ''),
  image: computed(() => pageData.value?.page?.image || ''),
  path: '/privacy-policy'
})
</script>
