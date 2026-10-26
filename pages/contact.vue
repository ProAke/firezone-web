<template>
  <div>
    <PageBanner
      title="ติดต่อเรา / ขอใบเสนอราคา"
      subtitle="CONTACT US"
      :breadcrumbs="[{ label: 'ติดต่อเรา' }]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Left Contact Details -->
        <div class="lg:col-span-5 space-y-6">
          <div>
            <span class="text-firezone-red font-bold text-xs uppercase tracking-widest">GET IN TOUCH</span>
            <h2 class="text-2xl font-extrabold text-firezone-navy mt-1">
              {{ settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}
            </h2>
            <p class="text-xs font-semibold text-gray-500 mt-0.5">
              {{ settings.companyTagline || 'FIRESZONE & MANUFACTURING CO., LTD.' }}
            </p>
            <div class="section-divider" />
          </div>

          <div class="space-y-4">
            <div class="flex items-start gap-3.5 bg-firezone-light p-4 rounded-lg border border-gray-200">
              <MapPin class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
              <div>
                <div class="font-bold text-sm text-firezone-navy">ที่ตั้งสำนักงาน</div>
                <p class="text-sm text-gray-600 mt-1 leading-relaxed">
                  {{ settings.address || '678/6 ซอยพหลโยธิน 32 แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900' }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3.5 bg-firezone-light p-4 rounded-lg border border-gray-200">
              <Phone class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
              <div>
                <div class="font-bold text-sm text-firezone-navy">เบอร์โทรศัพท์ฝ่ายขายและบริการ</div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 mt-1 font-medium">
                  <a :href="`tel:${settings.phone1 || '0863635495'}`" class="hover:text-firezone-red">
                    {{ settings.phone1 || '086-363-5495' }}
                  </a>
                  <a :href="`tel:${settings.phone2 || '0864492598'}`" class="hover:text-firezone-red">
                    {{ settings.phone2 || '086-449-2598' }}
                  </a>
                  <a :href="`tel:${settings.phone3 || '0869541974'}`" class="hover:text-firezone-red">
                    {{ settings.phone3 || '086-954-1974' }}
                  </a>
                  <a :href="`tel:${settings.officePhone || '021975275'}`" class="hover:text-firezone-red">
                    {{ settings.officePhone || '02-197-5275' }}
                  </a>
                </div>
              </div>
            </div>

            <div class="flex items-start gap-3.5 bg-firezone-light p-4 rounded-lg border border-gray-200">
              <Mail class="w-5 h-5 text-firezone-red shrink-0 mt-0.5" />
              <div>
                <div class="font-bold text-sm text-firezone-navy">อีเมลติดต่อ</div>
                <a
                  :href="`mailto:${settings.email || 'fire_zone@hotmail.com'}`"
                  class="text-sm text-firezone-red font-medium hover:underline mt-0.5 inline-block"
                >
                  {{ settings.email || 'fire_zone@hotmail.com' }}
                </a>
              </div>
            </div>

            <!-- LINE QR Card -->
            <div class="bg-[#06C755]/10 border border-[#06C755]/30 p-4 rounded-lg flex items-center gap-4">
              <div v-if="settings.lineQrImage" class="w-24 h-24 bg-white p-1.5 rounded border shrink-0">
                <SmartImage :src="settings.lineQrImage" alt="LINE QR Code" img-class="w-full h-full object-contain" />
              </div>
              <div class="space-y-1.5">
                <div class="font-bold text-sm text-gray-900">ติดต่อทาง LINE Official</div>
                <div class="text-xs text-gray-600">LINE ID: <strong>{{ settings.lineId || '0864492598' }}</strong></div>
                <a
                  v-if="settings.lineUrl"
                  :href="settings.lineUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block px-3.5 py-1.5 rounded bg-[#06C755] text-white text-xs font-semibold hover:bg-[#05b04b]"
                >
                  คลิกเพิ่มเพื่อน LINE
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Inquiry / Quotation Form -->
        <div id="quote" class="lg:col-span-7">
          <div class="bg-firezone-light border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
            <h3 class="text-xl font-extrabold text-firezone-navy mb-1">
              แบบฟอร์มติดต่อสอบถาม / ขอใบเสนอราคา
            </h3>
            <p class="text-xs text-gray-500 mb-6">
              กรอกรายละเอียดอุปกรณ์หรือบริการที่ต้องการ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด
            </p>

            <div
              v-if="successMsg"
              class="mb-6 bg-green-50 border border-green-300 text-green-800 rounded-md p-4 text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 class="w-5 h-5 text-green-600 shrink-0" />
              <span>{{ successMsg }}</span>
            </div>

            <div
              v-if="errorMsg"
              class="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-md p-4 text-sm font-medium"
            >
              {{ errorMsg }}
            </div>

            <form class="space-y-4" @submit.prevent="submitForm">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">ชื่อ - นามสกุลผู้ติดต่อ *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="ระบุชื่อผู้ติดต่อ"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="เช่น 08x-xxx-xxxx"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">อีเมล</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="example@company.com"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">ชื่อบริษัท / อาคาร / โครงการ</label>
                  <input
                    v-model="form.company"
                    type="text"
                    placeholder="ระบุชื่อบริษัทหรือโครงการ (ถ้ามี)"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">หัวข้อที่ติดต่อ</label>
                  <input
                    v-model="form.subject"
                    type="text"
                    placeholder="เช่น ขอใบเสนอราคา / นัดสำรวจหน้างาน"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">รุ่นสินค้าที่สนใจ (ถ้ามี)</label>
                  <input
                    v-model="form.productName"
                    type="text"
                    placeholder="เช่น Notifier NFS-320"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">รายละเอียดเพิ่มเติม / จำนวนที่ต้องการ *</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  placeholder="ระบุรายการสินค้า จำนวน หรือขอบเขตงานติดตั้ง/ตรวจเช็คระบบที่ต้องการ..."
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                />
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="btn-firezone w-full sm:w-auto disabled:opacity-60"
              >
                <Send class="w-4 h-4 mr-2" />
                <span>{{ submitting ? 'กำลังส่งข้อความ...' : 'ส่งข้อมูลติดต่อ / ขอใบเสนอราคา' }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Google Map Embed -->
      <div v-if="settings.googleMapsEmbed || settings.googleMapEmbed" class="container-classic mt-12">
        <div class="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-[380px]">
          <iframe
            :src="settings.googleMapsEmbed || settings.googleMapEmbed"
            class="w-full h-full border-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="แผนที่บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-vue-next'

const route = useRoute()
const { settings } = useSiteData()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
  subject: String(route.query.subject || (route.query.product ? 'ขอใบเสนอราคาสินค้า' : '')),
  productName: String(route.query.product || ''),
  message: ''
})

const submitting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

async function submitForm() {
  submitting.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const res = await $fetch<{ message: string }>('/api/inquiries', {
      method: 'POST',
      body: form
    })
    successMsg.value = res.message
    form.name = ''
    form.phone = ''
    form.email = ''
    form.company = ''
    form.message = ''
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    submitting.value = false
  }
}

useHead({
  title: 'ติดต่อเรา / ขอใบเสนอราคา | บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด'
})
</script>
