import { getDb, getPublicSettingsMap } from '../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const settings = getPublicSettingsMap(db)
  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const baseUrl = (settings.siteUrl || `${proto}://${host}`).replace(/\/+$/, '')

  const categories = db
    .prepare('SELECT name, slug, description FROM categories ORDER BY sort_order ASC')
    .all() as Array<{ name: string; slug: string; description: string }>

  const services = db
    .prepare('SELECT title, slug, excerpt FROM services ORDER BY sort_order ASC')
    .all() as Array<{ title: string; slug: string; excerpt: string }>

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return `# ${settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด'} (FIRESZONE & MANUFACTURING CO., LTD.)

> ${settings.seoDefaultDescription || settings.companyTagline}

## ข้อมูลองค์กรและการติดต่อ (Company Facts)
- ชื่อบริษัท (TH): ${settings.companyName || 'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด'}
- ชื่อบริษัท (EN): FIRESZONE & MANUFACTURING CO., LTD.
- ที่ตั้งสำนักงาน: ${settings.address}
- โทรศัพท์สายด่วน: ${settings.phone1}, ${settings.phone2}, ${settings.phone3}
- โทรศัพท์สำนักงาน: ${settings.officePhone}
- อีเมล: ${settings.email}
- LINE Official / LINE ID: ${settings.lineId} (${settings.lineUrl})
- Facebook: ${settings.facebookUrl}
- พื้นที่ให้บริการ: กรุงเทพมหานคร ปริมณฑล และโครงการทั่วประเทศไทย

## ความเชี่ยวชาญหลัก (Core Capabilities)
- จัดจำหน่ายอุปกรณ์ระบบสัญญาณเตือนอัคคีภัย (Fire Alarm System) มาตรฐานสากล UL / FM / ULC
- แบรนด์ชั้นนำที่จัดจำหน่าย: NOTIFIER, NOHMI, System Sensor, EDWARDS (EST), CEMEN, AIP, CL, BGM, COMMAX
- รับออกแบบ ติดตั้ง ตรวจสอบประจำปี และทดสอบระบบแจ้งเหตุเพลิงไหม้โดยทีมช่างชำนาญการประสบการณ์กว่า 20 ปี
- พัฒนาระบบแจ้งเตือนเหตุเพลิงไหม้ (Fire Alarm Notification) ส่งตรงเข้า LINE Group และ E-mail แบบเรียลไทม์
- ระบบกล้องวงจรปิด (CCTV), ระบบทีวีรวมดิจิตอล (MATV), ถังดับเพลิงเคมีแห้ง/CO2 และไฟฉุกเฉิน

## หน้าหลักของเว็บไซต์ (Key Pages)
- [หน้าหลัก](${baseUrl}/): ภาพรวมสินค้า บริการ และผลงานของบริษัท
- [แคตตาล็อกสินค้าทั้งหมด](${baseUrl}/shop): อุปกรณ์ Fire Alarm ทั้งหมด 48 รายการ
- [บริการและโซลูชัน](${baseUrl}/services): รายละเอียดงานติดตั้ง ตรวจเช็ค และพัฒนาระบบ
- [ผลงานการติดตั้ง](${baseUrl}/portfolio): ตัวอย่างโครงการอ้างอิงทั้งภาครัฐ โรงงาน คอนโด และโรงพยาบาล
- [ข่าวสารและเกร็ดความรู้](${baseUrl}/news): บทความเทคนิคด้านระบบแจ้งเหตุเพลิงไหม้
- [ติดต่อขอใบเสนอราคา](${baseUrl}/contact): แบบฟอร์มขอใบเสนอราคาพร้อมแนบไฟล์สเปค PDF/รูปภาพ และเชื่อมต่อ LINE
- [แคตตาล็อกข้อมูลฉบับเต็มสำหรับ AI](${baseUrl}/llms-full.txt): รายละเอียดสินค้าทุกรุ่นและคำถามที่พบบ่อยฉบับเต็ม

## หมวดหมู่สินค้า (Product Categories)
${categories.map((c) => `- [${c.name}](${baseUrl}/shop/category/${c.slug}): ${c.description}`).join('\n')}

## บริการและระบบ (Engineering Services & Equipment)
${services.map((s) => `- [${s.title}](${baseUrl}/service/${s.slug}): ${s.excerpt}`).join('\n')}
`
})
