# FIRESZONE Web — Nuxt 3 Full-Stack CMS

เว็บไซต์ของ **บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด (FIRESZONE & MANUFACTURING CO., LTD.)** ที่ย้ายระบบจาก WordPress / WooCommerce (`fireszone.com`) มาเป็น **Nuxt 3 Full-Stack + SQLite** อย่างสมบูรณ์ พร้อมระบบหลังบ้าน `/admin` สำหรับจัดการเนื้อหาและสินค้าได้เองโดยไม่ต้องพึ่งพา WordPress อีกต่อไป

## สรุปข้อมูลที่ย้ายจาก `fireszone.com` และทำความสะอาดแล้ว

- **สินค้าทั้งหมด 48 รายการ** ครบทุกหมวดหมู่ (`Control Panels`, `Conventional`, `Addressable`, `Notifier`, `Nohmi`, `Yunyang`, `GST`, `Hochiki`, `Simplex`, `Cemen`, `Detectors`, `Manual Stations`, `Strobe & Horns`) พร้อมสเปค คำอธิบาย รูปภาพ และไฟล์ PDF Datasheet
- **หมวดอุปกรณ์และบริการทั้งหมด 9 รายการ** (อุปกรณ์ของเรา 5 หมวด + งานบริการติดตั้ง/ตรวจสอบ/พัฒนาระบบแจ้งเตือนผ่าน LINE & Email 4 หมวด)
- **ผลงานการติดตั้ง (Portfolio) 13 โครงการจริง** พร้อมอัลบั้มภาพหน้างานหลายรูป
- **บทความสาระความรู้ (News) 3 บทความ**
- **คลีนสแปม 100%**: ตัดหน้าและโพสต์ที่ถูกแฮกฝังเว็บพนัน/คาสิโนใน WordPress เดิมออกทั้งหมด
- **รองรับลิงก์เก่า (Legacy URL Redirects)**: ลิงก์เดิมจาก Google เช่น `/blog-page`, `/ติดต่อเรา`, `/product-category/...`, `/wp-admin`, และ `/*.htm` จะถูก Redirect ไปยังหน้าใหม่ใน Nuxt ให้อัตโนมัติ

---

## การติดตั้งและรันโปรเจกต์

> ความต้องการระบบ: **Node.js 22.5 ขึ้นไป** (ใช้ `node:sqlite` ในตัว ไม่ต้องคอมไพล์ C++ addon)

```bash
# 1. ติดตั้งแพ็กเกจ
npm install

# 2. คัดลอกไฟล์ตั้งค่า .env และกำหนดรหัสผ่านผู้ดูแลระบบ
cp .env.example .env

# 3. รันโหมดพัฒนา (Dev Server ที่พอร์ต 3000)
npm run dev
```

เมื่อรันครั้งแรก ระบบจะสร้างไฟล์ฐานข้อมูล `data/firezone.sqlite` และนำเข้าข้อมูลเริ่มต้นทั้งหมดให้อัตโนมัติ

---

## การเข้าใช้งานระบบหลังบ้าน (`/admin`)

- เปิดเบราว์เซอร์ไปที่ `/admin` (หรือคลิกปุ่ม **"จัดการเว็บ"** มุมขวาบนของเว็บไซต์)
- ค่าเริ่มต้นสำหรับการทดสอบครั้งแรก (หากไม่ได้ตั้งค่าใน `.env`):
  - **Username:** `admin`
  - **Password:** `firezone2026` *(สามารถเปลี่ยนรหัสผ่านได้ทันทีในเมนู `/admin/settings` หรือกำหนดผ่าน `.env` ก่อนเริ่มรันครั้งแรก)*

### ความสามารถของระบบหลังบ้าน `/admin`
1. **จัดการสินค้า (`/admin/products`)**: เพิ่ม/แก้ไข/ลบสินค้า อัปโหลดรูปภาพและไฟล์ PDF Datasheet เลือกหมวดหมู่ และเปิด/ปิดการแสดงผล
2. **จัดการหมวดหมู่ (`/admin/categories`)**: จัดการหมวดหมู่หลักและหมวดหมู่ย่อย
3. **จัดการบริการ (`/admin/services`)**: แก้ไขข้อมูลหน้าอุปกรณ์และงานบริการ
4. **จัดการผลงาน (`/admin/portfolio`)**: เพิ่มโครงการใหม่พร้อมอัปโหลดอัลบั้มรูปภาพหลายรูป
5. **จัดการข่าวสาร (`/admin/news`)**: เขียนและแก้ไขบทความความรู้
6. **กล่องข้อความลูกค้า & ไฟล์แนบ (`/admin/inquiries`)**: บันทึกลงฐานข้อมูลอัตโนมัติ (Database-First) แสดงป้ายยืนยันตัวตน LINE (`✓ LINE OAuth Verified` / `LINE Connected`), สถานะความยินยอม PDPA, สถานะการส่งแจ้งเตือน Email/LINE OA และเปิดดู/ดาวน์โหลดไฟล์แนบ PDF/รูปภาพจากลูกค้า (สูงสุด 5 ไฟล์)
7. **แจ้งเตือน LINE OA & Email (`/admin/settings?tab=notifications`)**: ตั้งค่า SMTP Email, LINE Messaging API (Flex Message แจ้งเตือนเข้า LINE OA ทันที), LINE Login OAuth 2.0 สำหรับปุ่ม **Connect LINE** บนฟอร์มติดต่อเรา และปุ่มทดสอบส่งแจ้งเตือนทันที
8. **Google Analytics, Custom Tags & SEO/ASEO (`/admin/settings?tab=analytics_seo`)**: ตั้งค่า GA4 (`G-XXXX`), Google Tag Manager (`GTM-XXXX`), Meta Pixel, LINE Tag, Google Search Console, ฝังโค้ดสคริปต์เพิ่มเติมใน `<head>` / `<body>` และรองรับ SEO + AI Search Optimization (`/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, Schema.org JSON-LD)
9. **PDPA & ความปลอดภัย (`/admin/settings?tab=pdpa_security`)**: แถบขอความยินยอมคุกกี้ PDPA (ควบคุมการยิงสคริปต์วิเคราะห์/การตลาด), หน้านโยบาย `/privacy-policy`, ระบบป้องกันสแปมหลายชั้น (Honeypot + HMAC Challenge + Time-Trap + Rate Limit + ตรวจ Magic Bytes ของไฟล์อัปโหลด) และเปลี่ยนรหัสผ่าน Admin

---

## การดึงรูปภาพจาก WordPress เดิมมาเก็บในเซิร์ฟเวอร์ใหม่ (ก่อนปิดโฮสต์เก่า)

ก่อนยกเลิกโฮสติ้ง WordPress เดิมของ `fireszone.com` ให้รันคำสั่งต่อไปนี้ 1 ครั้งบนเครื่องหรือเซิร์ฟเวอร์ที่ต่ออินเทอร์เน็ตได้:

```bash
npm run mirror:media
```

สคริปต์จะดาวน์โหลดรูปภาพและเอกสาร PDF ทั้งหมดจาก `https://fireszone.com/wp-content/uploads/...` มาเก็บไว้ใน `data/uploads/wp/...` และอัปเดตฐานข้อมูล `data/firezone.sqlite` ให้เรียกใช้ไฟล์จากเซิร์ฟเวอร์ใหม่ทั้งหมดโดยอัตโนมัติ

---

## การ Build สำหรับใช้งานจริง (Production)

```bash
npm run build
npm start
```
