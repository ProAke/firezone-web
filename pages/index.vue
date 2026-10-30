<template>
  <div>
    <!-- 1. Classic Hero Slider -->
    <section class="relative bg-firezone-navy text-white overflow-hidden">
      <div class="relative h-[440px] sm:h-[520px] lg:h-[600px]">
        <div
          v-for="(slide, idx) in slides"
          :key="idx"
          class="absolute inset-0 transition-opacity duration-700"
          :class="idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
        >
          <SmartImage
            :src="slide.image"
            :alt="slide.title"
            img-class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-[#151922]/90 via-[#151922]/75 to-[#151922]/35" />

          <div class="container-classic absolute inset-0 flex items-center">
            <div class="max-w-2xl space-y-5">
              <div class="inline-flex items-center gap-2 bg-firezone-red/90 text-white text-xs font-semibold px-3.5 py-1.5 rounded uppercase tracking-wider">
                <Flame class="w-3.5 h-3.5" />
                <span>{{ slide.subtitle || 'FIRE ALARM & SECURITY SPECIALIST' }}</span>
              </div>
              <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow">
                {{ slide.title }}
              </h1>
              <p class="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">
                {{ slide.description || slide.subtitle }}
              </p>
              <div class="pt-2 flex flex-wrap items-center gap-3">
                <NuxtLink :to="slide.buttonLink || slide.ctaLink || '/shop'" class="btn-firezone">
                  <span>{{ slide.buttonText || slide.ctaText || 'ดูสินค้าทั้งหมด' }}</span>
                  <ArrowRight class="w-4 h-4 ml-2" />
                </NuxtLink>
                <NuxtLink
                  to="/contact#quote"
                  class="inline-flex items-center justify-center px-6 py-3 rounded font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-colors"
                >
                  ติดต่อขอใบเสนอราคา
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Slider Arrows -->
        <button
          v-if="slides.length > 1"
          type="button"
          class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-firezone-red text-white items-center justify-center transition-colors"
          aria-label="สไลด์ก่อนหน้า"
          @click="prevSlide"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <button
          v-if="slides.length > 1"
          type="button"
          class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-firezone-red text-white items-center justify-center transition-colors"
          aria-label="สไลด์ถัดไป"
          @click="nextSlide"
        >
          <ChevronRight class="w-6 h-6" />
        </button>

        <!-- Slider Dots -->
        <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <button
            v-for="(_, idx) in slides"
            :key="idx"
            type="button"
            class="h-2.5 rounded-full transition-all"
            :class="idx === activeSlide ? 'w-8 bg-firezone-red' : 'w-2.5 bg-white/50 hover:bg-white'"
            :aria-label="`ไปยังสไลด์ ${idx + 1}`"
            @click="activeSlide = idx"
          />
        </div>
      </div>
    </section>

    <!-- 2. About Us Classic Two-Column Section -->
    <section class="py-16 lg:py-20 bg-white">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-5 relative">
          <div class="rounded-lg overflow-hidden shadow-xl border border-gray-200">
            <SmartImage
              :src="homeData?.settings?.aboutImage || '/wp-content/uploads/2021/01/bg-homeaboutus.png'"
              alt="เกี่ยวกับบริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด"
              img-class="w-full h-[340px] object-cover"
            />
          </div>
          <div class="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-right-5 bg-firezone-red text-white p-5 rounded-lg shadow-lg max-w-[230px]">
            <div class="text-2xl font-extrabold leading-none">20+ ปี</div>
            <div class="text-xs mt-1 text-red-100">ประสบการณ์ทีมช่างผู้เชี่ยวชาญเฉพาะทาง มาตรฐาน UL / FM</div>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-5">
          <div>
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">ABOUT FIRESZONE</span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-firezone-navy mt-1">
              {{ homeData?.settings?.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}
            </h2>
            <p class="text-sm font-semibold text-gray-500 mt-0.5">
              {{ homeData?.settings?.companyTagline || 'FIRESZONE & MANUFACTURING CO., LTD.' }}
            </p>
          </div>

          <p class="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
            {{ homeData?.settings?.aboutIntro }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div class="flex items-center gap-2.5 text-sm font-medium text-gray-800">
              <CheckCircle2 class="w-5 h-5 text-firezone-red shrink-0" />
              <span>ตัวแทนจำหน่ายอุปกรณ์แจ้งเหตุเพลิงไหม้ชั้นนำ</span>
            </div>
            <div class="flex items-center gap-2.5 text-sm font-medium text-gray-800">
              <CheckCircle2 class="w-5 h-5 text-firezone-red shrink-0" />
              <span>บริการติดตั้ง ตรวจเช็ค และทดสอบระบบประจำปี</span>
            </div>
            <div class="flex items-center gap-2.5 text-sm font-medium text-gray-800">
              <CheckCircle2 class="w-5 h-5 text-firezone-red shrink-0" />
              <span>พัฒนาระบบแจ้งเตือน Fire Alarm ผ่าน LINE &amp; Email</span>
            </div>
            <div class="flex items-center gap-2.5 text-sm font-medium text-gray-800">
              <CheckCircle2 class="w-5 h-5 text-firezone-red shrink-0" />
              <span>รับเหมาติดตั้งกล้องวงจรปิด CCTV &amp; ระบบทีวีรวม MATV</span>
            </div>
          </div>

          <div class="pt-3 flex flex-wrap gap-3">
            <NuxtLink to="/about-us" class="btn-firezone">
              อ่านข้อมูลบริษัทเพิ่มเติม
            </NuxtLink>
            <NuxtLink to="/contact" class="btn-outline-firezone">
              ติดต่อสอบถามทีมงาน
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. อุปกรณ์ของเรา (5 Equipment Categories from fireszone.com) -->
    <section class="py-16 bg-firezone-light border-y border-gray-200">
      <div class="container-classic">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">OUR EQUIPMENT</span>
          <h2 class="section-heading mt-1">อุปกรณ์ของเรา</h2>
          <div class="section-divider mx-auto" />
          <p class="text-gray-600 text-sm mt-3">
            จัดจำหน่ายอุปกรณ์ระบบสัญญาณเตือนอัคคีภัย อุปกรณ์ดับเพลิง กล้องวงจรปิด และระบบทีวีดิจิตอลคุณภาพสูง
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <NuxtLink
            v-for="item in homeData?.equipmentItems || []"
            :key="item.id"
            :to="`/service/${encodeURIComponent(item.slug)}`"
            class="group bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-firezone-red transition-all flex flex-col"
          >
            <div class="h-44 bg-gray-100 overflow-hidden">
              <SmartImage
                :src="item.image"
                :alt="item.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="font-bold text-gray-900 text-sm group-hover:text-firezone-red transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-xs text-gray-500 mt-1.5 line-clamp-3 flex-1">
                {{ item.excerpt }}
              </p>
              <span class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-firezone-red">
                <span>ดูรายละเอียด</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 4. สินค้าแนะนำ (Featured Products) -->
    <section class="py-16 bg-white">
      <div class="container-classic">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">PRODUCTS CATALOG</span>
            <h2 class="section-heading mt-1">สินค้าและอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้</h2>
            <div class="section-divider" />
          </div>
          <NuxtLink to="/shop" class="btn-outline-firezone text-sm py-2.5 px-5 self-start sm:self-auto">
            ดูสินค้าทั้งหมด (48 รายการ)
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="prod in homeData?.featuredProducts || []"
            :key="prod.id"
            :product="prod"
          />
        </div>
      </div>
    </section>

    <!-- 5. งานบริการของเรา (4 Core Services from fireszone.com) -->
    <section class="py-16 bg-firezone-navy text-white">
      <div class="container-classic">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-red-400 font-bold text-xs uppercase tracking-widest">OUR SERVICES</span>
          <h2 class="text-2xl md:text-3xl font-bold text-white mt-1">งานบริการของเรา</h2>
          <div class="section-divider mx-auto" />
          <p class="text-gray-300 text-sm mt-3">
            ดูแลครบวงจรตั้งแต่ให้คำปรึกษา ออกแบบ ติดตั้ง ตรวจเช็ค ทดสอบระบบ ไปจนถึงพัฒนาระบบแจ้งเตือนอัจฉริยะ
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="svc in homeData?.serviceItems || []"
            :key="svc.id"
            :to="`/service/${encodeURIComponent(svc.slug)}`"
            class="group bg-[#1e2430] border border-white/10 rounded-md overflow-hidden hover:border-firezone-red transition-all flex flex-col"
          >
            <div class="h-44 overflow-hidden bg-black/30">
              <SmartImage
                :src="svc.image"
                :alt="svc.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <h3 class="font-bold text-base text-white group-hover:text-red-400 transition-colors">
                {{ svc.title }}
              </h3>
              <p class="text-xs text-gray-400 mt-2 line-clamp-3 flex-1 leading-relaxed">
                {{ svc.excerpt }}
              </p>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-red-400">
                <span>อ่านเพิ่มเติม</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 6. Classic Achievement Counters Strip (from fireszone.com: 856 / 165 / 93) -->
    <section class="bg-firezone-red text-white py-12">
      <div class="container-classic grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <div class="text-3xl md:text-4xl font-extrabold">{{ homeData?.settings?.statFireAlarmCount || '856' }}</div>
          <div class="text-xs md:text-sm text-red-100 mt-1 font-medium">
            {{ homeData?.settings?.statFireAlarmLabel || 'โปรเจค ระบบไฟอราม' }}
          </div>
        </div>
        <div>
          <div class="text-3xl md:text-4xl font-extrabold">{{ homeData?.settings?.statCctvCount || '165' }}</div>
          <div class="text-xs md:text-sm text-red-100 mt-1 font-medium">
            {{ homeData?.settings?.statCctvLabel || 'โปรเจค ระบบกล้องวงจรปิด' }}
          </div>
        </div>
        <div>
          <div class="text-3xl md:text-4xl font-extrabold">{{ homeData?.settings?.statMatvCount || '93' }}</div>
          <div class="text-xs md:text-sm text-red-100 mt-1 font-medium">
            {{ homeData?.settings?.statMatvLabel || 'โปรเจค ระบบเอ็มเอทีวี' }}
          </div>
        </div>
      </div>
    </section>

    <!-- 7. ผลงานที่ผ่านมา (Portfolio Showcase) -->
    <section class="py-16 bg-firezone-light">
      <div class="container-classic">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">OUR PORTFOLIO</span>
            <h2 class="section-heading mt-1">ผลงานการติดตั้งและตรวจเช็คระบบ</h2>
            <div class="section-divider" />
          </div>
          <NuxtLink to="/portfolio" class="btn-outline-firezone text-sm py-2.5 px-5 self-start sm:self-auto">
            ดูผลงานทั้งหมด
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in homeData?.portfolio || []"
            :key="item.id"
            :to="`/portfolio/${encodeURIComponent(item.slug)}`"
            class="group bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-firezone-red transition-all flex flex-col"
          >
            <div class="h-52 bg-gray-100 overflow-hidden relative">
              <SmartImage
                :src="item.image"
                :alt="item.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span class="absolute bottom-3 left-3 bg-firezone-navy/85 text-white text-[11px] px-2.5 py-1 rounded">
                {{ formatThaiDate(item.publishedAt) }}
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <h3 class="font-bold text-gray-900 text-base group-hover:text-firezone-red transition-colors line-clamp-2">
                {{ item.title }}
              </h3>
              <p class="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">
                {{ item.excerpt }}
              </p>
              <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-firezone-red">
                <span>ดูภาพและรายละเอียดโครงการ</span>
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 8. ลูกค้าที่ไว้วางใจ & แบรนด์ชั้นนำ -->
    <section class="py-14 bg-white border-y border-gray-200">
      <div class="container-classic space-y-12">
        <!-- Brands -->
        <div>
          <div class="text-center mb-8">
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">TRUSTED BRANDS</span>
            <h2 class="text-xl md:text-2xl font-bold text-firezone-navy mt-1">แบรนด์สินค้าชั้นนำที่เราจัดจำหน่าย</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <NuxtLink
              v-for="(brand, idx) in homeData?.brands || []"
              :key="idx"
              :to="brand.slug ? `/shop/category/${encodeURIComponent(brand.slug)}` : `/shop?search=${encodeURIComponent(brand.name)}`"
              class="h-20 bg-white border border-gray-200 rounded p-3 flex items-center justify-center hover:border-firezone-red hover:shadow-sm transition-all"
              :title="brand.name"
            >
              <SmartImage
                :src="brand.logo"
                :alt="brand.name"
                img-class="max-h-12 w-auto object-contain"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Clients -->
        <div v-if="(homeData?.clients || []).length">
          <div class="text-center mb-6">
            <h3 class="text-lg font-bold text-gray-700">ลูกค้าองค์กรและโครงการที่ไว้วางใจเรา</h3>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div
              v-for="(client, idx) in homeData?.clients || []"
              :key="idx"
              class="h-20 bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-center"
            >
              <SmartImage
                :src="client.logo"
                :alt="client.name"
                img-class="max-h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. ข่าวสารและเกร็ดความรู้ (Latest News) -->
    <section class="py-16 bg-white">
      <div class="container-classic">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">NEWS &amp; KNOWLEDGE</span>
            <h2 class="section-heading mt-1">ข่าวสารและเกร็ดความรู้ระบบอัคคีภัย</h2>
            <div class="section-divider" />
          </div>
          <NuxtLink to="/news" class="btn-outline-firezone text-sm py-2.5 px-5 self-start sm:self-auto">
            ดูบทความทั้งหมด
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in homeData?.news || []"
            :key="article.id"
            :to="`/news/${encodeURIComponent(article.slug)}`"
            class="group bg-white rounded-md border border-gray-200 overflow-hidden hover:border-firezone-red hover:shadow-md transition-all flex flex-col"
          >
            <div class="h-48 bg-gray-100 overflow-hidden">
              <SmartImage
                :src="article.image"
                :alt="article.title"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="text-xs text-gray-400 mb-1.5">{{ formatThaiDate(article.publishedAt) }}</div>
              <h3 class="font-bold text-gray-900 text-base group-hover:text-firezone-red transition-colors line-clamp-2">
                {{ article.title }}
              </h3>
              <p class="text-xs text-gray-600 mt-2 line-clamp-3 flex-1 leading-relaxed">
                {{ article.excerpt }}
              </p>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-firezone-red">
                <span>อ่านบทความ</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 9.5 คำถามที่พบบ่อย (FAQ Section for Buyers & AI Search / ASEO) -->
    <section class="py-16 bg-firezone-light border-t border-gray-200">
      <div class="container-classic max-w-4xl">
        <div class="text-center mb-10">
          <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">FAQ &amp; KNOWLEDGE BASE</span>
          <h2 class="section-heading mt-1">คำถามที่พบบ่อยเกี่ยวกับระบบสัญญาณเตือนอัคคีภัย</h2>
          <div class="section-divider mx-auto" />
        </div>

        <div class="space-y-3">
          <details
            v-for="(faq, idx) in homeFaqs"
            :key="idx"
            class="group bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
            :open="idx === 0"
          >
            <summary class="font-bold text-firezone-navy text-sm md:text-base cursor-pointer list-none flex items-center justify-between gap-4">
              <span>{{ faq.q }}</span>
              <span class="text-firezone-red font-extrabold text-lg group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p class="text-sm text-gray-600 mt-3 leading-relaxed border-t border-gray-100 pt-3">
              {{ faq.a }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- 10. Bottom CTA Strip -->
    <section class="bg-firezone-navy text-white py-12 border-t border-white/10">
      <div class="container-classic flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-xl md:text-2xl font-bold">
            ต้องการปรึกษา ออกแบบ ติดตั้ง หรือขอใบเสนอราคานิติบุคคล / โครงการ?
          </h2>
          <p class="text-sm text-gray-300 mt-1">
            โทรสายด่วน {{ homeData?.settings?.phone1 || '086-363-5495' }}, {{ homeData?.settings?.phone2 || '086-449-2598' }} หรือส่งรายการอุปกรณ์ให้เราประเมินราคาฟรี
          </p>
        </div>
        <div class="flex flex-wrap gap-3 shrink-0">
          <NuxtLink to="/contact#quote" class="btn-firezone">
            ส่งข้อความขอใบเสนอราคา
          </NuxtLink>
          <a
            :href="`tel:${(homeData?.settings?.phone1 || '0863635495').replace(/[^0-9+]/g, '')}`"
            class="px-6 py-3 rounded font-semibold border border-white/30 hover:bg-white/10 transition-colors"
          >
            โทร {{ homeData?.settings?.phone1 || '086-363-5495' }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-vue-next'
import { formatThaiDate } from '~/composables/useSiteData'

const { data: homeData } = await useAsyncData('home-page-data', () => $fetch('/api/home'))

const slides = computed(() => {
  const list = homeData.value?.heroSlides || []
  return list.length
    ? list
    : [
        {
          title: 'ผู้นำด้านระบบสัญญาณเตือนอัคคีภัยครบวงจร',
          subtitle: 'ตัวแทนจำหน่าย ออกแบบ ติดตั้ง ตรวจเช็ค และบำรุงรักษาระบบ Fire Alarm, CCTV, MATV มาตรฐานสากล',
          image: '/wp-content/uploads/2021/01/banner1.png',
          ctaText: 'ดูสินค้าทั้งหมด',
          ctaLink: '/shop'
        }
      ]
})

const activeSlide = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % slides.value.length
}

function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + slides.value.length) % slides.value.length
}

onMounted(() => {
  if (slides.value.length > 1) {
    timer = setInterval(nextSlide, 6000)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const homeFaqs = [
  {
    q: 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด ให้บริการระบบอะไรบ้าง?',
    a: 'เราเป็นตัวแทนจำหน่าย ออกแบบ ติดตั้ง ตรวจสอบประจำปี และบำรุงรักษาระบบสัญญาณเตือนอัคคีภัย (Fire Alarm System) มาตรฐาน UL/FM รวมถึงพัฒนาระบบแจ้งเตือนเหตุเพลิงไหม้ผ่าน LINE และ E-mail ระบบกล้องวงจรปิด (CCTV) ระบบทีวีรวมดิจิตอล (MATV) และอุปกรณ์ดับเพลิงครบวงจร'
  },
  {
    q: 'ระบบ Fire Alarm แบบ Conventional และ Addressable ต่างกันอย่างไร?',
    a: 'ระบบ Conventional แสดงผลแจ้งเตือนเป็นโซนพื้นที่ เหมาะกับอาคารขนาดเล็กถึงกลาง ติดตั้งและดูแลง่าย ส่วนระบบ Addressable ระบุตำแหน่งหัวตรวจจับ (Smoke/Heat Detector) ที่เกิดเหตุได้แบบรายจุดแม่นยำ เหมาะกับอาคารสูง โรงงานขนาดใหญ่ โรงพยาบาล และคอนโดมิเนียม'
  },
  {
    q: 'ระบบแจ้งเตือนไฟไหม้ผ่าน LINE ของ Fireszone สามารถติดตั้งร่วมกับตู้เดิมได้หรือไม่?',
    a: 'สามารถติดตั้งเชื่อมต่อเข้ากับตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้ (Fire Alarm Control Panel) ได้ทั้งตู้ติดตั้งใหม่และตู้เดิมทุกยี่ห้อ เมื่อเกิดสัญญาณแจ้งเตือน ระบบจะส่งข้อความเข้ากลุ่ม LINE และ E-mail ของผู้ดูแลอาคารทันทีตลอด 24 ชั่วโมง'
  },
  {
    q: 'ต้องการขอใบเสนอราคาหรือส่งแบบแปลนให้ประเมินราคาต้องทำอย่างไร?',
    a: 'สามารถส่งข้อมูลผ่านหน้า ติดต่อเรา (/contact) พร้อมแนบไฟล์แบบแปลน PDF หรือรูปภาพหน้างานได้สูงสุด 5 ไฟล์ และกดปุ่ม Connect LINE เพื่อรับการติดต่อผ่าน LINE Official Account ได้ทันที หรือโทร 086-363-5495, 086-449-2598 ยินดีให้คำปรึกษาฟรี'
  }
]

usePageSeo({
  title: computed(
    () =>
      homeData.value?.settings?.seoDefaultTitle ||
      'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด | ระบบสัญญาณเตือนอัคคีภัย Fire Alarm ครบวงจร'
  ),
  description: computed(() => homeData.value?.settings?.seoDefaultDescription || ''),
  path: '/',
  jsonLd: computed(() => {
    const siteUrl = (homeData.value?.settings?.siteUrl || 'https://fireszone.com').replace(/\/+$/, '')
    return [
      {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness'],
        name: homeData.value?.settings?.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
        alternateName: 'FIRESZONE & MANUFACTURING CO., LTD.',
        url: siteUrl,
        logo: `${siteUrl}/logo-fz.jpg`,
        image: `${siteUrl}/logo-fz.jpg`,
        telephone: homeData.value?.settings?.phone1 || '086-363-5495',
        email: homeData.value?.settings?.email || 'fire_zone@hotmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress:
            homeData.value?.settings?.address ||
            '678/6 ซอยพหลโยธิน 32 แขวงจันทรเกษม เขตจตุจักร',
          addressLocality: 'กรุงเทพมหานคร',
          postalCode: '10900',
          addressCountry: 'TH'
        },
        sameAs: [
          homeData.value?.settings?.facebookUrl || 'https://www.facebook.com/FIRESZONE/',
          homeData.value?.settings?.lineUrl || 'https://line.me/ti/p/RBiGzfFotR'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'FIRESZONE',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/shop?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: homeFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
          }
        }))
      }
    ]
  })
})
</script>
