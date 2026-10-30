<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-firezone-navy">ตั้งค่าระบบหลังบ้านครบวงจร</h1>
        <p class="text-xs text-gray-500 mt-1">
          จัดการข้อมูลบริษัท, แจ้งเตือน LINE OA &amp; Email (SMTP), Google Analytics / Custom Tags, SEO &amp; AI Search (ASEO) และ PDPA
        </p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="px-4 py-2 rounded-md text-xs font-bold transition-colors"
        :class="
          activeTab === t.id
            ? 'bg-firezone-red text-white shadow-sm'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-firezone-red'
        "
        @click="selectTab(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div
      v-if="savedMsg"
      class="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-md text-xs font-semibold flex items-center justify-between"
    >
      <span>✓ {{ savedMsg }}</span>
      <button type="button" class="text-green-700 font-bold" @click="savedMsg = ''">×</button>
    </div>

    <!-- Settings Master Form -->
    <form class="space-y-6 text-xs" @submit.prevent="saveSettings">
      <!-- ==================== TAB 1: COMPANY & BRANDING ==================== -->
      <div v-show="activeTab === 'company'" class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-5">
        <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">
          1. ข้อมูลบริษัท โลโก้ และการติดต่อ
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block font-bold mb-1">ชื่อบริษัท</label>
            <input v-model="form.companyName" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">สโลแกน / คำโปรยบริษัท</label>
            <input v-model="form.companyTagline" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">โดเมนเว็บไซต์หลัก (Site Canonical URL)</label>
            <input v-model="form.siteUrl" type="url" placeholder="https://fireszone.com" class="w-full px-3 py-2 border rounded font-mono" />
          </div>
        </div>

        <div>
          <label class="block font-bold mb-1">ที่อยู่บริษัท</label>
          <input v-model="form.address" type="text" class="w-full px-3 py-2 border rounded" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label class="block font-bold mb-1">เบอร์โทร 1</label>
            <input v-model="form.phone1" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">เบอร์โทร 2</label>
            <input v-model="form.phone2" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">เบอร์โทร 3</label>
            <input v-model="form.phone3" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">เบอร์โทรสำนักงาน</label>
            <input v-model="form.officePhone" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label class="block font-bold mb-1">อีเมลติดต่อหลัก</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">LINE ID แสดงหน้าเว็บ</label>
            <input v-model="form.lineId" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">LINE OA Basic ID (เช่น @fireszone)</label>
            <input v-model="form.lineOaBasicId" type="text" placeholder="@fireszone" class="w-full px-3 py-2 border rounded font-mono" />
          </div>
          <div>
            <label class="block font-bold mb-1">ลิงก์เพิ่มเพื่อน LINE</label>
            <input v-model="form.lineUrl" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminFileUpload v-model="form.logoHeader" label="โลโก้เมนูด้านบน (Top Menu Logo)" accept="image/*" :show-preview="true" />
          <AdminFileUpload v-model="form.logoFooter" label="โลโก้ส่วนท้ายเว็บ (Footer Logo)" accept="image/*" :show-preview="true" :dark-preview="true" />
          <AdminFileUpload v-model="form.lineQrImage" label="รูป LINE QR Code" accept="image/*" :show-preview="true" />
        </div>

        <h3 class="text-sm font-extrabold text-firezone-navy border-b pb-2 pt-3">
          เนื้อหาเกี่ยวกับเรา &amp; สถิติหน้าแรก
        </h3>

        <div>
          <label class="block font-bold mb-1">รายละเอียดเกี่ยวกับบริษัท (About Us)</label>
          <textarea v-model="form.aboutIntro" rows="4" class="w-full px-3 py-2 border rounded" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block font-bold mb-1">โปรเจค ระบบไฟอราม</label>
            <input v-model="form.statFireAlarmCount" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">โปรเจค ระบบกล้องวงจรปิด</label>
            <input v-model="form.statCctvCount" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block font-bold mb-1">โปรเจค ระบบเอ็มเอทีวี</label>
            <input v-model="form.statMatvCount" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <!-- Backup Media Auto-Mirror Control -->
        <div class="border-t pt-4 space-y-3">
          <h3 class="text-sm font-extrabold text-firezone-navy">
            ระบบดึงและบันทึกรูปภาพต้นฉบับลงเซิร์ฟเวอร์อัตโนมัติ (Media Backup Sync)
          </h3>
          <p class="text-[11px] text-gray-500">
            เซิร์ฟเวอร์จะดึงรูปภาพจาก URL สำรองด้านล่างมาเก็บถาวรในโฟลเดอร์ <code>data/uploads/wp/</code> โดยอัตโนมัติ เพื่อให้รูปแสดงผลรวดเร็วจากเซิร์ฟเวอร์หลักโดยตรง
          </p>
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div class="flex-1 w-full">
              <label class="block font-bold mb-1">URL โฟลเดอร์รูปสำรอง (Backup Uploads URL)</label>
              <input
                v-model="form.wpBackupUploadsUrl"
                type="url"
                placeholder="https://fz.uarea.in/uploads"
                class="w-full px-3 py-2 border rounded font-mono"
              />
            </div>
            <button
              type="button"
              :disabled="syncingMedia"
              class="px-4 py-2 rounded bg-firezone-navy hover:bg-slate-800 text-white font-semibold shrink-0"
              @click="triggerMediaSync"
            >
              {{ syncingMedia ? 'กำลังดึงรูปภาพเข้าเซิร์ฟเวอร์...' : 'ดึงรูปภาพทั้งหมดเก็บในเซิร์ฟเวอร์ทันที' }}
            </button>
          </div>
          <div
            v-if="mediaSyncMsg"
            class="p-3 rounded border font-semibold"
            :class="mediaSyncOk ? 'bg-green-50 border-green-300 text-green-800' : 'bg-amber-50 border-amber-300 text-amber-900'"
          >
            {{ mediaSyncMsg }}
          </div>
        </div>
      </div>

      <!-- ==================== TAB 2: EMAIL (SMTP) & LINE OA NOTIFICATIONS ==================== -->
      <div v-show="activeTab === 'notifications'" class="space-y-6">
        <div class="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-4 leading-relaxed">
          <strong>หลักการทำงานแบบปลอดภัย (Database-First):</strong> ทุกข้อความและไฟล์แนบ (PDF/รูปภาพ สูงสุด 5 ไฟล์) ที่ลูกค้าส่งผ่านหน้าติดต่อเรา จะถูกบันทึกลงฐานข้อมูลของเว็บไซต์ก่อนเสมอ จากนั้นระบบจะส่งแจ้งเตือนไปยัง <strong>Email (SMTP)</strong> และ/หรือ <strong>LINE Official Account (Messaging API)</strong> ตามค่าที่ตั้งไว้ด้านล่าง
        </div>

        <!-- Email SMTP Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 class="text-base font-extrabold text-firezone-navy">แจ้งเตือนทางอีเมล (SMTP Email Notification)</h2>
              <p class="text-[11px] text-gray-500">ส่งรายละเอียดพร้อมแนบไฟล์ PDF / รูปภาพของลูกค้าเข้าอีเมลฝ่ายขายโดยตรง</p>
            </div>
            <label class="inline-flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                type="checkbox"
                :checked="form.notifyEmailEnabled !== '0'"
                class="w-4 h-4 accent-firezone-red"
                @change="form.notifyEmailEnabled = ($event.target as HTMLInputElement).checked ? '1' : '0'"
              />
              <span>เปิดส่งแจ้งเตือนทาง Email</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold mb-1">อีเมลผู้รับแจ้งเตือน (คั่นหลายอีเมลด้วย ,)</label>
              <input v-model="form.notifyEmailTo" type="text" placeholder="fire_zone@hotmail.com" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block font-bold mb-1">SMTP Host</label>
              <input v-model="form.smtpHost" type="text" placeholder="smtp.gmail.com หรือ smtp.office365.com" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold mb-1">SMTP Port</label>
                <input v-model="form.smtpPort" type="text" placeholder="587" class="w-full px-3 py-2 border rounded font-mono" />
              </div>
              <div>
                <label class="block font-bold mb-1">SSL/TLS</label>
                <select v-model="form.smtpSecure" class="w-full px-2 py-2 border rounded bg-white">
                  <option value="0">STARTTLS (587)</option>
                  <option value="1">SSL/TLS (465)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold mb-1">SMTP Username</label>
              <input v-model="form.smtpUser" type="text" autocomplete="off" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">SMTP Password / App Password</label>
              <input v-model="form.smtpPass" type="password" autocomplete="new-password" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">ชื่อผู้ส่ง (From Header)</label>
              <input v-model="form.smtpFrom" type="text" placeholder="FIRESZONE Website <noreply@fireszone.com>" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div class="pt-1 flex items-center gap-3">
            <button
              type="button"
              :disabled="testingChannel === 'email'"
              class="px-4 py-2 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold"
              @click="testNotification('email')"
            >
              {{ testingChannel === 'email' ? 'กำลังทดสอบส่งอีเมล...' : 'ทดสอบส่ง Email แจ้งเตือน' }}
            </button>
          </div>
        </div>

        <!-- LINE OA Messaging API + LINE Login Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 class="text-base font-extrabold text-[#048839]">
                LINE Official Account (Messaging API) &amp; ปุ่ม Connect LINE (OAuth 2.0)
              </h2>
              <p class="text-[11px] text-gray-500">
                ส่งการ์ด Flex Message แจ้งเตือนเข้า LINE OA ของแอดมินทันที และส่งข้อความยืนยันกลับหาลูกค้าที่กด Connect LINE
              </p>
            </div>
            <label class="inline-flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                type="checkbox"
                :checked="form.notifyLineEnabled !== '0'"
                class="w-4 h-4 accent-[#06C755]"
                @change="form.notifyLineEnabled = ($event.target as HTMLInputElement).checked ? '1' : '0'"
              />
              <span>เปิดส่งแจ้งเตือนเข้า LINE OA</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold mb-1">LINE Messaging API — Channel Access Token (Long-lived)</label>
              <input
                v-model="form.lineChannelAccessToken"
                type="password"
                autocomplete="new-password"
                placeholder="วาง Channel Access Token จาก LINE Developers Console"
                class="w-full px-3 py-2 border rounded font-mono"
              />
            </div>
            <div>
              <label class="block font-bold mb-1">LINE Target User ID / Group ID ผู้รับแจ้งเตือน (เช่น Uxxxx หรือ Cxxxx)</label>
              <input
                v-model="form.lineNotifyTargetId"
                type="text"
                placeholder="U1234567890abcdef..."
                class="w-full px-3 py-2 border rounded font-mono"
              />
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="font-extrabold text-sm text-firezone-navy mb-2">
              ตั้งค่าปุ่ม "Connect LINE" ยืนยันตัวตนด้วย LINE Login OAuth 2.0 (หน้าติดต่อเรา)
            </h3>
            <p class="text-[11px] text-gray-500 mb-3">
              เมื่อใส่ Channel ID และ Secret จาก LINE Login Channel (ที่ผูก Linked OA กับ LINE OA ของบริษัทแล้ว) ปุ่ม Connect LINE จะใช้ LINE OAuth 2.0 ยืนยัน LINE User ID จริงของลูกค้า และส่งใบยืนยันเข้าแชท LINE ของลูกค้าทันที (Callback URL: <code class="bg-gray-100 px-1.5 py-0.5 rounded">{{ (form.siteUrl || 'https://fireszone.com').replace(/\/+$/, '') }}/api/line/callback</code>)
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold mb-1">LINE Login Channel ID</label>
                <input v-model="form.lineLoginChannelId" type="text" placeholder="เช่น 2001234567" class="w-full px-3 py-2 border rounded font-mono" />
              </div>
              <div>
                <label class="block font-bold mb-1">LINE Login Channel Secret</label>
                <input v-model="form.lineLoginChannelSecret" type="password" autocomplete="new-password" class="w-full px-3 py-2 border rounded font-mono" />
              </div>
            </div>
          </div>

          <div class="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              :disabled="testingChannel === 'line'"
              class="px-4 py-2 rounded bg-[#06C755] hover:bg-[#05b04b] text-white font-semibold"
              @click="testNotification('line')"
            >
              {{ testingChannel === 'line' ? 'กำลังทดสอบส่ง LINE...' : 'ทดสอบส่งข้อความเข้า LINE OA' }}
            </button>
          </div>
        </div>

        <!-- Anti-Spam Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">
            ระบบป้องกันสแปมและบอท (Anti-Spam Protection)
          </h2>
          <p class="text-[11px] text-gray-600">
            ระบบเปิดใช้งาน <strong>Honeypot + HMAC Math Challenge + Time-Trap + Rate Limit + ตัวกรองคำสแปม/พนัน</strong> ให้อัตโนมัติอยู่แล้ว และสามารถเพิ่ม Cloudflare Turnstile เพิ่มเติมได้ (ทางเลือก):
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold mb-1">Cloudflare Turnstile Site Key (ถ้ามี)</label>
              <input v-model="form.turnstileSiteKey" type="text" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">Cloudflare Turnstile Secret Key (ถ้ามี)</label>
              <input v-model="form.turnstileSecretKey" type="password" autocomplete="new-password" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
          </div>
        </div>

        <div
          v-if="testResultMsg"
          class="p-3.5 rounded-md border font-semibold"
          :class="testResultOk ? 'bg-green-50 border-green-300 text-green-800' : 'bg-amber-50 border-amber-300 text-amber-900'"
        >
          {{ testResultMsg }}
        </div>
      </div>

      <!-- ==================== TAB 3: ANALYTICS, CUSTOM TAGS & SEO/ASEO ==================== -->
      <div v-show="activeTab === 'analytics_seo'" class="space-y-6">
        <!-- Analytics IDs -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">
            Google Analytics (GA4), Tag Manager &amp; Marketing Pixels
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold mb-1">Google Analytics 4 (Measurement ID)</label>
              <input v-model="form.gaMeasurementId" type="text" placeholder="G-XXXXXXXXXX" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">Google Tag Manager (Container ID)</label>
              <input v-model="form.gtmContainerId" type="text" placeholder="GTM-XXXXXXX" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">Google Search Console Verification Code</label>
              <input v-model="form.googleSiteVerification" type="text" placeholder="ค่า content ของ google-site-verification" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">Facebook / Meta Pixel ID</label>
              <input v-model="form.metaPixelId" type="text" placeholder="เช่น 123456789012345" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
            <div>
              <label class="block font-bold mb-1">LINE Tag ID</label>
              <input v-model="form.lineTagId" type="text" placeholder="UUID ของ LINE Tag" class="w-full px-3 py-2 border rounded font-mono" />
            </div>
          </div>
        </div>

        <!-- Custom Code / Tag Injection -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">
            ฝังโค้ด / สคริปต์เพิ่มเติม (Custom Tag &amp; Script Injection)
          </h2>
          <p class="text-[11px] text-gray-500">
            สำหรับวางสคริปต์เสริม เช่น Google Ads Conversion, TikTok Pixel, Hotjar, Microsoft Clarity หรือ Live Chat Widget (จะโหลดหลังผู้เยี่ยมชมยินยอมตาม PDPA อัตโนมัติ)
          </p>

          <div>
            <label class="block font-bold mb-1">1. Custom Head Scripts (แทรกใน <code>&lt;head&gt;</code>)</label>
            <textarea
              v-model="form.customHeadScripts"
              rows="4"
              placeholder="<!-- วางโค้ดที่ต้องการแทรกใน <head> ที่นี่ -->"
              class="w-full px-3 py-2 border rounded font-mono text-[11px]"
            />
          </div>

          <div>
            <label class="block font-bold mb-1">2. Custom Body Start Scripts (แทรกหลังเปิด <code>&lt;body&gt;</code>)</label>
            <textarea
              v-model="form.customBodyStartScripts"
              rows="3"
              placeholder="<!-- เช่น GTM <noscript> -->"
              class="w-full px-3 py-2 border rounded font-mono text-[11px]"
            />
          </div>

          <div>
            <label class="block font-bold mb-1">3. Custom Body End Scripts (แทรกก่อนปิด <code>&lt;/body&gt;</code>)</label>
            <textarea
              v-model="form.customBodyEndScripts"
              rows="4"
              placeholder="<!-- วางสคริปต์ท้ายหน้า เช่น Chat Widget หรือ Remarketing Tag -->"
              class="w-full px-3 py-2 border rounded font-mono text-[11px]"
            />
          </div>
        </div>

        <!-- SEO & ASEO (AI Search Optimization) -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <div>
              <h2 class="text-base font-extrabold text-firezone-navy">
                SEO &amp; ASEO (AI Search Engine Optimization สำหรับ ChatGPT / Gemini / Perplexity / Google AI)
              </h2>
            </div>
            <div class="flex flex-wrap gap-2 text-[11px]">
              <a href="/robots.txt" target="_blank" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono">/robots.txt ↗</a>
              <a href="/sitemap.xml" target="_blank" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono">/sitemap.xml ↗</a>
              <a href="/llms.txt" target="_blank" class="px-2.5 py-1 rounded bg-red-50 text-firezone-red hover:bg-red-100 font-mono font-bold">/llms.txt ↗</a>
              <a href="/llms-full.txt" target="_blank" class="px-2.5 py-1 rounded bg-red-50 text-firezone-red hover:bg-red-100 font-mono font-bold">/llms-full.txt ↗</a>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold mb-1">Default SEO Title (หน้าหลัก)</label>
              <input v-model="form.seoDefaultTitle" type="text" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block font-bold mb-1">SEO Keywords</label>
              <input v-model="form.seoKeywords" type="text" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div>
            <label class="block font-bold mb-1">Default Meta Description (และใช้เป็นบทสรุปองค์กรใน AI Search <code>/llms.txt</code>)</label>
            <textarea v-model="form.seoDefaultDescription" rows="3" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>
      </div>

      <!-- ==================== TAB 4: PDPA & SECURITY ==================== -->
      <div v-show="activeTab === 'pdpa_security'" class="space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 class="text-base font-extrabold text-firezone-navy">
                การคุ้มครองข้อมูลส่วนบุคคล (PDPA Cookie Banner &amp; Privacy Policy)
              </h2>
              <p class="text-[11px] text-gray-500">
                ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 — หน้าเว็บมีแถบขอความยินยอมคุกกี้ และหน้า <NuxtLink to="/privacy-policy" target="_blank" class="text-firezone-red underline">/privacy-policy</NuxtLink>
              </p>
            </div>
            <label class="inline-flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                type="checkbox"
                :checked="form.pdpaEnabled !== '0'"
                class="w-4 h-4 accent-firezone-red"
                @change="form.pdpaEnabled = ($event.target as HTMLInputElement).checked ? '1' : '0'"
              />
              <span>เปิดใช้แถบ PDPA Cookie Consent (รอความยินยอมก่อนยิง Analytics/Pixel)</span>
            </label>
          </div>

          <div>
            <label class="block font-bold mb-1">ข้อความบนแถบแบนเนอร์คุกกี้ (PDPA Banner Text)</label>
            <textarea v-model="form.pdpaBannerText" rows="2" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold mb-1">อีเมลผู้ควบคุมข้อมูลส่วนบุคคล (DPO Contact Email)</label>
              <input v-model="form.pdpaDpoEmail" type="email" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block font-bold mb-1">ระยะเวลาจัดเก็บข้อมูลติดต่อลูกค้า (วัน)</label>
              <input v-model="form.pdpaRetentionDays" type="number" min="30" max="3650" class="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Save Bar -->
      <div class="bg-white rounded-lg border border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">
        <span class="text-gray-500">เมื่อกดบันทึก ค่าทั้งหมดจะมีผลทันทีโดยไม่ต้องรีสตาร์ทเซิร์ฟเวอร์</span>
        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-6">
          {{ saving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการตั้งค่าทั้งหมด' }}
        </button>
      </div>
    </form>

    <!-- Admin Password Change (Shown on PDPA & Security Tab) -->
    <form
      v-show="activeTab === 'pdpa_security'"
      class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 text-xs max-w-lg"
      @submit.prevent="changePassword"
    >
      <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">
        เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Admin Password)
      </h2>

      <div v-if="pwMsg" class="p-3 rounded font-semibold" :class="pwError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'">
        {{ pwMsg }}
      </div>

      <div>
        <label class="block font-bold mb-1">รหัสผ่านปัจจุบัน *</label>
        <input v-model="pwForm.currentPassword" type="password" required class="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label class="block font-bold mb-1">รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร) *</label>
        <input v-model="pwForm.newPassword" type="password" required minlength="6" class="w-full px-3 py-2 border rounded" />
      </div>

      <button type="submit" class="px-5 py-2.5 rounded bg-firezone-navy hover:bg-slate-800 text-white font-semibold">
        อัปเดตรหัสผ่านใหม่
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'company', label: '1. ข้อมูลบริษัท & โลโก้' },
  { id: 'notifications', label: '2. แจ้งเตือน LINE OA & Email' },
  { id: 'analytics_seo', label: '3. Google Analytics, Tag & SEO/ASEO' },
  { id: 'pdpa_security', label: '4. PDPA & รหัสผ่าน Admin' }
]

