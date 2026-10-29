<template>
  <div>
    <!-- Bottom Cookie Consent Bar -->
    <div
      v-if="hydrated && settings.pdpaEnabled !== '0' && !consent.decided && !modalOpen"
      class="fixed bottom-0 inset-x-0 z-50 bg-firezone-navy/95 backdrop-blur border-t-2 border-firezone-red text-gray-200 shadow-2xl"
    >
      <div class="container-classic py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="text-xs leading-relaxed max-w-3xl">
          <div class="font-bold text-white text-sm mb-1 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-firezone-red shrink-0" />
            <span>การคุ้มครองข้อมูลส่วนบุคคลและคุกกี้ (PDPA)</span>
          </div>
          <p class="text-gray-300">
            {{
              settings.pdpaBannerText ||
              'เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งาน วิเคราะห์สถิติการเข้าชม และปรับปรุงการให้บริการตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)'
            }}
            <NuxtLink to="/privacy-policy" class="text-red-400 hover:underline ml-1 font-medium">
              อ่านนโยบายความเป็นส่วนตัว
            </NuxtLink>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            class="px-3.5 py-2 rounded border border-white/25 hover:bg-white/10 text-xs font-medium text-gray-200 transition-colors"
            @click="openModalWithCurrent"
          >
            ตั้งค่าคุกกี้
          </button>
          <button
            type="button"
            class="px-3.5 py-2 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            @click="acceptNecessaryOnly"
          >
            เฉพาะที่จำเป็น
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded bg-firezone-red hover:bg-firezone-darkred text-xs font-bold text-white transition-colors shadow"
            @click="acceptAll"
          >
            ยอมรับทั้งหมด
          </button>
        </div>
      </div>
    </div>

    <!-- Preferences Modal -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-gray-800">
        <div class="bg-firezone-navy text-white px-6 py-4 flex items-center justify-between">
          <h3 class="font-bold text-base flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-firezone-red" />
            <span>ตั้งค่าความเป็นส่วนตัวและคุกกี้ (PDPA)</span>
          </h3>
          <button type="button" class="text-gray-400 hover:text-white text-xl leading-none" @click="modalOpen = false">
            ×
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <p class="text-gray-600 leading-relaxed">
            ท่านสามารถเลือกเปิดหรือปิดการใช้งานคุกกี้แต่ละประเภทได้ตามความต้องการ ยกเว้นคุกกี้ที่จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์
          </p>

          <div class="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-start justify-between gap-3">
            <div>
              <div class="font-bold text-gray-900">1. คุกกี้ที่จำเป็นอย่างยิ่ง (Strictly Necessary)</div>
              <p class="text-gray-500 mt-0.5">จำเป็นต่อความปลอดภัย ระบบเซสชัน และการส่งฟอร์มขอใบเสนอราคา</p>
            </div>
            <span class="px-2.5 py-1 rounded bg-gray-200 text-gray-700 font-bold shrink-0 text-[11px]">เปิดเสมอ</span>
          </div>

          <label class="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-start justify-between gap-3 cursor-pointer">
            <div>
              <div class="font-bold text-gray-900">2. คุกกี้เพื่อการวิเคราะห์สถิติ (Analytics Cookies)</div>
              <p class="text-gray-500 mt-0.5">ช่วยให้เราทราบสถิติผู้เข้าชมผ่าน Google Analytics เพื่อปรับปรุงเนื้อหาและบริการ</p>
            </div>
            <input v-model="draftAnalytics" type="checkbox" class="mt-1 w-4 h-4 accent-red-600" />
          </label>

          <label class="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-start justify-between gap-3 cursor-pointer">
            <div>
              <div class="font-bold text-gray-900">3. คุกกี้เพื่อการตลาดและโฆษณา (Marketing &amp; Tags)</div>
              <p class="text-gray-500 mt-0.5">ใช้สำหรับ Google Tag Manager, Meta Pixel, LINE Tag เพื่อนำเสนอข้อมูลที่ตรงความสนใจ</p>
            </div>
            <input v-model="draftMarketing" type="checkbox" class="mt-1 w-4 h-4 accent-red-600" />
          </label>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
            <NuxtLink to="/privacy-policy" class="text-firezone-red font-semibold hover:underline" @click="modalOpen = false">
              อ่านนโยบาย PDPA ฉบับเต็ม
            </NuxtLink>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                @click="saveConsent({ analytics: draftAnalytics, marketing: draftMarketing })"
              >
                บันทึกการตั้งค่า
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded bg-firezone-red hover:bg-firezone-darkred text-white font-bold"
                @click="acceptAll"
              >
                ยอมรับทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'

const { settings } = useSiteData()
const {
  consent,
  hydrated,
  modalOpen,
  loadConsent,
  saveConsent,
  acceptAll,
  acceptNecessaryOnly
} = usePdpaConsent()

const draftAnalytics = ref(true)
const draftMarketing = ref(true)

function openModalWithCurrent() {
  draftAnalytics.value = consent.value.decided ? consent.value.analytics : true
  draftMarketing.value = consent.value.decided ? consent.value.marketing : true
  modalOpen.value = true
}

watch(modalOpen, (open) => {
  if (open) {
    draftAnalytics.value = consent.value.decided ? consent.value.analytics : true
    draftMarketing.value = consent.value.decided ? consent.value.marketing : true
  }
})

onMounted(() => {
  loadConsent()
})
</script>
