<template>
  <div>
    <PageBanner
      title="นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
      subtitle="PRIVACY POLICY & PDPA"
      :breadcrumbs="[{ label: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)' }]"
    />

    <section class="py-14 bg-white">
      <div class="container-classic max-w-4xl space-y-8 text-sm md:text-base text-gray-700 leading-relaxed">
        <div class="bg-firezone-light border border-gray-200 rounded-lg p-6 md:p-8 space-y-6">
          <div>
            <h2 class="text-xl md:text-2xl font-extrabold text-firezone-navy">
              ประกาศนโยบายความเป็นส่วนตัว (Privacy Notice)
            </h2>
            <p class="text-xs text-gray-500 mt-1">
              ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act: PDPA)
            </p>
          </div>

          <p>
            <strong>{{ settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด' }}</strong>
            ("บริษัทฯ") ให้ความสำคัญสูงสุดต่อการคุ้มครองข้อมูลส่วนบุคคลของลูกค้า คู่ค้า และผู้เข้าชมเว็บไซต์
            เอกสารฉบับนี้อธิบายถึงวิธีการเก็บรวบรวม ใช้ เปิดเผย และรักษาความปลอดภัยของข้อมูลส่วนบุคคลของท่าน
          </p>

          <div class="space-y-2">
            <h3 class="text-lg font-bold text-firezone-navy">1. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</h3>
            <ul class="list-disc pl-6 space-y-1.5">
              <li><strong>ข้อมูลการติดต่อและขอใบเสนอราคา:</strong> ชื่อ-นามสกุล เบอร์โทรศัพท์ อีเมล ชื่อบริษัท/อาคาร/โครงการ และรายละเอียดความต้องการ</li>
              <li><strong>ข้อมูลการเชื่อมต่อบัญชี LINE (Connect LINE):</strong> รหัสอ้างอิงผู้ใช้ LINE (User ID) ชื่อที่แสดง (Display Name) หรือ LINE ID ที่ท่านยินยอมเชื่อมต่อเพื่อรับการติดต่อกลับผ่าน LINE Official Account</li>
              <li><strong>ไฟล์เอกสารและรูปภาพแนบ:</strong> ไฟล์ PDF สเปคงาน แบบแปลน หรือรูปภาพหน้างานที่ท่านแนบผ่านแบบฟอร์มติดต่อ (ไม่เกิน 5 ไฟล์)</li>
              <li><strong>ข้อมูลทางเทคนิคและคุกกี้ (Cookies):</strong> หมายเลข IP Address ข้อมูลเบราว์เซอร์ และสถิติการเข้าชมเว็บไซต์ (เฉพาะกรณีที่ท่านให้ความยินยอมคุกกี้เพื่อการวิเคราะห์หรือการตลาด)</li>
            </ul>
          </div>

          <div class="space-y-2">
            <h3 class="text-lg font-bold text-firezone-navy">2. วัตถุประสงค์ในการประมวลผลข้อมูล</h3>
            <ul class="list-disc pl-6 space-y-1.5">
              <li>เพื่อจัดทำใบเสนอราคา ให้คำปรึกษาทางวิศวกรรม นัดสำรวจหน้างาน และให้บริการติดตั้ง/ตรวจสอบระบบสัญญาณเตือนอัคคีภัย</li>
              <li>เพื่อส่งแจ้งเตือนและติดต่อสื่อสารกับท่านผ่านทางโทรศัพท์ อีเมล หรือ LINE Official Account ตามที่ท่านร้องขอ</li>
              <li>เพื่อป้องกันสแปม การโจมตีทางไซเบอร์ และการรักษาความปลอดภัยของระบบสารสนเทศ</li>
              <li>เพื่อวิเคราะห์สถิติและปรับปรุงคุณภาพเว็บไซต์และบริการ (เมื่อได้รับความยินยอมคุกกี้จากท่าน)</li>
            </ul>
          </div>

          <div class="space-y-2">
            <h3 class="text-lg font-bold text-firezone-navy">3. ระยะเวลาในการเก็บรักษาข้อมูล</h3>
            <p>
              บริษัทฯ จะเก็บรักษาข้อมูลการติดต่อขอใบเสนอราคาไว้เป็นระยะเวลาประมาณ
              <strong>{{ settings.pdpaRetentionDays || '365' }} วัน</strong>
              หรือตลอดระยะเวลาที่มีนิติสัมพันธ์ตามสัญญาซื้อขาย/สัญญาบริการบำรุงรักษาระบบ และจะลบหรือทำลายข้อมูลเมื่อพ้นกำหนดความจำเป็น
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="text-lg font-bold text-firezone-navy">4. สิทธิของเจ้าของข้อมูลส่วนบุคคลตามกฎหมาย PDPA</h3>
            <p>ท่านมีสิทธิตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ได้แก่:</p>
            <ul class="list-disc pl-6 space-y-1.5">
              <li>สิทธิในการเพิกถอนความยินยอม (Right to Withdraw Consent) และการปรับเปลี่ยนการตั้งค่าคุกกี้ได้ตลอดเวลา</li>
              <li>สิทธิในการขอเข้าถึงและรับสำเนาข้อมูลส่วนบุคคล (Right of Access)</li>
              <li>สิทธิในการขอแก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน (Right to Rectification)</li>
              <li>สิทธิในการขอลบหรือระงับการใช้ข้อมูลส่วนบุคคล (Right to Erasure / Restriction of Processing)</li>
            </ul>
            <div class="pt-2">
              <button
                type="button"
                class="btn-outline-firezone text-xs py-2 px-4"
                @click="openPreferencesModal"
              >
                จัดการการตั้งค่าคุกกี้ (Cookie Preferences)
              </button>
            </div>
          </div>

          <div class="space-y-2 border-t border-gray-200 pt-5">
            <h3 class="text-lg font-bold text-firezone-navy">5. ช่องทางติดต่อผู้ควบคุมข้อมูลส่วนบุคคล</h3>
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

usePageSeo({
  title: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) | บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
  description: 'ประกาศนโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) และการใช้งานคุกกี้ของ บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
  path: '/privacy-policy'
})
</script>