const activeTab = ref(String(route.query.tab || 'company'))
watch(
  () => route.query.tab,
  (val) => {
    activeTab.value = String(val || 'company')
  }
)

function selectTab(id: string) {
  activeTab.value = id
  router.replace({ path: '/admin/settings', query: id === 'company' ? {} : { tab: id } })
}

const reqFetch = useRequestFetch()
const { data: adminSettingsData, refresh } = await useAsyncData('admin-all-settings', () =>
  reqFetch('/api/admin/settings')
)

const form = reactive<Record<string, string>>({
  siteUrl: '',
  companyName: '',
  companyTagline: '',
  address: '',
  phone1: '',
  phone2: '',
  phone3: '',
  officePhone: '',
  email: '',
  lineId: '',
  lineOaBasicId: '',
  lineUrl: '',
  logoHeader: '',
  logoFooter: '',
  lineQrImage: '',
  aboutIntro: '',
  statFireAlarmCount: '',
  statCctvCount: '',
  statMatvCount: '',
  wpBackupUploadsUrl: 'https://fz.uarea.in/uploads',
  // Email & LINE Notifications
  notifyEmailEnabled: '1',
  notifyEmailTo: '',
  smtpHost: '',
  smtpPort: '587',
  smtpSecure: '0',
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  notifyLineEnabled: '1',
  lineChannelAccessToken: '',
  lineNotifyTargetId: '',
  lineLoginChannelId: '',
  lineLoginChannelSecret: '',
  turnstileSiteKey: '',
  turnstileSecretKey: '',
  // Analytics, Tags & SEO/ASEO
  gaMeasurementId: '',
  gtmContainerId: '',
  googleSiteVerification: '',
  metaPixelId: '',
  lineTagId: '',
  customHeadScripts: '',
  customBodyStartScripts: '',
  customBodyEndScripts: '',
  seoDefaultTitle: '',
  seoDefaultDescription: '',
  seoKeywords: '',
  // PDPA
  pdpaEnabled: '1',
  pdpaBannerText: '',
  pdpaDpoEmail: '',
  pdpaRetentionDays: '365'
})

