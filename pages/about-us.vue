<template>
  <div>
    <PageBanner
      title="เกี่ยวกับเรา"
      subtitle="ABOUT FIRESZONE"
      :breadcrumbs="[{ label: 'เกี่ยวกับเรา' }]"
    />

    <section class="py-16 bg-white">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-6 space-y-4">
          <div class="rounded-lg overflow-hidden border border-gray-200 shadow-md">
            <SmartImage
              src="https://fireszone.com/wp-content/uploads/2021/02/Banner-2.jpg"
              alt="Fireszone Fire Alarm Systems"
              img-class="w-full h-72 md:h-80 object-cover"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg overflow-hidden border border-gray-200">
              <SmartImage
                src="https://fireszone.com/wp-content/uploads/2021/02/server-2.jpg"
                alt="งานติดตั้งและตรวจเช็คระบบ Fire Alarm"
                img-class="w-full h-40 object-cover"
              />
            </div>
            <div class="rounded-lg overflow-hidden border border-gray-200">
              <SmartImage
                src="https://fireszone.com/wp-content/uploads/2021/02/server-3.jpg"
                alt="พัฒนาระบบแจ้งเตือนไฟไหม้ผ่าน Line และ Email"
                img-class="w-full h-40 object-cover"
              />
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 space-y-5">
          <div>
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">COMPANY PROFILE</span>
              <h2 class="text-2xl md:text-3xl font-extrabold text-firezone-navy mt-1">
              {{ settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}
            </h2>
            <p class="text-sm font-semibold text-gray-500 mt-1">
              {{ settings.companyTagline || 'FIRESZONE & MANUFACTURING CO., LTD.' }}
            </p>
            <div class="section-divider" />
          </div>

          <p class="text-gray-700 leading-relaxed whitespace-pre-line">
            {{ settings.aboutIntro }}
          </p>

          <div class="bg-firezone-light p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 class="font-bold text-firezone-navy text-lg">ขอบเขตการให้บริการหลักของเรา</h3>
            <ul class="space-y-3 text-sm text-gray-700">
              <li class="flex items-start gap-2.5">
                <ShieldCheck class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
                <span><strong>จัดจำหน่ายอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm System):</strong> ตู้ควบคุม Conventional &amp; Addressable, Smoke/Heat Detector, Manual Pull Station, Bell &amp; Strobe Light มาตรฐาน UL/FM</span>
              </li>
              <li class="flex items-start gap-2.5">
                <ShieldCheck class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
                <span><strong>บริการออกแบบ ติดตั้ง ตรวจสอบ และบำรุงรักษาประจำปี:</strong> ตรวจเช็คและทดสอบการทำงานของระบบแจ้งเหตุเพลิงไหม้ พร้อมออกเอกสารรับรองและอบรมการใช้งาน</span>
              </li>
              <li class="flex items-start gap-2.5">
                <ShieldCheck class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
                <span><strong>พัฒนานวัตกรรมแจ้งเตือนอัคคีภัยผ่าน LINE &amp; Email:</strong> เชื่อมต่อตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้เข้ากับสมาร์ทโฟนเพื่อให้ผู้ดูแลอาคารรับทราบเหตุได้ทันที</span>
              </li>
              <li class="flex items-start gap-2.5">
                <ShieldCheck class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
                <span><strong>ระบบรักษาความปลอดภัยและระบบอาคาร:</strong> กล้องวงจรปิด (CCTV), ระบบทีวีรวมดิจิตอล (MATV), ถังดับเพลิงเคมีแห้ง / CO2 และไฟฉุกเฉิน</span>
              </li>
            </ul>
          </div>

          <div class="pt-2 flex flex-wrap gap-3">
            <NuxtLink to="/shop" class="btn-firezone">ดูแคตตาล็อกสินค้า</NuxtLink>
            <NuxtLink to="/portfolio" class="btn-outline-firezone">ชมผลงานที่ผ่านมา</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Brands Strip -->
    <section class="py-14 bg-firezone-light border-t border-gray-200">
      <div class="container-classic">
        <div class="text-center mb-8">
          <h3 class="text-xl font-bold text-firezone-navy">แบรนด์พันธมิตรและสินค้าที่เราจัดจำหน่าย</h3>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="(b, idx) in brands"
            :key="idx"
            class="h-20 bg-white border border-gray-200 rounded p-3 flex items-center justify-center"
          >
            <SmartImage :src="b.logo" :alt="b.name" img-class="max-h-12 w-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'

const { settings, brands } = useSiteData()

useHead({
  title: 'เกี่ยวกับเรา | บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด'
})
</script>
