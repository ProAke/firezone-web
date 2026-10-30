<template>
  <div>
    <PageBanner
      :title="contactPageData?.page?.title || 'ติดต่อเรา / ขอใบเสนอราคา'"
      :subtitle="contactPageData?.page?.subtitle || 'CONTACT US & QUOTATION'"
      :breadcrumbs="[{ label: contactPageData?.page?.title || 'ติดต่อเรา' }]"
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

          <RichContent
            v-if="contactPageData?.page?.content"
            class="text-sm text-gray-600 leading-relaxed"
            :content="contactPageData.page.content"
          />

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
                <div class="font-bold text-sm text-gray-900">ติดต่อทาง LINE Official Account</div>
                <div class="text-xs text-gray-600">LINE ID: <strong>{{ settings.lineId || '0864492598' }}</strong></div>
                <a
                  v-if="settings.lineUrl"
                  :href="settings.lineUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block px-3.5 py-1.5 rounded bg-[#06C755] text-white text-xs font-semibold hover:bg-[#05b04b]"
                >
                  คลิกเพิ่มเพื่อน LINE OA
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
            <p class="text-xs text-gray-500 mb-5">
              ข้อมูลจะถูกบันทึกและส่งแจ้งเตือนไปยังทีมงานทันที รองรับการยืนยัน LINE และแนบไฟล์สเปค PDF / รูปภาพ (สูงสุด 5 ไฟล์)
            </p>

            <!-- Connect LINE Verification Box -->
            <div class="mb-6 rounded-lg border border-[#06C755]/40 bg-white p-4">
              <div v-if="lineProfile" class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img
                    v-if="lineProfile.pictureUrl"
                    :src="lineProfile.pictureUrl"
                    alt="LINE Avatar"
                    class="w-10 h-10 rounded-full border border-[#06C755]"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-[#06C755] text-white flex items-center justify-center font-extrabold text-xs"
                  >
                    LINE
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5 text-xs font-bold text-[#06C755]">
                      <CheckCircle2 class="w-4 h-4" />
                      <span>เชื่อมต่อและยืนยันบัญชี LINE เรียบร้อยแล้ว</span>
                    </div>
                    <div class="text-sm font-bold text-gray-900">
                      {{ lineProfile.displayName }}
                      <span v-if="lineProfile.lineId && lineProfile.lineId !== lineProfile.displayName" class="text-xs text-gray-500 font-normal">
                        (LINE ID: {{ lineProfile.lineId }})
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  class="text-xs text-gray-500 hover:text-red-600 underline"
                  @click="disconnectLine"
                >
                  ยกเลิกการเชื่อมต่อ
                </button>
              </div>

              <div v-else class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#06C755]" />
                    <span>ติดต่อสะดวกยิ่งขึ้นผ่าน LINE Official Account</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">
                    กดปุ่ม Connect LINE เพื่อยืนยันบัญชี LINE ของท่านในฟอร์มและส่งข้อมูลเข้า LINE OA ได้ทันที
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#06C755] hover:bg-[#05b04b] text-white text-xs font-bold shadow-sm transition-colors shrink-0"
                  @click="handleConnectLineClick"
                >
                  <span>Connect LINE</span>
                </button>
              </div>
            </div>

            <!-- Submission Success Banner + Instant LINE OA Handoff -->
            <div
              v-if="submittedResult"
              class="mb-6 bg-green-50 border border-green-300 text-green-900 rounded-lg p-5 space-y-3"
            >
              <div class="flex items-start gap-2.5">
                <CheckCircle2 class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div class="text-sm font-bold">{{ submittedResult.message }}</div>
              </div>
              <p class="text-xs text-green-800">
                ท่านสามารถกดปุ่มด้านล่างเพื่อส่งเลขอ้างอิงและเปิดห้องแชทคุยกับเจ้าหน้าที่ผ่าน <strong>LINE OA</strong> ต่อได้ทันที:
              </p>
              <div class="flex flex-wrap items-center gap-2.5">
                <a
                  :href="submittedResult.lineOaDirectUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#06C755] hover:bg-[#05b04b] text-white text-xs font-bold shadow-sm"
                >
                  <span>ส่งข้อมูลเข้าแชท LINE OA ทันที</span>
                </a>
                <button
                  type="button"
                  class="px-3.5 py-2 rounded border border-green-400 bg-white text-green-800 text-xs font-semibold hover:bg-green-100"
                  @click="copyLineSummary"
                >
                  {{ copiedSummary ? 'คัดลอกข้อความแล้ว ✓' : 'คัดลอกรหัสอ้างอิงส่ง LINE' }}
                </button>
              </div>
            </div>

            <!-- Error Banner -->
            <div
              v-if="errorMsg"
              class="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-md p-4 text-sm font-medium"
            >
              {{ errorMsg }}
            </div>

            <form class="space-y-4" @submit.prevent="submitForm">
              <!-- Honeypot field (hidden from real users, traps bots) -->
              <div class="hidden" aria-hidden="true">
                <label>Website URL (Do not fill)</label>
                <input v-model="form.websiteUrl" type="text" tabindex="-1" autocomplete="off" />
              </div>

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

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <label class="block text-xs font-bold text-gray-700 mb-1">LINE ID (หรือกด Connect LINE)</label>
                  <input
                    v-model="form.lineId"
                    type="text"
                    :readonly="Boolean(lineProfile)"
                    :placeholder="lineProfile ? 'ยืนยันผ่าน Connect LINE แล้ว' : 'ระบุ LINE ID (ถ้ามี)'"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red read-only:bg-green-50 read-only:text-green-800"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">ชื่อบริษัท / อาคาร / โครงการ</label>
                  <input
                    v-model="form.company"
                    type="text"
                    placeholder="ชื่อบริษัทหรือโครงการ"
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
                  rows="4"
                  required
                  placeholder="ระบุรายการสินค้า จำนวน หรือขอบเขตงานติดตั้ง/ตรวจเช็คระบบที่ต้องการ..."
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red"
                />
              </div>

              <!-- File Attachments (PDF & Photos, max 5 files) -->
              <div class="bg-white border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div class="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Paperclip class="w-4 h-4 text-firezone-red" />
                      <span>แนบไฟล์สเปค / แบบแปลน PDF หรือรูปภาพหน้างาน (สูงสุดไม่เกิน 5 ไฟล์)</span>
                    </div>
                    <p class="text-[11px] text-gray-500 mt-0.5">
                      รองรับไฟล์ .pdf, .jpg, .png, .webp, .gif ขนาดไม่เกิน 5MB ต่อไฟล์ ({{ selectedFiles.length }}/5 ไฟล์)
                    </p>
                  </div>
                  <label
                    v-if="selectedFiles.length < 5"
                    class="px-3.5 py-2 rounded bg-firezone-navy hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    + เลือกไฟล์แนบ
                    <input
                      type="file"
                      multiple
                      accept=".pdf,image/jpeg,image/png,image/webp,image/gif"
                      class="hidden"
                      @change="onFilesSelected"
                    />
                  </label>
                </div>

                <ul v-if="selectedFiles.length" class="divide-y divide-gray-100 border border-gray-200 rounded bg-gray-50 text-xs">
                  <li
                    v-for="(file, idx) in selectedFiles"
                    :key="idx"
                    class="px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <FileText v-if="file.name.toLowerCase().endsWith('.pdf')" class="w-4 h-4 text-red-600 shrink-0" />
                      <ImageIcon v-else class="w-4 h-4 text-blue-600 shrink-0" />
                      <span class="truncate font-medium text-gray-800">{{ file.name }}</span>
                      <span class="text-gray-400 shrink-0">({{ Math.max(1, Math.round(file.size / 1024)) }} KB)</span>
                    </div>
                    <button
                      type="button"
                      class="text-red-600 hover:text-red-800 font-bold px-1.5"
                      title="ลบไฟล์นี้"
                      @click="removeFile(idx)"
                    >
                      ×
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Anti-Spam Security Verification -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-800">
                    ระบบป้องกันสแปม (Anti-Spam): กรุณาตอบผลลัพธ์ของ
                    <span class="text-firezone-red text-sm font-extrabold ml-1">{{ challenge?.question || '...' }}</span> *
                  </label>
                  <button
                    type="button"
                    class="text-[11px] text-gray-500 hover:text-firezone-red underline mt-0.5 inline-flex items-center gap-1"
                    @click="refreshChallenge()"
                  >
                    <RefreshCw class="w-3 h-3" />
                    <span>สุ่มคำถามใหม่</span>
                  </button>
                </div>
                <input
                  v-model="form.challengeAnswer"
                  type="text"
                  inputmode="numeric"
                  required
                  placeholder="พิมพ์คำตอบตัวเลข"
                  class="w-full sm:w-40 px-3.5 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-firezone-red font-bold text-center"
                />
              </div>

              <!-- PDPA Consent Checkbox -->
              <label class="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer pt-1">
                <input
                  v-model="form.pdpaConsent"
                  type="checkbox"
                  required
                  class="mt-0.5 w-4 h-4 accent-red-600 rounded shrink-0"
                />
                <span class="leading-relaxed">
                  ข้าพเจ้ายินยอมให้บริษัทฯ เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลรวมถึงไฟล์แนบและข้อมูลบัญชี LINE เพื่อใช้ในการติดต่อกลับ จัดทำใบเสนอราคา และให้บริการ ตาม
                  <NuxtLink to="/privacy-policy" target="_blank" class="text-firezone-red font-semibold hover:underline">
                    นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  </NuxtLink>
                  *
                </span>
              </label>

              <button
                type="submit"
                :disabled="submitting"
                class="btn-firezone w-full sm:w-auto disabled:opacity-60"
              >
                <Send class="w-4 h-4 mr-2" />
                <span>{{ submitting ? 'กำลังบันทึกและส่งแจ้งเตือน...' : 'ส่งข้อมูลติดต่อ / ขอใบเสนอราคา' }}</span>
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
            referrerpolicy="no-referrer-when-cross-origin"
            title="แผนที่บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด"
          />
        </div>
      </div>
    </section>

    <!-- Connect LINE Quick Confirmation Modal (used when LINE Login OAuth keys are not yet configured) -->
    <div
      v-if="connectLineModalOpen"
      class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div class="bg-[#06C755] text-white px-6 py-4 flex items-center justify-between">
          <div class="font-extrabold text-base">Connect LINE — ยืนยันบัญชี LINE</div>
          <button type="button" class="text-white/80 hover:text-white text-xl leading-none" @click="connectLineModalOpen = false">
            ×
          </button>
        </div>

        <form class="p-6 space-y-4 text-xs" @submit.prevent="submitQuickConnectLine">
          <p class="text-gray-600 leading-relaxed">
            ยืนยัน <strong>LINE ID</strong> ของท่านเพื่อผูกเข้ากับแบบฟอร์มขอใบเสนอราคาและส่งข้อมูลตรงเข้าห้องแชท LINE OA ของบริษัทได้ทันที
          </p>

          <div v-if="lineModalError" class="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 font-medium">
            {{ lineModalError }}
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">LINE ID ของท่าน *</label>
            <input
              v-model="quickLineForm.lineId"
              type="text"
              required
              placeholder="เช่น somchai.fire หรือ @company"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#06C755]"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">ชื่อที่ใช้แสดงบน LINE (Display Name)</label>
            <input
              v-model="quickLineForm.displayName"
              type="text"
              placeholder="เช่น คุณสมชาย"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#06C755]"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              class="px-4 py-2 rounded border border-gray-300 font-semibold text-gray-700"
              @click="connectLineModalOpen = false"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="connectingLine"
              class="px-5 py-2 rounded bg-[#06C755] hover:bg-[#05b04b] text-white font-bold"
            >
              {{ connectingLine ? 'กำลังยืนยัน...' : 'ยืนยัน Connect LINE' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  RefreshCw,
  Send
} from 'lucide-vue-next'

const route = useRoute()
const { settings } = useSiteData()

// Anti-Spam Challenge
const { data: challenge, refresh: refreshChallenge } = await useAsyncData(
  'contact-spam-challenge',
  () => $fetch('/api/contact-challenge'),
  { server: false }
)

// LINE Connection Status
const { data: lineStatus, refresh: refreshLineStatus } = await useAsyncData(
  'contact-line-status',
  () => $fetch('/api/line/status'),
  { server: false }
)

const lineProfile = computed(() => lineStatus.value?.profile || null)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  lineId: '',
  company: '',
  subject: String(route.query.subject || (route.query.product ? 'ขอใบเสนอราคาสินค้า' : '')),
  productName: String(route.query.product || ''),
  message: '',
  challengeAnswer: '',
  pdpaConsent: true,
  websiteUrl: '' // honeypot
})

watch(
  lineProfile,
  (prof) => {
    if (prof?.lineId) {
      form.lineId = prof.lineId
    }
  },
  { immediate: true }
)

// File attachments (max 5 files, PDF & images)
const selectedFiles = ref<File[]>([])
const submitting = ref(false)
const errorMsg = ref('')
const copiedSummary = ref(false)
const submittedResult = ref<{
  id: number
  message: string
  lineOaDirectUrl: string
  prefilledLineText: string
} | null>(null)

function onFilesSelected(ev: Event) {
  const input = ev.target as HTMLInputElement
  const incoming = Array.from(input.files || [])
  errorMsg.value = ''

  for (const f of incoming) {
    if (selectedFiles.value.length >= 5) {
      errorMsg.value = 'สามารถแนบไฟล์ได้สูงสุดไม่เกิน 5 ไฟล์'
      break
    }
    if (f.size > 5 * 1024 * 1024) {
      errorMsg.value = `ไฟล์ "${f.name}" มีขนาดเกิน 5MB`
      continue
    }
    selectedFiles.value.push(f)
  }
  input.value = ''
}

function removeFile(idx: number) {
  selectedFiles.value.splice(idx, 1)
}

// Connect LINE Flow
const connectLineModalOpen = ref(false)
const connectingLine = ref(false)
const lineModalError = ref('')
const quickLineForm = reactive({ lineId: '', displayName: '' })

function handleConnectLineClick() {
  if (lineStatus.value?.oauthConfigured) {
    window.location.href = '/api/line/login'
  } else {
    lineModalError.value = ''
    quickLineForm.lineId = form.lineId || ''
    quickLineForm.displayName = form.name || ''
    connectLineModalOpen.value = true
  }
}

async function submitQuickConnectLine() {
  connectingLine.value = true
  lineModalError.value = ''
  try {
    await $fetch('/api/line/quick-connect', {
      method: 'POST',
      body: quickLineForm
    })
    await refreshLineStatus()
    connectLineModalOpen.value = false
  } catch (err: any) {
    lineModalError.value = err?.data?.statusMessage || 'ไม่สามารถยืนยัน LINE ID ได้'
  } finally {
    connectingLine.value = false
  }
}

async function disconnectLine() {
  await $fetch('/api/line/disconnect', { method: 'POST' })
  form.lineId = ''
  await refreshLineStatus()
}

async function copyLineSummary() {
  if (!submittedResult.value?.prefilledLineText) return
  try {
    await navigator.clipboard.writeText(submittedResult.value.prefilledLineText)
    copiedSummary.value = true
    setTimeout(() => {
      copiedSummary.value = false
    }, 3000)
  } catch {
    // ignore clipboard error
  }
}

async function submitForm() {
  submitting.value = true
  errorMsg.value = ''
  submittedResult.value = null

  try {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('phone', form.phone)
    fd.append('email', form.email)
    fd.append('lineId', form.lineId)
    fd.append('company', form.company)
    fd.append('subject', form.subject)
    fd.append('productName', form.productName)
    fd.append('message', form.message)
    fd.append('challengeToken', challenge.value?.challengeToken || '')
    fd.append('challengeAnswer', form.challengeAnswer)
    fd.append('pdpaConsent', form.pdpaConsent ? '1' : '0')
    fd.append('websiteUrl', form.websiteUrl)

    for (const file of selectedFiles.value) {
      fd.append('attachments', file, file.name)
    }

    const res = await $fetch<{
      id: number
      message: string
      lineOaDirectUrl: string
      prefilledLineText: string
    }>('/api/inquiries', {
      method: 'POST',
      body: fd
    })

    submittedResult.value = res
    form.name = ''
    form.phone = ''
    form.email = ''
    form.company = ''
    form.message = ''
    form.challengeAnswer = ''
    selectedFiles.value = []
    await refreshChallenge()
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง'
    await refreshChallenge()
  } finally {
    submitting.value = false
  }
}

const { data: contactPageData } = await useAsyncData('page-contact', () =>
  $fetch('/api/pages/contact').catch(() => ({ page: null }))
)

usePageSeo({
  title: computed(
    () =>
      `${contactPageData.value?.page?.title || 'ติดต่อเรา / ขอใบเสนอราคา'} | บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด`
  ),
  seoTitle: computed(() => contactPageData.value?.page?.seoTitle || ''),
  description: computed(
    () =>
      contactPageData.value?.page?.excerpt ||
      'ติดต่อขอใบเสนอราคาอุปกรณ์ระบบสัญญาณเตือนอัคคีภัย Fire Alarm นัดสำรวจหน้างาน แนบไฟล์สเปค PDF/รูปภาพ และเชื่อมต่อผ่าน LINE OA ได้ทันที'
  ),
  seoDescription: computed(() => contactPageData.value?.page?.seoDescription || ''),
  seoKeywords: computed(() => contactPageData.value?.page?.seoKeywords || ''),
  htmlContent: computed(() => contactPageData.value?.page?.content || ''),
  path: '/contact',
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'ติดต่อเรา — บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: settings.value.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
      telephone: settings.value.phone1 || '086-363-5495',
      email: settings.value.email || 'fire_zone@hotmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.value.address || '678/6 ซอยพหลโยธิน 32 แขวงจันทรเกษม เขตจตุจักร',
        addressLocality: 'กรุงเทพมหานคร',
        postalCode: '10900',
        addressCountry: 'TH'
      }
    }
  }))
})
</script>