watchEffect(() => {
  const s = adminSettingsData.value?.settings || {}
  for (const key of Object.keys(form)) {
    if (s[key] !== undefined) {
      form[key] = s[key]
    }
  }
})

const saving = ref(false)
const savedMsg = ref('')
const syncingMedia = ref(false)
const mediaSyncMsg = ref('')
const mediaSyncOk = ref(false)

async function triggerMediaSync() {
  syncingMedia.value = true
  mediaSyncMsg.value = ''
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: { settings: { ...form } }
    })
    const res = await $fetch<{
      ok: boolean
      total: number
      alreadyCached: number
      downloaded: number
      failed: number
      networkOffline: boolean
    }>('/api/admin/sync-media', {
      method: 'POST',
      body: { backupBaseUrl: form.wpBackupUploadsUrl }
    })
    if (res.networkOffline) {
      mediaSyncOk.value = false
      mediaSyncMsg.value = `สภาพแวดล้อมทดสอบจำกัดการเชื่อมต่อภายนอก (บนเซิร์ฟเวอร์จริง ระบบจะดึงครบทั้ง ${res.total} ไฟล์อัตโนมัติ)`
    } else {
      mediaSyncOk.value = true
      mediaSyncMsg.value = `ซิงก์รูปภาพสำเร็จ! มีในเซิร์ฟเวอร์แล้ว ${res.alreadyCached + res.downloaded} / ${res.total} ไฟล์ (ดาวน์โหลดเพิ่มใหม่ ${res.downloaded} ไฟล์)`
    }
  } catch (err: any) {
    mediaSyncOk.value = false
    mediaSyncMsg.value = err?.data?.statusMessage || 'ไม่สามารถซิงก์รูปภาพได้'
  } finally {
    syncingMedia.value = false
  }
}

