<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-extrabold text-firezone-navy">ตั้งค่าข้อมูลเว็บไซต์ &amp; รหัสผ่าน</h1>
      <p class="text-xs text-gray-500 mt-1">แก้ไขข้อมูลการติดต่อ โลโก้ เนื้อหาเกี่ยวกับเรา ตัวเลขสถิติ และรหัสผ่านผู้ดูแล</p>
    </div>

    <!-- General Settings Form -->
    <form class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-5 text-xs" @submit.prevent="saveSettings">
      <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">1. ข้อมูลบริษัทและการติดต่อ</h2>

      <div v-if="savedMsg" class="bg-green-50 border border-green-200 text-green-800 p-3 rounded font-semibold">
        {{ savedMsg }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block font-bold mb-1">ชื่อบริษัท</label>
          <input v-model="form.companyName" type="text" class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block font-bold mb-1">สโลแกน / คำโปรยบริษัท</label>
          <input v-model="form.companyTagline" type="text" class="w-full px-3 py-2 border rounded" />
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

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block font-bold mb-1">อีเมล</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block font-bold mb-1">LINE ID</label>
          <input v-model="form.lineId" type="text" class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block font-bold mb-1">ลิงก์ LINE</label>
          <input v-model="form.lineUrl" type="text" class="w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminFileUpload v-model="form.logoHeader" label="โลโก้เมนูด้านบน (Top Menu Logo)" accept="image/*" :show-preview="true" />
        <AdminFileUpload v-model="form.logoFooter" label="โลโก้ส่วนท้ายเว็บ (Footer Logo)" accept="image/*" :show-preview="true" :dark-preview="true" />
        <AdminFileUpload v-model="form.lineQrImage" label="รูป LINE QR Code" accept="image/*" :show-preview="true" />
      </div>

      <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2 pt-3">2. เนื้อหาเกี่ยวกับเรา &amp; สถิติหน้าแรก</h2>

      <div>
        <label class="block font-bold mb-1">รายละเอียดเกี่ยวกับบริษัท (About Us)</label>
        <textarea v-model="form.aboutIntro" rows="5" class="w-full px-3 py-2 border rounded" />
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

      <div class="pt-2">
        <button type="submit" :disabled="saving" class="btn-firezone text-xs py-2.5 px-6">
          {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าเว็บไซต์' }}
        </button>
      </div>
    </form>

    <!-- Password Change Form -->
    <form class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 text-xs max-w-lg" @submit.prevent="changePassword">
      <h2 class="text-base font-extrabold text-firezone-navy border-b pb-2">3. เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Admin Password)</h2>

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

const { settings, refreshSiteData } = useSiteData()

const form = reactive<Record<string, string>>({
  companyName: settings.value.companyName || '',
  companyTagline: settings.value.companyTagline || '',
  address: settings.value.address || '',
  phone1: settings.value.phone1 || '',
  phone2: settings.value.phone2 || '',
  phone3: settings.value.phone3 || '',
  officePhone: settings.value.officePhone || '',
  email: settings.value.email || '',
  lineId: settings.value.lineId || '',
  lineUrl: settings.value.lineUrl || '',
  logoHeader: settings.value.logoHeader || '/logosticky-fireszone-2.png',
  logoFooter: settings.value.logoFooter || '/logofooter-firesone.png',
  lineQrImage: settings.value.lineQrImage || '',
  aboutIntro: settings.value.aboutIntro || '',
  statFireAlarmCount: settings.value.statFireAlarmCount || '856',
  statCctvCount: settings.value.statCctvCount || '165',
  statMatvCount: settings.value.statMatvCount || '93'
})

const saving = ref(false)
const savedMsg = ref('')

async function saveSettings() {
  saving.value = true
  savedMsg.value = ''
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: form })
    await refreshSiteData()
    savedMsg.value = 'บันทึกการตั้งค่าเรียบร้อยแล้ว'
  } finally {
    saving.value = false
  }
}

const pwForm = reactive({ currentPassword: '', newPassword: '' })
const pwMsg = ref('')
const pwError = ref(false)

async function changePassword() {
  pwMsg.value = ''
  pwError.value = false
  try {
    await $fetch('/api/admin/password', { method: 'PUT', body: pwForm })
    pwMsg.value = 'เปลี่ยนรหัสผ่านสำเร็จแล้ว'
    pwForm.currentPassword = ''
    pwForm.newPassword = ''
  } catch (err: any) {
    pwError.value = true
    pwMsg.value = err?.data?.statusMessage || 'เปลี่ยนรหัสผ่านไม่สำเร็จ'
  }
}

useHead({ title: 'ตั้งค่าเว็บไซต์ | FIRESZONE CMS' })
</script>
