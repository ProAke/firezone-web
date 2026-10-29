<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-800">
    <!-- Classic Top Contact Bar -->
    <div class="bg-firezone-navy text-gray-300 text-xs border-b border-white/10">
      <div class="container-classic py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-4 md:gap-6">
          <a
            :href="`tel:${(settings.phone1 || '086-363-5495').replace(/[^0-9+]/g, '')}`"
            class="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone class="w-3.5 h-3.5 text-firezone-red" />
            <span>{{ settings.phone1 || '086-363-5495' }}, {{ settings.phone2 || '086-449-2598' }}</span>
          </a>
          <a
            :href="`mailto:${settings.email || 'fire_zone@hotmail.com'}`"
            class="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail class="w-3.5 h-3.5 text-firezone-red" />
            <span>{{ settings.email || 'fire_zone@hotmail.com' }}</span>
          </a>
          <span class="hidden lg:flex items-center gap-1.5 text-gray-400">
            <MapPin class="w-3.5 h-3.5 text-firezone-red" />
            <span>แขวงจันทรเกษม เขตจตุจักร กรุงเทพฯ</span>
          </span>
        </div>

        <div class="flex items-center gap-3">
          <a
            v-if="settings.lineUrl"
            :href="settings.lineUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-green-400 transition-colors font-medium"
          >
            LINE: {{ settings.lineId || '0864492598' }}
          </a>
          <span class="text-white/20">|</span>
          <a
            v-if="settings.facebookUrl"
            :href="settings.facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white transition-colors"
          >
            Facebook
          </a>
          <span class="text-white/20">|</span>
          <NuxtLink
            to="/admin"
            class="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            title="ระบบจัดการเว็บไซต์ (CMS)"
          >
            <Lock class="w-3 h-3" />
            <span>จัดการเว็บ</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Sticky Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div class="container-classic h-20 flex items-center justify-between gap-4">
        <!-- Top Menu Logo (logosticky-fireszone-2.png) -->
        <NuxtLink to="/" class="flex items-center gap-3 shrink-0 py-1">
          <img
            v-if="!logoFailed"
            :src="settings.logoHeader || settings.logoUrl || '/logosticky-fireszone-2.png'"
            :alt="settings.companyName || 'Firezone and Manufacturing Co., Ltd.'"
            class="h-11 md:h-[50px] w-auto object-contain"
            @error="logoFailed = true"
          />
          <div v-else class="flex items-center gap-2.5">
            <div class="w-11 h-11 rounded bg-firezone-red text-white flex items-center justify-center font-extrabold text-xl">
              FZ
            </div>
            <div>
              <div class="font-extrabold text-lg leading-none text-firezone-navy tracking-tight">FIREZONE</div>
              <div class="text-[11px] text-gray-500">Fire Alarm &amp; Security Systems</div>
            </div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2 font-medium text-[15px]">
          <NuxtLink
            to="/"
            class="px-3 py-2 rounded hover:text-firezone-red transition-colors"
            active-class="text-firezone-red font-semibold"
          >
            หน้าหลัก
          </NuxtLink>

          <NuxtLink
            to="/about-us"
            class="px-3 py-2 rounded hover:text-firezone-red transition-colors"
            active-class="text-firezone-red font-semibold"
          >
            เกี่ยวกับเรา
          </NuxtLink>

          <!-- Products Dropdown -->
          <div class="relative group">
            <NuxtLink
              to="/shop"
              class="px-3 py-2 rounded inline-flex items-center gap-1 hover:text-firezone-red transition-colors"
              :class="{ 'text-firezone-red font-semibold': route.path.startsWith('/shop') || route.path.startsWith('/product') }"
            >
              <span>สินค้า</span>
              <ChevronDown class="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
            </NuxtLink>

            <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-0 top-full pt-2 w-72 z-50">
              <div class="bg-white rounded-md shadow-xl border border-gray-200 py-2 max-h-[75vh] overflow-y-auto">
                <NuxtLink
                  to="/shop"
                  class="block px-4 py-2 text-sm font-semibold text-firezone-red hover:bg-red-50 border-b border-gray-100"
                >
                  สินค้าทั้งหมด (48 รายการ)
                </NuxtLink>
                <template v-for="cat in categoryTree" :key="cat.id">
                  <NuxtLink
                    :to="`/shop/category/${encodeURIComponent(cat.slug)}`"
                    class="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-firezone-red"
                  >
                    <span class="font-medium">{{ cat.name }}</span>
                    <span class="text-xs text-gray-400">({{ cat.productCount }})</span>
                  </NuxtLink>
                  <div v-if="cat.children?.length" class="bg-gray-50/70 border-y border-gray-100 py-1">
                    <NuxtLink
                      v-for="sub in cat.children"
                      :key="sub.id"
                      :to="`/shop/category/${encodeURIComponent(sub.slug)}`"
                      class="flex items-center justify-between pl-8 pr-4 py-1.5 text-xs text-gray-600 hover:text-firezone-red"
                    >
                      <span>— {{ sub.name }}</span>
                      <span class="text-[11px] text-gray-400">({{ sub.productCount }})</span>
                    </NuxtLink>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/services"
            class="px-3 py-2 rounded hover:text-firezone-red transition-colors"
            :class="{ 'text-firezone-red font-semibold': route.path.startsWith('/service') }"
          >
            บริการของเรา
          </NuxtLink>

          <NuxtLink
            to="/portfolio"
            class="px-3 py-2 rounded hover:text-firezone-red transition-colors"
            :class="{ 'text-firezone-red font-semibold': route.path.startsWith('/portfolio') }"
          >
            ผลงาน
          </NuxtLink>

          <NuxtLink
            to="/news"
            class="px-3 py-2 rounded hover:text-firezone-red transition-colors"
            :class="{ 'text-firezone-red font-semibold': route.path.startsWith('/news') }"
          >
            ข่าวสาร
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="px-3 py-2 rounded hover:text-firezone-red transition-colors"
            active-class="text-firezone-red font-semibold"
          >
            ติดต่อเรา
          </NuxtLink>
        </nav>

        <!-- Search & CTA -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2.5 rounded-full text-gray-600 hover:text-firezone-red hover:bg-gray-100 transition-colors"
            aria-label="ค้นหาสินค้า"
            @click="searchOpen = !searchOpen"
          >
            <Search class="w-5 h-5" />
          </button>

          <NuxtLink
            to="/contact#quote"
            class="hidden sm:inline-flex items-center gap-2 bg-firezone-red hover:bg-firezone-darkred text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors shadow-sm"
          >
            <PhoneCall class="w-4 h-4" />
            <span>ขอใบเสนอราคา</span>
          </NuxtLink>

          <button
            type="button"
            class="lg:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
            aria-label="เปิดเมนู"
            @click="mobileOpen = !mobileOpen"
          >
            <X v-if="mobileOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Quick Product Search Bar -->
      <div v-if="searchOpen" class="border-t border-gray-200 bg-gray-50 py-3">
        <form class="container-classic flex gap-2" @submit.prevent="submitSearch">
          <input
            v-model="searchKeyword"
            type="search"
            placeholder="ค้นหารุ่นสินค้า เช่น NFS-320, Notifier, Smoke Detector, Nohmi, GST..."
            class="flex-1 px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red bg-white"
          />
          <button type="submit" class="btn-firezone py-2 px-5 text-sm">ค้นหา</button>
        </form>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div v-if="mobileOpen" class="lg:hidden border-t border-gray-200 bg-white shadow-lg">
        <div class="container-classic py-4 flex flex-col gap-1 text-sm font-medium">
          <NuxtLink to="/" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">หน้าหลัก</NuxtLink>
          <NuxtLink to="/about-us" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">เกี่ยวกับเรา</NuxtLink>
          <NuxtLink to="/shop" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">สินค้าทั้งหมด</NuxtLink>
          <NuxtLink to="/services" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">บริการของเรา</NuxtLink>
          <NuxtLink to="/portfolio" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">ผลงานการติดตั้ง</NuxtLink>
          <NuxtLink to="/news" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">ข่าวสารและเกร็ดความรู้</NuxtLink>
          <NuxtLink to="/contact" class="py-2.5 px-3 rounded hover:bg-gray-50" @click="mobileOpen = false">ติดต่อเรา</NuxtLink>
          <NuxtLink
            to="/contact#quote"
            class="mt-2 btn-firezone w-full text-center"
            @click="mobileOpen = false"
          >
            ขอใบเสนอราคา / สอบถามสินค้า
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Page Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Classic Dark 4-Column Footer -->
    <footer class="bg-firezone-navy text-gray-300 pt-14 pb-8 border-t-4 border-firezone-red">
      <div class="container-classic grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <!-- Col 1: Company (Footer Zone Logo: logofooter-firesone.png) -->
        <div>
          <img
            v-if="!footerLogoFailed"
            :src="settings.logoFooter || settings.footerLogoUrl || '/logofooter-firesone.png'"
            :alt="settings.companyName || 'Firezone and Manufacturing Co., Ltd.'"
            class="h-16 md:h-20 w-auto object-contain mb-4"
            @error="footerLogoFailed = true"
          />
          <div v-else class="text-xl font-extrabold text-white mb-3">
            FIREZONE
          </div>
          <p class="font-semibold text-white text-sm mb-2">
            {{ settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}
          </p>
          <p class="text-xs leading-relaxed text-gray-400 mb-4">
            ตัวแทนจำหน่าย ออกแบบ ติดตั้ง ตรวจสอบ และบำรุงรักษาระบบสัญญาณเตือนอัคคีภัย (Fire Alarm System) กล้องวงจรปิด (CCTV) ระบบทีวีรวม (MATV) และอุปกรณ์ดับเพลิงครบวงจร
          </p>
          <div class="flex items-center gap-2">
            <a
              v-if="settings.facebookUrl"
              :href="settings.facebookUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded bg-white/10 hover:bg-firezone-red text-white text-xs font-medium transition-colors"
            >
              Facebook
            </a>
            <a
              v-if="settings.lineUrl"
              :href="settings.lineUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded bg-[#06C755]/90 hover:bg-[#06C755] text-white text-xs font-medium transition-colors"
            >
              LINE Official
            </a>
          </div>
        </div>

        <!-- Col 2: Product Categories -->
        <div>
          <h3 class="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-firezone-red rounded-full" />
            หมวดหมู่สินค้า
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-for="cat in categoryTree.slice(0, 6)" :key="cat.id">
              <NuxtLink
                :to="`/shop/category/${encodeURIComponent(cat.slug)}`"
                class="text-gray-400 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>› {{ cat.name }}</span>
                <span class="text-xs text-gray-500">({{ cat.productCount }})</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Quick Links -->
        <div>
          <h3 class="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-firezone-red rounded-full" />
            เมนูลัด
          </h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-white">› หน้าหลัก</NuxtLink></li>
            <li><NuxtLink to="/about-us" class="text-gray-400 hover:text-white">› เกี่ยวกับบริษัท</NuxtLink></li>
            <li><NuxtLink to="/shop" class="text-gray-400 hover:text-white">› สินค้าและอุปกรณ์ทั้งหมด</NuxtLink></li>
            <li><NuxtLink to="/services" class="text-gray-400 hover:text-white">› บริการติดตั้งและตรวจสอบ</NuxtLink></li>
            <li><NuxtLink to="/portfolio" class="text-gray-400 hover:text-white">› ผลงานโครงการที่ผ่านมา</NuxtLink></li>
            <li><NuxtLink to="/news" class="text-gray-400 hover:text-white">› ข่าวสารและบทความ</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">› ติดต่อเรา / ขอใบเสนอราคา</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="text-gray-400 hover:text-white">› นโยบายความเป็นส่วนตัว (PDPA)</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 4: Contact Info -->
        <div>
          <h3 class="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-firezone-red rounded-full" />
            ติดต่อสอบถาม
          </h3>
          <ul class="space-y-3 text-xs text-gray-300">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-firezone-red shrink-0 mt-0.5" />
              <span class="leading-relaxed">
                {{ settings.address || '678/6 ซอยพหลโยธิน 32 แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900' }}
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <Phone class="w-4 h-4 text-firezone-red shrink-0 mt-0.5" />
              <div class="space-y-1">
                <div>
                  <a :href="`tel:${settings.phone1 || '0863635495'}`" class="hover:text-white">{{ settings.phone1 || '086-363-5495' }}</a>,
                  <a :href="`tel:${settings.phone2 || '0864492598'}`" class="hover:text-white">{{ settings.phone2 || '086-449-2598' }}</a>
                </div>
                <div>
                  <a :href="`tel:${settings.phone3 || '0869541974'}`" class="hover:text-white">{{ settings.phone3 || '086-954-1974' }}</a>,
                  <a :href="`tel:${settings.officePhone || '021975275'}`" class="hover:text-white">{{ settings.officePhone || '02-197-5275' }}</a>
                </div>
              </div>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-firezone-red shrink-0" />
              <a :href="`mailto:${settings.email || 'fire_zone@hotmail.com'}`" class="hover:text-white">
                {{ settings.email || 'fire_zone@hotmail.com' }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="container-classic pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© {{ new Date().getFullYear() }} {{ settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}. สงวนลิขสิทธิ์.</p>
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink to="/privacy-policy" class="hover:text-gray-300">นโยบาย PDPA</NuxtLink>
          <span>•</span>
          <button type="button" class="hover:text-gray-300" @click="openPreferencesModal">ตั้งค่าคุกกี้</button>
          <span>•</span>
          <a href="/sitemap.xml" target="_blank" class="hover:text-gray-300">Sitemap</a>
          <span>•</span>
          <a href="/llms.txt" target="_blank" class="hover:text-gray-300" title="AI Search Index">AI / ASEO</a>
        </div>
      </div>
    </footer>

    <!-- Floating Quick Contact Actions -->
    <div class="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
      <a
        v-if="settings.lineUrl"
        :href="settings.lineUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="w-12 h-12 rounded-full bg-[#06C755] hover:bg-[#05b04b] text-white shadow-lg flex items-center justify-center font-bold text-xs transition-transform hover:scale-105"
        title="แชทผ่าน LINE"
      >
        LINE
      </a>
      <a
        :href="`tel:${(settings.phone1 || '0863635495').replace(/[^0-9+]/g, '')}`"
        class="w-12 h-12 rounded-full bg-firezone-red hover:bg-firezone-darkred text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        title="โทรติดต่อฝ่ายขาย"
      >
        <PhoneCall class="w-5 h-5" />
      </a>
    </div>

    <!-- Analytics/Tag Injector (respecting PDPA) & Cookie Consent Banner -->
    <TrackingScripts />
    <PdpaCookieBanner />
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDown,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  PhoneCall,
  Search,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { settings, categoryTree } = useSiteData()
const { openPreferencesModal } = usePdpaConsent()

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchKeyword = ref('')
const logoFailed = ref(false)
const footerLogoFailed = ref(false)

function submitSearch() {
  const q = searchKeyword.value.trim()
  searchOpen.value = false
  router.push(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop')
}
</script>