async function saveSettings() {
  saving.value = true
  savedMsg.value = ''
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: { settings: { ...form } }
    })
    await refresh()
    savedMsg.value = 'บันทึกการตั้งค่าระบบเรียบร้อยแล้ว'
  } finally {
    saving.value = false
  }
}

const testingChannel = ref<'email' | 'line' | ''>('')
const testResultMsg = ref('')
const testResultOk = ref(false)

async function testNotification(channel: 'email' | 'line') {
  testingChannel.value = channel
  testResultMsg.value = ''
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: { settings: { ...form } }
    })
    const res = await $fetch<{ ok: boolean; emailResult: string; lineResult: string }>(
      '/api/admin/test-notification',
      {
        method: 'POST',
        body: { channel }
      }
    )
    const statusStr = channel === 'email' ? res.emailResult : res.lineResult
    testResultOk.value = statusStr.startsWith('sent')
    testResultMsg.value = testResultOk.value
      ? `ส่งข้อความทดสอบทาง ${channel.toUpperCase()} สำเร็จ! (${statusStr})`
      : `สถานะการทดสอบ ${channel.toUpperCase()}: ${statusStr} (กรุณาตรวจสอบค่า Token / SMTP ให้ครบถ้วน)`
  } catch (err: any) {
    testResultOk.value = false
    testResultMsg.value = err?.data?.statusMessage || 'ไม่สามารถทดสอบส่งแจ้งเตือนได้'
  } finally {
    testingChannel.value = ''
  }
}

const pwForm = reactive({
  currentPassword: '',
  newPassword: ''
})
const pwMsg = ref('')
const pwError = ref(false)

async function changePassword() {
  pwMsg.value = ''
  pwError.value = false
  try {
    await $fetch('/api/admin/password', {
      method: 'PUT',
      body: pwForm
    })
    pwMsg.value = 'เปลี่ยนรหัสผ่านผู้ดูแลสำเร็จ'
    pwForm.currentPassword = ''
    pwForm.newPassword = ''
  } catch (e: any) {
    pwError.value = true
    pwMsg.value = e?.data?.statusMessage || 'ไม่สามารถเปลี่ยนรหัสผ่านได้'
  }
}

useHead({ title: 'ตั้งค่าระบบหลังบ้าน | FIRESZONE CMS' })
</script>
